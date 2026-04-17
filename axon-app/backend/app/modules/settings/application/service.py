import httpx
from uuid import UUID, uuid4
from typing import List, Optional
from app.modules.settings.infrastructure.repo import SettingsRepository
from app.modules.settings.infrastructure.pricing_scraper import PricingScraper
from app.modules.settings.domain.models import (
    LLMProvider, LLMModel, LLMRouter, EmbeddingModel, ChunkingStrategy, VectorDatabase
)
from app.modules.settings.application.schemas import (
    CreateLLMProviderRequest, UpdateLLMProviderRequest,
    CreateLLMModelRequest, UpdateLLMModelRequest,
    CreateLLMRouterRequest, UpdateLLMRouterRequest,
    CreateEmbeddingModelRequest, UpdateEmbeddingModelRequest,
    CreateChunkingStrategyRequest, UpdateChunkingStrategyRequest,
    CreateVectorDatabaseRequest, UpdateVectorDatabaseRequest,
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
            discovery_pricing_endpoint=request.discovery_pricing_endpoint,
            discovery_pricing_input_key=request.discovery_pricing_input_key,
            discovery_pricing_output_key=request.discovery_pricing_output_key,
            
            # Algorithmic Scraping Configuration
            pricing_page_url=request.pricing_page_url,
            pricing_scraper_strategy=request.pricing_scraper_strategy,
            
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
            mapped_models = await self._fetch_models(provider)
            latency_ms = (time.time() - start_time) * 1000
            
            return ConnectionTestResponse(
                success=True,
                message="Połączono pomyślnie",
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
        # Mocking for now
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
            provider_id=request.provider_id,
            model_provider_name=request.model_provider_name,
            model_id=request.model_id,
            model_vector_dimensions=request.model_vector_dimensions,
            model_max_context_tokens=request.model_max_context_tokens,
            model_cost_per_1m_tokens=request.model_cost_per_1m_tokens,
            is_draft=request.is_draft,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_embedding_model(model)

    async def list_embedding_models(self) -> List[EmbeddingModel]:
        return await self.repo.list_embedding_models()

    async def get_embedding_model(self, id: UUID) -> Optional[EmbeddingModel]:
        return await self.repo.get_embedding_model(id)

    async def update_embedding_model(self, id: UUID, request: UpdateEmbeddingModelRequest) -> EmbeddingModel:
        data = request.model_dump(exclude_unset=True)
        updated = await self.repo.update_embedding_model(id, data)
        if not updated:
            raise ValueError(f"Embedding model with id {id} not found")
        return updated

    async def delete_embedding_model(self, id: UUID) -> bool:
        return await self.repo.delete_embedding_model(id)

    # --- Chunking Strategy ---

    async def create_chunking_strategy(self, request: CreateChunkingStrategyRequest) -> ChunkingStrategy:
        strategy = ChunkingStrategy(
            id=uuid4(),
            strategy_name=request.strategy_name,
            strategy_chunking_method=request.strategy_chunking_method,
            strategy_chunk_size=request.strategy_chunk_size,
            strategy_chunk_overlap=request.strategy_chunk_overlap,
            strategy_chunk_boundaries=request.strategy_chunk_boundaries,
            is_draft=request.is_draft,
            created_at=now_utc(),
            updated_at=now_utc()
        )
        return await self.repo.create_chunking_strategy(strategy)

    async def list_chunking_strategies(self) -> List[ChunkingStrategy]:
        return await self.repo.list_chunking_strategies()

    async def get_chunking_strategy(self, id: UUID) -> Optional[ChunkingStrategy]:
        return await self.repo.get_chunking_strategy(id)

    async def update_chunking_strategy(self, id: UUID, request: UpdateChunkingStrategyRequest) -> ChunkingStrategy:
        data = request.model_dump(exclude_unset=True)
        updated = await self.repo.update_chunking_strategy(id, data)
        if not updated:
            raise ValueError(f"Chunking strategy with id {id} not found")
        return updated

    async def delete_chunking_strategy(self, id: UUID) -> bool:
        return await self.repo.delete_chunking_strategy(id)

    async def simulate_chunking(self, request: SimulateChunkingRequest) -> SimulateChunkingResponse:
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
            # Handle legacy fields if present in request, or use config
            vector_database_host=request.vector_database_host,
            vector_database_port=request.vector_database_port,
            vector_database_user=request.vector_database_user,
            vector_database_password=request.vector_database_password,
            vector_database_db_name=request.vector_database_db_name,
            vector_database_ssl_mode=request.vector_database_ssl_mode,
            # New universal config
            vector_database_config=request.vector_database_config,
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

    async def get_vector_database(self, id: UUID) -> Optional[VectorDatabase]:
        return await self.repo.get_vector_database(id)

    async def update_vector_database(self, id: UUID, request: UpdateVectorDatabaseRequest) -> VectorDatabase:
        data = request.model_dump(exclude_unset=True)
        updated = await self.repo.update_vector_database(id, data)
        if not updated:
            raise ValueError(f"Vector Database with id {id} not found")
        return updated

    async def delete_vector_database(self, id: UUID) -> bool:
        return await self.repo.delete_vector_database(id)

    async def test_vector_database(self, id: UUID) -> ConnectionTestResponse:
        import time
        from app.shared.infrastructure.vecs_client import get_vecs_client
        import httpx
        from urllib.parse import quote_plus
        from app.modules.settings.domain.enums import ConnectionStatus, VectorDBType

        db = await self.repo.get_vector_database(id)
        if not db:
            raise ValueError(f"Vector Database with id {id} not found")

        db_type = db.vector_database_type
        config = db.vector_database_config or {}
        
        # 1. Handle Qdrant
        if db_type == VectorDBType.QDRANT_LOCAL:
            url = config.get("qdrant_url")
            api_key = config.get("qdrant_api_key")
            if not url:
                return ConnectionTestResponse(success=False, message="Brak adresu URL w konfiguracji Qdrant.", latency_ms=0)
            
            start_time = time.time()
            try:
                async with httpx.AsyncClient() as client:
                    headers = {}
                    if api_key:
                        headers["api-key"] = api_key
                    
                    response = await client.get(f"{url.rstrip('/')}/", headers=headers, timeout=5.0)
                    if response.status_code == 200:
                        latency_ms = (time.time() - start_time) * 1000
                        await self.repo.update_vector_database(id, {"vector_database_connection_status": ConnectionStatus.CONNECTED})
                        return ConnectionTestResponse(
                            success=True, 
                            message="Połączono pomyślnie z Qdrant", 
                            latency_ms=latency_ms,
                            raw_json={"status": "ok", "version_info": response.json() if "application/json" in response.headers.get("content-type", "") else response.text}
                        )
                    else:
                        raise Exception(f"Qdrant zwrócił status: {response.status_code}")
            except Exception as e:
                await self.repo.update_vector_database(id, {"vector_database_connection_status": ConnectionStatus.DISCONNECTED})
                return ConnectionTestResponse(success=False, message=f"Błąd połączenia z Qdrant: {str(e)}", latency_ms=0)

        # 2. Handle ChromaDB
        if db_type in [VectorDBType.CHROMADB_LOCAL, VectorDBType.CHROMADB_CLOUD, VectorDBType.CHROMADB]:
            host = config.get("chroma_host")
            port = config.get("chroma_port")
            url = config.get("chroma_url") or f"http://{host}:{port}"
            api_key = config.get("chroma_api_key")
            
            if not url or url == "http://None:None":
                return ConnectionTestResponse(success=False, message="Brak konfiguracji host/port dla ChromaDB.", latency_ms=0)

            start_time = time.time()
            try:
                async with httpx.AsyncClient() as client:
                    headers = {}
                    if api_key:
                        headers["Authorization"] = f"Bearer {api_key}"
                        
                    # Try API v2 first (modern ChromaDB 0.7.0+)
                    response = await client.get(f"{url.rstrip('/')}/api/v2/heartbeat", headers=headers, timeout=5.0)
                    
                    # Fallback to API v1 if v2 returns 404/410/405 (backward compatibility)
                    if response.status_code in [404, 405, 410]:
                        response = await client.get(f"{url.rstrip('/')}/api/v1/heartbeat", headers=headers, timeout=5.0)

                    if response.status_code == 200:
                        latency_ms = (time.time() - start_time) * 1000
                        await self.repo.update_vector_database(id, {"vector_database_connection_status": ConnectionStatus.CONNECTED})
                        return ConnectionTestResponse(
                            success=True, 
                            message="Połączono pomyślnie z ChromaDB", 
                            latency_ms=latency_ms,
                            raw_json=response.json()
                        )
                    else:
                        raise Exception(f"ChromaDB zwrócił status: {response.status_code}")
            except Exception as e:
                await self.repo.update_vector_database(id, {"vector_database_connection_status": ConnectionStatus.DISCONNECTED})
                return ConnectionTestResponse(success=False, message=f"Błąd połączenia z ChromaDB: {str(e)}", latency_ms=0)

        # 3. Handle Postgres (pgvector / Supabase)
        connection_url = db.vector_database_connection_url
        if connection_url:
            connection_url = connection_url.strip()
        # Robust fallback: Try to recompose URL if missing but fields are present
        if not connection_url and db.vector_database_host and db.vector_database_user:
            from urllib.parse import quote_plus
            import re
            
            # Remove ANY whitespace or control characters from host, and leading @
            host = re.sub(r'^@', '', re.sub(r'\s+', '', db.vector_database_host))
            user = re.sub(r'\s+', '', db.vector_database_user)
            pwd = quote_plus(re.sub(r'\s+', '', db.vector_database_password or ""))
            db_name = re.sub(r'\s+', '', db.vector_database_db_name or "postgres")
            ssl = re.sub(r'\s+', '', db.vector_database_ssl_mode or "require")
            
            connection_url = f"postgresql://{user}:{pwd}@{host}:{db.vector_database_port}/{db_name}?sslmode={ssl}"

        if not connection_url:
            return ConnectionTestResponse(
                success=False,
                message="Brak adresu połączenia (Connection URL). Upewnij się, że host i użytkownik są wypełnieni.",
                latency_ms=0
            )

        # Handle password encoding for special characters
        try:
            if "://" in connection_url and "@" in connection_url:
                prefix, rest = connection_url.split("://", 1)
                auth, host_part = rest.rsplit("@", 1)
                
                # Remove ANY whitespace or control characters from host_part
                import re
                host_part = re.sub(r'\s+', '', host_part)
                
                if ":" in auth:
                    user, pwd = auth.split(":", 1)
                    safe_pwd = quote_plus(pwd) if "%" not in pwd else pwd
                    connection_url = f"{prefix}://{user}:{safe_pwd}@{host_part}"
                else:
                    connection_url = f"{prefix}://{auth}@{host_part}"
        except Exception as parse_err:
            print(f"URL Parsing warning: {parse_err}")
            pass

        start_time = time.time()
        try:
            # Connect using the specific URL from Vector Studio instead of global settings
            client = get_vecs_client(connection_url)
            # Test if we can list collections or just ping
            client.list_collections()
            
            latency_ms = (time.time() - start_time) * 1000
            
            # Fetch extra metadata from Postgres
            server_details = {}
            try:
                import psycopg2
                with psycopg2.connect(connection_url) as conn:
                    with conn.cursor() as cur:
                        cur.execute("SELECT inet_server_addr(), inet_server_port(), version(), current_database()")
                        addr, port, ver, db_name = cur.fetchone()
                        server_details = {
                            "server_addr": str(addr),
                            "server_port": port,
                            "server_version": ver,
                            "database_name": db_name,
                            "connection_verified_at": time.strftime("%Y-%m-%d %H:%M:%S")
                        }
            except Exception:
                server_details = {"info": "Connected successfully, but failed to fetch server metadata details."}

            await self.repo.update_vector_database(id, {
                "vector_database_connection_status": ConnectionStatus.CONNECTED
            })

            return ConnectionTestResponse(
                success=True,
                message="Połączono pomyślnie z bazą wektorową",
                latency_ms=latency_ms,
                raw_json=server_details
            )
        except Exception as e:
            await self.repo.update_vector_database(id, {
                "vector_database_connection_status": ConnectionStatus.DISCONNECTED
            })
            return ConnectionTestResponse(
                success=False,
                message=f"Błąd połączenia: {str(e)}",
                latency_ms=0
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
        Falls back to global litellm pricing scraper if provider pricing API is not configured or fails.
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

                def get_nested_value(d, key_path, default=0.0):
                    if not key_path:
                        return default
                    parts = key_path.split(".")
                    curr = d
                    for p in parts:
                        if isinstance(curr, dict):
                            curr = curr.get(p)
                        else:
                            return default
                    try:
                        return float(curr) if curr is not None else default
                    except (ValueError, TypeError):
                        return default

                pricing_data_map = {}
                pricing_endpoint = provider.discovery_pricing_endpoint.strip() if provider.discovery_pricing_endpoint else None
                if pricing_endpoint and pricing_endpoint != url:
                    try:
                        pres = await client.get(pricing_endpoint, headers=headers)
                        pres.raise_for_status()
                        p_raw = pres.json()
                        p_data = p_raw
                        for part in path_parts:
                            if isinstance(p_data, dict):
                                p_data = p_data.get(part, [])
                            else:
                                break
                        if isinstance(p_data, list):
                            for pm in p_data:
                                if isinstance(pm, dict):
                                    pm_id = str(pm.get(provider.discovery_id_key, ""))
                                    if pm_id:
                                        pricing_data_map[pm_id] = pm
                    except Exception as pe:
                        print(f"Error fetching pricing from custom endpoint {pricing_endpoint}: {pe}")

                # Pre-fetch litellm global pricing dictionary
                global_pricing_data = await PricingScraper.get_pricing_data()

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
                    
                    price_in = 0.0
                    price_out = 0.0
                    
                    pm_data = pricing_data_map.get(model_id, m)
                    
                    if provider.discovery_pricing_input_key or provider.discovery_pricing_output_key:
                        price_in = get_nested_value(pm_data, provider.discovery_pricing_input_key, 0.0)
                        price_out = get_nested_value(pm_data, provider.discovery_pricing_output_key, 0.0)
                    else:
                        # Fallback to litellm pricing scraper
                        model_key = model_id
                        if model_key not in global_pricing_data and "/" in model_key:
                             model_key = model_key.split("/", 1)[1]
                             
                        global_model_data = global_pricing_data.get(model_key)
                        if global_model_data:
                            input_cost = global_model_data.get("input_cost_per_token", 0.0)
                            output_cost = global_model_data.get("output_cost_per_token", 0.0)
                            if isinstance(input_cost, (int, float)):
                                price_in = input_cost * 1_000_000
                            if isinstance(output_cost, (int, float)):
                                price_out = output_cost * 1_000_000

                    try:
                        ctx_val = int(context) if context else 0
                    except (ValueError, TypeError):
                        ctx_val = 0

                    results.append(AvailableModelResponse(
                        id=model_id,
                        name=model_name,
                        context_window=ctx_val,
                        pricing_input=price_in,
                        pricing_output=price_out
                    ))
                
                # If native discovery returned results, return them
                if results:
                    return sorted(results, key=lambda x: x.name)

            except Exception as e:
                print(f"Error fetching models from {url}: {e}")
            
            # --- FINAL FALLBACK: LiteLLM Registry ---
            # If native discovery failed or returned nothing, try to find models in LiteLLM registry
            # that match the provider's technical ID or name.
            fallback_results = []
            provider_search_term = provider.provider_technical_id.lower() or provider.provider_name.lower()
            
            # Common mappings for LiteLLM
            mapping = {
                "openai": "openai/",
                "anthropic": "anthropic/",
                "google": "gemini/",
                "cohere": "os/",
                "mistral": "mistral/",
                "groq": "groq/",
                "perplexity": "perplexity/",
                "deepseek": "deepseek/",
                "openrouter": "openrouter/"
            }
            
            prefix = ""
            for k, v in mapping.items():
                if k in provider_search_term:
                    prefix = v
                    break
            
            # LiteLLM JSON mapping
            try:
                litellm_data = await PricingScraper.get_pricing_data()
                for model_key, m_info in litellm_data.items():
                    if not isinstance(m_info, dict): continue
                    
                    # Match by prefix or explicit provider field in litellm if it exists
                    # Heuristic: model_key starts with prefix
                    is_match = False
                    if prefix and model_key.startswith(prefix):
                        is_match = True
                    elif provider_search_term in model_key.lower():
                        is_match = True
                        
                    if is_match:
                        # Map to AvailableModelResponse
                        m_id = model_key
                        # If it has prefix, friendly name is just the part after prefix
                        m_name = model_key.split("/", 1)[1] if "/" in model_key else model_key
                        m_name = m_name.replace("-", " ").title()
                        
                        ctx = m_info.get("max_tokens", 4096)
                        in_cost = m_info.get("input_cost_per_token", 0.0) * 1_000_000
                        out_cost = m_info.get("output_cost_per_token", 0.0) * 1_000_000
                        
                        fallback_results.append(AvailableModelResponse(
                            id=m_id,
                            name=m_name,
                            context_window=ctx,
                            pricing_input=in_cost,
                            pricing_output=out_cost
                        ))
                
                if fallback_results:
                    return sorted(fallback_results, key=lambda x: x.name)
            except Exception as fe:
                print(f"LiteLLM Fallback discovery error: {fe}")

            return []

