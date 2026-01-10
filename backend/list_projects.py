import asyncio
import sys
import os
from sqlalchemy import select

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.modules.projects.infrastructure.tables import ProjectTable

async def list_projects():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(ProjectTable))
        projects = result.scalars().all()
        
        if projects:
            print(f"✅ Found {len(projects)} projects:")
            for p in projects:
                print(f"ID: {p.id} | Name: {p.name} | Owner: {p.owner_id}")
        else:
            print("❌ No projects found in DB.")

if __name__ == "__main__":
    asyncio.run(list_projects())
