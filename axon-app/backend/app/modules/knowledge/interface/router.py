from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, BackgroundTasks, HTTPException
from typing import List, Optional
from uuid import UUID
import json
import tempfile
import os
import logging

from app.modules.knowledge.domain.models import Asset, KnowledgeResource
from app.modules.knowledge.application.schemas import (
    SuccessResponse, KnowledgeHubCreate, 
    KnowledgeResourceCreate, KnowledgeResourceResponse,
    KnowledgeHubResponse
)
from app.modules.knowledge.application import service
from app.modules.knowledge.dependencies import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/knowledge", 
    tags=["knowledge"],
    dependencies=[Depends(get_current_user)]
)

@router.get("/hubs", response_model=List[KnowledgeHubResponse])
async def list_knowledge_hubs(session: AsyncSession = Depends(get_db)):
    return await service.list_knowledge_hubs_use_case(session)

@router.post("/hubs", response_model=KnowledgeHubResponse)
async def create_knowledge_hub(hub: KnowledgeHubCreate, session: AsyncSession = Depends(get_db)):
    return await service.create_knowledge_hub_use_case(hub, session)

@router.get("/resources", response_model=List[KnowledgeResourceResponse])
async def list_knowledge_resources(
    limit: int = 100, 
    offset: int = 0,
    session: AsyncSession = Depends(get_db)
):
    return await service.list_knowledge_resources_use_case(limit, offset, session)

@router.get("/resources/{resource_id}", response_model=KnowledgeResourceResponse)
async def get_knowledge_resource(
    resource_id: UUID,
    session: AsyncSession = Depends(get_db)
):
    logger.info(f"Fetching knowledge resource: {resource_id}")
    resource = await service.get_knowledge_resource_use_case(resource_id, session)
    if not resource:
        logger.warning(f"Resource not found: {resource_id}")
    return resource

@router.get("/resources/{resource_id}/chunks")
async def get_knowledge_resource_chunks(
    resource_id: UUID,
    session: AsyncSession = Depends(get_db)
):
    return await service.get_knowledge_resource_chunks_use_case(resource_id, session)

@router.post("/resources/preview")
async def preview_knowledge_resource(
    file: UploadFile = File(...),
    strategy_id: Optional[str] = Form(None),
    session: AsyncSession = Depends(get_db)
):
    """Simulates chunking for a given file and strategy."""
    from app.modules.knowledge.application.indexer import simulate_chunking
    
    # Save file temporarily for processing
    content_bytes = await file.read()
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        tmp.write(content_bytes)
        tmp_path = tmp.name

    try:
        chunks, count = await simulate_chunking(tmp_path, strategy_id, session)
        return {"chunks": chunks, "chunk_count": count}
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.post("/resources", response_model=KnowledgeResourceResponse)
async def create_knowledge_resource(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    metadata_json: str = Form(...),
    session: AsyncSession = Depends(get_db)
):
    # 1. Parse Metadata
    try:
        metadata_dict = json.loads(metadata_json)
        resource_create = KnowledgeResourceCreate(**metadata_dict)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid metadata JSON: {str(e)}")

    # 2. Create DB record via Service
    resource = await service.create_knowledge_resource_use_case(resource_create, session)

    # 3. Save file temporarily
    content_bytes = await file.read()
    upload_dir = "data/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_ext = os.path.splitext(file.filename)[1]
    tmp_file_path = os.path.join(upload_dir, f"resource_{resource.id}{file_ext}")
    
    with open(tmp_file_path, "wb") as f:
        f.write(content_bytes)
    
    # 4. Background indexing task
    background_tasks.add_task(process_and_index_resource_task, resource, tmp_file_path)
    
    return resource

async def process_and_index_resource_task(resource: KnowledgeResource, file_path: str):
    """Zadanie wykonywane w tle przez FastAPI."""
    from app.modules.knowledge.application.indexer import process_and_index_resource
    from app.shared.infrastructure.database import AsyncSessionLocal
    from app.modules.knowledge.infrastructure import repo as knowledge_repo

    try:
        print(f"Starting background indexing for resource: {resource.id}")
        await process_and_index_resource(resource, file_path)
        print(f"Finished background indexing for resource: {resource.id}")
    except Exception as e:
        logger.error(f"Background indexing failed for {resource.id}: {e}")
        # Manualnie aktualizujemy status na Error w razie porażki
        async with AsyncSessionLocal() as session:
            await knowledge_repo.update_knowledge_resource_status(
                session, resource.id, "Error", error=str(e)
            )
    finally:
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except:
                pass

@router.put("/resources/{resource_id}", response_model=KnowledgeResourceResponse)
async def update_knowledge_resource(
    resource_id: UUID,
    resource_update: KnowledgeResourceCreate,
    session: AsyncSession = Depends(get_db)
):
    return await service.update_knowledge_resource_use_case(resource_id, resource_update, session)

@router.delete("/resources/{resource_id}", response_model=SuccessResponse)
async def delete_knowledge_resource(resource_id: UUID, session: AsyncSession = Depends(get_db)):
    return await service.delete_knowledge_resource_use_case(resource_id, session)

@router.get("/assets", response_model=List[Asset])
async def list_assets(
    limit: int = 100, 
    offset: int = 0, 
    type: Optional[str] = None,
    session: AsyncSession = Depends(get_db)
):
    return await service.list_assets_use_case(limit, offset, type, session)

@router.post("/assets", response_model=Asset)
async def create_asset(asset: Asset, session: AsyncSession = Depends(get_db)):
    return await service.create_asset_use_case(asset, session)

@router.get("/search")
async def search_knowledge(
    query: str = Query(...),
    hub_id: Optional[str] = Query(None),
    limit: int = Query(5),
    session: AsyncSession = Depends(get_db)
):
    from app.modules.knowledge.application.rag import RAGService
    rag_service = RAGService(session)
    return await rag_service.search_knowledge(query, hub_id=hub_id, limit=limit)
