from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
from backend.app.modules.settings.domain.enums import (
    ProviderType, ModelTier, RouterStrategy, ChunkingMethod, VectorDBType, IndexMethod, ConnectionStatus
)

# LLM Provider
class CreateLLMProviderRequest(BaseModel):
    provider_name: str
    provider_api_key_required: bool = True
    provider_api_endpoint: Optional[str] = None

class LLMProviderResponse(CreateLLMProviderRequest):
    id: UUID
    created_at: datetime
    updated_at: datetime

# LLM Model
class CreateLLMModelRequest(BaseModel):
    model_id: str
    model_display_name: str
    model_tier: ModelTier = ModelTier.TIER1
    model_capabilities_flags: List[str] = Field(default_factory=list)
    model_context_window: int = 4096
    model_supports_thinking: bool = False
    model_pricing_config: Dict[str, Any] = Field(default_factory=dict)
    llm_provider_id: UUID

class LLMModelResponse(CreateLLMModelRequest):
    id: UUID
    created_at: datetime
    updated_at: datetime

# LLM Router
class CreateLLMRouterRequest(BaseModel):
    router_alias: str
    router_strategy: RouterStrategy = RouterStrategy.QUALITY_OPTIMIZED
    router_max_tokens_threshold: Optional[int] = None
    router_cost_limit_per_request: Optional[float] = None
    primary_model_id: UUID
    fallback_model_id: Optional[UUID] = None

class LLMRouterResponse(CreateLLMRouterRequest):
    id: UUID
    created_at: datetime
    updated_at: datetime

class TestPromptRequest(BaseModel):
    prompt: str
    # router_id passed in path

class SanityCheckResponse(BaseModel):
    success: bool
    response_text: str
    latency_ms: float
    cost_usd: float
    tokens_used: int
    model_used: str

# KE
class CreateEmbeddingModelRequest(BaseModel):
    model_provider_name: str
    model_id: str
    model_vector_dimensions: int
    model_max_context_tokens: int
    model_cost_per_1m_tokens: float

class EmbeddingModelResponse(CreateEmbeddingModelRequest):
    id: UUID
    created_at: datetime
    updated_at: datetime

class CreateChunkingStrategyRequest(BaseModel):
    strategy_name: str
    strategy_chunking_method: ChunkingMethod
    strategy_chunk_size: int
    strategy_chunk_overlap: int
    strategy_chunk_boundaries: List[str] = Field(default_factory=list)

class ChunkingStrategyResponse(CreateChunkingStrategyRequest):
    id: UUID
    created_at: datetime
    updated_at: datetime

class SimulateChunkingRequest(BaseModel):
    text: str
    strategy_id: UUID

class SimulateChunkingResponse(BaseModel):
    chunks: List[str]
    chunk_count: int

class CreateVectorDatabaseRequest(BaseModel):
    vector_database_name: str
    vector_database_type: VectorDBType
    vector_database_connection_url: Optional[str] = None
    vector_database_connection_string: Optional[str] = None
    vector_database_index_method: IndexMethod = IndexMethod.HNSW
    vector_database_collection_name: str
    vector_database_embedding_model_reference: str
    vector_database_expected_dimensions: int

class VectorDatabaseResponse(CreateVectorDatabaseRequest):
    id: UUID
    vector_database_connection_status: ConnectionStatus
    vector_database_total_vectors: int
    vector_database_size: int
    created_at: datetime
    updated_at: datetime

class ConnectionTestResponse(BaseModel):
    success: bool
    message: str
    latency_ms: float
