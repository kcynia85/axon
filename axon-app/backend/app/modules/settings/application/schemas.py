from typing import List, Optional, Dict, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, Field
from app.modules.settings.domain.enums import (
    ProviderType, ModelTier, RouterStrategy, ChunkingMethod, VectorDBType, IndexMethod, ConnectionStatus
)

# LLM Provider
class CreateLLMProviderRequest(BaseModel):
    provider_name: str
    provider_technical_id: str
    provider_type: ProviderType = ProviderType.cloud
    provider_api_key: Optional[str] = None
    provider_api_key_required: bool = True
    provider_api_endpoint: Optional[str] = None
    provider_custom_config: Optional[Dict[str, Any]] = None

    # Core Agnostic Configuration
    protocol: str = "openai"
    custom_headers: List[Dict[str, str]] = Field(default_factory=list)

    # Discovery & Auth Configuration (SSoT)
    auth_header_name: str = "Authorization"
    auth_header_prefix: str = "Bearer "
    api_key_placement: str = "header"
    discovery_json_path: str = "data"
    discovery_id_key: str = "id"
    discovery_name_key: str = "name"
    discovery_context_key: str = "context_length"

    # Response Mapping
    response_content_path: str = "choices.0.message.content"
    response_error_path: str = "error.message"

class UpdateLLMProviderRequest(BaseModel):
    provider_name: Optional[str] = None
    provider_technical_id: Optional[str] = None
    provider_type: Optional[ProviderType] = None
    provider_api_key: Optional[str] = None
    provider_api_key_required: Optional[bool] = None
    provider_api_endpoint: Optional[str] = None
    provider_custom_config: Optional[Dict[str, Any]] = None

    protocol: Optional[str] = None
    custom_headers: Optional[List[Dict[str, str]]] = None

    # Discovery & Auth Configuration (SSoT)
    auth_header_name: Optional[str] = None
    auth_header_prefix: Optional[str] = None
    api_key_placement: Optional[str] = None
    discovery_json_path: Optional[str] = None
    discovery_id_key: Optional[str] = None
    discovery_name_key: Optional[str] = None
    discovery_context_key: Optional[str] = None

    response_content_path: Optional[str] = None
    response_error_path: Optional[str] = None
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
    model_reasoning_effort: Optional[str] = None # Low, Medium, High
    model_system_prompt: Optional[str] = None
    model_custom_params: List[Dict[str, Any]] = Field(default_factory=list)
    model_pricing_config: Dict[str, Any] = Field(default_factory=dict)
    llm_provider_id: UUID

class UpdateLLMModelRequest(BaseModel):
    model_id: Optional[str] = None
    model_display_name: Optional[str] = None
    model_tier: Optional[ModelTier] = None
    model_capabilities_flags: Optional[List[str]] = None
    model_context_window: Optional[int] = None
    model_supports_thinking: Optional[bool] = None
    model_reasoning_effort: Optional[str] = None
    model_system_prompt: Optional[str] = None
    model_custom_params: Optional[List[Dict[str, Any]]] = None
    model_pricing_config: Optional[Dict[str, Any]] = None
    llm_provider_id: Optional[UUID] = None

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
    primary_model_id: Optional[UUID] = None
    fallback_model_id: Optional[UUID] = None
    priority_chain: List[Dict[str, Any]] = Field(default_factory=list)

class UpdateLLMRouterRequest(BaseModel):
    router_alias: Optional[str] = None
    router_strategy: Optional[RouterStrategy] = None
    router_max_tokens_threshold: Optional[int] = None
    router_cost_limit_per_request: Optional[float] = None
    primary_model_id: Optional[UUID] = None
    fallback_model_id: Optional[UUID] = None
    priority_chain: Optional[List[Dict[str, Any]]] = None

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

class AvailableModelResponse(BaseModel):
    id: str
    name: str
    context_window: int
    pricing_input: float # per 1M
    pricing_output: float # per 1M
    description: Optional[str] = None

class ConnectionTestResponse(BaseModel):
    success: bool
    message: str
    latency_ms: float
    raw_json: Optional[Any] = None
    mapped_models: List[AvailableModelResponse] = []

class LLMModelUsageResponse(BaseModel):
    is_used: bool
    used_by: List[str]
