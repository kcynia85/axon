import asyncio
import sys
import os
from sqlalchemy import select, text

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.shared.infrastructure.database import AsyncSessionLocal
from backend.app.modules.projects.infrastructure.tables import ProjectTable
from uuid import UUID

async def check_mock_project():
    mock_id = UUID("00000000-0000-0000-0000-000000000000")
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(ProjectTable).where(ProjectTable.id == mock_id))
        project = result.scalar_one_or_none()
        if project:
            print(f"✅ Mock Project Found! Owner: {project.owner_id}")
        else:
            print("❌ Mock Project NOT Found.")
            # Try to find the user from the last login or just print users
            # Since we can't easily see auth.users, we'll just print "Need to seed"

if __name__ == "__main__":
    asyncio.run(check_mock_project())
