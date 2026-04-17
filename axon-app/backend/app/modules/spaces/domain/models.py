from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Any, Optional
from app.modules.spaces.domain.enums import (
    SpaceStatus, 
    WorkspaceDomain, 
    NodeExecutionStatus, 
    LogStatus, 
    SessionStatus
)
from app.shared.utils.time import now_utc

class Space(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    space_name: str
    space_description: Optional[str] = None
    space_status: SpaceStatus = SpaceStatus.DRAFT
    project_id: Optional[UUID] = None
    space_viewport_config: dict[str, Any] = Field(default_factory=dict)
    canvas_data: dict[str, Any] = Field(default_factory=lambda: {"nodes": [], "edges": []})
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class SpaceZone(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    workspace_domain: WorkspaceDomain
    zone_position_x: float
    zone_position_y: float
    zone_width: float
    zone_height: float
    zone_color: Optional[str] = None
    space_id: UUID
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class SpaceNode(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    node_label: Optional[str] = None
    node_position_x: float
    node_position_y: float
    node_execution_status: NodeExecutionStatus = NodeExecutionStatus.IDLE
    node_runtime_state: dict[str, Any] = Field(default_factory=dict)
    component_type: str # Agent, Crew, etc.
    component_id: UUID
    space_id: UUID
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class NodeEdge(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    source_node_id: UUID
    edge_source_handle_id: str
    target_node_id: UUID
    edge_target_handle_id: str
    space_id: UUID

class ExecutionLog(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    log_status: LogStatus
    log_started_at: datetime
    log_completed_at: Optional[datetime] = None
    log_outcome: Optional[dict[str, Any]] = None
    log_streaming: Optional[str] = None
    log_error_message: Optional[str] = None
    log_token_consumed: Optional[int] = None
    log_execution_cost: Optional[float] = None
    canvas_node_id: UUID
    created_at: datetime = Field(default_factory=now_utc)

class ChatSession(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    messages: list[dict[str, Any]] = Field(default_factory=list)
    session_status: SessionStatus = SessionStatus.ACTIVE
    canvas_node_id: UUID
    user_id: UUID
    created_at: datetime = Field(default_factory=now_utc)
    resolved_at: Optional[datetime] = None
