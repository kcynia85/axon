from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.shared.infrastructure.database import get_db
from app.modules.projects.infrastructure.repo import ProjectRepository

async def get_project_repo(db: AsyncSession = Depends(get_db)) -> ProjectRepository:
    return ProjectRepository(db)
