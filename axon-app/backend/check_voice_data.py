import asyncio
import os
import sys
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
from app.shared.infrastructure.database import AsyncSessionLocal

async def main():
    async with AsyncSessionLocal() as session:
        res = await session.execute(text("SELECT interaction_mode, voice_provider FROM voice_meta_agents"))
        rows = res.all()
        print("Current voice data in DB:")
        for r in rows:
            print(f" - interaction_mode: '{r[0]}', voice_provider: '{r[1]}'")

if __name__ == "__main__":
    asyncio.run(main())
