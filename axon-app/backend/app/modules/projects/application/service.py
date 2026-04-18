from uuid import UUID
from typing import List
from fastapi import HTTPException

from app.modules.projects.infrastructure.repo import ProjectRepository
from app.modules.projects.domain.models import Project, KeyResource, Artifact
from app.modules.projects.application.schemas import (
    ProjectCreateDTO, 
    ProjectUpdateDTO,
    ResourceCreateDTO,
    ArtifactCreateDTO
)
from app.shared.security.schemas import UserPayload

# Function-First Service Layer (Decoupled from FastAPI Depends)

async def create_project_use_case(
    command: ProjectCreateDTO,
    user: UserPayload,
    repository: ProjectRepository
) -> Project:
    new_project = Project(
        project_name=command.project_name,
        project_status=command.project_status,
        project_summary=command.project_summary,
        project_keywords=command.project_keywords,
        project_strategy_url=command.project_strategy_url,
        owner_id=user.sub
    )
    return await repository.create(new_project)

async def list_projects_use_case(
    limit: int,
    offset: int,
    user: UserPayload,
    repository: ProjectRepository
) -> List[Project]:
    return await repository.list_by_user(user.sub, limit=limit, offset=offset)

async def get_project_use_case(
    project_id: UUID,
    user: UserPayload,
    repository: ProjectRepository
) -> Project:
    project = await repository.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.owner_id != user.sub:
         raise HTTPException(status_code=403, detail="Not authorized")
         
    return project

async def update_project_use_case(
    project_id: UUID,
    command: ProjectUpdateDTO,
    user: UserPayload,
    repository: ProjectRepository
) -> Project:
    # Check existence & auth
    await get_project_use_case(project_id, user, repository)
    
    return await repository.update(project_id, command.model_dump(exclude_unset=True))

async def delete_project_use_case(
    project_id: UUID,
    user: UserPayload,
    repository: ProjectRepository
) -> dict:
    await get_project_use_case(project_id, user, repository)
    await repository.delete(project_id)
    return {"message": "Project deleted"}

async def add_key_resource_use_case(
    project_id: UUID,
    command: ResourceCreateDTO,
    user: UserPayload,
    repository: ProjectRepository
) -> KeyResource:
    await get_project_use_case(project_id, user, repository)
    
    resource = KeyResource(
        project_id=project_id,
        **command.model_dump()
    )
    return await repository.add_resource(resource)

async def add_artifact_use_case(
    project_id: UUID,
    command: ArtifactCreateDTO,
    user: UserPayload,
    repository: ProjectRepository
) -> Artifact:
    await get_project_use_case(project_id, user, repository)
    
    artifact = Artifact(
        project_id=project_id,
        **command.model_dump()
    )
    return await repository.add_artifact(artifact)

async def list_artifacts_use_case(
    project_id: UUID,
    user: UserPayload,
    repository: ProjectRepository
) -> List[Artifact]:
    project = await get_project_use_case(project_id, user, repository)
    return project.artifacts
