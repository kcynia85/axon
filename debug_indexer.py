import asyncio
import os
import sys
from uuid import UUID

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "axon-app", "backend"))

async def test():
    from app.modules.knowledge.application.indexer import simulate_chunking
    from app.shared.infrastructure.database import AsyncSessionLocal
    
    file_path = "README.md"
    vdb_id = "c0e18a92-7026-44e2-ae74-09ec1cda12b9"
    
    async with AsyncSessionLocal() as session:
        result = await simulate_chunking(file_path, None, vdb_id, session)
        print("RESULT:", result)

if __name__ == "__main__":
    asyncio.run(test())
