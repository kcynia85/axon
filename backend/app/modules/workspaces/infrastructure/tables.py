from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, Enum as SAEnum, Integer, Float, Table
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from app.shared.infrastructure.base import Base
from app.shared.utils.time import now_utc
from app.modules.workspaces.domain.enums import PatternType, ProcessType

class PatternTable(Base):
    __tablename__ = "patterns"

    id = Column(UUID(as_uuid=True), primary_key=True)
    pattern_name = Column(String, nullable=False)
    pattern_type = Column(SAEnum(PatternType), default=PatternType.PATTERN)
    pattern_okr_context = Column(String, nullable=True) # Enum?
    pattern_graph_structure = Column(JSONB, nullable=False) # nodes, edges, zones
    pattern_keywords = Column(ARRAY(String), nullable=True)
    availability_workspace = Column(ARRAY(String), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class TemplateTable(Base):
    __tablename__ = "templates"

    id = Column(UUID(as_uuid=True), primary_key=True)
    template_name = Column(String, nullable=False)
    template_description = Column(String, nullable=True)
    template_markdown_content = Column(String, nullable=False)
    template_checklist_items = Column(JSONB, default=[])
    template_keywords = Column(ARRAY(String), nullable=True)
    availability_workspace = Column(ARRAY(String), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

# Association table for Crew <-> Agent
crew_agents_association = Table(
    "crew_agents",
    Base.metadata,
    Column("crew_id", UUID(as_uuid=True), ForeignKey("crews.id"), primary_key=True),
    Column("agent_id", UUID(as_uuid=True), ForeignKey("agent_configs.id"), primary_key=True)
)

class CrewTable(Base):
    __tablename__ = "crews"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    crew_name = Column(String, nullable=False)
    crew_description = Column(String, nullable=True)
    crew_process_type = Column(SAEnum(ProcessType), default=ProcessType.SEQUENTIAL)
    manager_agent_id = Column(UUID(as_uuid=True), ForeignKey("agent_configs.id"), nullable=True)
    crew_keywords = Column(ARRAY(String), nullable=True)
    availability_workspace = Column(ARRAY(String), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    agents = relationship("AgentConfigTable", secondary=crew_agents_association, backref="crews")
