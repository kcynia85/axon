from uuid import UUID
from typing import List, Optional
from fastapi import Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.knowledge.domain.models import Asset, KnowledgeHub, KnowledgeResource
from app.modules.knowledge.infrastructure import repo as knowledge_repo
from app.modules.knowledge.application.schemas import AssetUpdate, SuccessResponse, KnowledgeHubCreate, KnowledgeResourceCreate
from app.modules.knowledge.domain.enums import RAGIndexingStatus
from app.modules.knowledge.dependencies import get_db

# Function-First Service Layer

async def list_knowledge_hubs_use_case(
    session: AsyncSession = Depends(get_db)
) -> List[KnowledgeHub]:
    return await knowledge_repo.list_knowledge_hubs(session)

async def create_knowledge_hub_use_case(
    hub_create: KnowledgeHubCreate,
    session: AsyncSession = Depends(get_db)
) -> KnowledgeHub:
    hub = KnowledgeHub(**hub_create.model_dump())
    return await knowledge_repo.create_knowledge_hub(session, hub)

async def list_knowledge_resources_use_case(
    limit: int = 100,
    offset: int = 0,
    session: AsyncSession = Depends(get_db)
) -> List[KnowledgeResource]:
    return await knowledge_repo.list_knowledge_resources(session, limit=limit, offset=offset)

async def get_knowledge_resource_use_case(
    resource_id: UUID,
    session: AsyncSession = Depends(get_db)
) -> KnowledgeResource:
    resource = await knowledge_repo.get_knowledge_resource(session, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail=f"Knowledge resource with ID '{resource_id}' not found")
    return resource

async def get_knowledge_resource_chunks_use_case(
    resource_id: UUID,
    session: AsyncSession = Depends(get_db)
):
    return await knowledge_repo.get_knowledge_resource_chunks(session, resource_id)

async def create_knowledge_resource_use_case(
    resource_create: KnowledgeResourceCreate,
    session: AsyncSession = Depends(get_db)
) -> KnowledgeResource:
    # Ensure vector_database_id is set
    vdb_id = resource_create.vector_database_id
    if not vdb_id:
        from app.modules.settings.infrastructure.tables import VectorDatabaseTable
        from sqlalchemy import select
        stmt = select(VectorDatabaseTable.id).limit(1)
        res = await session.execute(stmt)
        vdb_id = res.scalar()

    resource = KnowledgeResource(
        **resource_create.model_dump(exclude={"resource_metadata", "vector_database_id"}),
        resource_metadata=resource_create.resource_metadata,
        vector_database_id=vdb_id,
        resource_rag_indexing_status=RAGIndexingStatus.PENDING,
        resource_chunk_count=0
    )
    return await knowledge_repo.create_knowledge_resource(session, resource)

async def list_assets_use_case(
    limit: int = 100, 
    offset: int = 0,
    type: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_db)
) -> List[Asset]:
    return await knowledge_repo.list_assets(session, limit=limit, offset=offset, asset_type=type)

async def create_asset_use_case(
    asset: Asset,
    session: AsyncSession = Depends(get_db)
) -> Asset:
    existing = await knowledge_repo.get_asset_by_slug(session, asset.slug)
    if existing:
        raise HTTPException(status_code=400, detail=f"Asset with slug '{asset.slug}' already exists")
    
    return await knowledge_repo.create_asset(session, asset)

async def get_asset_use_case(
    slug: str,
    session: AsyncSession = Depends(get_db)
) -> Asset:
    asset = await knowledge_repo.get_asset_by_slug(session, slug)
    if not asset:
        raise HTTPException(status_code=404, detail=f"Asset with slug '{slug}' not found")
    return asset

async def update_asset_use_case(
    asset_id: UUID,
    update_data: AssetUpdate,
    session: AsyncSession = Depends(get_db)
) -> Asset:
    updated_asset = await knowledge_repo.update_asset(session, asset_id, update_data.model_dump(exclude_unset=True))
    if not updated_asset:
        raise HTTPException(status_code=404, detail=f"Asset with ID '{asset_id}' not found")
    return updated_asset

async def delete_asset_use_case(
    asset_id: UUID,
    session: AsyncSession = Depends(get_db)
) -> SuccessResponse:
    success = await knowledge_repo.delete_asset(session, asset_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Asset with ID '{asset_id}' not found")
    return SuccessResponse(message="Asset deleted successfully", id=asset_id)

async def update_knowledge_resource_use_case(
    resource_id: UUID,
    resource_update: KnowledgeResourceCreate,
    session: AsyncSession = Depends(get_db)
) -> KnowledgeResource:
    from app.modules.knowledge.infrastructure.tables import KnowledgeResourceTable
    from app.modules.knowledge.infrastructure.repo import map_resource_to_domain
    
    resource = await session.get(KnowledgeResourceTable, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail=f"Knowledge resource with ID '{resource_id}' not found")
    
    # Update fields
    for key, value in resource_update.model_dump(exclude_unset=True).items():
        setattr(resource, key, value)
    
    await session.commit()
    await session.refresh(resource)
    return map_resource_to_domain(resource)

async def delete_knowledge_resource_use_case(
    resource_id: UUID,
    session: AsyncSession = Depends(get_db)
) -> SuccessResponse:
    # Use repo function to ensure both SQL and Vector Store (vecs) are updated
    success = await knowledge_repo.delete_knowledge_resource(session, resource_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Knowledge resource with ID '{resource_id}' not found or deletion failed")

    return SuccessResponse(message="Knowledge resource moved to trash successfully", id=resource_id)



async def update_knowledge_resource_status_use_case(
    resource_id: UUID, 
    status: str, 
    chunk_count: int = 0, 
    error: str = None,
    session: AsyncSession = Depends(get_db)
) -> Optional[KnowledgeResource]:
    return await knowledge_repo.update_knowledge_resource_status(session, resource_id, status, chunk_count, error)
