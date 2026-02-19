from uuid import UUID, uuid4
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.shared.utils.time import now_utc
from app.modules.settings.domain.enums import (
    ProviderType, ModelTier, RouterStrategy, ChunkingMethod, VectorDBType, IndexMethod, ConnectionStatus
)

class SettingsBase(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

# LLM
class LLMModel(SettingsBase):
    model_id: str
    model_display_name: str
    model_tier: ModelTier = ModelTier.TIER1
    model_capabilities_flags: List[str] = Field(default_factory=list)
    model_context_window: int = 4096
    model_supports_thinking: bool = False
    model_pricing_config: Dict[str, Any] = Field(default_factory=dict)
    llm_provider_id: UUID

class LLMProvider(SettingsBase):
    provider_name: str
    provider_api_key_required: bool = True
    provider_api_endpoint: Optional[str] = None
    models: List[LLMModel] = Field(default_factory=list)

class LLMRouter(SettingsBase):
    router_alias: str
    router_strategy: RouterStrategy = RouterStrategy.QUALITY_OPTIMIZED
    router_max_tokens_threshold: Optional[int] = None
    router_cost_limit_per_request: Optional[float] = None
    primary_model_id: UUID
    fallback_model_id: Optional[UUID] = None

# KE
class EmbeddingModel(SettingsBase):
    model_provider_name: str
    model_id: str
    model_vector_dimensions: int
    model_max_context_tokens: int
    model_cost_per_1m_tokens: float

class ChunkingStrategy(SettingsBase):
    strategy_name: str
    strategy_chunking_method: ChunkingMethod
    strategy_chunk_size: int
    strategy_chunk_overlap: int
    strategy_chunk_boundaries: List[str] = Field(default_factory=list)

class VectorDatabase(SettingsBase):
    vector_database_name: str
    vector_database_type: VectorDBType
    vector_database_connection_url: Optional[str] = None
    vector_database_connection_string: Optional[str] = None
    vector_database_index_method: IndexMethod = IndexMethod.HNSW
    vector_database_connection_status: ConnectionStatus = ConnectionStatus.DISCONNECTED
    vector_database_collection_name: str
    vector_database_embedding_model_reference: str
    vector_database_total_vectors: int = 0
    vector_database_size: int = 0
    vector_database_expected_dimensions: int
