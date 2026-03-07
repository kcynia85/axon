from fastapi import APIRouter, Depends, status, HTTPException
from typing import List, Optional
from uuid import UUID

from app.api.deps import get_current_user
from app.modules.workspaces.application.service import (
    get_unique_workspaces_use_case,
    list_patterns_use_case, create_pattern_use_case, update_pattern_use_case, delete_pattern_use_case,
    list_templates_use_case, create_template_use_case, update_template_use_case, delete_template_use_case,
    list_crews_use_case, create_crew_use_case, update_crew_use_case, delete_crew_use_case
)
from app.modules.workspaces.application.schemas import (
    PatternResponse, CreatePatternRequest, UpdatePatternRequest,
    TemplateResponse, CreateTemplateRequest, UpdateTemplateRequest,
    CrewResponse, CreateCrewRequest, UpdateCrewRequest,
    WorkspaceResponse
)

router = APIRouter(
    prefix="/workspaces",
    tags=["workspaces"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/", response_model=List[WorkspaceResponse])
async def list_workspaces(
    limit: int = 100,
    offset: int = 0,
    workspace_names: List[str] = Depends(get_unique_workspaces_use_case)
):
    """List all unique workspace identifiers from patterns, templates, and crews."""
    return [
        WorkspaceResponse(
            id=name.lower().replace(" ", "-"),
            name=name,
            description=f"Automated workspace for {name}"
        ) for name in workspace_names
    ]

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
