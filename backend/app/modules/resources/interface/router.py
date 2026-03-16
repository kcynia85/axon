from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from uuid import UUID

from app.api.deps import get_current_user
from app.shared.security.schemas import UserPayload
from app.modules.resources.application.service import ResourcesService
from app.modules.resources.dependencies import get_resources_service
from app.modules.resources.application.schemas import (
    PromptArchetypeResponse, CreatePromptArchetypeRequest, UpdatePromptArchetypeRequest,
    ExternalServiceResponse, CreateExternalServiceRequest, UpdateExternalServiceRequest, ServiceCapabilityResponse, CreateCapabilityRequest,
    InternalToolResponse, SyncResultResponse,
    AutomationResponse, CreateAutomationRequest, UpdateAutomationRequest, TestPayload, SimulatorResultResponse
)

router = APIRouter(
    prefix="/resources",
    tags=["resources"],
    dependencies=[Depends(get_current_user)]
)

# --- Prompt Archetypes ---

@router.get("/prompts", response_model=List[PromptArchetypeResponse])
async def list_prompt_archetypes(
    service: ResourcesService = Depends(get_resources_service)
):
    """List all prompt archetypes available."""
    return await service.list_prompt_archetypes()

@router.get("/prompts/{id}", response_model=PromptArchetypeResponse)
async def get_prompt_archetype(
    id: UUID,
    service: ResourcesService = Depends(get_resources_service)
):
    """Get a prompt archetype by ID."""
    result = await service.get_prompt_archetype(id)
    if not result:
        raise HTTPException(status_code=404, detail="Prompt Archetype not found")
    return result

@router.post("/prompts", response_model=PromptArchetypeResponse, status_code=status.HTTP_201_CREATED)
async def create_prompt_archetype(
    request: CreatePromptArchetypeRequest,
    service: ResourcesService = Depends(get_resources_service)
):
    """Create a new prompt archetype."""
    return await service.create_prompt_archetype(request)

@router.put("/prompts/{id}", response_model=PromptArchetypeResponse)
async def update_prompt_archetype(
    id: UUID,
    request: UpdatePromptArchetypeRequest,
    service: ResourcesService = Depends(get_resources_service)
):
    """Update a prompt archetype."""
    result = await service.update_prompt_archetype(id, request)
    if not result:
        raise HTTPException(status_code=404, detail="Prompt Archetype not found")
    return result

@router.delete("/prompts/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_prompt_archetype(
    id: UUID,
    service: ResourcesService = Depends(get_resources_service)
):
    """Delete a prompt archetype."""
    deleted = await service.delete_prompt_archetype(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Prompt Archetype not found")
    return

# --- External Services ---

@router.get("/services", response_model=List[ExternalServiceResponse])
async def list_external_services(
    service: ResourcesService = Depends(get_resources_service)
):
    """List all registered external services."""
    return await service.list_external_services()

@router.get("/services/{id}", response_model=ExternalServiceResponse)
async def get_external_service(
    id: UUID,
    service: ResourcesService = Depends(get_resources_service)
):
    """Get an external service by ID."""
    result = await service.get_external_service(id)
    if not result:
        raise HTTPException(status_code=404, detail="Service not found")
    return result

@router.post("/services", response_model=ExternalServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_external_service(
    request: CreateExternalServiceRequest,
    service: ResourcesService = Depends(get_resources_service)
):
    """Register a new external service."""
    return await service.create_external_service(request)

@router.put("/services/{id}", response_model=ExternalServiceResponse)
async def update_external_service(
    id: UUID,
    request: UpdateExternalServiceRequest,
    service: ResourcesService = Depends(get_resources_service)
):
    """Update an external service."""
    result = await service.update_external_service(id, request)
    if not result:
        raise HTTPException(status_code=404, detail="Service not found")
    return result

@router.delete("/services/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_external_service(
    id: UUID,
    service: ResourcesService = Depends(get_resources_service)
):
    """Delete an external service."""
    deleted = await service.delete_external_service(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Service not found")
    return

@router.post("/services/{id}/capabilities", response_model=ServiceCapabilityResponse, status_code=status.HTTP_201_CREATED)
async def add_service_capability(
    id: UUID,
    request: CreateCapabilityRequest,
    service: ResourcesService = Depends(get_resources_service)
):
    """Add a capability to an external service."""
    # Ideally verify service exists first, simplified here
    return await service.add_service_capability(id, request)

# --- Internal Tools ---

@router.get("/tools", response_model=List[InternalToolResponse])
async def list_internal_tools(
    service: ResourcesService = Depends(get_resources_service)
):
    """List all internal tools (synced from codebase)."""
    return await service.list_internal_tools()

@router.post("/tools/sync", response_model=SyncResultResponse)
async def sync_tools(
    service: ResourcesService = Depends(get_resources_service)
):
    """Sync internal tools definitions from Python codebase to DB."""
    return await service.sync_tools()

# --- Automations ---

@router.get("/automations", response_model=List[AutomationResponse])
async def list_automations(
    service: ResourcesService = Depends(get_resources_service)
):
    """List all automations."""
    return await service.list_automations()

@router.get("/automations/{id}", response_model=AutomationResponse)
async def get_automation(
    id: UUID,
    service: ResourcesService = Depends(get_resources_service)
):
    """Get an automation by ID."""
    result = await service.get_automation(id)
    if not result:
        raise HTTPException(status_code=404, detail="Automation not found")
    return result

@router.post("/automations", response_model=AutomationResponse, status_code=status.HTTP_201_CREATED)
async def create_automation(
    request: CreateAutomationRequest,
    service: ResourcesService = Depends(get_resources_service)
):
    """Create a new automation definition."""
    return await service.create_automation(request)

@router.put("/automations/{id}", response_model=AutomationResponse)
async def update_automation(
    id: UUID,
    request: UpdateAutomationRequest,
    service: ResourcesService = Depends(get_resources_service)
):
    """Update an automation."""
    result = await service.update_automation(id, request)
    if not result:
        raise HTTPException(status_code=404, detail="Automation not found")
    return result

@router.delete("/automations/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_automation(
    id: UUID,
    service: ResourcesService = Depends(get_resources_service)
):
    """Delete an automation."""
    deleted = await service.delete_automation(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Automation not found")
    return

@router.post("/automations/{id}/test", response_model=SimulatorResultResponse)
async def test_automation(
    id: UUID,
    payload: TestPayload,
    service: ResourcesService = Depends(get_resources_service)
):
    """Test run an automation with payload (Simulator)."""
    return await service.test_automation(id, payload)
