from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.shared.infrastructure.database import get_db
from app.modules.knowledge.infrastructure.repo import AssetRepository
from app.modules.knowledge.application.rag import RAGService
from app.api.deps import get_vector_store_adapter
from app.shared.domain.ports.vector_store import VectorStoreAdapter

async def get_asset_repo(db: AsyncSession = Depends(get_db)) -> AssetRepository:
    return AssetRepository(db)

async def get_rag_service(
    db: AsyncSession = Depends(get_db),
    vector_store: VectorStoreAdapter = Depends(get_vector_store_adapter)
) -> RAGService:
    return RAGService(db, vector_store)
