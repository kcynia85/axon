from sqlalchemy import Column, String, ForeignKey, DateTime, Boolean, Enum as SAEnum, Integer, Float
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
from sqlalchemy.orm import relationship
from app.shared.infrastructure.base import Base
from app.shared.utils.time import now_utc
from app.modules.settings.domain.enums import (
    ProviderType, ModelTier, RouterStrategy, ChunkingMethod, VectorDBType, IndexMethod, ConnectionStatus
)

class LLMProviderTable(Base):
    __tablename__ = "llm_providers"

    id = Column(UUID(as_uuid=True), primary_key=True)
    provider_name = Column(String, unique=True, nullable=False)
    provider_technical_id = Column(String, unique=True, nullable=False)
    provider_type = Column(SAEnum(ProviderType), nullable=False, default=ProviderType.cloud)
    provider_api_key = Column(String, nullable=True)
    provider_api_key_required = Column(Boolean, default=True)
    provider_api_endpoint = Column(String, nullable=True)
    provider_custom_config = Column(JSONB, nullable=True)

    # Core Agnostic Configuration
    protocol = Column(String, default="openai")
    inference_path = Column(String, default="/chat/completions")
    inference_json_template = Column(String, default='{"model": "{{model}}", "messages": [{"role": "user", "content": "{{prompt}}"}]}')
    custom_headers = Column(JSONB, default=[]) # List of {key, value}

    # Discovery & Auth Configuration (SSoT)
    auth_header_name = Column(String, default="Authorization")
    auth_header_prefix = Column(String, default="Bearer ")
    api_key_placement = Column(String, default="header") # header, query
    discovery_json_path = Column(String, default="data")
    discovery_id_key = Column(String, default="id")
    discovery_name_key = Column(String, default="name")
    discovery_context_key = Column(String, default="context_length")
    discovery_pricing_endpoint = Column(String, nullable=True)
    discovery_pricing_input_key = Column(String, nullable=True)
    discovery_pricing_output_key = Column(String, nullable=True)

    # Algorithmic Scraping Configuration
    pricing_page_url = Column(String, nullable=True)
    pricing_scraper_strategy = Column(String, default="auto") # auto, openai_spa, anthropic_table, litellm_fallback
    pricing_last_synced_at = Column(DateTime(timezone=True), nullable=True)
    pricing_sync_error = Column(String, nullable=True)
    pricing_data_cache = Column(JSONB, nullable=True)

    # Response Mapping
    response_content_path = Column(String, default="choices.0.message.content")
    response_error_path = Column(String, default="error.message")

    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    models = relationship("LLMModelTable", back_populates="provider", cascade="all, delete-orphan")

class LLMModelTable(Base):
    __tablename__ = "llm_models"

    id = Column(UUID(as_uuid=True), primary_key=True)
    model_id = Column(String, nullable=False) # e.g. gpt-4
    model_display_name = Column(String, nullable=False)
    model_tier = Column(SAEnum(ModelTier, name="llm_model_tier"), default=ModelTier.TIER1)
    model_capabilities_flags = Column(ARRAY(String), default=[])
    model_context_window = Column(Integer, default=4096)
    model_supports_thinking = Column(Boolean, default=False)
    model_reasoning_effort = Column(String, nullable=True) # Low, Medium, High
    model_system_prompt = Column(String, nullable=True)
    model_custom_params = Column(JSONB, default=[]) # List of {key, value, type}
    model_pricing_config = Column(JSONB, default={}) # {input_1M, output_1M}
    is_available = Column(Boolean, default=True)
    llm_provider_id = Column(UUID(as_uuid=True), ForeignKey("llm_providers.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    provider = relationship("LLMProviderTable", back_populates="models")

class LLMRouterTable(Base):
    __tablename__ = "llm_routers"

    id = Column(UUID(as_uuid=True), primary_key=True)
    router_alias = Column(String, unique=True, nullable=False)
    router_strategy = Column(SAEnum(RouterStrategy), default=RouterStrategy.QUALITY_OPTIMIZED)
    router_max_tokens_threshold = Column(Integer, nullable=True)
    router_cost_limit_per_request = Column(Float, nullable=True)
    primary_model_id = Column(UUID(as_uuid=True), ForeignKey("llm_models.id"), nullable=True)
    fallback_model_id = Column(UUID(as_uuid=True), ForeignKey("llm_models.id"), nullable=True)
    priority_chain = Column(JSONB, default=[])
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class EmbeddingModelTable(Base):
    __tablename__ = "embedding_models"

    id = Column(UUID(as_uuid=True), primary_key=True)
    provider_id = Column(UUID(as_uuid=True), nullable=True)
    model_provider_name = Column(String, nullable=False)
    model_id = Column(String, nullable=False)
    model_vector_dimensions = Column(Integer, nullable=False)
    model_max_context_tokens = Column(Integer, nullable=False)
    model_cost_per_1m_tokens = Column(Float, nullable=False)
    is_draft = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class ChunkingStrategyTable(Base):
    __tablename__ = "chunking_strategies"

    id = Column(UUID(as_uuid=True), primary_key=True)
    strategy_name = Column(String, nullable=False)
    strategy_chunking_method = Column(SAEnum(ChunkingMethod), nullable=False)
    strategy_chunk_size = Column(Integer, nullable=False)
    strategy_chunk_overlap = Column(Integer, nullable=False)
    strategy_chunk_boundaries = Column(JSONB, default=[])
    is_draft = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

class VectorDatabaseTable(Base):
    __tablename__ = "vector_databases"

    id = Column(UUID(as_uuid=True), primary_key=True)
    vector_database_name = Column(String, nullable=False)
    vector_database_type = Column(SAEnum(VectorDBType), nullable=False)
    vector_database_connection_url = Column(String, nullable=True)
    vector_database_connection_string = Column(String, nullable=True)
    vector_database_index_method = Column(SAEnum(IndexMethod), default=IndexMethod.HNSW)
    vector_database_connection_status = Column(SAEnum(ConnectionStatus), default=ConnectionStatus.DISCONNECTED)
    vector_database_collection_name = Column(String, nullable=False)
    vector_database_embedding_model_reference = Column(String, nullable=False) # ID or name
    vector_database_total_vectors = Column(Integer, default=0)
    vector_database_size = Column(Integer, default=0) # bytes?
    vector_database_expected_dimensions = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    updated_at = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
