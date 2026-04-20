from typing import Protocol, Any, List
from abc import abstractmethod

class VectorStoreAdapter(Protocol):
    """
    Port (Interface) for managing vector database operations (search, upsert, delete).
    Provides isolation from specific implementations (Supabase/pgvector, Chroma, etc.).
    Allows RAG#1 and RAG#2 to specify independent collections/namespaces.
    """
    
    @abstractmethod
    async def search(self, collection_name: str, query: str, limit: int = 5) -> List[dict[str, Any]]:
        """
        Semantically searches for documents matching the query within a specific collection.
        Returns a list of results with id, content and metadata.
        """
        ...

    @abstractmethod
    async def upsert(self, collection_name: str, doc_id: str, content: str, metadata: dict[str, Any]) -> None:
        """
        Inserts or updates a document with its vector embedding.
        """
        ...

    @abstractmethod
    async def delete(self, collection_name: str, doc_id: str) -> None:
        """
        Deletes a document from the specified collection.
        """
        ...
        
    @abstractmethod
    async def test_connection(self) -> bool:
        """
        Verifies the connection to the vector database.
        """
        ...
