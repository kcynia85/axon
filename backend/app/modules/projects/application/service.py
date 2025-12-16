from uuid import UUID
from typing import List
from fastapi import Depends, HTTPException

from backend.app.modules.projects.infrastructure.repo import ProjectRepository, ScenarioRepository
from backend.app.modules.projects.domain.models import Project, Scenario
from backend.app.modules.projects.application.schemas import ProjectCreate, ScenarioCreate
from backend.app.modules.projects.dependencies import get_project_repo, get_scenario_repo
from backend.app.shared.security.schemas import UserPayload
from backend.app.api.deps import get_current_user

# Function-First Service Layer
# Contains pure business logic orchestration

async def create_project_use_case(
    command: ProjectCreate,
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> Project:
    """
    Orchestrates the creation of a new project.
    Binds the authenticated user as the owner.
    """
    # Convert DTO to Domain Entity
    new_project = Project(
        name=command.name,
        description=command.description,
        domain=command.domain,
        status=command.status,
        owner_id=user.sub  # Enforce ownership from Token
    )
    
    return await repo.create(new_project)

async def list_projects_use_case(
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> List[Project]:
    """
    Retrieves all projects owned by the current user.
    """
    return await repo.list_by_user(user.sub)

async def get_project_use_case(
    project_id: UUID,
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> Project:
    """
    Retrieves a single project, ensuring ownership/access.
    """
    project = await repo.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Simple Access Check (Ownership)
    if project.owner_id != user.sub:
         raise HTTPException(status_code=403, detail="Not authorized to access this project")
         
    return project

async def delete_project_use_case(
    project_id: UUID,
    user: UserPayload = Depends(get_current_user),
    repo: ProjectRepository = Depends(get_project_repo)
) -> None:
    """
    Deletes a project, ensuring ownership.
    """
    project = await repo.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project.owner_id != user.sub:
         raise HTTPException(status_code=403, detail="Not authorized to delete this project")
         
    await repo.delete(project_id)

async def create_scenario_use_case(
    command: ScenarioCreate,
    repo: ScenarioRepository = Depends(get_scenario_repo)
) -> Scenario:
    # TODO: Add check if user owns project_id
    new_scenario = Scenario(
        project_id=command.project_id,
        title=command.title,
        description=command.description,
        category=command.category,
        prompt_template=command.prompt_template,
        icon=command.icon
    )
    return await repo.create(new_scenario)

async def list_scenarios_use_case(
    project_id: UUID,
    repo: ScenarioRepository = Depends(get_scenario_repo)
) -> List[Scenario]:
    return await repo.list_by_project(project_id)

async def list_templates_use_case(
    repo: ScenarioRepository = Depends(get_scenario_repo)
) -> List[Scenario]:
    """
    Lists global scenario templates (where project_id is NULL).
    """
    return await repo.list_templates()
