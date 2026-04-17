from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
from app.modules.resources.domain.enums import (
    AutomationPlatform, AutomationHttpMethod, ValidationStatus,
    ServiceCategory, ToolCategory
)

# --- Prompt Archetype ---

class CreatePromptArchetypeRequest(BaseModel):
    archetype_name: str
    archetype_description: Optional[str] = None
    archetype_role: str
    archetype_goal: str
    archetype_backstory: str
    archetype_guardrails: Dict[str, List[str]] = Field(default_factory=lambda: {"instructions": [], "constraints": []})
    archetype_knowledge_hubs: Optional[List[Dict[str, Any]]] = None
    archetype_keywords: List[str] = Field(default_factory=list)
    workspace_domain: str

class UpdatePromptArchetypeRequest(BaseModel):
    archetype_name: Optional[str] = None
    archetype_description: Optional[str] = None
    archetype_role: Optional[str] = None
    archetype_goal: Optional[str] = None
    archetype_backstory: Optional[str] = None
    archetype_guardrails: Optional[Dict[str, List[str]]] = None
    archetype_knowledge_hubs: Optional[List[Dict[str, Any]]] = None
    archetype_keywords: Optional[List[str]] = None
    workspace_domain: Optional[str] = None

class PromptArchetypeResponse(CreatePromptArchetypeRequest):
    id: UUID
    created_at: datetime
    updated_at: datetime

# --- External Service ---

class CreateCapabilityRequest(BaseModel):
    capability_name: str
    capability_description: Optional[str] = None

class ServiceCapabilityResponse(CreateCapabilityRequest):
    id: UUID
    external_service_id: UUID
    created_at: datetime

class CreateExternalServiceRequest(BaseModel):
    service_name: str
    service_description: Optional[str] = None
    service_category: ServiceCategory
    service_url: str
    service_keywords: List[str] = Field(default_factory=list)
    availability_workspace: List[str] = Field(default_factory=list)
    capabilities: List[CreateCapabilityRequest] = Field(default_factory=list)

class UpdateExternalServiceRequest(BaseModel):
    service_name: Optional[str] = None
    service_description: Optional[str] = None
    service_category: Optional[ServiceCategory] = None
    service_url: Optional[str] = None
    service_keywords: Optional[List[str]] = None
    availability_workspace: Optional[List[str]] = None
    capabilities: Optional[List[CreateCapabilityRequest]] = None

class ExternalServiceResponse(CreateExternalServiceRequest):
    id: UUID
    created_at: datetime
    updated_at: datetime
    capabilities: List[ServiceCapabilityResponse] = Field(default_factory=list)

# --- Internal Tool ---

class InternalToolResponse(BaseModel):
    id: UUID
    tool_function_name: str
    tool_display_name: str
    tool_description: str
    tool_category: ToolCategory
    tool_keywords: List[str]
    tool_input_schema: Dict[str, Any]
    tool_output_schema: Dict[str, Any]
    tool_is_active: bool
    tool_status: str
    availability_workspace: List[str]
    created_at: datetime
    updated_at: datetime

class SyncResultResponse(BaseModel):
    added: int
    updated: int
    removed: int
    errors: List[str]

class SyncRemoteToolRequest(BaseModel):
    file_name: str
    file_content: str
    author: Optional[str] = None
    status: Optional[str] = "draft"

# --- Automation ---

class CreateAutomationRequest(BaseModel):
    automation_name: str
    automation_description: Optional[str] = None
    automation_platform: AutomationPlatform
    automation_webhook_url: str
    automation_http_method: AutomationHttpMethod = AutomationHttpMethod.POST
    automation_auth_config: Optional[Dict[str, Any]] = None
    automation_input_schema: Optional[Dict[str, Any]] = None
    automation_output_schema: Optional[Dict[str, Any]] = None
    automation_keywords: List[str] = Field(default_factory=list)
    availability_workspace: List[str] = Field(default_factory=list)

class UpdateAutomationRequest(BaseModel):
    automation_name: Optional[str] = None
    automation_description: Optional[str] = None
    automation_platform: Optional[AutomationPlatform] = None
    automation_webhook_url: Optional[str] = None
    automation_http_method: Optional[AutomationHttpMethod] = None
    automation_auth_config: Optional[Dict[str, Any]] = None
    automation_input_schema: Optional[Dict[str, Any]] = None
    automation_output_schema: Optional[Dict[str, Any]] = None
    automation_keywords: Optional[List[str]] = None
    availability_workspace: Optional[List[str]] = None

class AutomationResponse(CreateAutomationRequest):
    id: UUID
    automation_validation_status: ValidationStatus
    automation_last_validated_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

class TestPayload(BaseModel):
    payload: Dict[str, Any]

class SimulatorResultResponse(BaseModel):
    success: bool
    status_code: int
    response_body: Dict[str, Any]
    latency_ms: float
    validation_status: ValidationStatus
