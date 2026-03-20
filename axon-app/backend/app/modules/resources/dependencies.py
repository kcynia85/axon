from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.shared.infrastructure.database import get_db
from app.modules.resources.infrastructure.repo import ResourcesRepository
from app.modules.resources.application.service import ResourcesService

async def get_resources_repo(db: AsyncSession = Depends(get_db)) -> ResourcesRepository:
    return ResourcesRepository(db)

async def get_resources_service(repo: ResourcesRepository = Depends(get_resources_repo)) -> ResourcesService:
    return ResourcesService(repo)
