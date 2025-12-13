from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.modules.knowledge.infrastructure.repo import AssetRepository, KnowledgeVectorStore
from backend.app.shared.infrastructure.adk import GoogleADK
from backend.app.modules.knowledge.domain.models import Asset

class RAGService:
    def __init__(self, session: AsyncSession):
        self.asset_repo = AssetRepository(session)
        self.vector_store = KnowledgeVectorStore()

    async def search_knowledge(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Semantic search over Knowledge Base.
        1. Convert query to vector.
        2. Search vector DB.
        """
        # 1. Get Embeddings
        query_vector = await GoogleADK.get_embeddings(query)
        
        # 2. Search
        # Note: vecs client query returns specific format. 
        # We assume KnowledgeVectorStore.search handles the basic call.
        results = self.vector_store.search(query_vector, limit=limit)
        
        return results

    async def get_asset(self, slug: str) -> Optional[Asset]:
        """
        Retrieve a full Asset by slug.
        """
        return await self.asset_repo.get_by_slug(slug)
