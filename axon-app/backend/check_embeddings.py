import asyncio
import os
import sys
# Path setup BEFORE imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy import select, func, text
from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.knowledge.infrastructure.tables import AssetTable

async def check_embeddings():
    print("🔍 Checking Asset Embeddings Status...")
    
    async with AsyncSessionLocal() as session:
        # 1. Total Assets
        result = await session.execute(select(func.count(AssetTable.id)))
        total_assets = result.scalar()
        print(f"📊 Total Assets in DB: {total_assets}")

        # 2. Check for Mock/Zero Embeddings
        # Since pgvector doesn't easily allow summing the vector in standard SQL without casting
        # We'll fetch all and check in python for simplicity (assuming < 1000 assets)
        result = await session.execute(select(AssetTable.id, AssetTable.slug, AssetTable.description_embedding))
        assets = result.all()
        
        failed_count = 0
        failed_slugs = []
        
        for row in assets:
            emb = row.description_embedding
            # Check if it's the mock zero vector or None
            if emb is None or all(x == 0.0 for x in emb):
                failed_count += 1
                failed_slugs.append(row.slug)

        print(f"✅ Successfully Embedded: {total_assets - failed_count}")
        print(f"⚠️  Failed/Mock Embeddings: {failed_count}")
        
        if failed_slugs:
            print("\n📝 Assets with Zero Embeddings (Need Re-ingestion):")
            for slug in failed_slugs[:10]: # Limit output
                print(f"   - {slug}")
            if len(failed_slugs) > 10:
                print(f"   ... and {len(failed_slugs) - 10} more.")

if __name__ == "__main__":
    asyncio.run(check_embeddings())
