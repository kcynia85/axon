from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.shared.infrastructure.database import get_db
from backend.app.modules.projects.infrastructure.repo import ProjectRepository, ScenarioRepository

async def get_project_repo(db: AsyncSession = Depends(get_db)) -> ProjectRepository:
    return ProjectRepository(db)

async def get_scenario_repo(db: AsyncSession = Depends(get_db)) -> ScenarioRepository:
    return ScenarioRepository(db)
