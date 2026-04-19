from fastapi import APIRouter, Depends, status
from typing import List
from uuid import UUID
from app.modules.projects.domain.models import Project, KeyResource, Artifact
from app.modules.projects.infrastructure.repo import ProjectRepository
from app.modules.projects.dependencies import get_project_repo
from app.modules.projects.application import service
from app.modules.projects.application.schemas import (
    ProjectCreateDTO, 
    ProjectUpdateDTO,
    ResourceCreateDTO,
    ArtifactCreateDTO
)
from app.api.deps import get_current_user
from app.shared.security.schemas import UserPayload
from app.modules.spaces.infrastructure.repo import SpaceRepository
from app.modules.spaces.application.service import get_space_repo

router = APIRouter(
    prefix="/projects", 
    tags=["projects"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/", response_model=List[Project])
async def list_projects(
    limit: int = 100,
    offset: int = 0,
    repository: ProjectRepository = Depends(get_project_repo),
    space_repository: SpaceRepository = Depends(get_space_repo),
    user: UserPayload = Depends(get_current_user)
) -> List[Project]:
    """
    List all projects for the authenticated user.
    """
    return await service.list_projects_use_case(
        limit=limit, 
        offset=offset, 
        user=user, 
        repository=repository,
        space_repository=space_repository
    )

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_payload: ProjectCreateDTO,
    repository: ProjectRepository = Depends(get_project_repo),
    user: UserPayload = Depends(get_current_user)
) -> Project:
    """
    Create a new project.
    """
    return await service.create_project_use_case(
        command=project_payload,
        user=user,
        repository=repository
    )

@router.get("/{project_identifier}", response_model=Project)
async def get_project(
    project_identifier: UUID,
    repository: ProjectRepository = Depends(get_project_repo),
    user: UserPayload = Depends(get_current_user)
) -> Project:
    """
    Get project details including resources and artifacts.
    """
    return await service.get_project_use_case(
        project_id=project_identifier,
        user=user,
        repository=repository
    )

@router.patch("/{project_identifier}", response_model=Project)
async def update_project(
    project_identifier: UUID,
    project_payload: ProjectUpdateDTO,
    repository: ProjectRepository = Depends(get_project_repo),
    user: UserPayload = Depends(get_current_user)
) -> Project:
    """
    Update project metadata.
    """
    return await service.update_project_use_case(
        project_id=project_identifier,
        command=project_payload,
        user=user,
        repository=repository
    )

@router.delete("/{project_identifier}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_identifier: UUID,
    repository: ProjectRepository = Depends(get_project_repo),
    user: UserPayload = Depends(get_current_user)
) -> None:
    """
    Delete a project.
    """
    await service.delete_project_use_case(
        project_id=project_identifier,
        user=user,
        repository=repository
    )
    return

# --- Project Resources & Artifacts ---

@router.post("/{project_identifier}/resources", response_model=KeyResource, status_code=status.HTTP_201_CREATED)
async def add_resource(
    project_identifier: UUID,
    resource_payload: ResourceCreateDTO,
    repository: ProjectRepository = Depends(get_project_repo),
    user: UserPayload = Depends(get_current_user)
) -> KeyResource:
    """
    Add a key resource (Notion, Figma, etc.) to the project.
    """
    return await service.add_key_resource_use_case(
        project_id=project_identifier,
        command=resource_payload,
        user=user,
        repository=repository
    )

@router.get("/{project_identifier}/artifacts", response_model=List[Artifact])
async def list_artifacts(
    project_identifier: UUID,
    repository: ProjectRepository = Depends(get_project_repo),
    space_repository: SpaceRepository = Depends(get_space_repo),
    user: UserPayload = Depends(get_current_user)
) -> List[Artifact]:
    """
    List all artifacts for a given project.
    """
    return await service.list_artifacts_use_case(
        project_id=project_identifier, 
        user=user, 
        repository=repository,
        space_repository=space_repository
    )

@router.post("/{project_identifier}/artifacts", response_model=Artifact, status_code=status.HTTP_201_CREATED)
async def add_artifact(
    project_identifier: UUID,
    artifact_payload: ArtifactCreateDTO,
    repository: ProjectRepository = Depends(get_project_repo),
    user: UserPayload = Depends(get_current_user)
) -> Artifact:
    """
    Add a generated artifact to the project.
    """
    return await service.add_artifact_use_case(
        project_id=project_identifier,
        command=artifact_payload,
        user=user,
        repository=repository
    )
