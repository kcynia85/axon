from typing import AsyncGenerator, Dict, Any, List
from fastapi import UploadFile
from app.modules.system.infrastructure.repo import SystemRepository
from app.modules.system.infrastructure.adapters.voice_adapter_factory import VoiceAdapterFactory
from app.modules.system.domain.models import VoiceMetaAgent
from app.modules.system.domain.enums import VoiceProvider
from uuid import uuid4

class VoiceInteractionService:
    def __init__(self, repo: SystemRepository):
        self.repo = repo

    async def _get_active_voice_agent(self) -> VoiceMetaAgent:
        voice_agent = await self.repo.get_voice_meta_agent()
        if voice_agent:
            return voice_agent
        
        # Fallback to default ElevenLabs config if nothing is in DB
        # This allows immediate usage if the API key is set in .env
        return VoiceMetaAgent(
            id=uuid4(),
            voice_provider=VoiceProvider.ELEVENLABS,
            provider_config={
                "voice_id": "pNInz6obpg8ndclKuztW", # Default "Rachel" voice or similar
                "stability": 0.5,
                "similarity_boost": 0.75
            },
            meta_agent_system_prompt="You are a helpful voice assistant.",
            meta_agent_temperature=0.7
        )

    async def handle_tts(self, text: str) -> AsyncGenerator[bytes, None]:
        voice_agent = await self._get_active_voice_agent()
        adapter = VoiceAdapterFactory.get_adapter(voice_agent.voice_provider)
        
        async for chunk in adapter.generate_speech(text, voice_agent.provider_config):
            yield chunk

    async def handle_stt(self, audio_data: bytes) -> str:
        voice_agent = await self._get_active_voice_agent()
        adapter = VoiceAdapterFactory.get_adapter(voice_agent.voice_provider)
        
        return await adapter.transcribe_audio(audio_data, voice_agent.provider_config)

    async def get_supported_models(self, provider: VoiceProvider) -> List[Dict[str, str]]:
        """
        Returns a list of supported models for a given voice provider.
        """
        if provider == VoiceProvider.ELEVENLABS:
            return [
                { "id": "eleven_multilingual_v2", "name": "Multilingual v2", "description": "Highest quality, support for 29 languages." },
                { "id": "eleven_turbo_v2_5", "name": "Turbo v2.5", "description": "Low latency, great for real-time applications." },
                { "id": "eleven_flash_v2_5", "name": "Flash v2.5", "description": "Lowest latency and cost." },
                { "id": "eleven_monolingual_v1", "name": "Monolingual v1", "description": "Legacy English-only model." },
            ]
        return []
