
import asyncio
from sqlalchemy import text
from app.shared.infrastructure.database import AsyncSessionLocal

async def check_crews_manager():
    async with AsyncSessionLocal() as session:
        try:
            result = await session.execute(text("SELECT id, crew_name, manager_agent_id FROM crews;"))
            rows = result.all()
            for row in rows:
                print(f"ID: {row[0]}, Name: {row[1]}, Manager ID: {row[2]}")
        except Exception as e:
            print(f"Error checking crews manager: {e}")

if __name__ == "__main__":
    asyncio.run(check_crews_manager())
