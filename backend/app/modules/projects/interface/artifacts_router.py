from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID

from backend.app.shared.infrastructure.database import get_db
from backend.app.modules.projects.infrastructure.repo import ArtifactRepository
from backend.app.modules.projects.domain.models import Artifact
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/artifacts", tags=["artifacts"])

async def get_artifact_repo(session: AsyncSession = Depends(get_db)) -> ArtifactRepository:
    return ArtifactRepository(session)

@router.get("/inbox", response_model=List[Artifact])
async def get_inbox_artifacts(
    current_user: dict = Depends(get_current_user),
    repo: ArtifactRepository = Depends(get_artifact_repo)
):
    """
    Get all artifacts requiring review for the current user.
    """
    # Ensure sub is a valid UUID
    try:
        user_id = UUID(current_user["sub"])
    except ValueError:
        user_id = UUID("00000000-0000-0000-0000-000000000000")

    return await repo.list_for_inbox(user_id)
