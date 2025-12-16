from typing import Optional, List
from sqlalchemy import create_engine, text
from backend.app.config import settings
from backend.app.shared.infrastructure.vecs_client import get_vecs_client

class SemanticCache:
    _instance = None
    
    def __init__(self):
        self.client = get_vecs_client()
        self.collection = self.client.get_or_create_collection(
            name="semantic_cache", 
            dimension=768 # Standard Gemini Embedding
        )
        self.threshold = 0.05 # Cosine distance threshold (similar to > 0.95 similarity)
        
        # Initialize Sync Engine for raw SQL (vecs uses sync driver usually, but we ensure compat)
        # Database URL might be async (postgresql+asyncpg), we need sync (postgresql+psycopg2 or default)
        db_url = settings.DATABASE_URL.replace("+asyncpg", "")
        self.engine = create_engine(db_url)

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def search(self, embedding: List[float]) -> Optional[str]:
        """
        Searches the cache for a semantically similar query using Cosine Distance.
        Returns the cached response if distance < threshold.
        """
        try:
            # Construct raw SQL for pgvector cosine distance (<=>)
            # Table name in vecs is usually "vecs"."collection_name"
            query = text("""
                SELECT metadata 
                FROM vecs."semantic_cache"
                WHERE vec <=> :embedding < :threshold
                ORDER BY vec <=> :embedding ASC
                LIMIT 1;
            """)
            
            with self.engine.connect() as conn:
                # Cast embedding to string representation if needed by driver, 
                # but sqlalchemy usually handles list[float] for pgvector if vector type is registered.
                # However, raw text query might need explicit casting or string formatting for the vector.
                # pgvector expects '[1,2,3]' string format often in raw SQL if binding isn't auto-handled.
                # Let's try passing the list directly first.
                
                result = conn.execute(
                    query, 
                    {"embedding": str(embedding), "threshold": self.threshold}
                ).fetchone()
                
                if result and result.metadata:
                    # metadata is a JSONB column, returned as dict
                    return result.metadata.get("response")
            
            return None
            
        except Exception as e:
            print(f"Cache Search Error: {e}")
            return None

    def store(self, embedding: List[float], query_text: str, response_text: str):
        """
        Stores the query and response in the cache.
        """
        try:
            from uuid import uuid4
            item_id = str(uuid4())
            
            self.collection.upsert(
                records=[
                    (
                        item_id, 
                        embedding, 
                        {"query": query_text, "response": response_text}
                    )
                ]
            )
        except Exception as e:
            print(f"Cache Store Error: {e}")
