import asyncio
import sys
import os
import logging

# Add the current directory to sys.path to allow imports from app
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.resources.infrastructure.repo import ResourcesRepository
from app.modules.resources.application.service import ResourcesService

async def debug_sync():
    async with AsyncSessionLocal() as session:
        repo = ResourcesRepository(session)
        service = ResourcesService(repo)
        
        print("Starting sync...")
        result = await service.sync_tools()
        
        print(f"Sync result: {result}")
        if result.errors:
            print(f"Errors: {result.errors}")
            
        # List tools in DB
        db_tools = await repo.list_internal_tools()
        print(f"Active tools in DB: {len(db_tools)}")
        for t in db_tools:
            print(f"- {t.tool_display_name} ({t.tool_function_name})")

if __name__ == "__main__":
    asyncio.run(debug_sync())
