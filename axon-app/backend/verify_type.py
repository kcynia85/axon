import asyncio
import os
import sys
from sqlalchemy import text

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
from app.shared.infrastructure.database import AsyncSessionLocal

async def main():
    async with AsyncSessionLocal() as session:
        res = await session.execute(text("SELECT typname FROM pg_type WHERE typname = 'voiceinteractionmode'"))
        row = res.scalar()
        if row:
            print(f"TYPE EXISTS: {row}")
            # Also check values
            res = await session.execute(text("SELECT enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'voiceinteractionmode'"))
            labels = [r[0] for r in res.all()]
            print(f"VALUES: {labels}")
        else:
            print("TYPE DOES NOT EXIST")

if __name__ == "__main__":
    asyncio.run(main())
