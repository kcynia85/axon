import asyncio
import sys
import os
from uuid import uuid4
from datetime import datetime
from sqlalchemy import select

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.settings.infrastructure.tables import VectorDatabaseTable, EmbeddingModelTable
from app.modules.settings.domain.enums import VectorDBType, IndexMethod, ConnectionStatus

async def seed_settings():
    print("🌱 Seeding Vector Database and Embedding Model...")
    async with AsyncSessionLocal() as session:
        # 1. Create/Update Default Embedding Model (For Langchain)
        print("  - Configuring Embedding Model")
        stmt = select(EmbeddingModelTable).where(EmbeddingModelTable.model_id == "models/text-embedding-004")
        result = await session.execute(stmt)
        embedding_model = result.scalar_one_or_none()
        
        if not embedding_model:
            embedding_model = EmbeddingModelTable(
                id=uuid4(),
                model_provider_name="Google",
                model_id="models/text-embedding-004",
                model_vector_dimensions=768,
                model_max_context_tokens=2048,
                model_cost_per_1m_tokens=0.0,
                is_draft=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            session.add(embedding_model)
        
        # 2. Create/Update Supabase Postgres (pgvector) Vector Database
        print("  - Configuring Supabase Axon Store")
        stmt = select(VectorDatabaseTable).where(VectorDatabaseTable.vector_database_name == "Supabase Axon Store")
        result = await session.execute(stmt)
        vector_db = result.scalar_one_or_none()
        
        db_url = "postgresql://postgres.bluklvgvgqiumixkferm:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
        
        if not vector_db:
            vector_db = VectorDatabaseTable(
                id=uuid4(),
                vector_database_name="Supabase Axon Store",
                vector_database_type=VectorDBType.POSTGRES_PGVECTOR,
                vector_database_connection_url=db_url,
                vector_database_connection_string="vecs_default",
                vector_database_index_method=IndexMethod.HNSW,
                vector_database_connection_status=ConnectionStatus.DISCONNECTED,
                vector_database_collection_name="axon_knowledge_vectors",
                vector_database_embedding_model_reference=embedding_model.model_id,
                vector_database_total_vectors=0,
                vector_database_size=0,
                vector_database_expected_dimensions=768,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            session.add(vector_db)
        else:
            vector_db.vector_database_connection_url = db_url
            vector_db.vector_database_collection_name = "axon_knowledge_vectors"
            vector_db.vector_database_embedding_model_reference = embedding_model.model_id
        
        await session.commit()
        print("✅ Vector Database and Embedding Model configured successfully.")

if __name__ == "__main__":
    asyncio.run(seed_settings())
