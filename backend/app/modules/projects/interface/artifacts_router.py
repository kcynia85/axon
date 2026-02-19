from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from app.shared.infrastructure.database import get_db
from app.modules.projects.infrastructure.repo import ArtifactRepository
from app.modules.projects.domain.models import Artifact
from app.api.deps import get_current_user
from app.shared.security.schemas import UserPayload

router = APIRouter(prefix="/artifacts", tags=["artifacts"])

async def get_artifact_repo(session: AsyncSession = Depends(get_db)) -> ArtifactRepository:
    return ArtifactRepository(session)

@router.get("/inbox", response_model=List[Artifact])
async def get_inbox_artifacts(
    current_user: UserPayload = Depends(get_current_user),
    repo: ArtifactRepository = Depends(get_artifact_repo)
):
    """
    Get all artifacts requiring review for the current user.
    """
    return await repo.list_for_inbox(current_user.sub)
