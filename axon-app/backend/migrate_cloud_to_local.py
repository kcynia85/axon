import asyncio
from sqlalchemy import create_engine, select, text, MetaData
from sqlalchemy.orm import sessionmaker
from app.shared.infrastructure.database import AsyncSessionLocal
from app.config import settings
import pgvector.sqlalchemy # Register vector type

# Cloud DB URL (Source)
CLOUD_URL = "postgresql://postgres.tkaqidapngcrlldnkuum:u0husqwguoy1Gx7U@aws-1-eu-north-1.pooler.supabase.com:5432/postgres"
# Local DB URL (Target)
LOCAL_URL = settings.DATABASE_URL.replace('postgresql+asyncpg://', 'postgresql://')

async def migrate_data():
    print(f"Migrating data from Cloud to Local...")
    
    # Sync engines for data copying
    src_engine = create_engine(CLOUD_URL)
    tgt_engine = create_engine(LOCAL_URL)
    
    src_metadata = MetaData()
    src_metadata.reflect(bind=src_engine)
    
    with tgt_engine.connect() as tgt_conn:
        print("Disabling triggers and FK checks on target...")
        tgt_conn.execute(text("SET session_replication_role = 'replica';"))
        
        # We must clear tables on target before copying if they are not empty
        # but here we started from fresh schema, so it's fine.

        for table in src_metadata.sorted_tables:
            if table.name.startswith('alembic_') or table.name.startswith('vecs.') or table.name.startswith('audit.'):
                continue
                
            print(f"Copying table: {table.name}...")
            with src_engine.connect() as src_conn:
                rows = src_conn.execute(table.select()).all()
                if rows:
                    print(f" - Found {len(rows)} rows.")
                    data = [dict(row._mapping) for row in rows]
                    try:
                        tgt_conn.execute(table.insert(), data)
                    except Exception as e:
                        print(f" ❌ Failed to insert into {table.name}: {e}")
                else:
                    print(" - Empty table.")
        
        tgt_conn.execute(text("SET session_replication_role = 'origin';"))
        tgt_conn.commit()
    
    print("\n✅ Data migration completed.")

if __name__ == "__main__":
    asyncio.run(migrate_data())
