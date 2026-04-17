from uuid import UUID
from typing import List, Optional, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.shared.utils.time import now_utc
from app.modules.spaces.domain.models import Space
from app.modules.spaces.infrastructure.tables import (
    SpaceTable
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
            owner_id=UUID("00000000-0000-0000-0000-000000000000"), # Default for prototype
            space_viewport_config=space.space_viewport_config,
            canvas_data=space.canvas_data,
            created_at=space.created_at,
            updated_at=space.updated_at
        )
        self.session.add(db_space)
        await self.session.commit()
        await self.session.refresh(db_space)
        return space

    async def get_space(self, space_id: str) -> Optional[Space]:
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
            canvas_data=row.canvas_data,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    async def update_canvas(self, space_id: str, canvas_data: dict[str, Any], viewport: dict[str, Any]) -> None:
        """Updates the JSONB canvas data and viewport config."""
        await self.session.execute(
            update(SpaceTable)
            .where(SpaceTable.id == space_id)
            .values(
                canvas_data=canvas_data,
                space_viewport_config=viewport,
                updated_at=now_utc()
            )
        )
        await self.session.commit()

    async def update_space(self, space_id: str, updates: dict[str, Any]) -> None:
        """Updates general space metadata (name, description, etc.)."""
        # Ensure we don't accidentally update internal columns if not provided
        if not updates:
            return
            
        await self.session.execute(
            update(SpaceTable)
            .where(SpaceTable.id == space_id)
            .values(
                **updates,
                updated_at=now_utc()
            )
        )
        await self.session.commit()

    async def list_spaces(self) -> List[Space]:
        """Returns all spaces."""
        result = await self.session.execute(select(SpaceTable))
        rows = result.scalars().all()
        return [
            Space(
                id=row.id,
                space_name=row.space_name,
                space_description=row.space_description,
                space_status=row.space_status,
                project_id=row.project_id,
                space_viewport_config=row.space_viewport_config,
                canvas_data=row.canvas_data,
                created_at=row.created_at,
                updated_at=row.updated_at
            ) for row in rows
        ]
