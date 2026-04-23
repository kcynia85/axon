import httpx
from typing import AsyncGenerator, Dict, Any
from app.modules.system.domain.ports.voice_port import VoiceProviderPort
from app.config import settings

class ElevenLabsAdapter(VoiceProviderPort):
    """
    Adapter for ElevenLabs Voice APIs.
    """
    
    def __init__(self):
        self.api_key = settings.ELEVENLABS_API_KEY
        self.base_url = "https://api.elevenlabs.io/v1"

    async def generate_speech(self, text: str, config: Dict[str, Any]) -> AsyncGenerator[bytes, None]:
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY is not configured")
            
        voice_id = config.get("voice_id")
        if not voice_id:
            raise ValueError("voice_id is required for ElevenLabs TTS")

        url = f"{self.base_url}/text-to-speech/{voice_id}/stream"
        headers = {
            "xi-api-key": self.api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "text": text,
            "model_id": config.get("model_id", "eleven_multilingual_v2"),
            "voice_settings": {
                "stability": config.get("stability", 0.5),
                "similarity_boost": config.get("similarity_boost", 0.75),
                "style": config.get("style", 0.0),
                "use_speaker_boost": config.get("use_speaker_boost", True),
                "speed": config.get("speed", 1.0)
            }
        }
        
        async with httpx.AsyncClient() as client:
            async with client.stream("POST", url, headers=headers, json=payload) as response:
                response.raise_for_status()
                async for chunk in response.aiter_bytes():
                    yield chunk

    async def transcribe_audio(self, audio_data: bytes, config: Dict[str, Any]) -> str:
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY is not configured")
            
        url = f"{self.base_url}/speech-to-text"
        headers = {
            "xi-api-key": self.api_key
        }
        # WebM is typically what browsers send via MediaRecorder
        files = {
            "file": ("audio.webm", audio_data, "audio/webm")
        }
        data = {
            "model_id": "scribe_v1"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(url, headers=headers, files=files, data=data)
            response.raise_for_status()
            result = response.json()
            return result.get("text", "")

    async def get_voices(self) -> list[Dict[str, Any]]:
        if not self.api_key:
            raise ValueError("ELEVENLABS_API_KEY is not configured")
            
        url = f"{self.base_url}/voices"
        headers = {
            "xi-api-key": self.api_key
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            voices = response.json().get("voices", [])
            return [
                {
                    "voice_id": voice["voice_id"],
                    "name": voice["name"],
                    "category": voice.get("category", "")
                }
                for voice in voices
            ]
