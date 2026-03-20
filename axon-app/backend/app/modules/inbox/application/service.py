from uuid import UUID
from typing import List, Optional
from app.modules.inbox.infrastructure.repo import InboxRepository
from app.modules.inbox.domain.models import InboxItem
from app.modules.inbox.application.schemas import BulkResolveRequest

class InboxService:
    def __init__(self, repo: InboxRepository):
        self.repo = repo

    async def list_items(self, user_id: UUID) -> List[InboxItem]:
        return await self.repo.list_for_user(user_id)

    async def resolve_item(self, item_id: UUID) -> Optional[InboxItem]:
        return await self.repo.resolve_item(item_id)

    async def bulk_resolve(self, request: BulkResolveRequest) -> int:
        return await self.repo.bulk_resolve(request.item_ids)
