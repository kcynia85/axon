from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, Enum as SAEnum, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB
from pgvector.sqlalchemy import Vector
from app.shared.infrastructure.base import Base
from app.shared.utils.time import now_utc
from app.modules.system.domain.enums import UserRole, VoiceProvider
import uuid

class UserTable(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    user_email = Column(String, unique=True, nullable=False)
    user_email_verified = Column(Boolean, default=False)
    user_display_name = Column(String, nullable=False)
    user_avatar_url = Column(String, nullable=True)
    user_password_hash = Column(String, nullable=False)
    user_preferences = Column(JSONB, default={})
    user_role = Column(SAEnum(UserRole), default=UserRole.WORKER, nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    last_login_at = Column(DateTime(timezone=True), nullable=True)

class MetaAgentTable(Base):
    __tablename__ = "meta_agents"

    id = Column(UUID(as_uuid=True), primary_key=True)
    meta_agent_system_prompt = Column(String, nullable=False)
    meta_agent_temperature = Column(Float, default=0.7)
    meta_agent_rag_enabled = Column(Boolean, default=True)
    meta_agent_system_knowledge_rags = Column(JSONB, default=[]) # List of RAG configs
    
    llm_model_id = Column(UUID(as_uuid=True), ForeignKey("llm_models.id"), nullable=True)

class VoiceMetaAgentTable(Base):
    __tablename__ = "voice_meta_agents"

    id = Column(UUID(as_uuid=True), primary_key=True)
    voice_provider = Column(SAEnum(VoiceProvider), nullable=False)
    voice_id = Column(String, nullable=False)
    meta_agent_system_prompt = Column(String, nullable=False)

class SystemEmbeddingTable(Base):
    __tablename__ = "system_embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    entity_type = Column(String, nullable=False, index=True)
    embedding = Column(Vector(768), nullable=False)
    payload = Column(JSONB, nullable=True)
    metadata_ = Column(JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
