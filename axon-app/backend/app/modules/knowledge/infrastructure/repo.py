from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, text
from typing import Optional, List, Any, Dict
import logging
from app.modules.knowledge.domain.models import Asset, KnowledgeHub, KnowledgeResource
from app.modules.knowledge.infrastructure.tables import AssetTable, KnowledgeHubTable, KnowledgeResourceTable, TextChunkTable
from app.shared.utils.time import now_utc

logger = logging.getLogger(__name__)

# --- Functional-First Repository Layer ---

async def list_unique_resource_ids_from_vector_db(session: AsyncSession, table_name: str = "knowledge_base") -> List[str]:
    """
    Find all unique resourceId values present in the vector database metadata.
    Helps discover which resources are actually vectorized.
    """
    if not table_name or not (table_name.isalnum() or "_" in table_name):
        table_name = "knowledge_base"
        
    sql = f"SELECT DISTINCT(metadata->>'sourceId') FROM vecs.\"{table_name}\" WHERE metadata ? 'sourceId';"
    try:
        result = await session.execute(text(sql))
        return [row[0] for row in result.fetchall() if row[0]]
    except Exception as e:
        logger.error(f"Failed to list resource IDs from vector db: {e}")
        return []

def map_resource_to_domain(row: KnowledgeResourceTable) -> KnowledgeResource:
    # Normalize status to Title Case for Pydantic Enum
    status_raw = str(row.resource_rag_indexing_status)
    status_val = status_raw.split('.')[-1].lower()
    
    status_map = {
        "pending": "Pending",
        "indexing": "Indexing",
        "ready": "Ready",
        "error": "Error"
    }
    normalized_status = status_map.get(status_val, "Pending")

    return KnowledgeResource(
        id=row.id,
        resource_file_name=row.resource_file_name,
        resource_file_format=row.resource_file_format,
        resource_file_size_bytes=row.resource_file_size_bytes,
        resource_metadata=row.resource_metadata,
        resource_rag_indexing_status=normalized_status,
        resource_indexed_at=row.resource_indexed_at,
        resource_chunk_count=row.resource_chunk_count,
        resource_chunking_strategy_ref=row.resource_chunking_strategy_ref,
        resource_indexing_error=row.resource_indexing_error,
        knowledge_hub_id=row.knowledge_hub_id,
        vector_database_id=row.vector_database_id,
        vector_database_name=getattr(row, 'vector_database_name', None),
        vector_database_dimensions=getattr(row, 'vector_database_dimensions', None),
        knowledge_hub_name=getattr(row, 'knowledge_hub_name', None),
        deleted_at=row.deleted_at,
        created_at=row.created_at,
        updated_at=row.updated_at
    )

