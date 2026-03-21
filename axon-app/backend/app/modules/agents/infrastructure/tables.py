from sqlalchemy import Column, String, ForeignKey, DateTime, Enum as SAEnum, Index, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from app.modules.agents.domain.enums import AgentRole, ModelTier
from app.shared.utils.time import now_utc
from app.shared.infrastructure.base import Base

class AgentConfigTable(Base):
    __tablename__ = "agent_configs"

    id = Column(UUID(as_uuid=True), primary_key=True)
    # Legacy fields - nullable for vNext custom agents migration
    role = Column(SAEnum(AgentRole), unique=True, nullable=True)
    description = Column(String, default="")
    model_tier = Column(SAEnum(ModelTier), default=ModelTier.TIER_2_EXPERT, nullable=True)
    tools = Column(JSONB, default=[])
    system_instruction = Column(String, default="")
    
    # New vNext fields
    agent_name = Column(String, nullable=True)
    agent_role_text = Column("agent_role_text", String, nullable=True) # Replacing enum role for custom agents
    agent_goal = Column(String, nullable=True)
    agent_backstory = Column(String, nullable=True)
    guardrails = Column(JSONB, default={"instructions": [], "constraints": []})
    few_shot_examples = Column(JSONB, default=[])
    reflexion = Column(Boolean, default=False)
    temperature = Column(Float, default=0.7)
    rag_enforcement = Column(Boolean, default=False)
    input_schema = Column(JSONB, nullable=True)
    output_schema = Column(JSONB, nullable=True)
    availability_workspace = Column(ARRAY(String), default=[])
    agent_keywords = Column(ARRAY(String), default=[])
    
    # Relationships
    llm_model_id = Column(UUID(as_uuid=True), ForeignKey("llm_models.id"), nullable=True)
    knowledge_hub_ids = Column(ARRAY(UUID(as_uuid=True)), nullable=True)

    # vNext+ Fields (Extended UI configuration)
    agent_visual_url = Column(String, nullable=True)
    auto_start = Column(Boolean, default=False)
    grounded_mode = Column(Boolean, default=False)
    native_skills = Column(ARRAY(String), default=[])
    custom_functions = Column(ARRAY(String), default=[])
    data_interface = Column(JSONB, default={"context": [], "artefacts": []})
    
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class ChatSessionTable(Base):
    __tablename__ = "chat_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=False)
    agent_role = Column(SAEnum(AgentRole), nullable=True) # Nullable if we use agent_id instead?
    # Keeping it as is for now to avoid breaking existing chats
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
    agent_role = Column(SAEnum(AgentRole), nullable=True)
    level = Column(String, nullable=False, default="INFO")
    event = Column(String, nullable=False) # e.g. "THOUGHT", "TOOL_CALL", "RESPONSE"
    content = Column(JSONB, default={}) # Detailed trace
    created_at = Column(DateTime(timezone=True), default=now_utc)

    __table_args__ = (
        Index("idx_agent_logs_content", "content", postgresql_using="gin"),
        Index("idx_agent_logs_session", "session_id"),
    )
