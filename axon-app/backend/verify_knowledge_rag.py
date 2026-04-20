import asyncio
import sys
from sqlalchemy import select
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.knowledge.application.rag import RAGService
from app.modules.settings.infrastructure.tables import VectorDatabaseTable

async def verify_rag_search():
    print("Connecting to the database to verify Knowledge RAG search...")
    async with AsyncSessionLocal() as session:
        # Check if we have any vector databases configured
        vdbs = (await session.execute(select(VectorDatabaseTable))).scalars().all()
        print(f"Found {len(vdbs)} vector databases in config.")
        
        rag_service = RAGService(session)
        
        query = "test"
        print(f"Performing search for query: '{query}'...")
        
        try:
            results = await rag_service.search_knowledge(query, limit=3)
            print(f"Found {len(results)} results in Knowledge Base.")
            for res in results:
                print(f" - [{res.get('score', 0):.4f}] {res.get('id')}: {res.get('metadata', {}).get('text', 'No text')[:100]}...")
        except Exception as e:
            print(f"❌ RAG search failed: {e}")
            if "chromadb" in str(e).lower():
                print("Note: This might be due to ChromaDB not running or not being configured.")
            elif "qdrant" in str(e).lower():
                print("Note: This might be due to Qdrant not running.")

if __name__ == "__main__":
    asyncio.run(verify_rag_search())
