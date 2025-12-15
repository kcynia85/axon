from sqlalchemy import Column, String, ForeignKey, DateTime, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import declarative_base
from backend.app.modules.agents.domain.enums import AgentRole, ModelTier
from backend.app.shared.utils.time import now_utc

Base = declarative_base()

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
