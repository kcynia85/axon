from typing import List
from fastapi import APIRouter, Depends, status
from app.modules.spaces.domain.models import Space
from app.modules.spaces.application.service import (
    SpaceService, 
    get_space_repo,
    create_space_use_case
)
from app.modules.spaces.application.schemas import SpaceDetailDTO
from app.modules.spaces.infrastructure.repo import SpaceRepository
from app.modules.workspaces.infrastructure.repo import WorkspaceRepository
from app.modules.agents.infrastructure.repo import AgentConfigRepository
from app.modules.workspaces.dependencies import get_workspace_repo
from app.modules.agents.dependencies import get_agent_repo

from app.modules.projects.infrastructure.repo import ProjectRepository
from app.modules.projects.dependencies import get_project_repo

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

@router.get("/", response_model=List[Space])
async def list_spaces(
    repo: SpaceRepository = Depends(get_space_repo)
):
    """
    Returns all visual Spaces.
    """
    service = SpaceService(repo)
    return await service.list_spaces()

@router.get("/{space_id}/canvas", response_model=SpaceDetailDTO)
async def get_space_canvas(
    space_id: str,
    repo: SpaceRepository = Depends(get_space_repo),
    workspace_repo: WorkspaceRepository = Depends(get_workspace_repo),
    agent_repo: AgentConfigRepository = Depends(get_agent_repo),
    project_repo: ProjectRepository = Depends(get_project_repo)
):
    """
    Returns the complete Space graph optimized for React Flow.
    """
    service = SpaceService(repo, workspace_repo, agent_repo, project_repo)
    return await service.get_space_canvas(space_id)

@router.patch("/{space_id}/canvas", status_code=status.HTTP_204_NO_CONTENT)
async def update_space_canvas(
    space_id: str,
    updates: dict,
    repo: SpaceRepository = Depends(get_space_repo)
):
    """
    Updates the Space graph structure (JSONB storage).
    """
    service = SpaceService(repo)
    await service.update_canvas_data(space_id, updates)

@router.patch("/{space_id}", response_model=Space)
async def update_space_metadata(
    space_id: str,
    updates: dict,
    repo: SpaceRepository = Depends(get_space_repo)
):
    """
    Updates general space metadata (name, description, etc.).
    """
    service = SpaceService(repo)
    return await service.update_space_metadata(space_id, updates)

