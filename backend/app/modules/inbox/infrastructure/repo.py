from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.modules.inbox.domain.models import InboxItem
from app.modules.inbox.infrastructure.tables import InboxItemTable
from app.modules.inbox.domain.enums import InboxItemStatus
from app.shared.utils.time import now_utc

class InboxRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    def _to_domain(self, row: InboxItemTable) -> InboxItem:
        return InboxItem(
            id=row.id,
            item_status=row.item_status,
            item_type=row.item_type,
            item_priority=row.item_priority,
            item_title=row.item_title,
            item_content=row.item_content,
            item_source=row.item_source,
            artifact_id=row.artifact_id,
            project_id=row.project_id,
            created_at=row.created_at,
            resolved_at=row.resolved_at
        )

    async def list_for_user(self, user_id: UUID) -> List[InboxItem]:
        # Filter by projects owned by user
        # In a real app we would join with projects or rely on RLS.
        stmt = select(InboxItemTable).order_by(InboxItemTable.created_at.desc())
        
        result = await self.session.execute(stmt)
        return [self._to_domain(row) for row in result.scalars().all()]

    async def resolve_item(self, item_id: UUID) -> Optional[InboxItem]:
        stmt = (
            update(InboxItemTable)
            .where(InboxItemTable.id == item_id)
            .values(item_status=InboxItemStatus.RESOLVED, resolved_at=now_utc())
            .execution_options(synchronize_session="fetch")
        )
        await self.session.execute(stmt)
        await self.session.commit()
        
        # Get updated
        result = await self.session.execute(select(InboxItemTable).where(InboxItemTable.id == item_id))
        row = result.scalar_one_or_none()
        return self._to_domain(row) if row else None
        
    async def bulk_resolve(self, item_ids: List[UUID]) -> int:
        stmt = (
            update(InboxItemTable)
            .where(InboxItemTable.id.in_(item_ids))
            .values(item_status=InboxItemStatus.RESOLVED, resolved_at=now_utc())
            .execution_options(synchronize_session=False) # Skip session sync for bulk
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.rowcount
