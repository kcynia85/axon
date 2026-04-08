from uuid import UUID
from typing import List, Optional
from fastapi import Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.knowledge.domain.models import Asset, KnowledgeHub, KnowledgeSource
from app.modules.knowledge.infrastructure import repo as asset_repo
from app.modules.knowledge.application.schemas import AssetUpdate, SuccessResponse, KnowledgeHubCreate, KnowledgeSourceCreate
from app.modules.knowledge.domain.enums import RAGIndexingStatus
from app.modules.knowledge.dependencies import get_db

# Function-First Service Layer

async def list_knowledge_hubs_use_case(
    session: AsyncSession = Depends(get_db)
) -> List[KnowledgeHub]:
    return await asset_repo.list_knowledge_hubs(session)

async def create_knowledge_hub_use_case(
    hub_create: KnowledgeHubCreate,
    session: AsyncSession = Depends(get_db)
) -> KnowledgeHub:
    hub = KnowledgeHub(**hub_create.model_dump())
    return await asset_repo.create_knowledge_hub(session, hub)

async def list_knowledge_sources_use_case(
    limit: int = 100,
    offset: int = 0,
    session: AsyncSession = Depends(get_db)
) -> List[KnowledgeSource]:
    return await asset_repo.list_knowledge_sources(session, limit=limit, offset=offset)

async def create_knowledge_source_use_case(
    source_create: KnowledgeSourceCreate,
    session: AsyncSession = Depends(get_db)
) -> KnowledgeSource:
    source = KnowledgeSource(
        **source_create.model_dump(exclude={"source_metadata"}),
        source_metadata=source_create.source_metadata,
        source_rag_indexing_status=RAGIndexingStatus.PENDING,
        source_chunk_count=0
    )
    return await asset_repo.create_knowledge_source(session, source)

async def list_assets_use_case(
    limit: int = 100, 
    offset: int = 0,
    type: Optional[str] = Query(None),
    session: AsyncSession = Depends(get_db)
) -> List[Asset]:
    return await asset_repo.list_assets(session, limit=limit, offset=offset, asset_type=type)

async def create_asset_use_case(
    asset: Asset,
    session: AsyncSession = Depends(get_db)
) -> Asset:
    existing = await asset_repo.get_asset_by_slug(session, asset.slug)
    if existing:
        raise HTTPException(status_code=400, detail=f"Asset with slug '{asset.slug}' already exists")
    
    return await asset_repo.create_asset(session, asset)

async def get_asset_use_case(
    slug: str,
    session: AsyncSession = Depends(get_db)
) -> Asset:
    asset = await asset_repo.get_asset_by_slug(session, slug)
    if not asset:
        raise HTTPException(status_code=404, detail=f"Asset with slug '{slug}' not found")
    return asset

async def update_asset_use_case(
    asset_id: UUID,
    update_data: AssetUpdate,
    session: AsyncSession = Depends(get_db)
) -> Asset:
    updated_asset = await asset_repo.update_asset(session, asset_id, update_data.model_dump(exclude_unset=True))
    if not updated_asset:
        raise HTTPException(status_code=404, detail=f"Asset with ID '{asset_id}' not found")
    return updated_asset

async def delete_asset_use_case(
    asset_id: UUID,
    session: AsyncSession = Depends(get_db)
) -> SuccessResponse:
    success = await asset_repo.delete_asset(session, asset_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Asset with ID '{asset_id}' not found")
    return SuccessResponse(message="Asset deleted successfully", id=asset_id)
