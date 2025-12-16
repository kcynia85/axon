from fastapi import APIRouter, Depends, Query
from typing import List, Optional

from backend.app.modules.knowledge.domain.models import Asset
from backend.app.modules.knowledge.application import service
from backend.app.api.deps import get_current_user

router = APIRouter(
    prefix="/knowledge", 
    tags=["knowledge"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/assets", response_model=List[Asset])
async def list_assets(
    limit: int = 100, 
    offset: int = 0,
    type: Optional[str] = Query(None, description="Filter by asset type (e.g. 'prompt', 'template')"),
    # Delegate to service
    assets: List[Asset] = Depends(service.list_assets_use_case)
):
    """
    List all assets (Templates, SOPs, Prompts etc.) from the Knowledge Base.
    """
    return assets

@router.post("/assets", response_model=Asset)
async def create_asset(
    asset: Asset = Depends(service.create_asset_use_case)
):
    """
    Create a new asset.
    """
    return asset

@router.get("/assets/{slug}", response_model=Asset)
async def get_asset(
    asset: Asset = Depends(service.get_asset_use_case)
):
    """
    Retrieve a specific asset by its unique slug.
    """
    return asset

@router.put("/assets/{asset_id}", response_model=Asset)
async def update_asset(
    asset: Asset = Depends(service.update_asset_use_case)
):
    """
    Update an existing asset.
    """
    return asset

@router.delete("/assets/{asset_id}")
async def delete_asset(
    result: dict = Depends(service.delete_asset_use_case)
):
    """
    Delete an asset.
    """
    return result
