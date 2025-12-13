from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List
from backend.app.modules.knowledge.domain.models import Asset
from backend.app.modules.knowledge.infrastructure.tables import AssetTable
from backend.app.shared.infrastructure.vecs_client import get_vecs_client

class AssetRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, asset: Asset, embedding: List[float] = None) -> Asset:
        db_asset = AssetTable(
            **asset.model_dump(exclude={"created_at", "updated_at"}),
            description_embedding=embedding
        )
        self.session.add(db_asset)
        await self.session.commit()
        await self.session.refresh(db_asset)
        return Asset.model_validate(db_asset, from_attributes=True)

    async def get_by_slug(self, slug: str) -> Optional[Asset]:
        result = await self.session.execute(select(AssetTable).where(AssetTable.slug == slug))
        db_asset = result.scalar_one_or_none()
        if db_asset:
            return Asset.model_validate(db_asset, from_attributes=True)
        return None

class KnowledgeVectorStore:
    def __init__(self):
        self.client = get_vecs_client()
        # Initialize collections if they don't exist
        self.knowledge = self.client.get_or_create_collection(name="knowledge_base", dimension=768)
        self.memories = self.client.get_or_create_collection(name="memories", dimension=768)

    def search(self, query_vector: List[float], limit: int = 5, filters: dict = None):
        return self.knowledge.query(
            data=query_vector,
            limit=limit,
            filters=filters,
            include_value=True,
            include_metadata=True
        )
