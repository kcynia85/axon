import asyncio
import os
import sys
from uuid import UUID

async def main():
    sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__))))
    from app.shared.infrastructure.database import AsyncSessionLocal
    from app.modules.system.infrastructure.repo import SystemRepository
    from app.modules.system.application.schemas import UpdateVoiceMetaAgentRequest
    
    data = {
        "voice_provider": "ElevenLabs",
        "interaction_mode": "LIVE_CONVERSATION",
        "provider_config": {"voice_id": "test"},
        "meta_agent_system_prompt": "test"
    }
    
    async with AsyncSessionLocal() as session:
        repo = SystemRepository(session)
        try:
            update_req = UpdateVoiceMetaAgentRequest(**data)
            result = await repo.upsert_voice_meta_agent(update_req.model_dump(exclude_unset=True))
            print("SUCCESS:", result)
        except Exception as e:
            print("FAILED:", str(e))

if __name__ == "__main__":
    asyncio.run(main())
