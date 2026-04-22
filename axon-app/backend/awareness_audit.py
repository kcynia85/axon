import asyncio
from app.shared.infrastructure.database import AsyncSessionLocal
from sqlalchemy import text

async def audit_awareness():
    print("--- 🔍 SYSTEM AWARENESS (RAG#2) COVERAGE AUDIT ---")
    
    entities = [
        {"type": "agent", "table": "agent_configs", "embedding_type": "agent"},
        {"type": "crew", "table": "crews", "embedding_type": "crew"},
        {"type": "template", "table": "templates", "embedding_type": "template"},
        {"type": "project", "table": "projects", "embedding_type": "project"},
        {"type": "space", "table": "spaces", "embedding_type": "space"},
        {"type": "archetype", "table": "prompt_archetypes", "embedding_type": "prompt_archetype"},
        {"type": "tool", "table": "internal_tools", "embedding_type": "tool"},
    ]

    async with AsyncSessionLocal() as session:
        for ent in entities:
            # Count in source table
            try:
                res_source = await session.execute(text(f"SELECT count(*) FROM {ent['table']} WHERE deleted_at IS NULL"))
                source_count = res_source.scalar()
            except Exception:
                # Fallback for tables without deleted_at
                res_source = await session.execute(text(f"SELECT count(*) FROM {ent['table']}"))
                source_count = res_source.scalar()

            # Count in embeddings table
            res_emb = await session.execute(text(f"SELECT count(*) FROM system_embeddings WHERE entity_type = :t"), {"t": ent['embedding_type']})
            emb_count = res_emb.scalar()

            status = "✅ OK" if source_count == emb_count else "⚠️ MISMATCH"
            if source_count > 0 and emb_count == 0: status = "❌ MISSING"
            
            print(f"Type: {ent['type']:10} | Source: {source_count:3} | Indexed: {emb_count:3} | Status: {status}")

        # Check latest synchronization
        res_latest = await session.execute(text("SELECT created_at FROM system_embeddings ORDER BY created_at DESC LIMIT 1"))
        latest = res_latest.scalar()
        print(f"\nLast indexing activity: {latest}")

if __name__ == "__main__":
    asyncio.run(audit_awareness())
