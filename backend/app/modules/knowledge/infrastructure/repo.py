from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Optional, List
from backend.app.modules.knowledge.domain.models import Asset
from backend.app.modules.knowledge.infrastructure.tables import AssetTable
from backend.app.shared.infrastructure.vecs_client import get_vecs_client

class AssetRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    def _to_domain(self, row: AssetTable) -> Asset:
        return Asset(
            id=row.id,
            slug=row.slug,
            title=row.title,
            content=row.content,
            type=row.type,
            domain=row.domain,
            metadata=row.metadata_,
            is_deleted=row.is_deleted,
            created_at=row.created_at,
            updated_at=row.updated_at
        )

    async def create(self, asset: Asset, embedding: List[float] = None) -> Asset:
        db_asset = AssetTable(
            **asset.model_dump(exclude={"created_at", "updated_at", "metadata"}),
            metadata_=asset.metadata,
            description_embedding=embedding
        )
        self.session.add(db_asset)
        await self.session.commit()
        await self.session.refresh(db_asset)
        return self._to_domain(db_asset)

    async def get(self, asset_id: UUID) -> Optional[Asset]:
        result = await self.session.execute(
            select(AssetTable).where(AssetTable.id == asset_id, AssetTable.is_deleted.is_(False))
        )
        db_asset = result.scalar_one_or_none()
        if db_asset:
            return self._to_domain(db_asset)
        return None

    async def get_by_slug(self, slug: str) -> Optional[Asset]:
        result = await self.session.execute(
            select(AssetTable).where(AssetTable.slug == slug, AssetTable.is_deleted.is_(False))
        )
        db_asset = result.scalar_one_or_none()
        if db_asset:
            return self._to_domain(db_asset)
        return None

    async def list_assets(self, limit: int = 100, offset: int = 0, asset_type: Optional[str] = None) -> List[Asset]:
        query = select(AssetTable).where(AssetTable.is_deleted.is_(False)).limit(limit).offset(offset).order_by(AssetTable.created_at.desc())
        
        if asset_type:
            query = query.where(AssetTable.type == asset_type)

        result = await self.session.execute(query)
        return [self._to_domain(row) for row in result.scalars().all()]

    async def update(self, asset_id: UUID, asset_update: dict) -> Optional[Asset]:
        # Filter out fields that shouldn't be updated directly or are not in the model
        valid_fields = {}
        for k, v in asset_update.items():
            if k == "metadata":
                 valid_fields["metadata_"] = v
            elif hasattr(AssetTable, k) and k not in ['id', 'created_at', 'updated_at']:
                 valid_fields[k] = v
        
        if not valid_fields:
            return await self.get(asset_id)

        query = (
            update(AssetTable)
            .where(AssetTable.id == asset_id, AssetTable.is_deleted.is_(False))
            .values(**valid_fields)
            .execution_options(synchronize_session="fetch")
        )
        await self.session.execute(query)
        await self.session.commit()
        return await self.get(asset_id)

    async def delete(self, asset_id: UUID) -> bool:
        # Soft delete
        query = (
            update(AssetTable)
            .where(AssetTable.id == asset_id)
            .values(is_deleted=True)
            .execution_options(synchronize_session="fetch")
        )
        result = await self.session.execute(query)
        await self.session.commit()
        return result.rowcount > 0

    async def search_by_vector(self, embedding: List[float], limit: int = 5) -> List[Asset]:
        """
        Search for assets by semantic similarity using pgvector.
        """
        stmt = (
            select(AssetTable)
            .where(AssetTable.is_deleted.is_(False))
            .order_by(AssetTable.description_embedding.cosine_distance(embedding))
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return [self._to_domain(row) for row in result.scalars().all()]

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
