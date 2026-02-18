from uuid import UUID
from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
from backend.app.modules.spaces.domain.models import Space, SpaceZone, SpaceNode, NodeEdge
from backend.app.modules.spaces.infrastructure.tables import (
    SpaceTable, 
    SpaceZoneTable, 
    SpaceNodeTable, 
    NodeEdgeTable
)

class SpaceRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_space(self, space: Space) -> Space:
        db_space = SpaceTable(
            id=space.id,
            space_name=space.space_name,
            space_description=space.space_description,
            space_status=space.space_status,
            project_id=space.project_id,
            space_viewport_config=space.space_viewport_config,
            created_at=space.created_at,
            updated_at=space.updated_at
        )
        self.session.add(db_space)
        await self.session.commit()
        await self.session.refresh(db_space)
        return space

    async def get_space(self, space_id: UUID) -> Optional[Space]:
        """Returns pure Domain Model (Aggregate Root only)"""
        result = await self.session.execute(
            select(SpaceTable).where(SpaceTable.id == space_id)
        )
        row = result.scalar_one_or_none()
        if not row:
            return None
            
        return Space(
            id=row.id,
            space_name=row.space_name,
            space_description=row.space_description,
            space_status=row.space_status,
            project_id=row.project_id,
            space_viewport_config=row.space_viewport_config,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    async def get_space_orm(self, space_id: UUID) -> Optional[SpaceTable]:
        """
        Returns the raw ORM object with loaded relationships. 
        Used by Service layer for complex DTO mapping (CQRS-lite read model).
        """
        result = await self.session.execute(
            select(SpaceTable)
            .where(SpaceTable.id == space_id)
            .options(
                selectinload(SpaceTable.zones),
                selectinload(SpaceTable.nodes),
                selectinload(SpaceTable.edges)
            )
        )
        return result.scalar_one_or_none()
