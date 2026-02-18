from enum import Enum

class UserRole(str, Enum):
    ADMIN = "Admin"
    WORKER = "Worker"

class VoiceProvider(str, Enum):
    ELEVENLABS = "ElevenLabs"
    AZURE_TTS = "Azure_TTS"
    GOOGLE_TTS = "Google_TTS"
