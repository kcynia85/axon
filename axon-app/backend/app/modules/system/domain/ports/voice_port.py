from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, Any

class VoiceProviderPort(ABC):
    """
    Port defining the standard interface for external Voice (TTS/STT) providers.
    """
    
    @abstractmethod
    async def generate_speech(self, text: str, config: Dict[str, Any]) -> AsyncGenerator[bytes, None]:
        """
        Generate a stream of audio bytes from text using the provider's specific configuration.
        """
        pass

    @abstractmethod
    async def transcribe_audio(self, audio_data: bytes, config: Dict[str, Any]) -> str:
        """
        Transcribe audio bytes to text using the provider's specific configuration.
        """
        pass
        
    @abstractmethod
    async def get_voices(self) -> list[Dict[str, Any]]:
        """
        Retrieve a list of available voices from the provider.
        """
        pass
