from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload

from app.modules.settings.domain.models import (
    LLMProvider, LLMModel, LLMRouter, EmbeddingModel, ChunkingStrategy, VectorDatabase
)
from app.modules.settings.infrastructure.tables import (
    LLMProviderTable, LLMModelTable, LLMRouterTable, EmbeddingModelTable, ChunkingStrategyTable, VectorDatabaseTable
)
from app.shared.utils.time import now_utc

class SettingsRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- LLM Provider ---

    async def create_llm_provider(self, provider: LLMProvider) -> LLMProvider:
        db_obj = LLMProviderTable(
            id=provider.id,
            provider_name=provider.provider_name,
            provider_api_key_required=provider.provider_api_key_required,
            provider_api_endpoint=provider.provider_api_endpoint,
            created_at=provider.created_at,
            updated_at=provider.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_provider(db_obj)

    async def list_llm_providers(self) -> List[LLMProvider]:
        result = await self.session.execute(
            select(LLMProviderTable).options(selectinload(LLMProviderTable.models))
        )
        return [self._to_domain_provider(row) for row in result.scalars().all()]

    async def get_llm_provider(self, id: UUID) -> Optional[LLMProvider]:
        result = await self.session.execute(
            select(LLMProviderTable).options(selectinload(LLMProviderTable.models)).where(LLMProviderTable.id == id)
        )
        row = result.scalar_one_or_none()
        return self._to_domain_provider(row) if row else None

    async def update_llm_provider(self, id: UUID, provider_data: dict) -> Optional[LLMProvider]:
        provider_data["updated_at"] = now_utc()
        await self.session.execute(
            update(LLMProviderTable).where(LLMProviderTable.id == id).values(**provider_data)
        )
        await self.session.commit()
        return await self.get_llm_provider(id)

    async def delete_llm_provider(self, id: UUID) -> bool:
        await self.session.execute(delete(LLMProviderTable).where(LLMProviderTable.id == id))
        await self.session.commit()
        return True

    def _to_domain_provider(self, row: LLMProviderTable) -> LLMProvider:
        return LLMProvider(
            id=row.id,
            provider_name=row.provider_name,
            provider_api_key_required=row.provider_api_key_required,
            provider_api_endpoint=row.provider_api_endpoint,
            created_at=row.created_at,
            updated_at=row.updated_at,
            models=[
                LLMModel(
                    id=m.id,
                    model_id=m.model_id,
                    model_display_name=m.model_display_name,
                    model_tier=m.model_tier,
                    model_capabilities_flags=m.model_capabilities_flags,
                    model_context_window=m.model_context_window,
                    model_supports_thinking=m.model_supports_thinking,
                    model_pricing_config=m.model_pricing_config,
                    llm_provider_id=m.llm_provider_id,
                    created_at=m.created_at,
                    updated_at=m.updated_at
                ) for m in row.models
            ]
        )

    # --- LLM Model ---

    async def create_llm_model(self, model: LLMModel) -> LLMModel:
        db_obj = LLMModelTable(
            id=model.id,
            model_id=model.model_id,
            model_display_name=model.model_display_name,
            model_tier=model.model_tier,
            model_capabilities_flags=model.model_capabilities_flags,
            model_context_window=model.model_context_window,
            model_supports_thinking=model.model_supports_thinking,
            model_pricing_config=model.model_pricing_config,
            llm_provider_id=model.llm_provider_id,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_model(db_obj)

    async def list_llm_models(self) -> List[LLMModel]:
        result = await self.session.execute(select(LLMModelTable))
        return [self._to_domain_model(row) for row in result.scalars().all()]

    async def get_llm_model(self, id: UUID) -> Optional[LLMModel]:
        result = await self.session.execute(select(LLMModelTable).where(LLMModelTable.id == id))
        row = result.scalar_one_or_none()
        return self._to_domain_model(row) if row else None

    async def update_llm_model(self, id: UUID, model_data: dict) -> Optional[LLMModel]:
        model_data["updated_at"] = now_utc()
        await self.session.execute(
            update(LLMModelTable).where(LLMModelTable.id == id).values(**model_data)
        )
        await self.session.commit()
        return await self.get_llm_model(id)

    async def delete_llm_model(self, id: UUID) -> bool:
        await self.session.execute(delete(LLMModelTable).where(LLMModelTable.id == id))
        await self.session.commit()
        return True

    def _to_domain_model(self, row: LLMModelTable) -> LLMModel:
        return LLMModel(
            id=row.id,
            model_id=row.model_id,
            model_display_name=row.model_display_name,
            model_tier=row.model_tier,
            model_capabilities_flags=row.model_capabilities_flags,
            model_context_window=row.model_context_window,
            model_supports_thinking=row.model_supports_thinking,
            model_pricing_config=row.model_pricing_config,
            llm_provider_id=row.llm_provider_id,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    # --- LLM Router ---

    async def create_llm_router(self, router: LLMRouter) -> LLMRouter:
        db_obj = LLMRouterTable(
            id=router.id,
            router_alias=router.router_alias,
            router_strategy=router.router_strategy,
            router_max_tokens_threshold=router.router_max_tokens_threshold,
            router_cost_limit_per_request=router.router_cost_limit_per_request,
            primary_model_id=router.primary_model_id,
            fallback_model_id=router.fallback_model_id,
            created_at=router.created_at,
            updated_at=router.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_router(db_obj)

    async def list_llm_routers(self) -> List[LLMRouter]:
        result = await self.session.execute(select(LLMRouterTable))
        return [self._to_domain_router(row) for row in result.scalars().all()]

    async def get_llm_router(self, id: UUID) -> Optional[LLMRouter]:
        result = await self.session.execute(select(LLMRouterTable).where(LLMRouterTable.id == id))
        row = result.scalar_one_or_none()
        return self._to_domain_router(row) if row else None

    async def update_llm_router(self, id: UUID, router_data: dict) -> Optional[LLMRouter]:
        router_data["updated_at"] = now_utc()
        await self.session.execute(
            update(LLMRouterTable).where(LLMRouterTable.id == id).values(**router_data)
        )
        await self.session.commit()
        return await self.get_llm_router(id)

    async def delete_llm_router(self, id: UUID) -> bool:
        await self.session.execute(delete(LLMRouterTable).where(LLMRouterTable.id == id))
        await self.session.commit()
        return True

    def _to_domain_router(self, row: LLMRouterTable) -> LLMRouter:
        return LLMRouter(
            id=row.id,
            router_alias=row.router_alias,
            router_strategy=row.router_strategy,
            router_max_tokens_threshold=row.router_max_tokens_threshold,
            router_cost_limit_per_request=row.router_cost_limit_per_request,
            primary_model_id=row.primary_model_id,
            fallback_model_id=row.fallback_model_id,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    # --- Embedding Model ---

    async def create_embedding_model(self, model: EmbeddingModel) -> EmbeddingModel:
        db_obj = EmbeddingModelTable(
            id=model.id,
            model_provider_name=model.model_provider_name,
            model_id=model.model_id,
            model_vector_dimensions=model.model_vector_dimensions,
            model_max_context_tokens=model.model_max_context_tokens,
            model_cost_per_1m_tokens=model.model_cost_per_1m_tokens,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_embedding_model(db_obj)

    async def list_embedding_models(self) -> List[EmbeddingModel]:
        result = await self.session.execute(select(EmbeddingModelTable))
        return [self._to_domain_embedding_model(row) for row in result.scalars().all()]

    def _to_domain_embedding_model(self, row: EmbeddingModelTable) -> EmbeddingModel:
        return EmbeddingModel(
            id=row.id,
            model_provider_name=row.model_provider_name,
            model_id=row.model_id,
            model_vector_dimensions=row.model_vector_dimensions,
            model_max_context_tokens=row.model_max_context_tokens,
            model_cost_per_1m_tokens=row.model_cost_per_1m_tokens,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    # --- Chunking Strategy ---

    async def create_chunking_strategy(self, strategy: ChunkingStrategy) -> ChunkingStrategy:
        db_obj = ChunkingStrategyTable(
            id=strategy.id,
            strategy_name=strategy.strategy_name,
            strategy_chunking_method=strategy.strategy_chunking_method,
            strategy_chunk_size=strategy.strategy_chunk_size,
            strategy_chunk_overlap=strategy.strategy_chunk_overlap,
            strategy_chunk_boundaries=strategy.strategy_chunk_boundaries,
            created_at=strategy.created_at,
            updated_at=strategy.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_chunking_strategy(db_obj)

    async def list_chunking_strategies(self) -> List[ChunkingStrategy]:
        result = await self.session.execute(select(ChunkingStrategyTable))
        return [self._to_domain_chunking_strategy(row) for row in result.scalars().all()]

    async def get_chunking_strategy(self, id: UUID) -> Optional[ChunkingStrategy]:
        result = await self.session.execute(select(ChunkingStrategyTable).where(ChunkingStrategyTable.id == id))
        row = result.scalar_one_or_none()
        return self._to_domain_chunking_strategy(row) if row else None

    def _to_domain_chunking_strategy(self, row: ChunkingStrategyTable) -> ChunkingStrategy:
        return ChunkingStrategy(
            id=row.id,
            strategy_name=row.strategy_name,
            strategy_chunking_method=row.strategy_chunking_method,
            strategy_chunk_size=row.strategy_chunk_size,
            strategy_chunk_overlap=row.strategy_chunk_overlap,
            strategy_chunk_boundaries=row.strategy_chunk_boundaries or [],
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    # --- Vector Database ---

    async def create_vector_database(self, db: VectorDatabase) -> VectorDatabase:
        db_obj = VectorDatabaseTable(
            id=db.id,
            vector_database_name=db.vector_database_name,
            vector_database_type=db.vector_database_type,
            vector_database_connection_url=db.vector_database_connection_url,
            vector_database_connection_string=db.vector_database_connection_string,
            vector_database_index_method=db.vector_database_index_method,
            vector_database_connection_status=db.vector_database_connection_status,
            vector_database_collection_name=db.vector_database_collection_name,
            vector_database_embedding_model_reference=db.vector_database_embedding_model_reference,
            vector_database_total_vectors=db.vector_database_total_vectors,
            vector_database_size=db.vector_database_size,
            vector_database_expected_dimensions=db.vector_database_expected_dimensions,
            created_at=db.created_at,
            updated_at=db.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_vector_db(db_obj)

    async def list_vector_databases(self) -> List[VectorDatabase]:
        result = await self.session.execute(select(VectorDatabaseTable))
        return [self._to_domain_vector_db(row) for row in result.scalars().all()]

    async def get_vector_database(self, id: UUID) -> Optional[VectorDatabase]:
        result = await self.session.execute(select(VectorDatabaseTable).where(VectorDatabaseTable.id == id))
        row = result.scalar_one_or_none()
        return self._to_domain_vector_db(row) if row else None

    def _to_domain_vector_db(self, row: VectorDatabaseTable) -> VectorDatabase:
        return VectorDatabase(
            id=row.id,
            vector_database_name=row.vector_database_name,
            vector_database_type=row.vector_database_type,
            vector_database_connection_url=row.vector_database_connection_url,
            vector_database_connection_string=row.vector_database_connection_string,
            vector_database_index_method=row.vector_database_index_method,
            vector_database_connection_status=row.vector_database_connection_status,
            vector_database_collection_name=row.vector_database_collection_name,
            vector_database_embedding_model_reference=row.vector_database_embedding_model_reference,
            vector_database_total_vectors=row.vector_database_total_vectors or 0,
            vector_database_size=row.vector_database_size or 0,
            vector_database_expected_dimensions=row.vector_database_expected_dimensions,
            created_at=row.created_at,
            updated_at=row.updated_at
        )
