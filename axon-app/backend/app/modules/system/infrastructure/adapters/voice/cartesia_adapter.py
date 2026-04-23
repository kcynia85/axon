from typing import AsyncGenerator, Dict, Any
from app.modules.system.domain.ports.voice_port import VoiceProviderPort

class CartesiaAdapter(VoiceProviderPort):
    """
    Adapter for Cartesia Voice APIs.
    """
    
    async def generate_speech(self, text: str, config: Dict[str, Any]) -> AsyncGenerator[bytes, None]:
        # TODO: Implement actual Cartesia API call
        yield b""
        
    async def transcribe_audio(self, audio_data: bytes, config: Dict[str, Any]) -> str:
        # TODO: Implement actual Cartesia STT API call
        return ""

    async def get_voices(self) -> list[Dict[str, Any]]:
        # TODO: Implement Cartesia available voices fetch
        return []
