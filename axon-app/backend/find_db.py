import asyncio; from sqlalchemy import select; from app.shared.infrastructure.database import AsyncSessionLocal; from app.modules.settings.infrastructure.tables import VectorDatabaseTable;
async def find():
    async with AsyncSessionLocal() as s:
        res = await s.execute(select(VectorDatabaseTable).where(VectorDatabaseTable.vector_database_name == 'Supabase Test'))
        row = res.scalar_one_or_none()
        if row:
            print(f'FOUND: {row.id} | Host: {row.vector_database_host} | User: {row.vector_database_user} | URL: {row.vector_database_connection_url}')
        else:
            res = await s.execute(select(VectorDatabaseTable))
            rows = res.scalars().all()
            print('NOT FOUND "Supabase Test". Available databases:')
            for r in rows:
                print(f'- {r.vector_database_name} ({r.id})')
asyncio.run(find())