async def list_knowledge_resources(
    session: AsyncSession, 
    limit: int = 100, 
    offset: int = 0
) -> List[KnowledgeResource]:
    """
    Simplified high-performance query from local SQL only.
    Bypasses expensive multi-provider discovery for general list view.
    """
    from app.modules.settings.infrastructure.tables import VectorDatabaseTable
    from app.modules.knowledge.infrastructure.tables import KnowledgeHubTable
    
    stmt = (
        select(
            KnowledgeResourceTable,
            VectorDatabaseTable.vector_database_name,
            VectorDatabaseTable.vector_database_expected_dimensions,
            KnowledgeHubTable.hub_name
        )
        .outerjoin(VectorDatabaseTable, KnowledgeResourceTable.vector_database_id == VectorDatabaseTable.id)
        .outerjoin(KnowledgeHubTable, KnowledgeResourceTable.knowledge_hub_id == KnowledgeHubTable.id)
        .where(KnowledgeResourceTable.deleted_at.is_(None))
        .order_by(KnowledgeResourceTable.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    
    try:
        result = await session.execute(stmt)
        resources = []
        for row in result.all():
            resource_obj, vdb_name, vdb_dim, hub_name = row
            dr = map_resource_to_domain(resource_obj)
            dr.vector_database_name = vdb_name
            dr.vector_database_dimensions = vdb_dim
            dr.knowledge_hub_name = hub_name
            resources.append(dr)
        return resources
    except Exception as e:
        logger.error(f"Failed to list knowledge resources: {e}")
        return []

async def get_knowledge_resource(session: AsyncSession, resource_id: UUID) -> Optional[KnowledgeResource]:
    from app.modules.settings.infrastructure.tables import VectorDatabaseTable
    from app.modules.knowledge.infrastructure.tables import KnowledgeHubTable

    stmt = (
        select(
            KnowledgeResourceTable,
            VectorDatabaseTable.vector_database_name,
            VectorDatabaseTable.vector_database_expected_dimensions,
            KnowledgeHubTable.hub_name
        )
        .outerjoin(VectorDatabaseTable, KnowledgeResourceTable.vector_database_id == VectorDatabaseTable.id)
        .outerjoin(KnowledgeHubTable, KnowledgeResourceTable.knowledge_hub_id == KnowledgeHubTable.id)
        .where(KnowledgeResourceTable.id == resource_id, KnowledgeResourceTable.deleted_at.is_(None))
    )

    try:
        result = await session.execute(stmt)
        row = result.first()
        if row:
            resource_obj, vdb_name, vdb_dim, hub_name = row
            domain_resource = map_resource_to_domain(resource_obj)
            domain_resource.vector_database_name = vdb_name
            domain_resource.vector_database_dimensions = vdb_dim
            domain_resource.knowledge_hub_name = hub_name
            return domain_resource
        return None
    except Exception as e:
        logger.error(f"Failed to get knowledge resource {resource_id}: {e}")
        return None

async def get_knowledge_resource_chunks(session: AsyncSession, resource_id: UUID):
    stmt = select(TextChunkTable).where(TextChunkTable.knowledge_resource_id == resource_id).order_by(TextChunkTable.chunk_index)
    result = await session.execute(stmt)
    return result.scalars().all()
async def create_knowledge_resource(session: AsyncSession, resource: KnowledgeResource) -> KnowledgeResource:
    db_resource = KnowledgeResourceTable(
        **resource.model_dump(exclude={"created_at", "updated_at", "vector_database_name", "vector_database_dimensions", "knowledge_hub_name"})
    )
    session.add(db_resource)
    await session.commit()
    await session.refresh(db_resource)
    return map_resource_to_domain(db_resource)

async def update_knowledge_resource_status(
    session: AsyncSession, 
    resource_id: UUID, 
    status: str, 
    chunk_count: int = 0, 
    error: str = None
) -> Optional[KnowledgeResource]:
    
    values = {
        "resource_rag_indexing_status": status,
        "resource_chunk_count": chunk_count,
        "resource_indexing_error": error,
        "updated_at": now_utc()
    }
    
    # Normalize comparison status
    status_lower = status.lower()
    if status_lower == "ready":
        values["resource_indexed_at"] = now_utc()

    query = (
        update(KnowledgeResourceTable)
        .where(KnowledgeResourceTable.id == resource_id)
        .values(**values)
        .execution_options(synchronize_session="fetch")
    )
    await session.execute(query)
    await session.commit()
    
    result = await session.execute(select(KnowledgeResourceTable).where(KnowledgeResourceTable.id == resource_id))
    db_resource = result.scalar_one_or_none()
    return map_resource_to_domain(db_resource) if db_resource else None

async def delete_knowledge_resource(session: AsyncSession, resource_id: UUID, table_name: str = "knowledge_base") -> bool:
    """
    Perform a soft delete by updating the metadata of all chunks in the vector store.
    Supports both Postgres (pgvector) and ChromaDB.
    """
    resource = await session.get(KnowledgeResourceTable, resource_id)
    if not resource:
        logger.error(f"Resource {resource_id} not found for deletion")
        return False

    timestamp = now_utc().isoformat()
    success = False

    # 2. Vector DB Deletion
    if resource.vector_database_id:
        from app.modules.settings.infrastructure.tables import VectorDatabaseTable
        vdb = await session.get(VectorDatabaseTable, resource.vector_database_id)
        if vdb:
            db_type = str(vdb.vector_database_type.value if hasattr(vdb.vector_database_type, 'value') else vdb.vector_database_type).upper()
            
            # ChromaDB Branch
            if "CHROMA" in db_type:
                try:
                    import chromadb
                    from urllib.parse import urlparse
                    config = vdb.vector_database_config or {}
                    url = vdb.vector_database_connection_url or (f"http://{config.get('chroma_host')}:{config.get('chroma_port')}" if config.get('chroma_host') else None)
                    if url:
                        parsed_url = urlparse(url)
                        if parsed_url.scheme and "http" in parsed_url.scheme:
                            client = chromadb.HttpClient(host=parsed_url.hostname or "localhost", port=parsed_url.port or 8000)
                        else:
                            client = chromadb.PersistentClient(path=url)
                        collection = client.get_collection(name=vdb.vector_database_collection_name or "knowledge_base")
                        collection.delete(where={"sourceId": str(resource_id)})
                        success = True
                except Exception as e: logger.error(f"Chroma delete error: {e}")
            
            # Qdrant Branch
            elif "QDRANT" in db_type:
                try:
                    from qdrant_client import QdrantClient
                    from qdrant_client.models import Filter, FieldCondition, MatchValue
                    config = vdb.vector_database_config or {}
                    url = vdb.vector_database_connection_url or config.get("qdrant_url") or "http://localhost:6333"
                    client = QdrantClient(url=url)
                    client.delete(collection_name=vdb.vector_database_collection_name or "knowledge_base", 
                                  points_selector=Filter(must=[FieldCondition(key="sourceId", match=MatchValue(value=str(resource_id)))]))
                    success = True
                except Exception as e: logger.error(f"Qdrant delete error: {e}")

            # Postgres / vecs Branch
            else:
                sql = text(f"""
                    UPDATE vecs."{table_name}"
                    SET metadata = metadata || jsonb_build_object('deleted_at', cast(:timestamp as text))
                    WHERE (metadata->>'sourceId')::text = :resource_id;
                """)
                try:
                    await session.execute(sql, {"resource_id": str(resource_id), "timestamp": timestamp})
                    success = True
                except Exception as e:
                    await session.rollback()
                    logger.error(f"Postgres delete error: {e}")

    # 3. SQL Table Soft Delete
    try:
        resource.deleted_at = now_utc()
        await session.commit()
        return True
    except Exception as e:
        await session.rollback()
        logger.error(f"Failed to update SQL table for soft delete: {e}")
        return False

# --- Common Mappings & Utils ---

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

async def list_knowledge_hubs(session: AsyncSession) -> List[KnowledgeHub]:
    result = await session.execute(select(KnowledgeHubTable).order_by(KnowledgeHubTable.created_at.desc()))
    return [map_hub_to_domain(row) for row in result.scalars().all()]

# --- Asset Management (Simpler Entities) ---

def map_to_domain(row: AssetTable) -> Asset:
    return Asset(id=row.id, slug=row.slug, title=row.title, content=row.content, type=row.type, domain=row.domain, metadata=row.metadata_, deleted_at=row.deleted_at, created_at=row.created_at, updated_at=row.updated_at)

async def list_assets(session: AsyncSession, limit: int = 100, offset: int = 0, asset_type: Optional[str] = None) -> List[Asset]:
    query = select(AssetTable).where(AssetTable.deleted_at.is_(None)).limit(limit).offset(offset).order_by(AssetTable.created_at.desc())
    if asset_type: query = query.where(AssetTable.type == asset_type)
    result = await session.execute(query)
    return [map_to_domain(row) for row in result.scalars().all()]

async def get_asset(session: AsyncSession, asset_id: UUID) -> Optional[Asset]:
    result = await session.execute(select(AssetTable).where(AssetTable.id == asset_id, AssetTable.deleted_at.is_(None)))
    db_asset = result.scalar_one_or_none()
    return map_to_domain(db_asset) if db_asset else None

async def create_asset(session: AsyncSession, asset: Asset, embedding: List[float] = None) -> Asset:
    db_asset = AssetTable(**asset.model_dump(exclude={"created_at", "updated_at", "metadata"}), metadata_=asset.metadata, description_embedding=embedding)
    session.add(db_asset)
    await session.commit()
    await session.refresh(db_asset)
    return map_to_domain(db_asset)

# --- Live Discovery (Standalone Utility) ---

async def discover_resources_from_all_databases(session: AsyncSession) -> List[dict]:
    """
    Discovery Service: Standalone utility to scan vector stores.
    """
    from app.modules.settings.infrastructure.tables import VectorDatabaseTable
    from sqlalchemy.ext.asyncio import create_async_engine
    from sqlalchemy.orm import sessionmaker
    import chromadb
    from urllib.parse import urlparse
    from qdrant_client import QdrantClient

    stmt = select(VectorDatabaseTable)
    result = await session.execute(stmt)
    vdbs = result.scalars().all()
    discovered_resources = {}

    for vdb in vdbs:
        db_type = str(vdb.vector_database_type.value if hasattr(vdb.vector_database_type, 'value') else vdb.vector_database_type).upper()
        collection_name = vdb.vector_database_collection_name or "axon_knowledge_vectors"
        
        try:
            if "CHROMA" in db_type:
                config = vdb.vector_database_config or {}
                url = vdb.vector_database_connection_url or (f"http://{config.get('chroma_host')}:{config.get('chroma_port')}" if config.get('chroma_host') else None)
                if url:
                    parsed_url = urlparse(url)
                    client = chromadb.HttpClient(host=parsed_url.hostname or "localhost", port=parsed_url.port or 8000) if parsed_url.scheme and "http" in parsed_url.scheme else chromadb.PersistentClient(path=url)
                    col = client.get_collection(name=collection_name)
                    data = col.get(include=['metadatas'])
                    for meta in (data.get('metadatas') or []):
                        rid, fname = meta.get('sourceId'), meta.get('file_name')
                        if rid and fname and rid not in discovered_resources:
                            discovered_resources[rid] = {"id": str(rid), "resource_file_name": fname, "resource_rag_indexing_status": "Ready", "vector_database_name": vdb.vector_database_name, "is_discovered": True}
            
            elif "QDRANT" in db_type:
                config = vdb.vector_database_config or {}
                url = vdb.vector_database_connection_url or config.get("qdrant_url") or "http://localhost:6333"
                client = QdrantClient(url=url)
                if client.collection_exists(collection_name):
                    points, _ = client.scroll(collection_name=collection_name, limit=1000, with_payload=True)
                    for p in points:
                        rid, fname = p.payload.get('sourceId'), p.payload.get('file_name')
                        if rid and fname and rid not in discovered_resources:
                            discovered_resources[rid] = {"id": str(rid), "resource_file_name": fname, "resource_rag_indexing_status": "Ready", "vector_database_name": vdb.vector_database_name, "is_discovered": True}

            elif "POSTGRES" in db_type or "SUPABASE" in db_type:
                ext_engine = create_async_engine(vdb.vector_database_connection_url)
                async with sessionmaker(ext_engine, class_=AsyncSession)() as ext_session:
                    res = await ext_session.execute(text(f"SELECT DISTINCT(metadata->>'sourceId'), metadata->>'file_name' FROM vecs.\"{collection_name}\" WHERE metadata ? 'sourceId' AND metadata ? 'file_name'"))
                    for row in res.fetchall():
                        rid, fname = row
                        if rid and fname and rid not in discovered_resources:
                            discovered_resources[rid] = {"id": str(rid), "resource_file_name": fname, "resource_rag_indexing_status": "Ready", "vector_database_name": vdb.vector_database_name, "is_discovered": True}
                await ext_engine.dispose()
        except Exception as e: logger.debug(f"Discovery skipped for {vdb.vector_database_name}: {e}")

    return list(discovered_resources.values())

async def get_asset_by_slug(session: AsyncSession, slug: str) -> Optional[Asset]:
    result = await session.execute(select(AssetTable).where(AssetTable.slug == slug, AssetTable.deleted_at.is_(None)))
    db_asset = result.scalar_one_or_none()
    return map_to_domain(db_asset) if db_asset else None

async def update_asset(session: AsyncSession, asset_id: UUID, data: dict) -> Optional[Asset]:
    data['updated_at'] = now_utc()
    stmt = update(AssetTable).where(AssetTable.id == asset_id, AssetTable.deleted_at.is_(None)).values(**data)
    await session.execute(stmt)
    await session.commit()
    return await get_asset(session, asset_id)

async def search_knowledge_hybrid(
    session: AsyncSession, 
    query: str, 
    query_vector: List[float],
    table_name: str = "knowledge_base",
    hub_id: str = None, 
    limit: int = 20
) -> List[Dict[str, Any]]:
    """
    Hybrid Search implementation using Reciprocal Rank Fusion (RRF).
    Combines Semantic Search (Vector) and Keyword Search (Full Text).
    """
    vector_str = "[" + ",".join(map(str, query_vector)) + "]"
    
    # Hub filter logic
    hub_filter = ""
    if hub_id:
        hub_filter = f"AND metadata->'hubIds' ? '{hub_id}'"

    sql = text(f"""
        WITH semantic_search AS (
            SELECT id, metadata, 1 - (vec <=> CAST(:query_embedding AS vector)) as score,
                   ROW_NUMBER() OVER (ORDER BY vec <=> CAST(:query_embedding AS vector)) as rank
            FROM vecs."{table_name}"
            WHERE (metadata->>'deleted_at') IS NULL
            {hub_filter}
            ORDER BY vec <=> CAST(:query_embedding AS vector)
            LIMIT :limit * 2
        ),
        keyword_search AS (
            SELECT id, metadata, ts_rank_cd(to_tsvector('english', metadata->>'text'), plainto_tsquery('english', :query)) as score,
                   ROW_NUMBER() OVER (ORDER BY ts_rank_cd(to_tsvector('english', metadata->>'text'), plainto_tsquery('english', :query)) DESC) as rank
            FROM vecs."{table_name}"
            WHERE (metadata->>'deleted_at') IS NULL
            AND to_tsvector('english', metadata->>'text') @@ plainto_tsquery('english', :query)
            {hub_filter}
            ORDER BY score DESC
            LIMIT :limit * 2
        )
        SELECT 
            COALESCE(s.id, k.id) as id,
            COALESCE(s.metadata, k.metadata) as metadata,
            (COALESCE(1.0 / (60 + s.rank), 0.0) + COALESCE(1.0 / (60 + k.rank), 0.0)) as combined_score
        FROM semantic_search s
        FULL OUTER JOIN keyword_search k ON s.id = k.id
        ORDER BY combined_score DESC
        LIMIT :limit;
    """)
    
    try:
        result = await session.execute(sql, {
            "query_embedding": vector_str,
            "query": query,
            "limit": limit
        })
        return [{"id": row[0], "metadata": row[1], "score": row[2]} for row in result.fetchall()]
    except Exception as e:
        logger.error(f"Hybrid search failed: {e}")
        # Fallback to pure semantic search
        sql_fallback = text(f"""
            SELECT id, metadata, 1 - (vec <=> CAST(:query_embedding AS vector)) as score
            FROM vecs."{table_name}"
            WHERE (metadata->>'deleted_at') IS NULL
            {hub_filter}
            ORDER BY vec <=> CAST(:query_embedding AS vector)
            LIMIT :limit;
        """)
        try:
            result = await session.execute(sql_fallback, {"query_embedding": vector_str, "limit": limit})
            return [{"id": row[0], "metadata": row[1], "score": row[2]} for row in result.fetchall()]
        except Exception as e2:
            logger.error(f"Fallback semantic search failed: {e2}")
            return []

class AssetRepository:
    def __init__(self, session: AsyncSession):
        self.session = session
    
    async def get_by_slug(self, slug: str) -> Optional[Asset]:
        return await get_asset_by_slug(self.session, slug)
    
    async def search_by_vector(self, query_vector: List[float], limit: int = 5) -> List[Asset]:
        vector_str = "[" + ",".join(map(str, query_vector)) + "]"
        stmt = text("""
            SELECT id, slug, title, content, type, domain, metadata, created_at, updated_at, deleted_at
            FROM assets
            WHERE deleted_at IS NULL
            ORDER BY description_embedding <=> :vec::vector
            LIMIT :limit
        """)
        result = await self.session.execute(stmt, {"vec": vector_str, "limit": limit})
        assets = []
        for row in result.fetchall():
            assets.append(Asset(
                id=row[0], slug=row[1], title=row[2], content=row[3], 
                type=row[4], domain=row[5], metadata=row[6],
                created_at=row[7], updated_at=row[8], deleted_at=row[9]
            ))
        return assets

async def create_knowledge_hub(session: AsyncSession, hub: KnowledgeHub) -> KnowledgeHub:
    db_hub = KnowledgeHubTable(**hub.model_dump(exclude={"created_at", "updated_at"}))
    session.add(db_hub)
    await session.commit()
    await session.refresh(db_hub)
    return map_hub_to_domain(db_hub)

async def delete_asset(session: AsyncSession, asset_id: UUID) -> bool:
    stmt = update(AssetTable).where(AssetTable.id == asset_id).values(deleted_at=now_utc(), updated_at=now_utc())
    result = await session.execute(stmt)
    await session.commit()
    return result.rowcount > 0
