import asyncio
from typing import Any
import vecs
from app.shared.domain.ports.knowledge_retriever import KnowledgeRetriever
from app.shared.domain.ports.llm_gateway import LLMGateway
from app.config import settings

class VecsRetriever(KnowledgeRetriever):
    """
    Adapter for pgvector (vecs) retrieval.
    """

    def __init__(self, gateway: LLMGateway, collection_name: str = "knowledge_base"):
        self.gateway = gateway
        # Note: vecs client creation is blocking but happens once at init/startup usually.
        # Ideally, this should also be non-blocking or managed by dependency injection lifecycle.
        # For now, we accept init blocking as it's typically "application startup" phase.
        self.client = vecs.create_client(settings.DATABASE_URL)
        self.collection = self.client.get_or_create_collection(name=collection_name, dimension=768)

    async def search(self, query: str, limit: int = 5) -> list[dict[str, Any]]:
        # 1. Embed Query
        embedding = await self.gateway.get_embeddings(query)
        
        # 2. Search Vecs (Blocking IO -> Thread)
        # vecs query returns a list of IDs (strings) by default in some versions, 
        # or list of records. We rely on include_metadata=True behavior.
        def _search_sync():
            return self.collection.query(
                data=embedding,
                limit=limit,
                include_value=True,
                include_metadata=True
            )
        
        results = await asyncio.to_thread(_search_sync)
        
        # 3. Format Results
        formatted_results = []
        for res in results:
            # Handle vecs result structure safely.
            # Assuming typical [(id, distance, metadata)] or object structure.
            # If res is just ID, we are missing data.
            # If include_metadata=True, vecs typically returns records.
            
            # Temporary safety check until integration tests confirm exact structure
            doc_id = str(res[0]) if isinstance(res, tuple) else str(res)
            metadata = res[2] if isinstance(res, tuple) and len(res) > 2 else {}
            
            formatted_results.append({
                "id": doc_id,
                "content": metadata.get("content", "Content not available in metadata"),
                "metadata": metadata
            })
            
        return formatted_results

    async def get_document(self, doc_id: str) -> dict[str, Any] | None:
        def _fetch_sync():
            rows = self.collection.fetch(ids=[doc_id])
            return rows[0] if rows else None
            
        return await asyncio.to_thread(_fetch_sync)
