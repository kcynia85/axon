from fastapi import APIRouter, Depends, status
from uuid import UUID
from backend.app.modules.spaces.domain.models import Space
from backend.app.modules.spaces.application.service import (
    SpaceService, 
    get_space_repo,
    create_space_use_case,
    get_space_details_use_case
)
from backend.app.modules.spaces.application.schemas import SpaceDetailDTO
from backend.app.modules.spaces.infrastructure.repo import SpaceRepository

router = APIRouter(prefix="/spaces", tags=["Spaces"])

@router.post("/", response_model=Space, status_code=status.HTTP_201_CREATED)
async def create_space(
    space: Space,
    repo: SpaceRepository = Depends(get_space_repo)
):
    """
    Creates a new visual Space.
    """
    return await create_space_use_case(space, repo)

@router.get("/{space_id}/canvas", response_model=SpaceDetailDTO)
async def get_space_canvas(
    space_id: UUID,
    repo: SpaceRepository = Depends(get_space_repo)
):
    """
    Returns the complete Space graph optimized for React Flow.
    """
    service = SpaceService(repo)
    return await service.get_space_canvas(space_id)

# TODO: Add PATCH for canvas_data (Nodes/Edges update)
