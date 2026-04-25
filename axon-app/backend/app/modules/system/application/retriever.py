from typing import List, Optional
from app.modules.system.infrastructure.repo import SystemEmbeddingRepository
from app.modules.system.infrastructure.token_usage_repo import TokenUsageRepository
from app.modules.system.domain.models import SystemAwarenessSearchResult
from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter
from app.shared.utils.tokens import count_tokens

class SystemAwarenessRetrieverService:
    """
    Service responsible for retrieving relevant system entities for System Awareness (RAG#2).
    """
    def __init__(self, repo: SystemEmbeddingRepository):
        self.repo = repo
        self.token_usage_repo = TokenUsageRepository(repo.session)
        self.adapter = get_llm_adapter()

    async def search(self, query: str, limit: int = 5, threshold: float = 0.7, entity_type: Optional[str] = None) -> List[SystemAwarenessSearchResult]:
        """
        Generates an embedding for the query and searches the system_embeddings table.
        Uses 768 dimensions to match the DB schema.
        """
        # Generate embedding for the query with enforced 768 dimensions
        query_embedding = await self.adapter.get_embeddings(query, dimensions=768)
        
        # Log usage for query embedding
        try:
            tokens_count = count_tokens(query, "text-embedding-3-small")
            await self.token_usage_repo.log_usage(
                model_name="text-embedding-3-small",
                category="awareness",
                tokens_count=tokens_count,
                metadata={"operation": "search_query_embedding"}
            )
        except Exception:
            pass

        # Search the repository
        results = await self.repo.search_similar(
            query_embedding=query_embedding,
            limit=limit,
            threshold=threshold,
            entity_type=entity_type
        )
        
        return results
