from typing import Optional
from backend.app.modules.system.infrastructure.repo import SystemRepository
from backend.app.modules.system.domain.models import MetaAgent, VoiceMetaAgent
from backend.app.modules.system.application.schemas import (
    UpdateMetaAgentRequest, UpdateVoiceMetaAgentRequest
)

class SystemService:
    def __init__(self, repo: SystemRepository):
        self.repo = repo

    async def get_meta_agent(self) -> Optional[MetaAgent]:
        return await self.repo.get_meta_agent()

    async def upsert_meta_agent(self, request: UpdateMetaAgentRequest) -> MetaAgent:
        return await self.repo.upsert_meta_agent(request.model_dump(exclude_unset=True))

    async def get_voice_meta_agent(self) -> Optional[VoiceMetaAgent]:
        return await self.repo.get_voice_meta_agent()

    async def upsert_voice_meta_agent(self, request: UpdateVoiceMetaAgentRequest) -> VoiceMetaAgent:
        return await self.repo.upsert_voice_meta_agent(request.model_dump(exclude_unset=True))
