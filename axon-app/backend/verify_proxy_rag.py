import asyncio
import sys
from sqlalchemy import select
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.knowledge.application.rag import RAGService
from app.api.deps import get_vector_store_adapter
from app.shared.infrastructure.adapters.langchain_adapter import get_llm_adapter

async def verify_proxy_search():
    print("Verifying RAG search via VectorStoreProxy...")
    async with AsyncSessionLocal() as session:
        # Manually construct proxy for testing
        gateway = get_llm_adapter()
        
        async def mock_config_resolver():
            return {"provider": "supabase_local", "url": ""}
            
        from app.shared.infrastructure.adapters.vector_stores.proxy import VectorStoreProxy
        proxy = VectorStoreProxy(mock_config_resolver, gateway)
        
        rag_service = RAGService(session, vector_store=proxy)
        
        query = "test"
        print(f"Searching for: '{query}' via Proxy...")
        
        try:
            results = await rag_service.search_knowledge(query, limit=5)
            print(f"Found {len(results)} results.")
            for res in results:
                print(f" - [{res.get('score', 0):.4f}] {res.get('id')}: {res.get('metadata', {}).get('text', 'No text')[:50]}...")
        except Exception as e:
            print(f"❌ Proxy search failed: {e}")

if __name__ == "__main__":
    asyncio.run(verify_proxy_search())
