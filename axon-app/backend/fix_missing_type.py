import asyncio
import os
import sys
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
from app.shared.infrastructure.database import AsyncSessionLocal

async def main():
    async with AsyncSessionLocal() as session:
        # Create the missing type manually
        try:
            print("Creating voiceinteractionmode type...")
            await session.execute(text("CREATE TYPE voiceinteractionmode AS ENUM ('STT_ONLY', 'LIVE_CONVERSATION')"))
            await session.commit()
            print("SUCCESS")
        except Exception as e:
            print(f"FAILED: {e}")
            await session.rollback()

if __name__ == "__main__":
    asyncio.run(main())
