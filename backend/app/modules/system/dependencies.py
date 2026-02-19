from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.shared.infrastructure.database import get_db
from app.modules.system.infrastructure.repo import SystemRepository
from app.modules.system.application.service import SystemService

async def get_system_repo(db: AsyncSession = Depends(get_db)) -> SystemRepository:
    return SystemRepository(db)

async def get_system_service(repo: SystemRepository = Depends(get_system_repo)) -> SystemService:
    return SystemService(repo)
