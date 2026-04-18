from uuid import UUID
from typing import List
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.spaces.domain.models import Space
from app.modules.spaces.infrastructure.repo import SpaceRepository
from app.modules.spaces.application.schemas import (
    SpaceDetailDTO, 
    ReactFlowNode, 
    ReactFlowNodeData, 
    ReactFlowNodePosition, 
    ReactFlowEdge,
    ReactFlowViewport
)
from app.shared.infrastructure.database import get_db

from app.modules.workspaces.infrastructure.repo import WorkspaceRepository
from app.modules.agents.infrastructure.repo import AgentConfigRepository
from app.modules.workspaces.dependencies import get_workspace_repo
from app.modules.agents.dependencies import get_agent_repo

from app.modules.projects.infrastructure.repo import ProjectRepository

async def get_space_repo(session: AsyncSession = Depends(get_db)) -> SpaceRepository:
    return SpaceRepository(session)

class SpaceService:
    def __init__(self, repo: SpaceRepository, workspace_repo: WorkspaceRepository = None, agent_repo: AgentConfigRepository = None, project_repo: ProjectRepository = None):
        self.repo = repo
        self.workspace_repo = workspace_repo
        self.agent_repo = agent_repo
        self.project_repo = project_repo

    async def create_space(self, space: Space) -> Space:
        return await self.repo.create_space(space)

    async def list_spaces(self) -> List[Space]:
        """Returns all available spaces."""
        return await self.repo.list_spaces()

    async def get_space_canvas(self, space_id: str) -> SpaceDetailDTO:
        """
        Retrieves the Space and converts it into a React Flow compatible DTO.
        Uses JSONB canvas_data for the graph structure.
        """
        space = await self.repo.get_space(space_id)
        if not space:
            raise HTTPException(status_code=404, detail="Space not found")

        # Fetch project name if project_id is present
        project_name = None
        if space.project_id and self.project_repo:
            project = await self.project_repo.get(space.project_id)
            if project:
                project_name = project.project_name or project.name

        # Map JSONB data to DTO
        canvas_data = space.canvas_data or {"nodes": [], "edges": []}
        nodes_raw = canvas_data.get("nodes", [])
        edges_raw = canvas_data.get("edges", [])
        
        nodes_dto = []
        for n in nodes_raw:
            node_type = n.get("type")
            node_data = n.get("data", {})
            
            # HYDRATION: Fetch latest data for crews and agents if IDs are present
            if node_type == "crew" and "id" in node_data and self.workspace_repo:
                try:
                    crew_id = UUID(node_data["id"]) if isinstance(node_data["id"], str) else node_data["id"]
                    crew = await self.workspace_repo.get_crew(crew_id)
                    if crew:
                        # Update node data with latest from DB
                        node_data.update({
                            "resolved_members": [m.model_dump() for m in crew.resolved_members],
                            "resolved_manager": crew.resolved_manager.model_dump() if crew.resolved_manager else None,
                            "agent_member_ids": [str(mid) for mid in crew.agent_member_ids],
                            "manager_agent_id": str(crew.manager_agent_id) if crew.manager_agent_id else None,
                            "crew_name": crew.crew_name,
                            "crew_process_type": crew.crew_process_type.value if hasattr(crew.crew_process_type, "value") else crew.crew_process_type
                        })
                except Exception as e:
                    print(f"Failed to hydrate crew node {n['id']}: {e}")

            elif node_type == "agent" and "id" in node_data and self.agent_repo:
                try:
                    agent_id = UUID(node_data["id"]) if isinstance(node_data["id"], str) else node_data["id"]
                    agent = await self.agent_repo.get(agent_id)
                    if agent:
                        node_data.update({
                            "agent_visual_url": agent.agent_visual_url,
                            "agent_name": agent.agent_name,
                            "agent_role_text": agent.agent_role_text
                        })
                except Exception as e:
                    print(f"Failed to hydrate agent node {n['id']}: {e}")

            nodes_dto.append(
                ReactFlowNode(
                    id=n["id"],
                    type=n["type"],
                    position=ReactFlowNodePosition(x=n["position"]["x"], y=n["position"]["y"]),
                    width=n.get("width"),
                    height=n.get("height"),
                    data=ReactFlowNodeData(
                        label=node_data.get("label"),
                        status=node_data.get("status", "idle"),
                        **{k: v for k, v in node_data.items() if k not in ["label", "status"]}
                    ),
                    **{k: v for k, v in n.items() if k not in ["id", "type", "position", "width", "height", "data"]}
                )
            )

        edges_dto = [
            ReactFlowEdge(
                id=e["id"],
                source=e["source"],
                target=e["target"],
                sourceHandle=e.get("sourceHandle"),
                targetHandle=e.get("targetHandle"),
                # Pass through any other edge fields (e.g., type, animated, style, etc.)
                **{k: v for k, v in e.items() if k not in ["id", "source", "target", "sourceHandle", "targetHandle"]}
            ) for e in edges_raw
        ]
        
        # Map zones if present (currently zones are nodes of type 'zone' in React Flow)
        zones_dto = [] # Implementation for dedicated zones if needed
        
        viewport_config = space.space_viewport_config or {}

        return SpaceDetailDTO(
            id=space.id,
            name=space.space_name,
            description=space.space_description,
            status=space.space_status.value,
            projectId=space.project_id,
            projectName=project_name,
            viewport=ReactFlowViewport(
                x=viewport_config.get("x", 0),
                y=viewport_config.get("y", 0),
                zoom=viewport_config.get("zoom", 1.0)
            ),
            nodes=nodes_dto,
            edges=edges_dto,
            zones=zones_dto
        )

    async def update_canvas_data(self, space_id: str, updates: dict) -> None:
        """Persists viewport and node/edge data into JSONB."""
        # Frontend sends data nested in 'config'
        config = updates.get("config", updates)
        
        # Persist full objects to ensure coordinates, sizes and all metadata are preserved
        canvas_data = {
            "nodes": config.get("nodes", []),
            "edges": config.get("edges", [])
        }
        viewport = config.get("viewport", {"x": 0, "y": 0, "zoom": 1})
        await self.repo.update_canvas(space_id, canvas_data, viewport)

    async def update_space_metadata(self, space_id: str, updates: dict) -> Space:
        """Updates space name, description or status."""
        await self.repo.update_space(space_id, updates)
        updated_space = await self.repo.get_space(space_id)
        if not updated_space:
            raise HTTPException(status_code=404, detail="Space not found after update")
        return updated_space

    # ... existing methods ...


async def create_space_use_case(space: Space, repo: SpaceRepository) -> Space:
    """Create a new space use case."""
    return await repo.create_space(space)


async def get_space_details_use_case(space_id: UUID, repo: SpaceRepository):
    """Get space details use case."""
    space = await repo.get_space(space_id)
    if not space:
        raise HTTPException(status_code=404, detail="Space not found")
    return space
