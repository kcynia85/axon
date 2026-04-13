from sqlalchemy import Column, String, DateTime, Boolean, Integer, Enum as SAEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.shared.infrastructure.base import Base
from app.modules.knowledge.domain.enums import ResourceFileFormat, RAGIndexingStatus

def get_now():
    return datetime.now(timezone.utc)

class KnowledgeHubTable(Base):
    __tablename__ = "knowledge_hubs"

    id = Column(UUID(as_uuid=True), primary_key=True)
    hub_name = Column(String, unique=True, nullable=False)
    hub_description = Column(String, nullable=True)
    workspace_domain = Column(String, nullable=False) # Enum as string
    hub_keywords = Column(ARRAY(String), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_now)
    updated_at = Column(DateTime(timezone=True), default=get_now, onupdate=get_now)

    resources = relationship("KnowledgeResourceTable", back_populates="hub", cascade="all, delete-orphan")

class KnowledgeResourceTable(Base):
    __tablename__ = "knowledge_resources"

    id = Column(UUID(as_uuid=True), primary_key=True)
    resource_file_name = Column(String, nullable=False)
    resource_file_format = Column(SAEnum(ResourceFileFormat, name="sourcefileformat", create_type=False), nullable=False)
    resource_file_size_bytes = Column(Integer, nullable=True)
    resource_metadata = Column(JSONB, default={})
    resource_rag_indexing_status = Column(SAEnum(RAGIndexingStatus, name="ragindexingstatus", create_type=False), default=RAGIndexingStatus.PENDING, nullable=False)
    resource_indexed_at = Column(DateTime(timezone=True), nullable=True)
    resource_chunk_count = Column(Integer, default=0)
    resource_chunking_strategy_ref = Column(String, nullable=True) # ID or name
    resource_indexing_error = Column(String, nullable=True)
    knowledge_hub_id = Column(UUID(as_uuid=True), ForeignKey("knowledge_hubs.id"), nullable=True)
    vector_database_id = Column(UUID(as_uuid=True), nullable=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_now)
    updated_at = Column(DateTime(timezone=True), default=get_now, onupdate=get_now)

    hub = relationship("KnowledgeHubTable", back_populates="resources")
    chunks = relationship("TextChunkTable", back_populates="resource", cascade="all, delete-orphan")

class TextChunkTable(Base):
    __tablename__ = "text_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True)
    chunk_index = Column(Integer, nullable=False)
    chunk_text = Column(String, nullable=False)
    chunk_embedding = Column(Vector(768))
    chunk_metadata = Column(JSONB, default={})
    chunk_token_count = Column(Integer, nullable=True)
    knowledge_resource_id = Column(UUID(as_uuid=True), ForeignKey("knowledge_resources.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_now)

    resource = relationship("KnowledgeResourceTable", back_populates="chunks")


class AssetTable(Base):
    __tablename__ = "assets"

    id = Column(UUID(as_uuid=True), primary_key=True)
    slug = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    type = Column(String, nullable=False)  # template, sop, checklist
    domain = Column(String, nullable=False)  # design, discovery, etc.
    metadata_ = Column("metadata", JSONB, default={})
    description_embedding = Column(Vector(768))
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_now)
    updated_at = Column(DateTime(timezone=True), default=get_now, onupdate=get_now)


class SemanticCacheTable(Base):
    __tablename__ = "semantic_cache"

    id = Column(UUID(as_uuid=True), primary_key=True)
    query = Column(String, nullable=False)
    query_embedding = Column(Vector(768), nullable=False)
    response = Column(String, nullable=False)
    metadata_ = Column("metadata", JSONB, default={})
    created_at = Column(DateTime(timezone=True), default=get_now)


class KnowledgeFeedbackTable(Base):
    __tablename__ = "knowledge_feedback"

    id = Column(UUID(as_uuid=True), primary_key=True)
    query = Column(String, nullable=False)
    response = Column(String, nullable=False)
    feedback_type = Column(String, nullable=False) # e.g., 'positive', 'negative'
    chunk_ids = Column(ARRAY(String), default=[])
    user_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=get_now)
