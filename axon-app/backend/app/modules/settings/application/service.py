import httpx
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
    TestPromptRequest, SanityCheckResponse, ConnectionTestResponse,
    AvailableModelResponse
)
from app.modules.settings.domain.enums import ConnectionStatus
from app.shared.utils.time import now_utc

class SettingsService:
    def __init__(self, repo: SettingsRepository):
        self.repo = repo

    # --- LLM Provider ---

    async def get_llm_provider(self, id: UUID) -> Optional[LLMProvider]:
        return await self.repo.get_llm_provider(id)

    async def create_llm_provider(self, request: CreateLLMProviderRequest) -> LLMProvider:
        provider = LLMProvider(
            id=uuid4(),
            provider_name=request.provider_name,
            provider_technical_id=request.provider_technical_id,
            provider_type=request.provider_type,
            provider_api_key=request.provider_api_key,
            provider_api_key_required=request.provider_api_key_required,
            provider_api_endpoint=request.provider_api_endpoint,
            provider_custom_config=request.provider_custom_config,
            
            # Agnostic Configuration
            protocol=request.protocol,
            custom_headers=request.custom_headers,
            
            # Discovery & Auth
            auth_header_name=request.auth_header_name,
            auth_header_prefix=request.auth_header_prefix,
            api_key_placement=request.api_key_placement,
            discovery_json_path=request.discovery_json_path,
            discovery_id_key=request.discovery_id_key,
            discovery_name_key=request.discovery_name_key,
            discovery_context_key=request.discovery_context_key,
            
            # Response Mapping
            response_content_path=request.response_content_path,
            response_error_path=request.response_error_path,
            
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
            model_reasoning_effort=request.model_reasoning_effort,
            model_system_prompt=request.model_system_prompt,
            model_custom_params=request.model_custom_params,
            model_pricing_config=request.model_pricing_config,
            llm_provider_id=request.llm_provider_id,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_llm_model(model)

    async def list_llm_models(self) -> List[LLMModel]:
        return await self.repo.list_llm_models()

    async def get_llm_model(self, id: UUID) -> Optional[LLMModel]:
        return await self.repo.get_llm_model(id)

    async def update_llm_model(self, id: UUID, request: UpdateLLMModelRequest) -> LLMModel:
        data = request.model_dump(exclude_unset=True)
        updated = await self.repo.update_llm_model(id, data)
        if not updated:
            raise ValueError(f"Model with id {id} not found")
        return updated

    async def delete_llm_model(self, id: UUID) -> bool:
        return await self.repo.delete_llm_model(id)

    async def get_llm_model_usage(self, id: UUID) -> List[str]:
        return await self.repo.get_model_usage(id)

    async def test_llm_model(self, id: UUID, request: TestPromptRequest) -> SanityCheckResponse:
        import time
        import tiktoken
        from app.shared.infrastructure.adapters.agnostic_gateway import AgnosticGateway

        model = await self.repo.get_llm_model(id)
        if not model:
            raise ValueError(f"Model with id {id} not found")
        
        provider = await self.repo.get_llm_provider(model.llm_provider_id)
        if not provider:
            raise ValueError(f"Provider not found for model {id}")

        gateway = AgnosticGateway(provider, model)
        
        start_time = time.time()
        try:
            response_text = await gateway.generate_content(request.prompt)
            latency_ms = (time.time() - start_time) * 1000
            
            # Calculate tokens
            try:
                encoding = tiktoken.get_encoding("cl100k_base")
                prompt_tokens = len(encoding.encode(request.prompt))
                completion_tokens = len(encoding.encode(response_text))
                total_tokens = prompt_tokens + completion_tokens
            except Exception:
                total_tokens = (len(request.prompt) + len(response_text)) // 4
                prompt_tokens = len(request.prompt) // 4
                completion_tokens = len(response_text) // 4

            # Calculate cost
            pricing = model.model_pricing_config or {}
            input_price_1m = pricing.get("input", 0.0)
            output_price_1m = pricing.get("output", 0.0)
            
            cost_usd = ((prompt_tokens / 1_000_000) * input_price_1m) + \
                       ((completion_tokens / 1_000_000) * output_price_1m)

            return SanityCheckResponse(
                success=True,
                response_text=response_text,
                latency_ms=latency_ms,
                cost_usd=cost_usd,
                tokens_used=total_tokens,
                model_used=model.model_id
            )
        except Exception as e:
            return SanityCheckResponse(
                success=False,
                response_text=f"Error: {str(e)}",
                latency_ms=0,
                cost_usd=0,
                tokens_used=0,
                model_used=model.model_id
            )

    async def test_provider_connection(self, provider_id: UUID) -> ConnectionTestResponse:
        """
        Tests the connection to a provider's discovery endpoint.
        Returns raw JSON and mapped models to help with SSoT configuration.
        """
        import time
        
        provider = await self.repo.get_llm_provider(provider_id)
        if not provider:
            raise ValueError(f"Provider with id {provider_id} not found")

        if not provider.provider_api_endpoint:
            return ConnectionTestResponse(
                success=False,
                message="Brak endpointu API",
                latency_ms=0
            )

        start_time = time.time()
        try:
            # Use _fetch_models to get both raw JSON and mapped models
            # We modify _fetch_models to return more info or just call it
            # To keep it simple, we'll just call it and it will use the correct agnostic logic
            mapped_models = await self._fetch_models(provider)
            latency_ms = (time.time() - start_time) * 1000
            
            return ConnectionTestResponse(
                success=True,
                message=f"Połączono pomyślnie",
                latency_ms=latency_ms,
                raw_json={"info": "See discovery results below", "count": len(mapped_models)},
                mapped_models=mapped_models
            )
        except Exception as e:
            return ConnectionTestResponse(
                success=False,
                message=f"Błąd połączenia: {str(e)}",
                latency_ms=0
            )

    # --- LLM Router ---

    async def create_llm_router(self, request: CreateLLMRouterRequest) -> LLMRouter:
        # Extract IDs from priority_chain for compatibility
        primary_id = None
        fallback_id = None
        if request.priority_chain:
            try:
                primary_id = UUID(request.priority_chain[0].get("model_id"))
                if len(request.priority_chain) > 1:
                    fallback_id = UUID(request.priority_chain[1].get("model_id"))
            except (ValueError, TypeError, IndexError):
                pass

        router = LLMRouter(
            id=uuid4(),
            router_alias=request.router_alias,
            router_strategy=request.router_strategy,
            router_max_tokens_threshold=request.router_max_tokens_threshold,
            router_cost_limit_per_request=request.router_cost_limit_per_request,
            primary_model_id=primary_id or request.primary_model_id,
            fallback_model_id=fallback_id or request.fallback_model_id,
            priority_chain=request.priority_chain,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_llm_router(router)

    async def list_llm_routers(self) -> List[LLMRouter]:
        return await self.repo.list_llm_routers()

    async def get_llm_router(self, id: UUID) -> Optional[LLMRouter]:
        return await self.repo.get_llm_router(id)

    async def update_llm_router(self, id: UUID, request: UpdateLLMRouterRequest) -> LLMRouter:
        data = request.model_dump(exclude_unset=True)
        
        # Sync compatibility IDs if priority_chain is updated
        if "priority_chain" in data and data["priority_chain"]:
            try:
                data["primary_model_id"] = UUID(data["priority_chain"][0].get("model_id"))
                if len(data["priority_chain"]) > 1:
                    data["fallback_model_id"] = UUID(data["priority_chain"][1].get("model_id"))
                else:
                    data["fallback_model_id"] = None
            except (ValueError, TypeError, IndexError):
                pass

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

    async def get_available_models(self, provider_id: UUID) -> List[AvailableModelResponse]:
        """
        Fetches available models from the endpoint configured in Provider Studio.
        Zero hardcoded provider names, protocols, or URLs.
        Returns empty list if provider_api_endpoint is not set.
        """
        provider = await self.repo.get_llm_provider(provider_id)
        if not provider:
            raise ValueError(f"Provider with id {provider_id} not found")

        if not provider.provider_api_endpoint:
            return []

        return await self._fetch_models(provider)

    async def _fetch_models(self, provider: LLMProvider) -> List[AvailableModelResponse]:
        """
        Generic model discovery driven by provider configuration (SSoT).
        """
        endpoint = provider.provider_api_endpoint.strip()
        api_key = provider.provider_api_key
        
        # URL construction
        if provider.api_key_placement == "query" and api_key:
             # Heuristic for URL injection (mostly for Google Gemini beta API)
             url = f"{endpoint}{api_key}" if "key=" in endpoint else f"{endpoint}?key={api_key}"
        else:
            base = endpoint.rstrip("/")
            url = base if base.endswith("/models") else f"{base}/models"

        headers: dict[str, str] = {"Content-Type": "application/json"}
        if api_key and provider.api_key_placement == "header":
            headers[provider.auth_header_name] = f"{provider.auth_header_prefix}{api_key}"

        # Add custom headers from config
        if provider.custom_headers:
            for header in provider.custom_headers:
                if header.get("key") and header.get("value"):
                    headers[header["key"]] = header["value"]

        # Anthropic Special Handling (if not set in custom_headers)
        if provider.protocol == "anthropic" or "anthropic" in provider.provider_technical_id.lower():
            if "anthropic-version" not in headers:
                headers["anthropic-version"] = "2023-06-01"
            if provider.auth_header_name == "Authorization" and "x-api-key" not in headers:
                headers["x-api-key"] = api_key
                headers.pop("Authorization", None)

        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                res = await client.get(url, headers=headers)
                res.raise_for_status()
                raw = res.json()
                
                # Dynamic discovery path (e.g. "data" or "models")
                data = raw
                path_parts = provider.discovery_json_path.split(".")
                for part in path_parts:
                    if isinstance(data, dict):
                        data = data.get(part, [])
                    else:
                        break
                
                if not isinstance(data, list):
                    return []

                # Dynamic field mapping
                results = []
                for m in data:
                    if not isinstance(m, dict):
                        continue
                        
                    model_id = str(m.get(provider.discovery_id_key, ""))
                    if not model_id:
                        continue
                        
                    model_name = str(m.get(provider.discovery_name_key, model_id))
                    context = m.get(provider.discovery_context_key)
                    
                    results.append(AvailableModelResponse(
                        id=model_id,
                        name=model_name,
                        context_window=int(context) if context and str(context).isdigit() else 0,
                        pricing_input=0.0, # Will be refined via marketplace if needed
                        pricing_output=0.0
                    ))
                
                return sorted(results, key=lambda x: x.name)

            except Exception as e:
                print(f"Error fetching models from {url}: {e}")
                return []
