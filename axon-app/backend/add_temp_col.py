import asyncio
import os
import sys
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
from app.shared.infrastructure.database import AsyncSessionLocal

async def main():
    async with AsyncSessionLocal() as session:
        try:
            print("Adding meta_agent_temperature column to voice_meta_agents...")
            await session.execute(text("ALTER TABLE voice_meta_agents ADD COLUMN IF NOT EXISTS meta_agent_temperature FLOAT DEFAULT 0.7"))
            await session.commit()
            print("SUCCESS")
        except Exception as e:
            print(f"FAILED: {e}")
            await session.rollback()

if __name__ == "__main__":
    asyncio.run(main())
