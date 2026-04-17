import asyncio
import os
import sys
sys.path.append('.')

async def check():
    from app.shared.infrastructure.database import AsyncSessionLocal
    from sqlalchemy import select
    from app.modules.knowledge.infrastructure.tables import KnowledgeResourceTable
    
    async with AsyncSessionLocal() as session:
        stmt = select(KnowledgeResourceTable).where(KnowledgeResourceTable.resource_rag_indexing_status == 'Error').order_by(KnowledgeResourceTable.created_at.desc()).limit(5)
        res = await session.execute(stmt)
        for r in res.scalars():
            print(f"ID: {r.id}")
            print(f"Name: {r.resource_file_name}")
            print(f"Error: {r.resource_indexing_error}")
            print("-" * 20)

if __name__ == "__main__":
    asyncio.run(check())
