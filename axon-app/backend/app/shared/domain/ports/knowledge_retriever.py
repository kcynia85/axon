from typing import Protocol, Any, Optional
from abc import abstractmethod

class KnowledgeRetriever(Protocol):
    """
    Port (Interface) for retrieving knowledge from a vector store or document database.
    Abstracts the underlying storage mechanism (pgvector/vecs, Pinecone, Chroma).
    """

    @abstractmethod
    async def search(self, query: str, limit: int = 5) -> list[dict[str, Any]]:
        """
        Semantically searches for documents matching the query.
        Returns a list of results with metadata and content.
        """
        ...

    @abstractmethod
    async def get_document(self, doc_id: str) -> dict[str, Any] | None:
        """
        Retrieves a specific document by its ID.
        """
        ...
