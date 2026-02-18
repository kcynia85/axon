from uuid import UUID
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from backend.app.modules.inbox.domain.models import InboxItem
from backend.app.modules.inbox.infrastructure.tables import InboxItemTable
from backend.app.shared.utils.time import now_utc

class InboxRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    def _to_domain(self, row: InboxItemTable) -> InboxItem:
        return InboxItem(
            id=row.id,
            item_status=row.item_status,
            item_type=row.item_type,
            artifact_source_id=row.artifact_source_id,
            project_id=row.project_id,
            created_at=row.created_at,
            resolved_at=row.resolved_at
        )

    async def list_for_user(self, user_id: UUID) -> List[InboxItem]:
        # Implementation depends on how we link user to inbox items
        # Usually via project ownership or specific user_id in inbox_items
        # For now, let's assume we filter by projects owned by user
        from backend.app.modules.projects.infrastructure.tables import ProjectTable
        
        stmt = (
            select(InboxItemTable)
            .join(ProjectTable, ProjectTable.id == InboxItemTable.project_id)
            .where(ProjectTable.owner_id == user_id)
            .order_by(InboxItemTable.created_at.desc())
        )
        result = await self.session.execute(stmt)
        return [self._to_domain(row) for row in result.scalars().all()]

    async def resolve_item(self, item_id: UUID) -> Optional[InboxItem]:
        stmt = (
            update(InboxItemTable)
            .where(InboxItemTable.id == item_id)
            .values(item_status="Resolved", resolved_at=now_utc())
            .execution_options(synchronize_session="fetch")
        )
        await self.session.execute(stmt)
        await self.session.commit()
        
        # Get updated
        result = await self.session.execute(select(InboxItemTable).where(InboxItemTable.id == item_id))
        row = result.scalar_one_or_none()
        return self._to_domain(row) if row else None
