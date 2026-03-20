import asyncio
import sys
import os
from sqlalchemy import select
from uuid import UUID

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.workspaces.infrastructure.tables import CrewTable

async def check_crew_availability(crew_id_str):
    crew_id = UUID(crew_id_str)
    async with AsyncSessionLocal() as session:
        stmt = select(CrewTable).where(CrewTable.id == crew_id)
        result = await session.execute(stmt)
        crew = result.scalar_one_or_none()
        
        if crew:
            print(f"Crew: {crew.crew_name}")
            print(f"Availability: {crew.availability_workspace}")
        else:
            print(f"Crew with ID {crew_id_str} not found.")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        asyncio.run(check_crew_availability(sys.argv[1]))
    else:
        print("Please provide a crew ID.")
