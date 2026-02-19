from fastapi import APIRouter, Depends, status, HTTPException
from typing import List, Optional
from uuid import UUID

from backend.app.api.deps import get_current_user
from backend.app.modules.workspaces.application.service import WorkspaceService
from backend.app.modules.workspaces.dependencies import get_workspace_service
from backend.app.modules.workspaces.application.schemas import (
    PatternResponse, CreatePatternRequest, UpdatePatternRequest,
    TemplateResponse, CreateTemplateRequest, UpdateTemplateRequest,
    CrewResponse, CreateCrewRequest, UpdateCrewRequest
)

router = APIRouter(
    prefix="/workspaces",
    tags=["workspaces"],
    dependencies=[Depends(get_current_user)]
)

# --- Patterns ---

@router.get("/{workspace_id}/patterns", response_model=List[PatternResponse])
async def list_patterns(
    workspace_id: str,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """List all reusable graphs (Patterns) for a given workspace."""
    return await service.list_patterns(workspace_id)

@router.post("/{workspace_id}/patterns", response_model=PatternResponse, status_code=status.HTTP_201_CREATED)
async def create_pattern(
    workspace_id: str,
    request: CreatePatternRequest,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """Create a new search/pattern for a given workspace."""
    return await service.create_pattern(request)

@router.put("/{workspace_id}/patterns/{pattern_id}", response_model=PatternResponse)
async def update_pattern(
    workspace_id: str,
    pattern_id: UUID,
    request: UpdatePatternRequest,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """Update a pattern."""
    result = await service.update_pattern(pattern_id, request)
    if not result:
        raise HTTPException(status_code=404, detail="Pattern not found")
    return result

@router.delete("/{workspace_id}/patterns/{pattern_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pattern(
    workspace_id: str,
    pattern_id: UUID,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """Delete a pattern."""
    if not await service.delete_pattern(pattern_id):
        raise HTTPException(status_code=404, detail="Pattern not found")
    return

# --- Templates ---

@router.get("/{workspace_id}/templates", response_model=List[TemplateResponse])
async def list_templates(
    workspace_id: str,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """List all manual checklist templates for a given workspace."""
    return await service.list_templates(workspace_id)

@router.post("/{workspace_id}/templates", response_model=TemplateResponse, status_code=status.HTTP_201_CREATED)
async def create_template(
    workspace_id: str,
    request: CreateTemplateRequest,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """Create a new manual template for a given workspace."""
    return await service.create_template(request)

@router.put("/{workspace_id}/templates/{template_id}", response_model=TemplateResponse)
async def update_template(
    workspace_id: str,
    template_id: UUID,
    request: UpdateTemplateRequest,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """Update a template."""
    result = await service.update_template(template_id, request)
    if not result:
        raise HTTPException(status_code=404, detail="Template not found")
    return result

@router.delete("/{workspace_id}/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    workspace_id: str,
    template_id: UUID,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """Delete a template."""
    if not await service.delete_template(template_id):
        raise HTTPException(status_code=404, detail="Template not found")
    return

# --- Crews ---

@router.get("/{workspace_id}/crews", response_model=List[CrewResponse])
async def list_crews(
    workspace_id: str,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """List all agent crews for a given workspace."""
    return await service.list_crews(workspace_id)

@router.post("/{workspace_id}/crews", response_model=CrewResponse, status_code=status.HTTP_201_CREATED)
async def create_crew(
    workspace_id: str,
    request: CreateCrewRequest,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """Create a new agent crew for a given workspace."""
    return await service.create_crew(request)

@router.put("/{workspace_id}/crews/{crew_id}", response_model=CrewResponse)
async def update_crew(
    workspace_id: str,
    crew_id: UUID,
    request: UpdateCrewRequest,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """Update a crew."""
    result = await service.update_crew(crew_id, request)
    if not result:
        raise HTTPException(status_code=404, detail="Crew not found")
    return result

@router.delete("/{workspace_id}/crews/{crew_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_crew(
    workspace_id: str,
    crew_id: UUID,
    service: WorkspaceService = Depends(get_workspace_service)
):
    """Delete a crew."""
    if not await service.delete_crew(crew_id):
        raise HTTPException(status_code=404, detail="Crew not found")
    return
