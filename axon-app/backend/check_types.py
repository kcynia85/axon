import asyncio
import os
import sys
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
from app.shared.infrastructure.database import AsyncSessionLocal

async def main():
    async with AsyncSessionLocal() as session:
        # Check available types in postgres
        res = await session.execute(text("SELECT n.nspname as schema, t.typname as type FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid WHERE n.nspname = 'public'"))
        types = res.all()
        print("Available public types:")
        for t in types:
            print(f" - {t.type}")

if __name__ == "__main__":
    asyncio.run(main())
