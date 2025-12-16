from fastapi import APIRouter, Depends
from typing import List
from uuid import UUID

from backend.app.modules.projects.domain.models import Project, Scenario
from backend.app.modules.projects.application import service
from backend.app.api.deps import get_current_user
from backend.app.shared.security.schemas import UserPayload

router = APIRouter(
    prefix="/projects", 
    tags=["projects"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/", response_model=List[Project])
async def list_projects(
    user: UserPayload = Depends(get_current_user),
    projects: List[Project] = Depends(service.list_projects_use_case)
):
    """
    List all projects for the authenticated user.
    """
    return projects

@router.post("/", response_model=Project)
async def create_project(
    project: Project = Depends(service.create_project_use_case)
):
    return project

@router.delete("/{project_id}", status_code=204)
async def delete_project(
    project_id: UUID,
    # Depends needs to be called to execute logic
    _ = Depends(service.delete_project_use_case)
):
    """
    Delete a project by ID.
    """
    return

@router.get("/templates", response_model=List[Scenario])
async def list_templates(
    templates: List[Scenario] = Depends(service.list_templates_use_case)
):
    """
    List global scenario templates.
    """
    return templates

@router.get("/{project_id}", response_model=Project)
async def get_project(
    project: Project = Depends(service.get_project_use_case)
):
    return project

@router.get("/{project_id}/scenarios", response_model=List[Scenario])
async def list_scenarios(
    project_id: UUID,
    scenarios: List[Scenario] = Depends(service.list_scenarios_use_case)
):
    return scenarios

@router.post("/scenarios", response_model=Scenario)
async def create_scenario(
    scenario: Scenario = Depends(service.create_scenario_use_case)
):
    return scenario