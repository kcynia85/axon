from fastapi import APIRouter, Depends, status, HTTPException
from typing import List, Optional
from uuid import UUID

from app.api.deps import get_current_user
from app.modules.workspaces.application.service import (
    get_unique_workspaces_use_case,
    list_patterns_use_case, get_pattern_use_case, create_pattern_use_case, update_pattern_use_case, delete_pattern_use_case,
    list_templates_use_case, get_template_use_case, create_template_use_case, update_template_use_case, delete_template_use_case,
    list_crews_use_case, get_crew_use_case, create_crew_use_case, update_crew_use_case, delete_crew_use_case,
    list_external_services_use_case, get_external_service_use_case, create_external_service_use_case, update_external_service_use_case, delete_external_service_use_case,
    list_automations_use_case, get_automation_use_case, create_automation_use_case, update_automation_use_case, delete_automation_use_case,
    get_trash_use_case, restore_item_use_case, purge_item_use_case
)
from app.modules.workspaces.application.schemas import (
    PatternResponse, CreatePatternRequest, UpdatePatternRequest,
    TemplateResponse, CreateTemplateRequest, UpdateTemplateRequest,
    CrewResponse, CreateCrewRequest, UpdateCrewRequest,
    WorkspaceResponse,
    ExternalServiceResponse, CreateExternalServiceRequest, UpdateExternalServiceRequest,
    AutomationResponse, CreateAutomationRequest, UpdateAutomationRequest,
    TrashItemResponse
)

