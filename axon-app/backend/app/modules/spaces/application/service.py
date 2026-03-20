from uuid import UUID
from typing import List, Optional
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
    ReactFlowViewport,
    ReactFlowZone
)
from app.shared.infrastructure.database import get_db

async def get_space_repo(session: AsyncSession = Depends(get_db)) -> SpaceRepository:
    return SpaceRepository(session)

class SpaceService:
    def __init__(self, repo: SpaceRepository):
        self.repo = repo

    async def create_space(self, space: Space) -> Space:
        return await self.repo.create_space(space)

    async def get_space_canvas(self, space_id: str) -> SpaceDetailDTO:
        """
        Retrieves the Space and converts it into a React Flow compatible DTO.
        """
        # We need a repo method that fetches everything eagerly
        # Currently get_space does this with selectinload
        space_orm = await self.repo.get_space_orm(space_id) 
        # Note: We need to expose get_space_orm or map inside repo. 
        # Let's adjust repo to return domain objects + relations, or use ORM for read-model efficiency.
        
        if not space_orm:
            raise HTTPException(status_code=404, detail="Space not found")

        # Map ORM -> React Flow DTO
        nodes_dto = [
            ReactFlowNode(
                id=str(n.id),
                type=n.component_type,
                position=ReactFlowNodePosition(x=n.node_position_x, y=n.node_position_y),
                data=ReactFlowNodeData(
                    label=n.node_label,
                    status=n.node_execution_status.value,
                    runtime=n.node_runtime_state
                )
            ) for n in space_orm.nodes
        ]

        edges_dto = [
            ReactFlowEdge(
                id=str(e.id),
                source=str(e.source_node_id),
                target=str(e.target_node_id),
                sourceHandle=e.edge_source_handle_id,
                targetHandle=e.edge_target_handle_id
            ) for e in space_orm.edges
        ]
        
        # Map zones
        zones_dto = [
            ReactFlowZone(
                id=str(z.id),
                workspaceDomain=z.workspace_domain.value,
                position=ReactFlowNodePosition(x=z.zone_position_x, y=z.zone_position_y),
                width=z.zone_width,
                height=z.zone_height,
                color=z.zone_color
            ) for z in space_orm.zones
        ]
        
        viewport_config = space_orm.space_viewport_config or {}

        return SpaceDetailDTO(
            id=space_orm.id,
            name=space_orm.space_name,
            description=space_orm.space_description,
            status=space_orm.space_status.value,
            viewport=ReactFlowViewport(
                x=viewport_config.get("x", 0),
                y=viewport_config.get("y", 0),
                zoom=viewport_config.get("zoom", 1.0)
            ),
            nodes=nodes_dto,
            edges=edges_dto,
            zones=zones_dto
        )

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
