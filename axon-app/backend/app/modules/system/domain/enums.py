from enum import Enum

class UserRole(str, Enum):
    ADMIN = "Admin"
    WORKER = "Worker"

class VoiceInteractionMode(str, Enum):
    STT_ONLY = "STT_ONLY"
    LIVE_CONVERSATION = "LIVE_CONVERSATION"

class VoiceProvider(str, Enum):
    ELEVENLABS = "ElevenLabs"
    INWORLD_AI = "Inworld_AI"
    CARTESIA = "Cartesia"
    GOOGLE_CLOUD = "Google_Cloud"
    MICROSOFT_AZURE = "Microsoft_Azure"
    AMAZON_POLLY = "Amazon_Polly"
