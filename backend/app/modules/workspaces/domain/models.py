from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.modules.workspaces.domain.enums import PatternType, ProcessType
from app.shared.utils.time import now_utc

class Pattern(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    pattern_name: str
    pattern_type: PatternType = PatternType.PATTERN
    pattern_okr_context: Optional[str] = None
    pattern_graph_structure: Dict[str, Any]
    pattern_keywords: List[str] = Field(default_factory=list)
    availability_workspace: List[str]
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    deleted_at: Optional[datetime] = None

class Template(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    template_name: str
    template_description: Optional[str] = None
    template_markdown_content: str
    template_checklist_items: List[Dict[str, Any]] = Field(default_factory=list)
    template_keywords: List[str] = Field(default_factory=list)
    # Deterministic I/O: defined at template config time, used on canvas
    template_inputs: List[Dict[str, Any]] = Field(default_factory=list)   # [{"id": str, "label": str, "expectedType": str}]
    template_outputs: List[Dict[str, Any]] = Field(default_factory=list)  # [{"id": str, "label": str}]
    availability_workspace: List[str]
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    deleted_at: Optional[datetime] = None

class Crew(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    crew_name: str
    crew_description: Optional[str] = None
    crew_process_type: ProcessType = ProcessType.SEQUENTIAL
    manager_agent_id: Optional[UUID] = None
    crew_keywords: List[str] = Field(default_factory=list)
    availability_workspace: List[str]
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    deleted_at: Optional[datetime] = None
    
    # Non-persistent fields or for display
    agent_member_ids: List[UUID] = Field(default_factory=list)
