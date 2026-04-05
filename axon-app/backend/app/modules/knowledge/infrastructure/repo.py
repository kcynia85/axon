from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Optional, List, Any
from app.modules.knowledge.domain.models import Asset
from app.modules.knowledge.infrastructure.tables import AssetTable
from app.shared.infrastructure.vecs_client import get_vecs_client

# Functional-First Repository Layer

def map_to_domain(row: AssetTable) -> Asset:
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

async def create_asset(session: AsyncSession, asset: Asset, embedding: List[float] = None) -> Asset:
    db_asset = AssetTable(
        **asset.model_dump(exclude={"created_at", "updated_at", "metadata"}),
        metadata_=asset.metadata,
        description_embedding=embedding
    )
    session.add(db_asset)
    await session.commit()
    await session.refresh(db_asset)
    return map_to_domain(db_asset)

async def get_asset(session: AsyncSession, asset_id: UUID) -> Optional[Asset]:
    result = await session.execute(
        select(AssetTable).where(AssetTable.id == asset_id, AssetTable.is_deleted.is_(False))
    )
    db_asset = result.scalar_one_or_none()
    if db_asset:
        return map_to_domain(db_asset)
    return None

async def get_asset_by_slug(session: AsyncSession, slug: str) -> Optional[Asset]:
    result = await session.execute(
        select(AssetTable).where(AssetTable.slug == slug, AssetTable.is_deleted.is_(False))
    )
    db_asset = result.scalar_one_or_none()
    if db_asset:
        return map_to_domain(db_asset)
    return None

async def list_assets(
    session: AsyncSession, 
    limit: int = 100, 
    offset: int = 0, 
    asset_type: Optional[str] = None
) -> List[Asset]:
    query = select(AssetTable).where(AssetTable.is_deleted.is_(False)).limit(limit).offset(offset).order_by(AssetTable.created_at.desc())
    
    if asset_type:
        query = query.where(AssetTable.type == asset_type)

    result = await session.execute(query)
    return [map_to_domain(row) for row in result.scalars().all()]

async def update_asset(session: AsyncSession, asset_id: UUID, asset_update: dict) -> Optional[Asset]:
    valid_fields = {}
    for k, v in asset_update.items():
        if k == "metadata":
             valid_fields["metadata_"] = v
        elif hasattr(AssetTable, k) and k not in ['id', 'created_at', 'updated_at']:
             valid_fields[k] = v
    
    if not valid_fields:
        return await get_asset(session, asset_id)

    query = (
        update(AssetTable)
        .where(AssetTable.id == asset_id, AssetTable.is_deleted.is_(False))
        .values(**valid_fields)
        .execution_options(synchronize_session="fetch")
    )
    await session.execute(query)
    await session.commit()
    return await get_asset(session, asset_id)

async def delete_asset(session: AsyncSession, asset_id: UUID) -> bool:
    query = (
        update(AssetTable)
        .where(AssetTable.id == asset_id)
        .values(is_deleted=True)
        .execution_options(synchronize_session="fetch")
    )
    result = await session.execute(query)
    await session.commit()
    return result.rowcount > 0

async def search_assets_by_vector(session: AsyncSession, embedding: List[float], limit: int = 5) -> List[Asset]:
    stmt = (
        select(AssetTable)
        .where(AssetTable.is_deleted.is_(False))
        .order_by(AssetTable.description_embedding.cosine_distance(embedding))
        .limit(limit)
    )
    result = await session.execute(stmt)
    return [map_to_domain(row) for row in result.scalars().all()]

# --- Vector Store Functions ---

def get_knowledge_collection():
    client = get_vecs_client()
    return client.get_or_create_collection(name="knowledge_base", dimension=768)

def get_memories_collection():
    client = get_vecs_client()
    return client.get_or_create_collection(name="memories", dimension=768)

def search_vector_store(collection_name: str, query_vector: List[float], limit: int = 5, filters: dict = None) -> Any:
    client = get_vecs_client()
    collection = client.get_or_create_collection(name=collection_name, dimension=768)
    return collection.query(
        data=query_vector,
        limit=limit,
        filters=filters,
        include_value=True,
        include_metadata=True
    )
