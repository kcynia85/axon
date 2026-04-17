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

async def get_space_repo(session: AsyncSession = Depends(get_db)) -> SpaceRepository:
    return SpaceRepository(session)

class SpaceService:
    def __init__(self, repo: SpaceRepository):
        self.repo = repo

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

        # Map JSONB data to DTO
        canvas_data = space.canvas_data or {"nodes": [], "edges": []}
        nodes_raw = canvas_data.get("nodes", [])
        edges_raw = canvas_data.get("edges", [])
        
        nodes_dto = [
            ReactFlowNode(
                id=n["id"],
                type=n["type"],
                position=ReactFlowNodePosition(x=n["position"]["x"], y=n["position"]["y"]),
                width=n.get("width"),
                height=n.get("height"),
                data=ReactFlowNodeData(
                    label=n["data"].get("label"),
                    status=n["data"].get("status", "idle"),
                    **{k: v for k, v in n["data"].items() if k not in ["label", "status"]}
                ),
                # Pass through any other top-level fields (e.g., style, className, etc.)
                **{k: v for k, v in n.items() if k not in ["id", "type", "position", "width", "height", "data"]}
            ) for n in nodes_raw
        ]

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
