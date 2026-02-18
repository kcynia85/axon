from fastapi import APIRouter, Depends, status, HTTPException
from typing import List
from uuid import UUID

from backend.app.api.deps import get_current_user
from backend.app.modules.settings.application.service import SettingsService
from backend.app.modules.settings.dependencies import get_settings_service
from backend.app.modules.settings.application.schemas import (
    LLMProviderResponse, CreateLLMProviderRequest,
    LLMModelResponse, CreateLLMModelRequest,
    LLMRouterResponse, CreateLLMRouterRequest, TestPromptRequest, SanityCheckResponse,
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

@router.post("/llm-providers", response_model=LLMProviderResponse, status_code=status.HTTP_201_CREATED)
async def create_llm_provider(
    request: CreateLLMProviderRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.create_llm_provider(request)

# --- LLM Model ---

@router.get("/llm-models", response_model=List[LLMModelResponse])
async def list_llm_models(
    service: SettingsService = Depends(get_settings_service)
):
    return await service.list_llm_models()

@router.post("/llm-models", response_model=LLMModelResponse, status_code=status.HTTP_201_CREATED)
async def create_llm_model(
    request: CreateLLMModelRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.create_llm_model(request)

# --- LLM Router ---

@router.get("/llm-routers", response_model=List[LLMRouterResponse])
async def list_llm_routers(
    service: SettingsService = Depends(get_settings_service)
):
    return await service.list_llm_routers()

@router.post("/llm-routers", response_model=LLMRouterResponse, status_code=status.HTTP_201_CREATED)
async def create_llm_router(
    request: CreateLLMRouterRequest,
    service: SettingsService = Depends(get_settings_service)
):
    return await service.create_llm_router(request)

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
