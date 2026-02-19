from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.shared.infrastructure.database import get_db
from backend.app.modules.workspaces.infrastructure.repo import WorkspaceRepository
from backend.app.modules.workspaces.application.service import WorkspaceService

async def get_workspace_repo(session: AsyncSession = Depends(get_db)) -> WorkspaceRepository:
    return WorkspaceRepository(session)

async def get_workspace_service(repo: WorkspaceRepository = Depends(get_workspace_repo)) -> WorkspaceService:
    return WorkspaceService(repo)
