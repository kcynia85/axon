from typing import Optional, List, Dict, Any
from app.modules.system.infrastructure.repo import SystemRepository, SystemEmbeddingRepository
from app.modules.system.domain.models import MetaAgent, VoiceMetaAgent, SystemAwarenessSettings
from app.modules.system.application.schemas import (
    UpdateMetaAgentRequest, UpdateVoiceMetaAgentRequest, UpdateSystemAwarenessSettingsRequest
)

class SystemService:
    def __init__(self, repo: SystemRepository, embedding_repo: SystemEmbeddingRepository):
        self.repo = repo
        self.embedding_repo = embedding_repo

    async def get_meta_agent(self) -> Optional[MetaAgent]:
        return await self.repo.get_meta_agent()

    async def upsert_meta_agent(self, request: UpdateMetaAgentRequest) -> MetaAgent:
        return await self.repo.upsert_meta_agent(request.model_dump(exclude_unset=True))

    async def get_voice_meta_agent(self) -> Optional[VoiceMetaAgent]:
        return await self.repo.get_voice_meta_agent()

    async def upsert_voice_meta_agent(self, request: UpdateVoiceMetaAgentRequest) -> VoiceMetaAgent:
        return await self.repo.upsert_voice_meta_agent(request.model_dump(exclude_unset=True))

    async def get_awareness_settings(self) -> Optional[SystemAwarenessSettings]:
        return await self.repo.get_awareness_settings()

    async def upsert_awareness_settings(self, request: UpdateSystemAwarenessSettingsRequest) -> SystemAwarenessSettings:
        return await self.repo.upsert_awareness_settings(request.model_dump(exclude_unset=True))

    async def list_embeddings(self, limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        return await self.embedding_repo.list_embeddings(limit=limit, offset=offset)
