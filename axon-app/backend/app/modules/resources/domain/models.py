from uuid import UUID, uuid4
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.shared.utils.time import now_utc
from app.modules.resources.domain.enums import (
    AutomationPlatform, AutomationHttpMethod, ValidationStatus,
    ServiceCategory, ToolCategory
)

# --- Base ---
class ResourceBase(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

# --- Prompt Archetype ---
class PromptArchetype(ResourceBase):
    archetype_name: str
    archetype_description: Optional[str] = None
    archetype_role: str
    archetype_goal: str
    archetype_backstory: str
    archetype_guardrails: Dict[str, List[str]] = Field(default_factory=lambda: {"instructions": [], "constraints": []})
    archetype_knowledge_hubs: Optional[List[Dict[str, Any]]] = None
    archetype_keywords: List[str] = Field(default_factory=list)
    workspace_domain: str

# --- External Service ---
class ServiceCapability(ResourceBase):
    capability_name: str
    capability_description: Optional[str] = None
    external_service_id: UUID

class ExternalService(ResourceBase):
    service_name: str
    service_description: Optional[str] = None
    service_category: ServiceCategory
    service_url: str
    service_keywords: List[str] = Field(default_factory=list)
    availability_workspace: List[str] = Field(default_factory=list)
    capabilities: List[ServiceCapability] = Field(default_factory=list)

# --- Internal Tool ---
class InternalTool(ResourceBase):
    tool_function_name: str
    tool_display_name: str
    tool_description: str
    tool_category: ToolCategory
    tool_keywords: List[str] = Field(default_factory=list)
    tool_input_schema: Dict[str, Any]
    tool_output_schema: Dict[str, Any]
    tool_is_active: bool = True
    tool_status: str = "draft" # draft, in_progress, testing, qa, staging, production, deprecated, disabled
    availability_workspace: List[str] = Field(default_factory=list)

# --- Automation ---
class AutomationExecution(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    automation_id: UUID
    status: str
    payload: Optional[Dict[str, Any]] = None
    response: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=now_utc)

class Automation(ResourceBase):
    automation_name: str
    automation_description: Optional[str] = None
    automation_platform: AutomationPlatform
    automation_webhook_url: str
    automation_http_method: AutomationHttpMethod = AutomationHttpMethod.POST
    automation_auth_config: Optional[Dict[str, Any]] = None
    automation_input_schema: Optional[Dict[str, Any]] = None
    automation_output_schema: Optional[Dict[str, Any]] = None
    automation_validation_status: ValidationStatus = ValidationStatus.UNTESTED
    automation_last_validated_at: Optional[datetime] = None
    automation_keywords: List[str] = Field(default_factory=list)
    availability_workspace: List[str] = Field(default_factory=list)
    executions: List[AutomationExecution] = Field(default_factory=list)
