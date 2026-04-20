import asyncio
import os
import sys
from uuid import uuid4
from sqlalchemy import select
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.agents.infrastructure.tables import AgentConfigTable
from app.modules.system.infrastructure.repo import SystemEmbeddingRepository
from app.modules.system.application.indexing_service import SystemIndexingService
from app.modules.system.application.retriever import SystemAwarenessRetrieverService
from app.modules.system.infrastructure.tables import SystemEmbeddingTable

async def main():
    print("Connecting to the database...")
    async with AsyncSessionLocal() as session:
        # 1. Fetch some agents
        print("Fetching agents from DB...")
        result = await session.execute(select(AgentConfigTable).limit(5))
        agents = result.scalars().all()
        
        if not agents:
            print("No agents found in the database. Creating a mock one for testing.")
            mock_id = uuid4()
            payload = {
                "name": "Mock E2E Agent",
                "description": "This is a mock agent for E2E testing of the indexing system.",
                "role": "Tester",
                "backstory": "Created during an E2E test run."
            }
            agents_to_index = [(mock_id, "agent", payload)]
        else:
            agents_to_index = []
            for agent in agents:
                # Convert to dict
                payload = {
                    "name": agent.agent_name,
                    "description": getattr(agent, "agent_description", ""),
                    "role": getattr(agent, "agent_role", ""),
                    "backstory": getattr(agent, "agent_backstory", ""),
                    "goal": getattr(agent, "agent_goal", "")
                }
                agents_to_index.append((agent.id, "agent", payload))
                
        repo = SystemEmbeddingRepository(session)
        indexing_service = SystemIndexingService(repo)
        
        # 2. Index them
        print(f"\n--- Indexing {len(agents_to_index)} entities ---")
        for entity_id, entity_type, payload in agents_to_index:
            print(f"Indexing {entity_type} {entity_id} - {payload.get('name')}")
            try:
                # Try normal indexing
                await indexing_service.index_entity(
                    entity_id=entity_id,
                    entity_type=entity_type,
                    payload=payload
                )
                print(" -> Success (API)")
            except Exception as e:
                print(f" -> API failed ({e}), using mock embedding...")
                # Use a mock vector of 768 dimensions
                mock_embedding = [0.01] * 768
                await repo.upsert_embedding(
                    entity_id=entity_id,
                    entity_type=entity_type,
                    embedding=mock_embedding,
                    payload=payload,
                    metadata={}
                )
                print(" -> Success (Mock)")
                
        # 3. Verify in DB
        print("\n--- Checking DB for embeddings ---")
        embed_result = await session.execute(select(SystemEmbeddingTable).limit(10))
        embeddings = embed_result.scalars().all()
        print(f"Found {len(embeddings)} embeddings in DB.")
        for emb in embeddings:
            print(f" - {emb.entity_type} {emb.entity_id}")
            
        # 4. Search
        print("\n--- Testing Retrieval ---")
        retriever = SystemAwarenessRetrieverService(repo)
        search_query = "Find me someone who knows about code, testing or data analysis."
        print(f"Searching for: '{search_query}'")
        try:
            results = await retriever.search(query=search_query, limit=3)
            print(f"Found {len(results)} results via API:")
            for res in results:
                print(f" - [{res.similarity_score:.4f}] {res.entity_type} {res.entity_id}: {res.payload.get('name')}")
        except Exception as e:
            print(f" -> API search failed: {e}. Testing manual search with mock query...")
            mock_query = [0.01] * 768
            results = await repo.search_similar(query_embedding=mock_query, limit=3)
            print(f"Found {len(results)} results via Mock Query:")
            for res in results:
                print(f" - [{res.similarity_score:.4f}] {res.entity_type} {res.entity_id}: {res.payload.get('name')}")

if __name__ == "__main__":
    asyncio.run(main())
