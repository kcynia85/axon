from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
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
            provider_technical_id=provider.provider_technical_id,
            provider_type=provider.provider_type,
            provider_api_key=provider.provider_api_key,
            provider_api_key_required=provider.provider_api_key_required,
            provider_api_endpoint=provider.provider_api_endpoint,
            provider_custom_config=provider.provider_custom_config,
            
            # Agnostic Configuration
            protocol=provider.protocol,
            custom_headers=provider.custom_headers,
            
            # Discovery & Auth Configuration (SSoT)
            auth_header_name=provider.auth_header_name,
            auth_header_prefix=provider.auth_header_prefix,
            api_key_placement=provider.api_key_placement,
            discovery_json_path=provider.discovery_json_path,
            discovery_id_key=provider.discovery_id_key,
            discovery_name_key=provider.discovery_name_key,
            discovery_context_key=provider.discovery_context_key,
            discovery_pricing_endpoint=provider.discovery_pricing_endpoint,
            discovery_pricing_input_key=provider.discovery_pricing_input_key,
            discovery_pricing_output_key=provider.discovery_pricing_output_key,

            # Algorithmic Scraping Configuration
            pricing_page_url=provider.pricing_page_url,
            pricing_scraper_strategy=provider.pricing_scraper_strategy,
            pricing_last_synced_at=provider.pricing_last_synced_at,
            pricing_sync_error=provider.pricing_sync_error,
            pricing_data_cache=provider.pricing_data_cache,
            
            # Response Mapping
            response_content_path=provider.response_content_path,
            response_error_path=provider.response_error_path,
            
            created_at=provider.created_at,
            updated_at=provider.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        
        # Re-fetch with models to avoid lazy loading error
        return await self.get_llm_provider(provider.id) # type: ignore

    async def list_llm_providers(self) -> List[LLMProvider]:
        result = await self.session.execute(
            select(LLMProviderTable).options(selectinload(LLMProviderTable.models)).where(LLMProviderTable.deleted_at == None)
        )
        return [self._to_domain_provider(row) for row in result.scalars().all()]

    async def get_llm_provider(self, id: UUID) -> Optional[LLMProvider]:
        result = await self.session.execute(
            select(LLMProviderTable).options(selectinload(LLMProviderTable.models)).where(
                LLMProviderTable.id == id,
                LLMProviderTable.deleted_at == None
            )
        )
        row = result.scalar_one_or_none()
        return self._to_domain_provider(row) if row else None

    async def update_llm_provider(self, id: UUID, provider_data: dict) -> Optional[LLMProvider]:
        provider_data["updated_at"] = now_utc()
        await self.session.execute(
            update(LLMProviderTable).where(
                LLMProviderTable.id == id,
                LLMProviderTable.deleted_at == None
            ).values(**provider_data)
        )
        await self.session.commit()
        return await self.get_llm_provider(id)

    async def delete_llm_provider(self, id: UUID) -> bool:
        await self.session.execute(
            update(LLMProviderTable).where(LLMProviderTable.id == id).values(deleted_at=now_utc())
        )
        await self.session.commit()
        return True

    def _to_domain_provider(self, row: LLMProviderTable) -> LLMProvider:
        return LLMProvider(
            id=row.id,
            provider_name=row.provider_name,
            provider_technical_id=row.provider_technical_id,
            provider_type=row.provider_type,
            provider_api_key=row.provider_api_key,
            provider_api_key_required=row.provider_api_key_required,
            provider_api_endpoint=row.provider_api_endpoint,
            provider_custom_config=row.provider_custom_config,
            
            # Agnostic Configuration
            protocol=row.protocol,
            inference_path=row.inference_path,
            inference_json_template=row.inference_json_template,
            custom_headers=row.custom_headers or [],
            
            # Discovery & Auth
            auth_header_name=row.auth_header_name,
            auth_header_prefix=row.auth_header_prefix,
            api_key_placement=row.api_key_placement,
            discovery_json_path=row.discovery_json_path,
            discovery_id_key=row.discovery_id_key,
            discovery_name_key=row.discovery_name_key,
            discovery_context_key=row.discovery_context_key,
            discovery_pricing_endpoint=row.discovery_pricing_endpoint,
            discovery_pricing_input_key=row.discovery_pricing_input_key,
            discovery_pricing_output_key=row.discovery_pricing_output_key,

            # Algorithmic Scraping Configuration
            pricing_page_url=row.pricing_page_url,
            pricing_scraper_strategy=row.pricing_scraper_strategy or "auto",
            pricing_last_synced_at=row.pricing_last_synced_at,
            pricing_sync_error=row.pricing_sync_error,
            pricing_data_cache=row.pricing_data_cache,
            
            # Response Mapping
            response_content_path=row.response_content_path,
            response_error_path=row.response_error_path,
            
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
                    model_reasoning_effort=m.model_reasoning_effort,
                    model_system_prompt=m.model_system_prompt,
                    model_custom_params=m.model_custom_params or [],
                    model_pricing_config=m.model_pricing_config,
                    is_available=m.is_available,
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
            model_reasoning_effort=model.model_reasoning_effort,
            model_system_prompt=model.model_system_prompt,
            model_custom_params=model.model_custom_params,
            model_pricing_config=model.model_pricing_config,
            is_available=model.is_available,
            llm_provider_id=model.llm_provider_id,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_model(db_obj)

    async def list_llm_models(self) -> List[LLMModel]:
        result = await self.session.execute(select(LLMModelTable).where(LLMModelTable.deleted_at == None))
        return [self._to_domain_model(row) for row in result.scalars().all()]

    async def get_llm_model(self, id: UUID) -> Optional[LLMModel]:
        result = await self.session.execute(select(LLMModelTable).where(
            LLMModelTable.id == id,
            LLMModelTable.deleted_at == None
        ))
        row = result.scalar_one_or_none()
        return self._to_domain_model(row) if row else None

    async def update_llm_model(self, id: UUID, model_data: dict) -> Optional[LLMModel]:
        model_data["updated_at"] = now_utc()
        await self.session.execute(
            update(LLMModelTable).where(
                LLMModelTable.id == id,
                LLMModelTable.deleted_at == None
            ).values(**model_data)
        )
        await self.session.commit()
        return await self.get_llm_model(id)

    async def delete_llm_model(self, id: UUID) -> bool:
        # Clear references in LLM Routers (they should stay empty if model deleted)
        await self.session.execute(
            update(LLMRouterTable).where(LLMRouterTable.primary_model_id == id).values(primary_model_id=None)
        )
        await self.session.execute(
            update(LLMRouterTable).where(LLMRouterTable.fallback_model_id == id).values(fallback_model_id=None)
        )
        
        await self.session.execute(
            update(LLMModelTable).where(LLMModelTable.id == id).values(deleted_at=now_utc())
        )
        await self.session.commit()
        return True

    async def get_model_usage(self, id: UUID) -> List[str]:
        """
        Returns a list of names/aliases where this model is being used.
        """
        # Check LLM Routers
        result = await self.session.execute(
            select(LLMRouterTable).where(
                (LLMRouterTable.primary_model_id == id) | 
                (LLMRouterTable.fallback_model_id == id)
            )
        )
        routers = result.scalars().all()
        return [f"Router: {r.router_alias}" for r in routers]

    def _to_domain_model(self, row: LLMModelTable) -> LLMModel:
        return LLMModel(
            id=row.id,
            model_id=row.model_id,
            model_display_name=row.model_display_name,
            model_tier=row.model_tier,
            model_capabilities_flags=row.model_capabilities_flags,
            model_context_window=row.model_context_window,
            model_supports_thinking=row.model_supports_thinking,
            model_reasoning_effort=row.model_reasoning_effort,
            model_system_prompt=row.model_system_prompt,
            model_custom_params=row.model_custom_params or [],
            model_pricing_config=row.model_pricing_config or {},
            is_available=row.is_available,
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
            priority_chain=router.priority_chain,
            created_at=router.created_at,
            updated_at=router.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_router(db_obj)

    async def list_llm_routers(self) -> List[LLMRouter]:
        result = await self.session.execute(select(LLMRouterTable).where(LLMRouterTable.deleted_at == None))
        return [self._to_domain_router(row) for row in result.scalars().all()]

    async def get_llm_router(self, id: UUID) -> Optional[LLMRouter]:
        result = await self.session.execute(select(LLMRouterTable).where(
            LLMRouterTable.id == id,
            LLMRouterTable.deleted_at == None
        ))
        row = result.scalar_one_or_none()
        return self._to_domain_router(row) if row else None

    async def update_llm_router(self, id: UUID, router_data: dict) -> Optional[LLMRouter]:
        router_data["updated_at"] = now_utc()
        await self.session.execute(
            update(LLMRouterTable).where(
                LLMRouterTable.id == id,
                LLMRouterTable.deleted_at == None
            ).values(**router_data)
        )
        await self.session.commit()
        return await self.get_llm_router(id)

    async def delete_llm_router(self, id: UUID) -> bool:
        await self.session.execute(
            update(LLMRouterTable).where(LLMRouterTable.id == id).values(deleted_at=now_utc())
        )
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
            priority_chain=row.priority_chain or [],
            created_at=row.created_at,
            updated_at=row.updated_at,
            deleted_at=row.deleted_at
        )

    # --- Embedding Model ---

    async def create_embedding_model(self, model: EmbeddingModel) -> EmbeddingModel:
        db_obj = EmbeddingModelTable(
            id=model.id,
            provider_id=model.provider_id,
            model_provider_name=model.model_provider_name,
            model_id=model.model_id,
            model_vector_dimensions=model.model_vector_dimensions,
            model_max_context_tokens=model.model_max_context_tokens,
            model_cost_per_1m_tokens=model.model_cost_per_1m_tokens,
            is_draft=model.is_draft,
            created_at=model.created_at,
            updated_at=model.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_embedding_model(db_obj)

    async def list_embedding_models(self) -> List[EmbeddingModel]:
        result = await self.session.execute(select(EmbeddingModelTable).where(EmbeddingModelTable.deleted_at == None))
        return [self._to_domain_embedding_model(row) for row in result.scalars().all()]

    async def get_embedding_model(self, id: UUID) -> Optional[EmbeddingModel]:
        result = await self.session.execute(select(EmbeddingModelTable).where(
            EmbeddingModelTable.id == id,
            EmbeddingModelTable.deleted_at == None
        ))
        row = result.scalar_one_or_none()
        return self._to_domain_embedding_model(row) if row else None

    async def update_embedding_model(self, id: UUID, model_data: dict) -> Optional[EmbeddingModel]:
        model_data["updated_at"] = now_utc()
        await self.session.execute(
            update(EmbeddingModelTable).where(
                EmbeddingModelTable.id == id,
                EmbeddingModelTable.deleted_at == None
            ).values(**model_data)
        )
        await self.session.commit()
        return await self.get_embedding_model(id)

    async def delete_embedding_model(self, id: UUID) -> bool:
        await self.session.execute(
            update(EmbeddingModelTable).where(EmbeddingModelTable.id == id).values(deleted_at=now_utc())
        )
        await self.session.commit()
        return True

    def _to_domain_embedding_model(self, row: EmbeddingModelTable) -> EmbeddingModel:
        return EmbeddingModel(
            id=row.id,
            provider_id=row.provider_id,
            model_provider_name=row.model_provider_name,
            model_id=row.model_id,
            model_vector_dimensions=row.model_vector_dimensions,
            model_max_context_tokens=row.model_max_context_tokens,
            model_cost_per_1m_tokens=row.model_cost_per_1m_tokens,
            is_draft=row.is_draft or False,
            created_at=row.created_at,
            updated_at=row.updated_at,
            deleted_at=row.deleted_at
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
            is_draft=strategy.is_draft,
            created_at=strategy.created_at,
            updated_at=strategy.updated_at
        )
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return self._to_domain_chunking_strategy(db_obj)

    async def list_chunking_strategies(self) -> List[ChunkingStrategy]:
        result = await self.session.execute(select(ChunkingStrategyTable).where(ChunkingStrategyTable.deleted_at == None))
        return [self._to_domain_chunking_strategy(row) for row in result.scalars().all()]

    async def delete_chunking_strategy(self, id: UUID) -> bool:
        await self.session.execute(
            update(ChunkingStrategyTable).where(ChunkingStrategyTable.id == id).values(deleted_at=now_utc())
        )
        await self.session.commit()
        return True

    async def get_chunking_strategy(self, id: UUID) -> Optional[ChunkingStrategy]:
        result = await self.session.execute(select(ChunkingStrategyTable).where(
            ChunkingStrategyTable.id == id,
            ChunkingStrategyTable.deleted_at == None
        ))
        row = result.scalar_one_or_none()
        return self._to_domain_chunking_strategy(row) if row else None

    async def update_chunking_strategy(self, id: UUID, strategy_data: dict) -> Optional[ChunkingStrategy]:
        strategy_data["updated_at"] = now_utc()
        await self.session.execute(
            update(ChunkingStrategyTable).where(
                ChunkingStrategyTable.id == id,
                ChunkingStrategyTable.deleted_at == None
            ).values(**strategy_data)
        )
        await self.session.commit()
        return await self.get_chunking_strategy(id)

    def _to_domain_chunking_strategy(self, row: ChunkingStrategyTable) -> ChunkingStrategy:
        return ChunkingStrategy(
            id=row.id,
            strategy_name=row.strategy_name,
            strategy_chunking_method=row.strategy_chunking_method,
            strategy_chunk_size=row.strategy_chunk_size,
            strategy_chunk_overlap=row.strategy_chunk_overlap,
            strategy_chunk_boundaries=row.strategy_chunk_boundaries or {},
            is_draft=row.is_draft or False,
            created_at=row.created_at,
            updated_at=row.updated_at,
            deleted_at=row.deleted_at
        )

    # --- Vector Database ---

    async def create_vector_database(self, db: VectorDatabase) -> VectorDatabase:
        db_obj = VectorDatabaseTable(
            id=db.id,
            vector_database_name=db.vector_database_name,
            vector_database_type=db.vector_database_type,
            # Legacy fields
            vector_database_host=db.vector_database_host,
            vector_database_port=db.vector_database_port,
            vector_database_user=db.vector_database_user,
            vector_database_password=db.vector_database_password,
            vector_database_db_name=db.vector_database_db_name,
            vector_database_ssl_mode=db.vector_database_ssl_mode,
            # Universal config
            vector_database_config=db.vector_database_config,
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
        result = await self.session.execute(select(VectorDatabaseTable).where(VectorDatabaseTable.deleted_at == None))
        return [self._to_domain_vector_db(row) for row in result.scalars().all()]

    async def delete_vector_database(self, id: UUID) -> bool:
        await self.session.execute(
            update(VectorDatabaseTable).where(VectorDatabaseTable.id == id).values(deleted_at=now_utc())
        )
        await self.session.commit()
        return True

    async def get_vector_database(self, id: UUID) -> Optional[VectorDatabase]:
        result = await self.session.execute(select(VectorDatabaseTable).where(
            VectorDatabaseTable.id == id,
            VectorDatabaseTable.deleted_at == None
        ))
        row = result.scalar_one_or_none()
        return self._to_domain_vector_db(row) if row else None

    async def update_vector_database(self, id: UUID, data: dict) -> Optional[VectorDatabase]:
        if not data:
            return await self.get_vector_database(id)
            
        await self.session.execute(
            update(VectorDatabaseTable).where(VectorDatabaseTable.id == id).values(
                **data, updated_at=now_utc()
            )
        )
        await self.session.commit()
        return await self.get_vector_database(id)

    def _to_domain_vector_db(self, row: VectorDatabaseTable) -> VectorDatabase:
        return VectorDatabase(
            id=row.id,
            vector_database_name=row.vector_database_name,
            vector_database_type=row.vector_database_type,
            # Legacy fields
            vector_database_host=row.vector_database_host,
            vector_database_port=row.vector_database_port or 5432,
            vector_database_user=row.vector_database_user,
            vector_database_password=row.vector_database_password,
            vector_database_db_name=row.vector_database_db_name or "postgres",
            vector_database_ssl_mode=row.vector_database_ssl_mode or "require",
            # Universal config
            vector_database_config=row.vector_database_config or {},
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
            updated_at=row.updated_at,
            deleted_at=row.deleted_at
        )

# --- Functional-First Standalone Functions ---

def map_model_to_domain(row: LLMModelTable) -> LLMModel:
    return LLMModel(
        id=row.id,
        model_id=row.model_id,
        model_display_name=row.model_display_name,
        model_tier=row.model_tier,
        model_capabilities_flags=row.model_capabilities_flags,
        model_context_window=row.model_context_window,
        model_supports_thinking=row.model_supports_thinking,
        model_reasoning_effort=row.model_reasoning_effort,
        model_system_prompt=row.model_system_prompt,
        model_custom_params=row.model_custom_params or [],
        model_pricing_config=row.model_pricing_config or {},
        is_available=row.is_available,
        llm_provider_id=row.llm_provider_id,
        created_at=row.created_at,
        updated_at=row.updated_at
    )

async def get_llm_model(session: AsyncSession, id: UUID) -> Optional[LLMModel]:
    result = await session.execute(select(LLMModelTable).where(
        LLMModelTable.id == id,
        LLMModelTable.deleted_at == None
    ))
    row = result.scalar_one_or_none()
    return map_model_to_domain(row) if row else None
