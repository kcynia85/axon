from sqlalchemy import Column, String, ForeignKey, DateTime, Enum as SAEnum, Float, Integer, Numeric, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.shared.infrastructure.base import Base
from app.shared.utils.time import now_utc
from app.modules.spaces.domain.enums import (
    SpaceStatus, 
    WorkspaceDomain, 
    NodeExecutionStatus, 
    LogStatus, 
    SessionStatus
)

class SpaceTable(Base):
    __tablename__ = "spaces"

    id = Column(UUID(as_uuid=True), primary_key=True)
    space_name = Column(String, nullable=False)
    space_description = Column(String, nullable=True)
    space_status = Column(SAEnum(SpaceStatus), default=SpaceStatus.DRAFT, nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=True)
    owner_id = Column(UUID(as_uuid=True), nullable=False)
    space_viewport_config = Column(JSONB, default={})
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    zones = relationship("SpaceZoneTable", back_populates="space", cascade="all, delete-orphan")
    nodes = relationship("SpaceNodeTable", back_populates="space", cascade="all, delete-orphan")
    edges = relationship("NodeEdgeTable", back_populates="space", cascade="all, delete-orphan")

class SpaceZoneTable(Base):
    __tablename__ = "space_zones"

    id = Column(UUID(as_uuid=True), primary_key=True)
    workspace_domain = Column(SAEnum(WorkspaceDomain), nullable=False)
    zone_position_x = Column(Float, nullable=False)
    zone_position_y = Column(Float, nullable=False)
    zone_width = Column(Float, nullable=False)
    zone_height = Column(Float, nullable=False)
    zone_color = Column(String, nullable=True)
    space_id = Column(UUID(as_uuid=True), ForeignKey("spaces.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    space = relationship("SpaceTable", back_populates="zones")

class SpaceNodeTable(Base):
    __tablename__ = "space_nodes"

    id = Column(UUID(as_uuid=True), primary_key=True)
    node_label = Column(String, nullable=True)
    node_position_x = Column(Float, nullable=False)
    node_position_y = Column(Float, nullable=False)
    node_execution_status = Column(SAEnum(NodeExecutionStatus), default=NodeExecutionStatus.IDLE, nullable=False)
    node_runtime_state = Column(JSONB, default={})
    component_type = Column(String, nullable=False)
    component_id = Column(UUID(as_uuid=True), nullable=False)
    space_id = Column(UUID(as_uuid=True), ForeignKey("spaces.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    space = relationship("SpaceTable", back_populates="nodes")
    execution_logs = relationship("ExecutionLogTable", back_populates="node", cascade="all, delete-orphan")

class NodeEdgeTable(Base):
    __tablename__ = "node_edges"

    id = Column(UUID(as_uuid=True), primary_key=True)
    source_node_id = Column(UUID(as_uuid=True), ForeignKey("space_nodes.id"), nullable=False)
    edge_source_handle_id = Column(String, nullable=False)
    target_node_id = Column(UUID(as_uuid=True), ForeignKey("space_nodes.id"), nullable=False)
    edge_target_handle_id = Column(String, nullable=False)
    space_id = Column(UUID(as_uuid=True), ForeignKey("spaces.id"), nullable=False)

    space = relationship("SpaceTable", back_populates="edges")

class ExecutionLogTable(Base):
    __tablename__ = "execution_logs"

    id = Column(UUID(as_uuid=True), primary_key=True)
    log_status = Column(SAEnum(LogStatus), nullable=False)
    log_started_at = Column(DateTime(timezone=True), nullable=False)
    log_completed_at = Column(DateTime(timezone=True), nullable=True)
    log_outcome = Column(JSONB, nullable=True)
    log_streaming = Column(Text, nullable=True)
    log_error_message = Column(String, nullable=True)
    log_token_consumed = Column(Integer, nullable=True)
    log_execution_cost = Column(Numeric(precision=10, scale=4), nullable=True)
    canvas_node_id = Column(UUID(as_uuid=True), ForeignKey("space_nodes.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)

    node = relationship("SpaceNodeTable", back_populates="execution_logs")

class ChatSessionTable(Base):
    __tablename__ = "canvas_chat_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True)
    messages = Column(JSONB, default=[], nullable=False)
    session_status = Column(SAEnum(SessionStatus), default=SessionStatus.ACTIVE, nullable=False)
    canvas_node_id = Column(UUID(as_uuid=True), ForeignKey("space_nodes.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
