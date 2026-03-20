from typing import List, Optional
from uuid import UUID, uuid4
from fastapi import Depends, HTTPException, status
from app.modules.workspaces.infrastructure.repo import WorkspaceRepository
from app.modules.workspaces.domain.models import Pattern, Template, Crew, ExternalService, Automation, ServiceCapability, TrashItem
from app.modules.workspaces.dependencies import get_workspace_repo
from app.shared.utils.time import now_utc
from app.modules.workspaces.application.schemas import (
    CreatePatternRequest, UpdatePatternRequest,
    CreateTemplateRequest, UpdateTemplateRequest,
    CreateCrewRequest, UpdateCrewRequest,
    CreateExternalServiceRequest, UpdateExternalServiceRequest,
    CreateAutomationRequest, UpdateAutomationRequest,
    CreateCapabilityRequest
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
    usage = await repo.check_template_usage(template_id)
    if usage:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot delete template. It is used in the following patterns: {', '.join(usage)}"
        )
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

# --- External Services ---

async def list_external_services_use_case(
    workspace_id: str,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> List[ExternalService]:
    return await repo.list_external_services(workspace_id)

async def get_external_service_use_case(
    service_id: UUID,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Optional[ExternalService]:
    return await repo.get_external_service(service_id)

async def create_external_service_use_case(
    workspace_id: str,
    request: CreateExternalServiceRequest,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> ExternalService:
    service_id = uuid4()
    
    capabilities = [
        ServiceCapability(
            id=uuid4(),
            capability_name=cap.capability_name,
            capability_description=cap.capability_description,
            external_service_id=service_id,
            created_at=now_utc()
        ) for cap in request.capabilities
    ]
    
    data = request.model_dump(exclude={"capabilities"})
    availability = data.get("availability_workspace") or []
    if workspace_id not in availability:
        availability.append(workspace_id)
    data["availability_workspace"] = availability
    
    service = ExternalService(
        id=service_id,
        capabilities=capabilities,
        **data
    )
    return await repo.create_external_service(service)

async def update_external_service_use_case(
    service_id: UUID, 
    request: UpdateExternalServiceRequest,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Optional[ExternalService]:
    update_data = request.model_dump(exclude_unset=True, exclude={"capabilities"})
    
    if request.capabilities is not None:
        new_capabilities = [
            ServiceCapability(
                id=uuid4(),
                capability_name=cap.capability_name,
                capability_description=cap.capability_description,
                external_service_id=service_id,
                created_at=now_utc()
            ) for cap in request.capabilities
        ]
        await repo.sync_service_capabilities(service_id, new_capabilities)
        
    return await repo.update_external_service(service_id, update_data)

async def delete_external_service_use_case(
    service_id: UUID,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> bool:
    return await repo.delete_external_service(service_id)

# --- Automations ---

async def list_automations_use_case(
    workspace_id: str,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> List[Automation]:
    return await repo.list_automations(workspace_id)

async def get_automation_use_case(
    automation_id: UUID,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Optional[Automation]:
    return await repo.get_automation(automation_id)

async def create_automation_use_case(
    workspace_id: str,
    request: CreateAutomationRequest,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Automation:
    data = request.model_dump()
    availability = data.get("availability_workspace") or []
    if workspace_id not in availability:
        availability.append(workspace_id)
    data["availability_workspace"] = availability
    automation = Automation(**data)
    return await repo.create_automation(automation)

async def update_automation_use_case(
    automation_id: UUID, 
    request: UpdateAutomationRequest,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> Optional[Automation]:
    data = request.model_dump(exclude_unset=True)
    return await repo.update_automation(automation_id, data)

async def delete_automation_use_case(
    automation_id: UUID,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> bool:
    return await repo.delete_automation(automation_id)

async def get_trash_use_case(
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> List[TrashItem]:
    return await repo.get_trash()

async def restore_item_use_case(
    item_id: UUID,
    item_type: str,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> bool:
    return await repo.restore_item(item_id, item_type)

async def purge_item_use_case(
    item_id: UUID,
    item_type: str,
    repo: WorkspaceRepository = Depends(get_workspace_repo)
) -> bool:
    return await repo.purge_item(item_id, item_type)
