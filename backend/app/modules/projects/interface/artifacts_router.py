from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from backend.app.shared.infrastructure.database import get_db
from backend.app.modules.projects.infrastructure.repo import ArtifactRepository
from backend.app.modules.projects.domain.models import Artifact

router = APIRouter(prefix="/artifacts", tags=["artifacts"])

async def get_artifact_repo(session: AsyncSession = Depends(get_db)) -> ArtifactRepository:
    return ArtifactRepository(session)

@router.get("/inbox", response_model=List[Artifact])
async def get_inbox_artifacts(
    user_id: UUID, # TODO: Get from auth context
    repo: ArtifactRepository = Depends(get_artifact_repo)
):
    """
    Get all artifacts requiring review for the current user.
    """
    return await repo.list_for_inbox(user_id)
