from pydantic import BaseModel
from typing import List, Optional, Any, Dict
from uuid import UUID
from datetime import datetime
from app.modules.workspaces.domain.enums import PatternType, ProcessType
from app.modules.workspaces.domain.models import Pattern, Template, Crew, DataInterface, ExternalService, Automation, ServiceCapability

class WorkspaceResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

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
    template_inputs: List[Dict[str, Any]] = []   # [{"id": str, "label": str, "expectedType": str}]
    template_outputs: List[Dict[str, Any]] = []  # [{"id": str, "label": str}]
    availability_workspace: List[str]

class TemplateResponse(Template):
    pass

class UpdateTemplateRequest(BaseModel):
    template_name: Optional[str] = None
    template_description: Optional[str] = None
    template_markdown_content: Optional[str] = None
    template_checklist_items: Optional[List[Dict[str, Any]]] = None
    template_keywords: Optional[List[str]] = None
    template_inputs: Optional[List[Dict[str, Any]]] = None
    template_outputs: Optional[List[Dict[str, Any]]] = None
    availability_workspace: Optional[List[str]] = None

class CreateCrewRequest(BaseModel):
    crew_name: str
    crew_description: Optional[str] = None
    crew_process_type: ProcessType = ProcessType.SEQUENTIAL
    manager_agent_id: Optional[UUID] = None
    crew_keywords: List[str] = []
    availability_workspace: List[str]
    data_interface: Optional[DataInterface] = None
    metadata: Dict[str, Any] = {}
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
    data_interface: Optional[DataInterface] = None
    metadata: Optional[Dict[str, Any]] = None
    agent_member_ids: Optional[List[UUID]] = None

# --- External Service ---

class CreateCapabilityRequest(BaseModel):
    capability_name: str
    capability_description: Optional[str] = None

class ServiceCapabilityResponse(ServiceCapability):
    pass

class CreateExternalServiceRequest(BaseModel):
    service_name: str
    service_category: str
    service_url: str
    service_keywords: List[str] = []
    availability_workspace: List[str] = []
    capabilities: List[CreateCapabilityRequest] = []

class UpdateExternalServiceRequest(BaseModel):
    service_name: Optional[str] = None
    service_category: Optional[str] = None
    service_url: Optional[str] = None
    service_keywords: Optional[List[str]] = None
    availability_workspace: Optional[List[str]] = None
    capabilities: Optional[List[CreateCapabilityRequest]] = None

class ExternalServiceResponse(ExternalService):
    pass

# --- Automation ---

class CreateAutomationRequest(BaseModel):
    automation_name: str
    automation_description: Optional[str] = None
    automation_platform: str
    automation_webhook_url: str
    automation_http_method: str = "POST"
    automation_auth_config: Optional[Dict[str, Any]] = None
    automation_input_schema: Optional[Dict[str, Any]] = None
    automation_output_schema: Optional[Dict[str, Any]] = None
    automation_keywords: List[str] = []
    availability_workspace: List[str] = []

class UpdateAutomationRequest(BaseModel):
    automation_name: Optional[str] = None
    automation_description: Optional[str] = None
    automation_platform: Optional[str] = None
    automation_webhook_url: Optional[str] = None
    automation_http_method: Optional[str] = None
    automation_auth_config: Optional[Dict[str, Any]] = None
    automation_input_schema: Optional[Dict[str, Any]] = None
    automation_output_schema: Optional[Dict[str, Any]] = None
    automation_keywords: Optional[List[str]] = None
    availability_workspace: Optional[List[str]] = None

class AutomationResponse(Automation):
    pass
