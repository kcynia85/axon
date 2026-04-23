from typing import AsyncGenerator, Dict, Any
from app.modules.system.domain.ports.voice_port import VoiceProviderPort

class InworldAIAdapter(VoiceProviderPort):
    """
    Adapter for Inworld AI. Note that Inworld handles broader interaction,
    but this maps it to the standard TTS/STT interface.
    """
    
    async def generate_speech(self, text: str, config: Dict[str, Any]) -> AsyncGenerator[bytes, None]:
        # TODO: Implement actual Inworld AI interaction map
        yield b""

    async def transcribe_audio(self, audio_data: bytes, config: Dict[str, Any]) -> str:
        # TODO: Implement actual Inworld AI STT interaction map
        return ""
        
    async def get_voices(self) -> list[Dict[str, Any]]:
        # TODO: Implement Inworld characters fetch
        return []
