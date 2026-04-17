from fastapi import APIRouter, Depends, status
from typing import List

from app.modules.projects.domain.models import Project, KeyResource, Artifact
from app.modules.projects.infrastructure.repo import ProjectRepository
from app.modules.projects.dependencies import get_project_repo
from app.modules.projects.application import service
from app.api.deps import get_current_user
from app.shared.security.schemas import UserPayload

router = APIRouter(
    prefix="/projects", 
    tags=["projects"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/", response_model=List[Project])
async def list_projects(
    limit: int = 100,
    offset: int = 0,
    repo: ProjectRepository = Depends(get_project_repo),
    user: UserPayload = Depends(get_current_user)
):
    """
    List all projects for the authenticated user.
    """
    return await service.list_projects_use_case(limit=limit, offset=offset, user=user, repo=repo)

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: Project = Depends(service.create_project_use_case)
):
    """
    Create a new project.
    """
    return project

@router.get("/{project_id}", response_model=Project)
async def get_project(
    project: Project = Depends(service.get_project_use_case)
):
    """
    Get project details including resources and artifacts.
    """
    return project

@router.patch("/{project_id}", response_model=Project)
async def update_project(
    project: Project = Depends(service.update_project_use_case)
):
    """
    Update project metadata.
    """
    return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    _ = Depends(service.delete_project_use_case)
):
    """
    Delete a project.
    """
    return

# --- Project Resources & Artifacts ---

@router.post("/{project_id}/resources", response_model=KeyResource, status_code=status.HTTP_201_CREATED)
async def add_resource(
    resource: KeyResource = Depends(service.add_key_resource_use_case)
):
    """
    Add a key resource (Notion, Figma, etc.) to the project.
    """
    return resource

@router.post("/{project_id}/artifacts", response_model=Artifact, status_code=status.HTTP_201_CREATED)
async def add_artifact(
    artifact: Artifact = Depends(service.add_artifact_use_case)
):
    """
    Add a generated artifact to the project.
    """
    return artifact
