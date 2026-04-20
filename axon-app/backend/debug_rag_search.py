import asyncio
import os
from app.shared.infrastructure.database import AsyncSessionLocal
from app.api.deps import get_vector_store_adapter
from app.modules.knowledge.application.rag import RAGService
from app.config import settings

async def debug_search():
    print(f"DATABASE_URL: {settings.DATABASE_URL}")
    print(f"OPENAI_API_KEY present: {bool(settings.OPENAI_API_KEY)}")
    
    async with AsyncSessionLocal() as session:
        proxy = await get_vector_store_adapter()
        config = await proxy.config_resolver()
        print(f"Proxy Config: {config}")
        
        rag_service = RAGService(session, vector_store=proxy)
        
        query_text = "donald"
        print(f"Searching for '{query_text}'...")
        
        # 1. Test raw proxy search
        try:
            proxy_results = await proxy.search('knowledge_base', query_text, limit=1)
            print(f"Proxy Raw Result Sample Content: {proxy_results}")
            
            # Get the adapter directly to test internal vecs result
            adapter = await proxy._get_active_adapter()
            embedding = await adapter.gateway.get_embeddings(
                query_text, 
                model_name="text-embedding-3-small", 
                provider_name="openai",
                dimensions=768
            )
            col = adapter._get_collection('knowledge_base')
            raw_vecs_results = col.query(data=embedding, limit=1, include_metadata=True)
            print(f"RAW VECS Result Type: {type(raw_vecs_results)}")
            if raw_vecs_results:
                print(f"RAW VECS Item Type: {type(raw_vecs_results[0])}")
                print(f"RAW VECS Item Content: {raw_vecs_results[0]}")
                # Check if it has attributes or is subscriptable
                try:
                    print(f"RAW VECS Item [0]: {raw_vecs_results[0][0]}")
                except:
                    print("RAW VECS Item is not subscriptable")
        except Exception as e:
            print(f"Proxy Search Failed: {e}")
        
        # 2. Test full RAG service (with reranking)
        try:
            results = await rag_service.search_knowledge(query_text, limit=5)
            print(f"Final Results count: {len(results)}")
            if results:
                print(f"First result metadata keys: {results[0].get('metadata', {}).keys()}")
                print(f"First result text: {results[0].get('metadata', {}).get('text', 'N/A')[:100]}...")
        except Exception as e:
            print(f"RAG Service Failed: {e}")

if __name__ == "__main__":
    asyncio.run(debug_search())