router = APIRouter(
    prefix="/workspaces",
    tags=["workspaces"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/trash", response_model=List[TrashItemResponse])
async def get_trash(
    trash = Depends(get_trash_use_case)
):
    """List all deleted items."""
    return trash

@router.post("/trash/{item_id}/restore", status_code=status.HTTP_200_OK)
async def restore_item(
    item_id: UUID,
    item_type: str,
    success: bool = Depends(restore_item_use_case)
):
    """Restore a deleted item."""
    if not success:
        raise HTTPException(status_code=404, detail="Item not found or could not be restored")
    return {"message": "Item restored successfully"}

@router.delete("/trash/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def purge_item(
    item_id: UUID,
    item_type: str,
    success: bool = Depends(purge_item_use_case)
):
    """Permanently delete an item."""
    if not success:
        raise HTTPException(status_code=404, detail="Item not found or could not be deleted")
    return

@router.get("/", response_model=List[WorkspaceResponse])
async def list_workspaces():
    """List all unique workspace identifiers from patterns, templates, and crews."""
    standard_workspaces = [
        {"id": "ws-discovery", "name": "Discovery", "description": "User research, JTBD, and opportunity mapping."},
        {"id": "ws-design", "name": "Design", "description": "UI/UX standards, components, and brand guidelines."},
        {"id": "ws-delivery", "name": "Delivery", "description": "Engineering standards, DevOps, and deployment workflows."},
        {"id": "ws-product", "name": "Product Management", "description": "Strategy, roadmaps, and PRD production."},
        {"id": "ws-growth", "name": "Growth & Market", "description": "Marketing, SEO, and competitor analysis."}
    ]
    return [
        WorkspaceResponse(
            id=ws["id"],
            name=ws["name"],
            description=ws["description"]
        ) for ws in standard_workspaces
    ]

@router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def get_workspace(workspace_id: str):
    """Get a single workspace by its ID."""
    standard_workspaces = {
        "ws-discovery": {"name": "Discovery", "description": "User research, JTBD, and opportunity mapping."},
        "ws-design": {"name": "Design", "description": "UI/UX standards, components, and brand guidelines."},
        "ws-delivery": {"name": "Delivery", "description": "Engineering standards, DevOps, and deployment workflows."},
        "ws-product": {"name": "Product Management", "description": "Strategy, roadmaps, and PRD production."},
        "ws-growth": {"name": "Growth & Market", "description": "Marketing, SEO, and competitor analysis."}
    }
    
    if workspace_id not in standard_workspaces:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    ws = standard_workspaces[workspace_id]
    return WorkspaceResponse(
        id=workspace_id,
        name=ws["name"],
        description=ws["description"]
    )

# --- Patterns ---

@router.get("/{workspace_id}/patterns", response_model=List[PatternResponse])
async def list_patterns(
    workspace_id: str,
    limit: int = 100,
    offset: int = 0,
    patterns = Depends(list_patterns_use_case)
):
    """List all reusable graphs (Patterns) for a given workspace."""
    return patterns

@router.get("/{workspace_id}/patterns/{pattern_id}", response_model=PatternResponse)
async def get_pattern(
    pattern_id: UUID,
    pattern = Depends(get_pattern_use_case)
):
    """Get a single pattern."""
    if not pattern:
        raise HTTPException(status_code=404, detail="Pattern not found")
    return pattern

@router.post("/{workspace_id}/patterns", response_model=PatternResponse, status_code=status.HTTP_201_CREATED)
async def create_pattern(
    pattern = Depends(create_pattern_use_case)
):
    """Create a new search/pattern for a given workspace."""
    return pattern

@router.put("/{workspace_id}/patterns/{pattern_id}", response_model=PatternResponse)
async def update_pattern(
    result = Depends(update_pattern_use_case)
):
    """Update a pattern."""
    if not result:
        raise HTTPException(status_code=404, detail="Pattern not found")
    return result

@router.delete("/{workspace_id}/patterns/{pattern_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pattern(
    success: bool = Depends(delete_pattern_use_case)
):
    """Delete a pattern."""
    if not success:
        raise HTTPException(status_code=404, detail="Pattern not found")
    return

# --- Templates ---

@router.get("/{workspace_id}/templates", response_model=List[TemplateResponse])
async def list_templates(
    limit: int = 100,
    offset: int = 0,
    templates = Depends(list_templates_use_case)
):
    """List all manual checklist templates for a given workspace."""
    return templates

@router.get("/{workspace_id}/templates/{template_id}", response_model=TemplateResponse)
async def get_template(
    template_id: UUID,
    template = Depends(get_template_use_case)
):
    """Get a single template."""
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template

@router.post("/{workspace_id}/templates", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(
    template = Depends(create_template_use_case)
):
    """Create a new manual template for a given workspace."""
    return template

@router.put("/{workspace_id}/templates/{template_id}", response_model=TemplateResponse)
async def update_template(
    result = Depends(update_template_use_case)
):
    """Update a template."""
    if not result:
        raise HTTPException(status_code=404, detail="Template not found")
    return result

@router.delete("/{workspace_id}/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    success: bool = Depends(delete_template_use_case)
):
    """Delete a template."""
    if not success:
        raise HTTPException(status_code=404, detail="Template not found")
    return

# --- Crews ---

@router.get("/{workspace_id}/crews", response_model=List[CrewResponse])
async def list_crews(
    limit: int = 100,
    offset: int = 0,
    crews = Depends(list_crews_use_case)
):
    """List all agent crews for a given workspace."""
    return crews

@router.get("/{workspace_id}/crews/{crew_id}", response_model=CrewResponse)
async def get_crew(
    crew_id: UUID,
    crew = Depends(get_crew_use_case)
):
    """Get a single crew."""
    if not crew:
        raise HTTPException(status_code=404, detail="Crew not found")
    return crew

@router.post("/{workspace_id}/crews", response_model=CrewResponse, status_code=status.HTTP_201_CREATED)
async def create_crew(
    crew = Depends(create_crew_use_case)
):
    """Create a new agent crew for a given workspace."""
    return crew

@router.put("/{workspace_id}/crews/{crew_id}", response_model=CrewResponse)
async def update_crew(
    result = Depends(update_crew_use_case)
):
    """Update a crew."""
    if not result:
        raise HTTPException(status_code=404, detail="Crew not found")
    return result

@router.delete("/{workspace_id}/crews/{crew_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_crew(
    success: bool = Depends(delete_crew_use_case)
):
    """Delete a crew."""
    if not success:
        raise HTTPException(status_code=404, detail="Crew not found")
    return

# --- Services ---

@router.get("/{workspace_id}/services", response_model=List[ExternalServiceResponse])
async def list_services(
    workspace_id: str,
    services = Depends(list_external_services_use_case)
):
    """List all services for a given workspace."""
    return services

@router.get("/{workspace_id}/services/{service_id}", response_model=ExternalServiceResponse)
async def get_service(
    service = Depends(get_external_service_use_case)
):
    """Get a single service."""
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/{workspace_id}/services", response_model=ExternalServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service = Depends(create_external_service_use_case)
):
    """Create a new service for a given workspace."""
    return service

@router.put("/{workspace_id}/services/{service_id}", response_model=ExternalServiceResponse)
async def update_service(
    result = Depends(update_external_service_use_case)
):
    """Update a service."""
    if not result:
        raise HTTPException(status_code=404, detail="Service not found")
    return result

@router.delete("/{workspace_id}/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_service(
    success: bool = Depends(delete_external_service_use_case)
):
    """Delete a service."""
    if not success:
        raise HTTPException(status_code=404, detail="Service not found")
    return

# --- Automations ---

@router.get("/{workspace_id}/automations", response_model=List[AutomationResponse])
async def list_automations(
    workspace_id: str,
    automations = Depends(list_automations_use_case)
):
    """List all automations for a given workspace."""
    return automations

@router.get("/{workspace_id}/automations/{automation_id}", response_model=AutomationResponse)
async def get_automation(
    automation = Depends(get_automation_use_case)
):
    """Get a single automation."""
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")
    return automation

@router.post("/{workspace_id}/automations", response_model=AutomationResponse, status_code=status.HTTP_201_CREATED)
async def create_automation(
    automation = Depends(create_automation_use_case)
):
    """Create a new automation for a given workspace."""
    return automation

@router.put("/{workspace_id}/automations/{automation_id}", response_model=AutomationResponse)
async def update_automation(
    result = Depends(update_automation_use_case)
):
    """Update an automation."""
    if not result:
        raise HTTPException(status_code=404, detail="Automation not found")
    return result

@router.delete("/{workspace_id}/automations/{automation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_automation(
    success: bool = Depends(delete_automation_use_case)
):
    """Delete an automation."""
    if not success:
        raise HTTPException(status_code=404, detail="Automation not found")
    return
