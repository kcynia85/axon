from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from uuid import UUID
from backend.app.modules.workspaces.domain.enums import PatternType, ProcessType
from backend.app.modules.workspaces.domain.models import Pattern, Template, Crew

class CreatePatternRequest(BaseModel):
    pattern_name: str
    pattern_type: PatternType = PatternType.PATTERN
    pattern_okr_context: Optional[str] = None
    pattern_graph_structure: Dict[str, Any]
    pattern_keywords: List[str] = []
    availability_workspace: List[str]

class UpdatePatternRequest(BaseModel):
    pattern_name: Optional[str] = None
    pattern_type: Optional[PatternType] = None
    pattern_okr_context: Optional[str] = None
    pattern_graph_structure: Optional[Dict[str, Any]] = None
    pattern_keywords: Optional[List[str]] = None
    availability_workspace: Optional[List[str]] = None

class PatternResponse(Pattern):
    pass

class CreateTemplateRequest(BaseModel):
    template_name: str
    template_description: Optional[str] = None
    template_markdown_content: str
    template_checklist_items: List[Dict[str, Any]] = []
    template_keywords: List[str] = []
    availability_workspace: List[str]

class TemplateResponse(Template):
    pass

class UpdateTemplateRequest(BaseModel):
    template_name: Optional[str] = None
    template_description: Optional[str] = None
    template_markdown_content: Optional[str] = None
    template_checklist_items: Optional[List[Dict[str, Any]]] = None
    template_keywords: Optional[List[str]] = None
    availability_workspace: Optional[List[str]] = None

class CreateCrewRequest(BaseModel):
    crew_name: str
    crew_description: Optional[str] = None
    crew_process_type: ProcessType = ProcessType.SEQUENTIAL
    manager_agent_id: Optional[UUID] = None
    crew_keywords: List[str] = []
    availability_workspace: List[str]
    agent_member_ids: List[UUID] = []

class CrewResponse(Crew):
    pass

class UpdateCrewRequest(BaseModel):
    crew_name: Optional[str] = None
    crew_description: Optional[str] = None
    crew_process_type: Optional[ProcessType] = None
    manager_agent_id: Optional[UUID] = None
    crew_keywords: Optional[List[str]] = None
    availability_workspace: Optional[List[str]] = None
    agent_member_ids: Optional[List[UUID]] = None
