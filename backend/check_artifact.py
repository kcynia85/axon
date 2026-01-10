import asyncio
import sys
import os
from sqlalchemy import select, desc

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.modules.projects.infrastructure.tables import ArtifactTable

async def check_latest_artifact():
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(ArtifactTable).order_by(desc(ArtifactTable.created_at)).limit(1)
        )
        artifact = result.scalar_one_or_none()
        
        if artifact:
            print(f"✅ Latest Artifact: {artifact.title}")
            print(f"Content Preview: {artifact.content[:50]}...")
            print(f"Created At: {artifact.created_at}")
        else:
            print("❌ No artifacts found.")

if __name__ == "__main__":
    asyncio.run(check_latest_artifact())
