import asyncio
import vecs
from typing import Any, List
from app.shared.domain.ports.vector_store import VectorStoreAdapter
from app.shared.domain.ports.llm_gateway import LLMGateway

class SupabaseLocalVectorAdapter(VectorStoreAdapter):
    """
    Adapter for Supabase Local (pgvector via vecs).
    Implements the VectorStoreAdapter interface asynchronously.
    """
    def __init__(self, connection_url: str, gateway: LLMGateway):
        self.connection_url = connection_url
        self.gateway = gateway
        self.client = None
    
    def _get_client(self):
        if not self.client:
            self.client = vecs.create_client(self.connection_url)
        return self.client
        
    def _get_collection(self, collection_name: str):
        client = self._get_client()
        # Defaulting to 768 for standard embedding models.
        # Production ready systems can pass dimension size dynamically.
        return client.get_or_create_collection(name=collection_name, dimension=768)

    async def search(self, collection_name: str, query: str, limit: int = 5) -> List[dict[str, Any]]:
        embedding = await self.gateway.get_embeddings(query)
        collection = self._get_collection(collection_name)
        
        def _search_sync():
            return collection.query(
                data=embedding,
                limit=limit,
                include_value=True,
                include_metadata=True
            )
        
        # Execute blocking vecs call in thread pool
        results = await asyncio.to_thread(_search_sync)
        
        formatted_results = []
        for res in results:
            doc_id = str(res[0]) if isinstance(res, tuple) else str(res)
            metadata = res[2] if isinstance(res, tuple) and len(res) > 2 else {}
            formatted_results.append({
                "id": doc_id,
                "content": metadata.get("content", ""),
                "metadata": metadata
            })
        return formatted_results

    async def upsert(self, collection_name: str, doc_id: str, content: str, metadata: dict[str, Any]) -> None:
        embedding = await self.gateway.get_embeddings(content)
        collection = self._get_collection(collection_name)
        
        upsert_metadata = metadata.copy()
        if "content" not in upsert_metadata:
            upsert_metadata["content"] = content
            
        def _upsert_sync():
            collection.upsert(records=[(doc_id, embedding, upsert_metadata)])
            
        await asyncio.to_thread(_upsert_sync)

    async def delete(self, collection_name: str, doc_id: str) -> None:
        collection = self._get_collection(collection_name)
        def _delete_sync():
            collection.delete(ids=[doc_id])
        await asyncio.to_thread(_delete_sync)

    async def test_connection(self) -> bool:
        try:
            client = self._get_client()
            def _ping_sync():
                return client.get_collections()
            await asyncio.to_thread(_ping_sync)
            return True
        except Exception:
            return False
            
    async def disconnect(self) -> None:
        if self.client:
            def _disc_sync():
                self.client.disconnect()
            await asyncio.to_thread(_disc_sync)
            self.client = None
