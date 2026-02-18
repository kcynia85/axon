from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.shared.infrastructure.database import get_db
from backend.app.modules.inbox.infrastructure.repo import InboxRepository
from backend.app.modules.inbox.application.service import InboxService

async def get_inbox_repo(db: AsyncSession = Depends(get_db)) -> InboxRepository:
    return InboxRepository(db)

async def get_inbox_service(repo: InboxRepository = Depends(get_inbox_repo)) -> InboxService:
    return InboxService(repo)
