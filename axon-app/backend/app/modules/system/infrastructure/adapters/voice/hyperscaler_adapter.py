from typing import AsyncGenerator, Dict, Any
from app.modules.system.domain.ports.voice_port import VoiceProviderPort

class HyperscalerAdapter(VoiceProviderPort):
    """
    Unified Adapter for Hyperscalers (Google Cloud, Microsoft Azure, Amazon Polly).
    Uses the underlying unified SDKs to perform text-to-speech.
    """
    
    def __init__(self, provider_name: str):
        self.provider_name = provider_name

    async def generate_speech(self, text: str, config: Dict[str, Any]) -> AsyncGenerator[bytes, None]:
        # TODO: Route to Google/Azure/AWS based on self.provider_name
        yield b""
        
    async def transcribe_audio(self, audio_data: bytes, config: Dict[str, Any]) -> str:
        # TODO: Route STT to Google/Azure/AWS based on self.provider_name
        return ""

    async def get_voices(self) -> list[Dict[str, Any]]:
        # TODO: Implement available voices fetch for the specific hyperscaler
        return []
