from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from uuid import UUID
from app.modules.knowledge.domain.enums import SourceFileFormat, RAGIndexingStatus

class AssetUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[str] = None
    domain: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class SuccessResponse(BaseModel):
    message: str
    id: Optional[UUID] = None

class KnowledgeHubCreate(BaseModel):
    hub_name: str
    hub_description: Optional[str] = None
    workspace_domain: str
    hub_keywords: Optional[List[str]] = None

class KnowledgeHubResponse(KnowledgeHubCreate):
    id: UUID

class KnowledgeSourceCreate(BaseModel):
    source_file_name: str
    source_file_format: SourceFileFormat
    source_file_size_bytes: Optional[int] = None
    source_metadata: Dict[str, Any] = Field(default_factory=dict)
    source_chunking_strategy_ref: Optional[str] = None
    knowledge_hub_id: Optional[UUID] = None
    vector_database_id: Optional[UUID] = None

class KnowledgeSourceResponse(KnowledgeSourceCreate):
    id: UUID
    source_rag_indexing_status: RAGIndexingStatus
    source_indexed_at: Optional[str] = None
    source_chunk_count: int
    source_indexing_error: Optional[str] = None
