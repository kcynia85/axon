from uuid import UUID, uuid4
from typing import List, Optional
from app.modules.settings.infrastructure.repo import SettingsRepository
from app.modules.settings.domain.models import (
    LLMProvider, LLMModel, LLMRouter, EmbeddingModel, ChunkingStrategy, VectorDatabase
)
from app.modules.settings.application.schemas import (
    CreateLLMProviderRequest, UpdateLLMProviderRequest,
    CreateLLMModelRequest, UpdateLLMModelRequest,
    CreateLLMRouterRequest, UpdateLLMRouterRequest,
    CreateEmbeddingModelRequest, CreateChunkingStrategyRequest, CreateVectorDatabaseRequest,
    SimulateChunkingRequest, SimulateChunkingResponse,
    TestPromptRequest, SanityCheckResponse, ConnectionTestResponse
)
from app.modules.settings.domain.enums import ConnectionStatus
from app.shared.utils.time import now_utc

class SettingsService:
    def __init__(self, repo: SettingsRepository):
        self.repo = repo

    # --- LLM Provider ---

    async def create_llm_provider(self, request: CreateLLMProviderRequest) -> LLMProvider:
        provider = LLMProvider(
            id=uuid4(),
            provider_name=request.provider_name,
            provider_api_key_required=request.provider_api_key_required,
            provider_api_endpoint=request.provider_api_endpoint,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_llm_provider(provider)

    async def list_llm_providers(self) -> List[LLMProvider]:
        return await self.repo.list_llm_providers()

    async def update_llm_provider(self, id: UUID, request: UpdateLLMProviderRequest) -> LLMProvider:
        data = request.model_dump(exclude_unset=True)
        updated = await self.repo.update_llm_provider(id, data)
        if not updated:
            raise ValueError(f"Provider with id {id} not found")
        return updated

    async def delete_llm_provider(self, id: UUID) -> bool:
        return await self.repo.delete_llm_provider(id)

    # --- LLM Model ---

    async def create_llm_model(self, request: CreateLLMModelRequest) -> LLMModel:
        model = LLMModel(
            id=uuid4(),
            model_id=request.model_id,
            model_display_name=request.model_display_name,
            model_tier=request.model_tier,
            model_capabilities_flags=request.model_capabilities_flags,
            model_context_window=request.model_context_window,
            model_supports_thinking=request.model_supports_thinking,
            model_pricing_config=request.model_pricing_config,
            llm_provider_id=request.llm_provider_id,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_llm_model(model)

    async def list_llm_models(self) -> List[LLMModel]:
        return await self.repo.list_llm_models()

    async def update_llm_model(self, id: UUID, request: UpdateLLMModelRequest) -> LLMModel:
        data = request.model_dump(exclude_unset=True)
        updated = await self.repo.update_llm_model(id, data)
        if not updated:
            raise ValueError(f"Model with id {id} not found")
        return updated

    async def delete_llm_model(self, id: UUID) -> bool:
        return await self.repo.delete_llm_model(id)

    # --- LLM Router ---

    async def create_llm_router(self, request: CreateLLMRouterRequest) -> LLMRouter:
        router = LLMRouter(
            id=uuid4(),
            router_alias=request.router_alias,
            router_strategy=request.router_strategy,
            router_max_tokens_threshold=request.router_max_tokens_threshold,
            router_cost_limit_per_request=request.router_cost_limit_per_request,
            primary_model_id=request.primary_model_id,
            fallback_model_id=request.fallback_model_id,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_llm_router(router)

    async def list_llm_routers(self) -> List[LLMRouter]:
        return await self.repo.list_llm_routers()

    async def update_llm_router(self, id: UUID, request: UpdateLLMRouterRequest) -> LLMRouter:
        data = request.model_dump(exclude_unset=True)
        updated = await self.repo.update_llm_router(id, data)
        if not updated:
            raise ValueError(f"Router with id {id} not found")
        return updated

    async def delete_llm_router(self, id: UUID) -> bool:
        return await self.repo.delete_llm_router(id)

    async def test_llm_router(self, id: UUID, request: TestPromptRequest) -> SanityCheckResponse:
        # TODO: Implement real LLM call logic
        # For now, return mock response
        return SanityCheckResponse(
            success=True,
            response_text=f"Mock response for prompt: {request.prompt}",
            latency_ms=150.5,
            cost_usd=0.0001,
            tokens_used=50,
            model_used="gpt-4-mock"
        )

    # --- Embedding Model ---

    async def create_embedding_model(self, request: CreateEmbeddingModelRequest) -> EmbeddingModel:
        model = EmbeddingModel(
            id=uuid4(),
            model_provider_name=request.model_provider_name,
            model_id=request.model_id,
            model_vector_dimensions=request.model_vector_dimensions,
            model_max_context_tokens=request.model_max_context_tokens,
            model_cost_per_1m_tokens=request.model_cost_per_1m_tokens,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_embedding_model(model)

    async def list_embedding_models(self) -> List[EmbeddingModel]:
        return await self.repo.list_embedding_models()

    # --- Chunking Strategy ---

    async def create_chunking_strategy(self, request: CreateChunkingStrategyRequest) -> ChunkingStrategy:
        strategy = ChunkingStrategy(
            id=uuid4(),
            strategy_name=request.strategy_name,
            strategy_chunking_method=request.strategy_chunking_method,
            strategy_chunk_size=request.strategy_chunk_size,
            strategy_chunk_overlap=request.strategy_chunk_overlap,
            strategy_chunk_boundaries=request.strategy_chunk_boundaries,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_chunking_strategy(strategy)

    async def list_chunking_strategies(self) -> List[ChunkingStrategy]:
        return await self.repo.list_chunking_strategies()

    async def simulate_chunking(self, request: SimulateChunkingRequest) -> SimulateChunkingResponse:
        # TODO: Implement real chunking logic (LangChain/TextSplitter)
        # Mocking for now
        text_len = len(request.text)
        chunk_size = 500 # Should get from strategy if ID provided
        chunks = [request.text[i:i+chunk_size] for i in range(0, text_len, chunk_size)]
        return SimulateChunkingResponse(
            chunks=chunks,
            chunk_count=len(chunks)
        )

    # --- Vector Database ---

    async def create_vector_database(self, request: CreateVectorDatabaseRequest) -> VectorDatabase:
        db = VectorDatabase(
            id=uuid4(),
            vector_database_name=request.vector_database_name,
            vector_database_type=request.vector_database_type,
            vector_database_connection_url=request.vector_database_connection_url,
            vector_database_connection_string=request.vector_database_connection_string,
            vector_database_index_method=request.vector_database_index_method,
            vector_database_connection_status=ConnectionStatus.DISCONNECTED,
            vector_database_collection_name=request.vector_database_collection_name,
            vector_database_embedding_model_reference=request.vector_database_embedding_model_reference,
            vector_database_total_vectors=0,
            vector_database_size=0,
            vector_database_expected_dimensions=request.vector_database_expected_dimensions,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_vector_database(db)

    async def list_vector_databases(self) -> List[VectorDatabase]:
        return await self.repo.list_vector_databases()

    async def test_vector_database(self, id: UUID) -> ConnectionTestResponse:
        # TODO: Implement real connection test
        return ConnectionTestResponse(
            success=True,
            message="Mock connection successful",
            latency_ms=20.0
        )
