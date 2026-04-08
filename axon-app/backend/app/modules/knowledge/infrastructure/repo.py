from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import Optional, List, Any
from app.modules.knowledge.domain.models import Asset, KnowledgeHub, KnowledgeSource
from app.modules.knowledge.infrastructure.tables import AssetTable, KnowledgeHubTable, KnowledgeSourceTable
from app.shared.infrastructure.vecs_client import get_vecs_client

# --- Functional-First Repository Layer ---

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

def map_hub_to_domain(row: KnowledgeHubTable) -> KnowledgeHub:
    return KnowledgeHub(
        id=row.id,
        hub_name=row.hub_name,
        hub_description=row.hub_description,
        workspace_domain=row.workspace_domain,
        hub_keywords=row.hub_keywords,
        created_at=row.created_at,
        updated_at=row.updated_at
    )

def map_source_to_domain(row: KnowledgeSourceTable) -> KnowledgeSource:
    return KnowledgeSource(
        id=row.id,
        source_file_name=row.source_file_name,
        source_file_format=row.source_file_format,
        source_file_size_bytes=row.source_file_size_bytes,
        source_metadata=row.source_metadata,
        source_rag_indexing_status=row.source_rag_indexing_status,
        source_indexed_at=row.source_indexed_at,
        source_chunk_count=row.source_chunk_count,
        source_chunking_strategy_ref=row.source_chunking_strategy_ref,
        source_indexing_error=row.source_indexing_error,
        knowledge_hub_id=row.knowledge_hub_id,
        vector_database_id=row.vector_database_id,
        created_at=row.created_at,
        updated_at=row.updated_at
    )

async def list_knowledge_hubs(session: AsyncSession) -> List[KnowledgeHub]:
    result = await session.execute(select(KnowledgeHubTable).order_by(KnowledgeHubTable.created_at.desc()))
    return [map_hub_to_domain(row) for row in result.scalars().all()]

async def create_knowledge_hub(session: AsyncSession, hub: KnowledgeHub) -> KnowledgeHub:
    db_hub = KnowledgeHubTable(
        **hub.model_dump(exclude={"created_at", "updated_at"})
    )
    session.add(db_hub)
    await session.commit()
    await session.refresh(db_hub)
    return map_hub_to_domain(db_hub)

async def list_knowledge_sources(session: AsyncSession, limit: int = 100, offset: int = 0) -> List[KnowledgeSource]:
    query = select(KnowledgeSourceTable).limit(limit).offset(offset).order_by(KnowledgeSourceTable.created_at.desc())
    result = await session.execute(query)
    return [map_source_to_domain(row) for row in result.scalars().all()]

async def create_knowledge_source(session: AsyncSession, source: KnowledgeSource) -> KnowledgeSource:
    db_source = KnowledgeSourceTable(
        **source.model_dump(exclude={"created_at", "updated_at"})
    )
    session.add(db_source)
    await session.commit()
    await session.refresh(db_source)
    return map_source_to_domain(db_source)

async def update_knowledge_source_status(
    session: AsyncSession, 
    source_id: UUID, 
    status: str, 
    chunk_count: int = 0, 
    error: str = None
) -> Optional[KnowledgeSource]:
    query = (
        update(KnowledgeSourceTable)
        .where(KnowledgeSourceTable.id == source_id)
        .values(
            source_rag_indexing_status=status,
            source_chunk_count=chunk_count,
            source_indexing_error=error
        )
        .execution_options(synchronize_session="fetch")
    )
    await session.execute(query)
    await session.commit()
    
    result = await session.execute(select(KnowledgeSourceTable).where(KnowledgeSourceTable.id == source_id))
    db_source = result.scalar_one_or_none()
    return map_source_to_domain(db_source) if db_source else None

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

# --- Class-Based Wrapper (for backward compatibility) ---

class AssetRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list(self, limit: int = 100, offset: int = 0, asset_type: Optional[str] = None) -> List[Asset]:
        return await list_assets(self.session, limit, offset, asset_type)

    async def get(self, id: UUID) -> Optional[Asset]:
        return await get_asset(self.session, id)

    async def get_by_slug(self, slug: str) -> Optional[Asset]:
        return await get_asset_by_slug(self.session, slug)

    async def create(self, asset: Asset, embedding: List[float] = None) -> Asset:
        return await create_asset(self.session, asset, embedding)

    async def update(self, id: UUID, data: dict) -> Optional[Asset]:
        return await update_asset(self.session, id, data)

    async def delete(self, id: UUID) -> bool:
        return await delete_asset(self.session, id)

    async def search_by_vector(self, embedding: List[float], limit: int = 5) -> List[Asset]:
        return await search_assets_by_vector(self.session, embedding, limit)

# --- Vector Store Functions ---

def get_knowledge_collection(connection_url: str = None):
    client = get_vecs_client(connection_url)
    return client.get_or_create_collection(name="knowledge_base", dimension=768)

def get_memories_collection(connection_url: str = None):
    client = get_vecs_client(connection_url)
    return client.get_or_create_collection(name="memories", dimension=768)

def search_vector_store(collection_name: str, query_vector: List[float], limit: int = 5, filters: dict = None, connection_url: str = None) -> Any:
    client = get_vecs_client(connection_url)
    collection = client.get_or_create_collection(name=collection_name, dimension=768)
    return collection.query(
        data=query_vector,
        limit=limit,
        filters=filters,
        include_value=True,
        include_metadata=True
    )
