from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from app.modules.knowledge.domain.enums import ResourceFileFormat, RAGIndexingStatus

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

class KnowledgeResourceCreate(BaseModel):
    resource_file_name: str
    resource_file_format: ResourceFileFormat
    resource_file_size_bytes: Optional[int] = None
    resource_metadata: Dict[str, Any] = Field(default_factory=dict)
    resource_chunking_strategy_ref: Optional[str] = None
    knowledge_hub_id: Optional[UUID] = None
    vector_database_id: Optional[UUID] = None

class KnowledgeResourceResponse(KnowledgeResourceCreate):
    id: UUID
    resource_rag_indexing_status: RAGIndexingStatus
    resource_indexed_at: Optional[datetime] = None
    resource_chunk_count: int
    resource_indexing_error: Optional[str] = None
    vector_database_name: Optional[str] = None
    vector_database_dimensions: Optional[int] = None
    knowledge_hub_name: Optional[str] = None

class KnowledgeFeedbackCreate(BaseModel):
    query: str
    response: str
    feedback_type: str
    chunk_ids: Optional[List[str]] = []

