from uuid import uuid4
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.modules.system.domain.models import MetaAgent, VoiceMetaAgent
from app.modules.system.infrastructure.tables import MetaAgentTable, VoiceMetaAgentTable

class SystemRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- Meta Agent ---

    async def get_meta_agent(self) -> Optional[MetaAgent]:
        result = await self.session.execute(select(MetaAgentTable).limit(1))
        row = result.scalar_one_or_none()
        if row:
            return MetaAgent(
                id=row.id,
                meta_agent_system_prompt=row.meta_agent_system_prompt,
                meta_agent_temperature=row.meta_agent_temperature,
                meta_agent_rag_enabled=row.meta_agent_rag_enabled,
                meta_agent_system_knowledge_rags=row.meta_agent_system_knowledge_rags or [],
                llm_model_id=row.llm_model_id
            )
        return None

    async def upsert_meta_agent(self, data: dict) -> MetaAgent:
        existing = await self.get_meta_agent()
        if existing:
            stmt = update(MetaAgentTable).where(MetaAgentTable.id == existing.id).values(**data)
            await self.session.execute(stmt)
        else:
            # Defaults for creation if missing
            new_agent = MetaAgentTable(
                id=uuid4(),
                meta_agent_system_prompt=data.get("meta_agent_system_prompt", "You are Axon."),
                meta_agent_temperature=data.get("meta_agent_temperature", 0.7),
                meta_agent_rag_enabled=data.get("meta_agent_rag_enabled", True),
                meta_agent_system_knowledge_rags=data.get("meta_agent_system_knowledge_rags", []),
                llm_model_id=data.get("llm_model_id")
            )
            self.session.add(new_agent)
        
        await self.session.commit()
        return (await self.get_meta_agent())

    # --- Voice Meta Agent ---

    async def get_voice_meta_agent(self) -> Optional[VoiceMetaAgent]:
        result = await self.session.execute(select(VoiceMetaAgentTable).limit(1))
        row = result.scalar_one_or_none()
        if row:
            return VoiceMetaAgent(
                id=row.id,
                voice_provider=row.voice_provider,
                voice_id=row.voice_id,
                meta_agent_system_prompt=row.meta_agent_system_prompt
            )
        return None

    async def upsert_voice_meta_agent(self, data: dict) -> VoiceMetaAgent:
        existing = await self.get_voice_meta_agent()
        if existing:
            stmt = update(VoiceMetaAgentTable).where(VoiceMetaAgentTable.id == existing.id).values(**data)
            await self.session.execute(stmt)
        else:
             # Ensure mandatory fields are present or defaulted (though for voice provider/id usually explicit)
             # If API sends partial update for non-existent record, it might fail if mandatory fields missing.
             # We assume service layer handles defaults or validation.
             new_voice = VoiceMetaAgentTable(
                 id=uuid4(),
                 voice_provider=data.get("voice_provider"),
                 voice_id=data.get("voice_id"),
                 meta_agent_system_prompt=data.get("meta_agent_system_prompt", "")
             )
             self.session.add(new_voice)
        
        await self.session.commit()
        return (await self.get_voice_meta_agent())
