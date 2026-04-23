import asyncio
from app.shared.infrastructure.database import AsyncSessionLocal
from sqlalchemy import text

async def check():
    async with AsyncSessionLocal() as s:
        r = await s.execute(text('SELECT * FROM voice_meta_agents'))
        rows = r.fetchall()
        print(f"Voice Meta Agents ({len(rows)}):")
        for row in rows:
            print(f" - {row}")

if __name__ == "__main__":
    asyncio.run(check())
