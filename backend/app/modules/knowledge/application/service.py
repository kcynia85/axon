from uuid import UUID
from typing import List, Optional
from fastapi import Depends, HTTPException, Query

from backend.app.modules.knowledge.domain.models import Asset
from backend.app.modules.knowledge.infrastructure.repo import AssetRepository
from backend.app.modules.knowledge.application.schemas import AssetUpdate
from backend.app.modules.knowledge.dependencies import get_asset_repo

# Function-First Service Layer

async def list_assets_use_case(
    limit: int = 100, 
    offset: int = 0,
    type: Optional[str] = Query(None),
    repo: AssetRepository = Depends(get_asset_repo)
) -> List[Asset]:
    return await repo.list_assets(limit=limit, offset=offset, asset_type=type)

async def create_asset_use_case(
    asset: Asset,
    repo: AssetRepository = Depends(get_asset_repo)
) -> Asset:
    # check if slug exists? unique constraint will handle it but better to check
    existing = await repo.get_by_slug(asset.slug)
    if existing:
        raise HTTPException(status_code=400, detail=f"Asset with slug '{asset.slug}' already exists")
    
    return await repo.create(asset)

async def get_asset_use_case(
    slug: str,
    repo: AssetRepository = Depends(get_asset_repo)
) -> Asset:
    asset = await repo.get_by_slug(slug)
    if not asset:
        raise HTTPException(status_code=404, detail=f"Asset with slug '{slug}' not found")
    return asset

async def update_asset_use_case(
    asset_id: UUID,
    update_data: AssetUpdate,
    repo: AssetRepository = Depends(get_asset_repo)
) -> Asset:
    updated_asset = await repo.update(asset_id, update_data.model_dump(exclude_unset=True))
    if not updated_asset:
        raise HTTPException(status_code=404, detail=f"Asset with ID '{asset_id}' not found")
    return updated_asset

async def delete_asset_use_case(
    asset_id: UUID,
    repo: AssetRepository = Depends(get_asset_repo)
) -> dict:
    success = await repo.delete(asset_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Asset with ID '{asset_id}' not found")
    return {"message": "Asset deleted successfully"}
