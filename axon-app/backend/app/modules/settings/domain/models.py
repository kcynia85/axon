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
    deleted_at: Optional[datetime] = None

# LLM
class LLMModel(SettingsBase):
    model_id: str
    model_display_name: str
    model_tier: ModelTier = ModelTier.TIER1
    model_capabilities_flags: List[str] = Field(default_factory=list)
    model_context_window: int = 4096
    model_supports_thinking: bool = False
    model_reasoning_effort: Optional[str] = None
    model_system_prompt: Optional[str] = None
    model_custom_params: List[Dict[str, Any]] = Field(default_factory=list)
    model_pricing_config: Dict[str, Any] = Field(default_factory=dict)
    is_available: Optional[bool] = True
    llm_provider_id: UUID

class LLMProvider(SettingsBase):
    provider_name: str
    provider_technical_id: str
    provider_type: ProviderType = ProviderType.cloud
    provider_api_key: Optional[str] = None
    provider_api_key_required: bool = True
    provider_api_endpoint: Optional[str] = None
    provider_custom_config: Optional[Dict[str, Any]] = None

    # Agnostic Protocol Configuration
    protocol: Optional[str] = "openai" # openai, anthropic, google, custom
    inference_path: Optional[str] = "/chat/completions"
    inference_json_template: Optional[str] = '{"model": "{{model}}", "messages": [{"role": "user", "content": "{{prompt}}"}]}'
    custom_headers: List[Dict[str, str]] = Field(default_factory=list)

    # Discovery Configuration (SSoT)
    auth_header_name: Optional[str] = "Authorization"
    auth_header_prefix: Optional[str] = "Bearer "
    api_key_placement: Optional[str] = "header" # header, query
    discovery_json_path: Optional[str] = "data"
    discovery_id_key: Optional[str] = "id"
    discovery_name_key: Optional[str] = "name"
    discovery_context_key: Optional[str] = "context_length"
    discovery_pricing_endpoint: Optional[str] = None
    discovery_pricing_input_key: Optional[str] = None
    discovery_pricing_output_key: Optional[str] = None

    # Algorithmic Scraping Configuration
    pricing_page_url: Optional[str] = None
    pricing_scraper_strategy: Optional[str] = "auto"
    pricing_last_synced_at: Optional[datetime] = None
    pricing_sync_error: Optional[str] = None
    pricing_data_cache: Optional[Dict[str, Any]] = None

    # Inference Response Mapping
    response_content_path: Optional[str] = "choices.0.message.content"
    response_error_path: Optional[str] = "error.message"

    models: List[LLMModel] = Field(default_factory=list)
class LLMRouter(SettingsBase):
    router_alias: str
    router_strategy: RouterStrategy = RouterStrategy.QUALITY_OPTIMIZED
    router_max_tokens_threshold: Optional[int] = None
    router_cost_limit_per_request: Optional[float] = None
    primary_model_id: Optional[UUID] = None
    fallback_model_id: Optional[UUID] = None
    priority_chain: List[Dict[str, Any]] = Field(default_factory=list)

# KE
class EmbeddingModel(SettingsBase):
    provider_id: Optional[UUID] = None
    model_provider_name: str
    model_id: str
    model_vector_dimensions: int
    model_max_context_tokens: int
    model_cost_per_1m_tokens: float
    is_draft: bool = False

class ChunkingStrategy(SettingsBase):
    strategy_name: str
    strategy_chunking_method: ChunkingMethod
    strategy_chunk_size: int
    strategy_chunk_overlap: int
    strategy_chunk_boundaries: Dict[str, Any] = Field(default_factory=dict)
    is_draft: bool = False

class VectorDatabase(SettingsBase):
    vector_database_name: str
    vector_database_type: VectorDBType
    
    # Granular Connection Fields (Legacy - for backward compat)
    vector_database_host: Optional[str] = None
    vector_database_port: int = 5432
    vector_database_user: Optional[str] = None
    vector_database_password: Optional[str] = None
    vector_database_db_name: str = "postgres"
    vector_database_ssl_mode: str = "require"
    
    # Universal Dynamic Config
    vector_database_config: Dict[str, Any] = Field(default_factory=dict)
    
    vector_database_connection_url: Optional[str] = None
    vector_database_connection_string: Optional[str] = None
    vector_database_index_method: IndexMethod = IndexMethod.HNSW
    vector_database_connection_status: ConnectionStatus = ConnectionStatus.DISCONNECTED
    vector_database_collection_name: str
    
    # Relation
    vector_database_embedding_model_id: Optional[UUID] = None
    vector_database_embedding_model_reference: str # ID or name for compat
    
    vector_database_total_vectors: int = 0
    vector_database_size: int = 0
    vector_database_expected_dimensions: int
