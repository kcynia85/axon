from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from uuid import UUID

from app.api.deps import get_current_user
from app.modules.settings.application.service import SettingsService
from app.modules.settings.dependencies import get_settings_service
from app.modules.settings.application.schemas import (
    LLMProviderResponse, CreateLLMProviderRequest, UpdateLLMProviderRequest,
    LLMModelResponse, CreateLLMModelRequest, UpdateLLMModelRequest, AvailableModelResponse, LLMModelUsageResponse,
    LLMRouterResponse, CreateLLMRouterRequest, UpdateLLMRouterRequest, TestPromptRequest, SanityCheckResponse,
    EmbeddingModelResponse, CreateEmbeddingModelRequest,
    ChunkingStrategyResponse, CreateChunkingStrategyRequest, SimulateChunkingRequest, SimulateChunkingResponse,
    VectorDatabaseResponse, CreateVectorDatabaseRequest, ConnectionTestResponse
)

router = APIRouter(
    prefix="/settings",
    tags=["settings"],
    dependencies=[Depends(get_current_user)]
)

# --- LLM Provider ---

@router.get("/llm-providers", response_model=List[LLMProviderResponse])
async def list_llm_providers(
    service: SettingsService = Depends(get_settings_service)
):
    return await service.list_llm_providers()

@router.get("/llm-providers/{id}", response_model=LLMProviderResponse)
async def get_llm_provider(
    id: UUID,
    service: SettingsService = Depends(get_settings_service)
):
    provider = await service.get_llm_provider(id)
    if not provider:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Provider not found")
    return provider

@router.post("/llm-providers", response_model=LLMProviderResponse, status_code=status.HTTP_201_CREATED)
async def create_llm_provider(
    request: CreateLLMProviderRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.create_llm_provider(request)

@router.patch("/llm-providers/{id}", response_model=LLMProviderResponse)
async def patch_llm_provider(
    id: UUID,
    request: UpdateLLMProviderRequest,
    service: SettingsService = Depends(get_settings_service)
):
    try:
        return await service.update_llm_provider(id, request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.delete("/llm-providers/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_llm_provider(
    id: UUID,
    service: SettingsService = Depends(get_settings_service)
):
    await service.delete_llm_provider(id)
    return None

@router.get("/llm-providers/{id}/available-models", response_model=List[AvailableModelResponse])
async def get_available_models(
    id: UUID,
    service: SettingsService = Depends(get_settings_service)
):
    try:
        return await service.get_available_models(id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.post("/llm-providers/{id}/test", response_model=ConnectionTestResponse)
async def test_llm_provider(
    id: UUID,
    service: SettingsService = Depends(get_settings_service)
):
    try:
        return await service.test_provider_connection(id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

# --- LLM Model ---

@router.get("/llm-models", response_model=List[LLMModelResponse])
async def list_llm_models(
    service: SettingsService = Depends(get_settings_service)
):
    return await service.list_llm_models()

@router.get("/llm-models/{id}", response_model=LLMModelResponse)
async def get_llm_model(
    id: UUID,
    service: SettingsService = Depends(get_settings_service)
):
    model = await service.get_llm_model(id)
    if not model:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Model not found")
    return model

@router.post("/llm-models", response_model=LLMModelResponse, status_code=status.HTTP_201_CREATED)
async def create_llm_model(
    request: CreateLLMModelRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.create_llm_model(request)

@router.patch("/llm-models/{id}", response_model=LLMModelResponse)
async def patch_llm_model(
    id: UUID,
    request: UpdateLLMModelRequest,
    service: SettingsService = Depends(get_settings_service)
):
    try:
        return await service.update_llm_model(id, request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.delete("/llm-models/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_llm_model(
    id: UUID,
    service: SettingsService = Depends(get_settings_service)
):
    await service.delete_llm_model(id)
    return None

@router.get("/llm-models/{id}/usage", response_model=LLMModelUsageResponse)
async def get_llm_model_usage(
    id: UUID,
    service: SettingsService = Depends(get_settings_service)
):
    usage = await service.get_llm_model_usage(id)
    return LLMModelUsageResponse(
        is_used=len(usage) > 0,
        used_by=usage
    )

@router.post("/llm-models/{id}/test", response_model=SanityCheckResponse)
async def test_llm_model(
    id: UUID,
    request: TestPromptRequest,
    service: SettingsService = Depends(get_settings_service)
):
    try:
        return await service.test_llm_model(id, request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

# --- LLM Router ---

@router.get("/llm-routers", response_model=List[LLMRouterResponse])
async def list_llm_routers(
    service: SettingsService = Depends(get_settings_service)
):
    return await service.list_llm_routers()

@router.get("/llm-routers/{id}", response_model=LLMRouterResponse)
async def get_llm_router(
    id: UUID,
    service: SettingsService = Depends(get_settings_service)
):
    router = await service.get_llm_router(id)
    if not router:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Router not found")
    return router

@router.post("/llm-routers", response_model=LLMRouterResponse, status_code=status.HTTP_201_CREATED)
async def create_llm_router(
    request: CreateLLMRouterRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.create_llm_router(request)

@router.patch("/llm-routers/{id}", response_model=LLMRouterResponse)
async def patch_llm_router(
    id: UUID,
    request: UpdateLLMRouterRequest,
    service: SettingsService = Depends(get_settings_service)
):
    try:
        return await service.update_llm_router(id, request)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.delete("/llm-routers/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_llm_router(
    id: UUID,
    service: SettingsService = Depends(get_settings_service)
):
    await service.delete_llm_router(id)
    return None

@router.post("/llm-routers/{id}/test", response_model=SanityCheckResponse)
async def test_llm_router(
    id: UUID,
    request: TestPromptRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.test_llm_router(id, request)

# --- Embedding Model ---

@router.get("/embedding-models", response_model=List[EmbeddingModelResponse])
async def list_embedding_models(
    service: SettingsService = Depends(get_settings_service)
):
    return await service.list_embedding_models()

@router.post("/embedding-models", response_model=EmbeddingModelResponse, status_code=status.HTTP_201_CREATED)
async def create_embedding_model(
    request: CreateEmbeddingModelRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.create_embedding_model(request)

# --- Chunking Strategy ---

@router.get("/chunking-strategies", response_model=List[ChunkingStrategyResponse])
async def list_chunking_strategies(
    service: SettingsService = Depends(get_settings_service)
):
    return await service.list_chunking_strategies()

@router.post("/chunking-strategies", response_model=ChunkingStrategyResponse, status_code=status.HTTP_201_CREATED)
async def create_chunking_strategy(
    request: CreateChunkingStrategyRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.create_chunking_strategy(request)

@router.post("/chunking-strategies/simulate", response_model=SimulateChunkingResponse)
async def simulate_chunking(
    request: SimulateChunkingRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.simulate_chunking(request)

# --- Vector Database ---

@router.get("/vector-databases", response_model=List[VectorDatabaseResponse])
async def list_vector_databases(
    service: SettingsService = Depends(get_settings_service)
):
    return await service.list_vector_databases()

@router.post("/vector-databases", response_model=VectorDatabaseResponse, status_code=status.HTTP_201_CREATED)
async def create_vector_database(
    request: CreateVectorDatabaseRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.create_vector_database(request)

@router.post("/vector-databases/{id}/test", response_model=ConnectionTestResponse)
async def test_vector_database(
    id: UUID,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.test_vector_database(id)
