import asyncio
import sys
import os
from sqlalchemy import select

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.settings.infrastructure.tables import VectorDatabaseTable

async def check_db():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(VectorDatabaseTable))
        dbs = result.scalars().all()
        for db in dbs:
            print(f"ID: {db.id} | Name: {db.vector_database_name} | Status: {db.vector_database_connection_status}")

if __name__ == "__main__":
    asyncio.run(check_db())
