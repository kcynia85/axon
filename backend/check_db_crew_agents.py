
import asyncio
from sqlalchemy import text
from app.shared.infrastructure.database import AsyncSessionLocal

async def check_crew_agents():
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(text("SELECT crew_id, agent_id FROM crew_agents;"))
            rows = result.all()
            for row in rows:
                print(f"Crew ID: {row[0]}, Agent ID: {row[1]}")
        except Exception as e:
            print(f"Error checking crew_agents: {e}")

if __name__ == "__main__":
    asyncio.run(check_crew_agents())
