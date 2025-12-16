from sqlalchemy import Column, String, ForeignKey, DateTime, Enum as SAEnum, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from backend.app.modules.agents.domain.enums import AgentRole, ModelTier
from backend.app.shared.utils.time import now_utc
from backend.app.shared.infrastructure.base import Base

class AgentConfigTable(Base):
    __tablename__ = "agent_configs"

    id = Column(UUID(as_uuid=True), primary_key=True)
    role = Column(SAEnum(AgentRole), unique=True, nullable=False)
    description = Column(String, default="")
    model_tier = Column(SAEnum(ModelTier), default=ModelTier.TIER_2_EXPERT, nullable=False)
    tools = Column(JSONB, default=[])
    system_instruction = Column(String, default="")
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

class ChatSessionTable(Base):
    __tablename__ = "chat_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    agent_role = Column(SAEnum(AgentRole), nullable=False)
    history = Column(JSONB, default=[])
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    __table_args__ = (
        Index("idx_chats_history", "history", postgresql_using="gin"),
    )

class AgentLogTable(Base):
    __tablename__ = "agent_logs"

    id = Column(UUID(as_uuid=True), primary_key=True)
    session_id = Column(UUID(as_uuid=True), ForeignKey("chat_sessions.id"), nullable=False)
    agent_role = Column(SAEnum(AgentRole), nullable=False)
    level = Column(String, nullable=False, default="INFO")
    event = Column(String, nullable=False) # e.g. "THOUGHT", "TOOL_CALL", "RESPONSE"
    content = Column(JSONB, default={}) # Detailed trace
    created_at = Column(DateTime(timezone=True), default=now_utc)

    __table_args__ = (
        Index("idx_agent_logs_content", "content", postgresql_using="gin"),
        Index("idx_agent_logs_session", "session_id"),
    )
