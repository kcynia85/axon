from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, Enum as SAEnum, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from app.shared.infrastructure.base import Base
from app.shared.utils.time import now_utc
from app.modules.resources.domain.enums import (
    AutomationPlatform, AutomationHttpMethod, ValidationStatus,
    ServiceCategory, ToolCategory, AvailabilityWorkspace
)

class PromptArchetypeTable(Base):
    __tablename__ = "prompt_archetypes"

    id = Column(UUID(as_uuid=True), primary_key=True)
    archetype_name = Column(String, unique=True, nullable=False)
    archetype_description = Column(String, nullable=True)
    archetype_role = Column(String, nullable=False)
    archetype_goal = Column(String, nullable=False)
    archetype_backstory = Column(String, nullable=False)
    archetype_guardrails = Column(JSONB, nullable=False) # {instructions: [], constraints: []}
    archetype_knowledge_hubs = Column(JSONB, nullable=True) # List of hub IDs? Or just names?
    archetype_keywords = Column(ARRAY(String), nullable=True)
    workspace_domain = Column(String, nullable=False) # Using String for now to avoid enum conflicts
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

class ExternalServiceTable(Base):
    __tablename__ = "external_services"

    id = Column(UUID(as_uuid=True), primary_key=True)
    service_name = Column(String, nullable=False)
    service_category = Column(SAEnum(ServiceCategory), nullable=False)
    service_url = Column(String, nullable=False)
    service_keywords = Column(ARRAY(String), nullable=True)
    availability_workspace = Column(ARRAY(String), nullable=False) # List of Enums stored as strings
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    capabilities = relationship("ServiceCapabilityTable", back_populates="service", cascade="all, delete-orphan")

class ServiceCapabilityTable(Base):
    __tablename__ = "service_capabilities"

    id = Column(UUID(as_uuid=True), primary_key=True)
    capability_name = Column(String, nullable=False)
    capability_description = Column(String, nullable=True)
    external_service_id = Column(UUID(as_uuid=True), ForeignKey("external_services.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)

    service = relationship("ExternalServiceTable", back_populates="capabilities")

class InternalToolTable(Base):
    __tablename__ = "internal_tools"

    id = Column(UUID(as_uuid=True), primary_key=True)
    tool_function_name = Column(String, unique=True, nullable=False)
    tool_display_name = Column(String, nullable=False)
    tool_description = Column(String, nullable=False)
    tool_category = Column(SAEnum(ToolCategory), nullable=False)
    tool_keywords = Column(ARRAY(String), nullable=True)
    tool_input_schema = Column(JSONB, nullable=False)
    tool_output_schema = Column(JSONB, nullable=False)
    tool_is_active = Column(Boolean, default=True, nullable=False)
    availability_workspace = Column(ARRAY(String), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

class AutomationTable(Base):
    __tablename__ = "automations"

    id = Column(UUID(as_uuid=True), primary_key=True)
    automation_name = Column(String, nullable=False)
    automation_description = Column(String, nullable=True)
    automation_platform = Column(SAEnum(AutomationPlatform), nullable=False)
    automation_webhook_url = Column(String, nullable=False)
    automation_http_method = Column(SAEnum(AutomationHttpMethod), default=AutomationHttpMethod.POST, nullable=False)
    automation_auth_config = Column(JSONB, nullable=True) # {type, key, value}
    automation_input_schema = Column(JSONB, nullable=True)
    automation_output_schema = Column(JSONB, nullable=True)
    automation_validation_status = Column(SAEnum(ValidationStatus), default=ValidationStatus.UNTESTED, nullable=False)
    automation_last_validated_at = Column(DateTime(timezone=True), nullable=True)
    automation_keywords = Column(ARRAY(String), nullable=True)
    availability_workspace = Column(ARRAY(String), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    executions = relationship("AutomationExecutionTable", back_populates="automation", cascade="all, delete-orphan")

class AutomationExecutionTable(Base):
    __tablename__ = "automation_executions"

    id = Column(UUID(as_uuid=True), primary_key=True)
    automation_id = Column(UUID(as_uuid=True), ForeignKey("automations.id"), nullable=False)
    status = Column(String, nullable=False)
    payload = Column(JSONB, nullable=True)
    response = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)

    automation = relationship("AutomationTable", back_populates="executions")
