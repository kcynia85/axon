from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.shared.infrastructure.database import get_db
from app.modules.system.infrastructure.repo import SystemRepository, SystemEmbeddingRepository
from app.modules.system.infrastructure.token_usage_repo import TokenUsageRepository
from app.modules.system.application.service import SystemService
from app.modules.system.application.retriever import SystemAwarenessRetrieverService
from app.modules.system.application.voice_service import VoiceInteractionService

async def get_system_repo(db: AsyncSession = Depends(get_db)) -> SystemRepository:
    return SystemRepository(db)

async def get_system_embedding_repo(db: AsyncSession = Depends(get_db)) -> SystemEmbeddingRepository:
    return SystemEmbeddingRepository(db)

async def get_system_service(
    repo: SystemRepository = Depends(get_system_repo),
    embedding_repo: SystemEmbeddingRepository = Depends(get_system_embedding_repo)
) -> SystemService:
    return SystemService(repo, embedding_repo)

async def get_system_awareness_retriever(
    repo: SystemEmbeddingRepository = Depends(get_system_embedding_repo)
) -> SystemAwarenessRetrieverService:
    return SystemAwarenessRetrieverService(repo)

async def get_voice_interaction_service(
    repo: SystemRepository = Depends(get_system_repo)
) -> VoiceInteractionService:
    return VoiceInteractionService(repo)

async def get_token_usage_repo(db: AsyncSession = Depends(get_db)) -> TokenUsageRepository:
    return TokenUsageRepository(db)
