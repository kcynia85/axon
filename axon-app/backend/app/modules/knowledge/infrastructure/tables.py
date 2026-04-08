from sqlalchemy import Column, String, DateTime, Boolean, Index, Integer, Enum as SAEnum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import relationship
from app.shared.utils.time import now_utc
from app.shared.infrastructure.base import Base
from app.modules.knowledge.domain.enums import SourceFileFormat, RAGIndexingStatus

class KnowledgeHubTable(Base):
    __tablename__ = "knowledge_hubs"

    id = Column(UUID(as_uuid=True), primary_key=True)
    hub_name = Column(String, unique=True, nullable=False)
    hub_description = Column(String, nullable=True)
    workspace_domain = Column(String, nullable=False) # Enum as string
    hub_keywords = Column(ARRAY(String), nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    sources = relationship("KnowledgeSourceTable", back_populates="hub", cascade="all, delete-orphan")

class KnowledgeSourceTable(Base):
    __tablename__ = "knowledge_sources"

    id = Column(UUID(as_uuid=True), primary_key=True)
    source_file_name = Column(String, nullable=False)
    source_file_format = Column(SAEnum(SourceFileFormat), nullable=False)
    source_file_size_bytes = Column(Integer, nullable=True)
    source_metadata = Column(JSONB, default={})
    source_rag_indexing_status = Column(SAEnum(RAGIndexingStatus), default=RAGIndexingStatus.PENDING, nullable=False)
    source_indexed_at = Column(DateTime(timezone=True), nullable=True)
    source_chunk_count = Column(Integer, default=0)
    source_chunking_strategy_ref = Column(String, nullable=True) # ID or name
    source_indexing_error = Column(String, nullable=True)
    knowledge_hub_id = Column(UUID(as_uuid=True), ForeignKey("knowledge_hubs.id"), nullable=True)
    vector_database_id = Column(UUID(as_uuid=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)

    hub = relationship("KnowledgeHubTable", back_populates="sources")
    chunks = relationship("TextChunkTable", back_populates="source", cascade="all, delete-orphan")

class TextChunkTable(Base):
    __tablename__ = "text_chunks"

    id = Column(UUID(as_uuid=True), primary_key=True)
    chunk_index = Column(Integer, nullable=False)
    chunk_text = Column(String, nullable=False)
    chunk_embedding = Column(Vector(768))
    chunk_metadata = Column(JSONB, default={})
    chunk_token_count = Column(Integer, nullable=True)
    knowledge_source_id = Column(UUID(as_uuid=True), ForeignKey("knowledge_sources.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)

    source = relationship("KnowledgeSourceTable", back_populates="chunks")


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
    is_deleted = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
