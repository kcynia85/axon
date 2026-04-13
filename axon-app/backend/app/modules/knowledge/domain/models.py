from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, Dict, Any, List
from app.shared.utils.time import now_utc
from app.modules.knowledge.domain.enums import ResourceFileFormat, RAGIndexingStatus

class Asset(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    slug: str
    title: str
    content: str
    type: str # template, sop, checklist
    domain: str # design, discovery, etc.
    metadata: Dict[str, Any] = Field(default_factory=dict)
    # description_embedding is handled by DB/Vector store, not usually in full Pydantic model unless needed
    deleted_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class Memory(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    content: str
    domain: str
    source_url: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=now_utc)

class KnowledgeHub(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    hub_name: str
    hub_description: Optional[str] = None
    workspace_domain: str
    hub_keywords: Optional[List[str]] = None
    created_at: Optional[datetime] = Field(default_factory=now_utc)
    updated_at: Optional[datetime] = Field(default_factory=now_utc)

class KnowledgeResource(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    resource_file_name: str
    resource_file_format: ResourceFileFormat
    resource_file_size_bytes: Optional[int] = None
    resource_metadata: Dict[str, Any] = Field(default_factory=dict)
    resource_rag_indexing_status: RAGIndexingStatus = RAGIndexingStatus.PENDING
    resource_indexed_at: Optional[datetime] = None
    resource_chunk_count: int = 0
    resource_chunking_strategy_ref: Optional[str] = None
    resource_indexing_error: Optional[str] = None
    knowledge_hub_id: Optional[UUID] = None
    vector_database_id: Optional[UUID] = None
    # UI-specific transient fields
    vector_database_name: Optional[str] = None
    vector_database_dimensions: Optional[int] = None
    knowledge_hub_name: Optional[str] = None
    deleted_at: Optional[datetime] = None
    created_at: Optional[datetime] = Field(default_factory=now_utc)
    updated_at: Optional[datetime] = Field(default_factory=now_utc)
