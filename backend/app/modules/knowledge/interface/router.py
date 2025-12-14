from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from uuid import UUID
from pydantic import BaseModel

from backend.app.shared.infrastructure.database import get_db_session
from backend.app.modules.knowledge.domain.models import Asset
from backend.app.modules.knowledge.infrastructure.repo import AssetRepository

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

class AssetUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[str] = None
    domain: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

async def get_asset_repo(session: AsyncSession = Depends(get_db_session)) -> AssetRepository:
    return AssetRepository(session)

@router.get("/assets", response_model=List[Asset])
async def list_assets(
    limit: int = 100, 
    offset: int = 0,
    type: Optional[str] = Query(None, description="Filter by asset type (e.g. 'prompt', 'template')"),
    repo: AssetRepository = Depends(get_asset_repo)
):
    """
    List all assets (Templates, SOPs, Prompts etc.) from the Knowledge Base.
    """
    return await repo.list_assets(limit=limit, offset=offset, asset_type=type)

@router.post("/assets", response_model=Asset)
async def create_asset(
    asset: Asset,
    repo: AssetRepository = Depends(get_asset_repo)
):
    """
    Create a new asset.
    """
    # check if slug exists? unique constraint will handle it but better to check
    existing = await repo.get_by_slug(asset.slug)
    if existing:
        raise HTTPException(status_code=400, detail=f"Asset with slug '{asset.slug}' already exists")
    
    return await repo.create(asset)

@router.get("/assets/{slug}", response_model=Asset)
async def get_asset(
    slug: str,
    repo: AssetRepository = Depends(get_asset_repo)
):
    """
    Retrieve a specific asset by its unique slug.
    """
    asset = await repo.get_by_slug(slug)
    if not asset:
        raise HTTPException(status_code=404, detail=f"Asset with slug '{slug}' not found")
    return asset

@router.put("/assets/{asset_id}", response_model=Asset)
async def update_asset(
    asset_id: UUID,
    asset_update: AssetUpdate,
    repo: AssetRepository = Depends(get_asset_repo)
):
    """
    Update an existing asset.
    """
    updated_asset = await repo.update(asset_id, asset_update.model_dump(exclude_unset=True))
    if not updated_asset:
        raise HTTPException(status_code=404, detail=f"Asset with ID '{asset_id}' not found")
    return updated_asset

@router.delete("/assets/{asset_id}")
async def delete_asset(
    asset_id: UUID,
    repo: AssetRepository = Depends(get_asset_repo)
):
    """
    Delete an asset.
    """
    success = await repo.delete(asset_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Asset with ID '{asset_id}' not found")
    return {"message": "Asset deleted successfully"}
