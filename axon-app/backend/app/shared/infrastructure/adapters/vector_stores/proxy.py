from typing import Any, List, Optional
from app.shared.domain.ports.vector_store import VectorStoreAdapter
from app.shared.domain.ports.llm_gateway import LLMGateway

class VectorStoreProxy(VectorStoreAdapter):
    """
    Dynamic Proxy resolving the active vector store per request.
    Enables hot-swapping between different providers (e.g. Supabase Local vs others)
    without restarting the application.
    """
    
    def __init__(self, config_resolver, gateway: LLMGateway):
        self.config_resolver = config_resolver
        self.gateway = gateway
        self._current_adapter: Optional[VectorStoreAdapter] = None
        self._current_config_hash: Optional[str] = None
        
    async def _get_active_adapter(self) -> VectorStoreAdapter:
        config = await self.config_resolver()
        config_hash = str(config)
        
        if self._current_adapter and self._current_config_hash == config_hash:
            return self._current_adapter
            
        if self._current_adapter and hasattr(self._current_adapter, "disconnect"):
            await self._current_adapter.disconnect()
            
        provider = config.get("provider", "supabase_local")
        connection_url = config.get("url", "")
        
        if provider == "supabase_local":
            from app.shared.infrastructure.adapters.vector_stores.supabase_local import SupabaseLocalVectorAdapter
            self._current_adapter = SupabaseLocalVectorAdapter(connection_url, self.gateway)
        else:
            raise ValueError(f"Unsupported Vector DB provider: {provider}")
            
        self._current_config_hash = config_hash
        return self._current_adapter

    async def search(self, collection_name: str, query: str, limit: int = 5) -> List[dict[str, Any]]:
        adapter = await self._get_active_adapter()
        return await adapter.search(collection_name, query, limit)

    async def upsert(self, collection_name: str, doc_id: str, content: str, metadata: dict[str, Any]) -> None:
        adapter = await self._get_active_adapter()
        return await adapter.upsert(collection_name, doc_id, content, metadata)

    async def delete(self, collection_name: str, doc_id: str) -> None:
        adapter = await self._get_active_adapter()
        return await adapter.delete(collection_name, doc_id)

    async def test_connection(self) -> bool:
        adapter = await self._get_active_adapter()
        return await adapter.test_connection()
