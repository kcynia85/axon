from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, BackgroundTasks, HTTPException
from typing import List, Optional
import json

from app.modules.knowledge.domain.models import Asset, KnowledgeHub, KnowledgeSource
from app.modules.knowledge.application.schemas import KnowledgeHubCreate, KnowledgeHubResponse, KnowledgeSourceCreate, KnowledgeSourceResponse
from app.modules.knowledge.application import service
from app.modules.knowledge.application.indexer import process_and_index_source
from app.modules.knowledge.dependencies import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user

router = APIRouter(
    prefix="/knowledge", 
    tags=["knowledge"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/hubs", response_model=List[KnowledgeHubResponse])
async def list_knowledge_hubs(
    hubs: List[KnowledgeHub] = Depends(service.list_knowledge_hubs_use_case)
):
    """
    List all knowledge hubs.
    """
    return hubs

@router.post("/hubs", response_model=KnowledgeHubResponse)
async def create_knowledge_hub(
    hub: KnowledgeHub = Depends(service.create_knowledge_hub_use_case)
):
    """
    Create a new knowledge hub.
    """
    return hub

@router.get("/sources", response_model=List[KnowledgeSourceResponse])
async def list_knowledge_sources(
    limit: int = Query(100),
    offset: int = Query(0),
    sources: List[KnowledgeSource] = Depends(service.list_knowledge_sources_use_case)
):
    """
    List all knowledge sources.
    """
    return sources

@router.post("/sources", response_model=KnowledgeSourceResponse)
async def create_knowledge_source(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    metadata_json: str = Form(...),
    session: AsyncSession = Depends(get_db)
):
    """
    Create a new knowledge source and initiate indexing.
    """
    try:
        data = json.loads(metadata_json)
        source_create = KnowledgeSourceCreate(**data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON metadata: {e}")

    # Create the source record first
    source = await service.create_knowledge_source_use_case(source_create, session)
    
    # Read content
    content_bytes = await file.read()
    try:
        content = content_bytes.decode('utf-8')
    except UnicodeDecodeError:
        # Fallback or error out for non-text formats if text parsing isn't implemented fully
        content = content_bytes.decode('latin-1') # fallback just in case
    
    # Schedule background task
    background_tasks.add_task(process_and_index_source, session, source, content)
    
    return source

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
