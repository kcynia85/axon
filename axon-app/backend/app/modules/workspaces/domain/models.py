from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, List, Dict, Any
from app.modules.workspaces.domain.enums import PatternType, ProcessType
from app.shared.utils.time import now_utc

class DataInterfaceItem(BaseModel):
    name: str
    field_type: str # e.g. "link", "text", "file"
    is_required: bool = True
    value: Optional[str] = None

class DataInterface(BaseModel):
    context: List[DataInterfaceItem] = Field(default_factory=list)
    artefacts: List[DataInterfaceItem] = Field(default_factory=list)

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
    template_inputs: List[Dict[str, Any]] = Field(default_factory=list)
    template_outputs: List[Dict[str, Any]] = Field(default_factory=list)
    availability_workspace: List[str]
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    deleted_at: Optional[datetime] = None

class ResolvedMember(BaseModel):
    id: UUID
    role: str
    visualUrl: Optional[str] = None

class Crew(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    crew_name: str
    crew_description: Optional[str] = None
    crew_process_type: ProcessType = ProcessType.SEQUENTIAL
    manager_agent_id: Optional[UUID] = None
    crew_keywords: List[str] = Field(default_factory=list)
    availability_workspace: List[str]
    data_interface: DataInterface = Field(default_factory=DataInterface)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    deleted_at: Optional[datetime] = None
    agent_member_ids: List[UUID] = Field(default_factory=list)
    resolved_members: List[ResolvedMember] = Field(default_factory=list)
    resolved_manager: Optional[ResolvedMember] = None

# --- Migrated Models ---

class ServiceCapability(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    capability_name: str
    capability_description: Optional[str] = None
    external_service_id: UUID
    created_at: datetime = Field(default_factory=now_utc)

class ExternalService(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    service_name: str
    service_description: Optional[str] = None
    service_category: str
    service_url: str
    service_input_schema: Optional[Dict[str, Any]] = None
    service_output_schema: Optional[Dict[str, Any]] = None
    service_keywords: List[str] = Field(default_factory=list)
    availability_workspace: List[str] = Field(default_factory=list)
    capabilities: List[ServiceCapability] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    deleted_at: Optional[datetime] = None

class Automation(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    automation_name: str
    automation_description: Optional[str] = None
    automation_platform: str
    automation_webhook_url: str
    automation_http_method: str = "POST"
    automation_auth_config: Optional[Dict[str, Any]] = None
    automation_input_schema: Optional[Dict[str, Any]] = None
    automation_output_schema: Optional[Dict[str, Any]] = None
    automation_keywords: List[str] = Field(default_factory=list)
    availability_workspace: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    deleted_at: Optional[datetime] = None

class TrashItem(BaseModel):
    id: UUID
    name: str
    type: str
    deleted_at: datetime
    workspace_id: Optional[str] = None
