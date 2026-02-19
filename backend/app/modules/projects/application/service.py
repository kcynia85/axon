from uuid import UUID
from typing import List
from fastapi import Depends, HTTPException

from app.modules.projects.infrastructure.repo import ProjectRepository
from app.modules.projects.domain.models import Project, KeyResource, Artifact
from app.modules.projects.application.schemas import (
    ProjectCreateDTO, 
    ProjectUpdateDTO,
    ResourceCreateDTO,
    ArtifactCreateDTO
)
from app.modules.projects.dependencies import get_project_repo
from app.shared.security.schemas import UserPayload
from app.api.deps import get_current_user

# Function-First Service Layer

async def create_project_use_case(
    command: ProjectCreateDTO,
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> Project:
    new_project = Project(
        project_name=command.project_name,
        project_status=command.project_status,
        project_summary=command.project_summary,
        project_keywords=command.project_keywords,
        project_strategy_url=command.project_strategy_url,
        owner_id=user.sub
    )
    return await repo.create(new_project)

async def list_projects_use_case(
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> List[Project]:
    return await repo.list_by_user(user.sub)

async def get_project_use_case(
    project_id: UUID,
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> Project:
    project = await repo.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.owner_id != user.sub:
         raise HTTPException(status_code=403, detail="Not authorized")
         
    return project

async def update_project_use_case(
    project_id: UUID,
    command: ProjectUpdateDTO,
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> Project:
    # Check existence & auth
    await get_project_use_case(project_id, user, repo)
    
    return await repo.update(project_id, command.model_dump(exclude_unset=True))

async def delete_project_use_case(
    project_id: UUID,
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> dict:
    await get_project_use_case(project_id, user, repo)
    await repo.delete(project_id)
    return {"message": "Project deleted"}

async def add_key_resource_use_case(
    project_id: UUID,
    command: ResourceCreateDTO,
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> KeyResource:
    await get_project_use_case(project_id, user, repo)
    
    resource = KeyResource(
        project_id=project_id,
        **command.model_dump()
    )
    return await repo.add_resource(resource)

async def add_artifact_use_case(
    project_id: UUID,
    command: ArtifactCreateDTO,
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> Artifact:
    await get_project_use_case(project_id, user, repo)
    
    artifact = Artifact(
        project_id=project_id,
        **command.model_dump()
    )
    return await repo.add_artifact(artifact)
