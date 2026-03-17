from typing import List, Optional
from uuid import UUID
from fastapi import Depends
from app.modules.workspaces.infrastructure.repo import WorkspaceRepository
from app.modules.workspaces.domain.models import Pattern, Template, Crew
from app.modules.workspaces.dependencies import get_workspace_repo
from app.modules.workspaces.application.schemas import (
    CreatePatternRequest, UpdatePatternRequest,
    CreateTemplateRequest, UpdateTemplateRequest,
    CreateCrewRequest, UpdateCrewRequest
)

# Function-First Use Cases (Standard-compliant)

async def get_unique_workspaces_use_case(
    limit: int = 100, 
    offset: int = 0,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> List[str]:
    """Get all unique workspace identifiers from patterns, templates, and crews."""
    return await repo.get_unique_workspaces(limit=limit, offset=offset)

# --- Patterns ---

async def list_patterns_use_case(
    workspace_id: Optional[str] = None, 
    limit: int = 100, 
    offset: int = 0,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> List[Pattern]:
    return await repo.list_patterns(workspace_id, limit=limit, offset=offset)

async def get_pattern_use_case(
    pattern_id: UUID,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Optional[Pattern]:
    return await repo.get_pattern(pattern_id)

async def create_pattern_use_case(
    request: CreatePatternRequest,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Pattern:
    pattern = Pattern(**request.model_dump())
    return await repo.create_pattern(pattern)

async def update_pattern_use_case(
    pattern_id: UUID, 
    request: UpdatePatternRequest,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Optional[Pattern]:
    data = request.model_dump(exclude_unset=True)
    return await repo.update_pattern(pattern_id, data)

async def delete_pattern_use_case(
    pattern_id: UUID,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> bool:
    return await repo.delete_pattern(pattern_id)

# --- Templates ---

async def list_templates_use_case(
    workspace_id: Optional[str] = None, 
    limit: int = 100, 
    offset: int = 0,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> List[Template]:
    return await repo.list_templates(workspace_id, limit=limit, offset=offset)

async def get_template_use_case(
    template_id: UUID,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Optional[Template]:
    return await repo.get_template(template_id)

async def create_template_use_case(
    request: CreateTemplateRequest,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Template:
    template = Template(**request.model_dump())
    return await repo.create_template(template)

async def update_template_use_case(
    template_id: UUID, 
    request: UpdateTemplateRequest,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Optional[Template]:
    data = request.model_dump(exclude_unset=True)
    return await repo.update_template(template_id, data)

async def delete_template_use_case(
    template_id: UUID,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> bool:
    return await repo.delete_template(template_id)

# --- Crews ---

async def list_crews_use_case(
    workspace_id: Optional[str] = None, 
    limit: int = 100, 
    offset: int = 0,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> List[Crew]:
    return await repo.list_crews(workspace_id, limit=limit, offset=offset)

async def get_crew_use_case(
    crew_id: UUID,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Optional[Crew]:
    return await repo.get_crew(crew_id)

async def create_crew_use_case(
    request: CreateCrewRequest,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Crew:
    crew = Crew(**request.model_dump(exclude={"agent_member_ids"}))
    return await repo.create_crew(crew, request.agent_member_ids)

async def update_crew_use_case(
    crew_id: UUID, 
    request: UpdateCrewRequest,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Optional[Crew]:
    data = request.model_dump(exclude_unset=True, exclude={"agent_member_ids"})
    agent_ids = request.agent_member_ids
    return await repo.update_crew(crew_id, data, agent_ids)

async def delete_crew_use_case(
    crew_id: UUID,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> bool:
    return await repo.delete_crew(crew_id)
