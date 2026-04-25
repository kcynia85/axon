import asyncio
import os
import sys
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
from app.shared.infrastructure.database import AsyncSessionLocal

async def main():
    async with AsyncSessionLocal() as session:
        res = await session.execute(text("SELECT version_num FROM alembic_version"))
        version = res.scalar()
        print(f"Current migration version: {version}")

if __name__ == "__main__":
    asyncio.run(main())
