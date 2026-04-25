import asyncio
import os
import sys
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
from app.shared.infrastructure.database import AsyncSessionLocal

async def main():
    async with AsyncSessionLocal() as session:
        res = await session.execute(text("SELECT interaction_mode::text, voice_provider::text FROM voice_meta_agents"))
        row = res.one()
        print(f"RAW DB VALUES: mode='{row[0]}', provider='{row[1]}'")

if __name__ == "__main__":
    asyncio.run(main())
