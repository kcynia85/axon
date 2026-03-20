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
