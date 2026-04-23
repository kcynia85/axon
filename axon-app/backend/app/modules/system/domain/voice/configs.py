from typing import Any, Dict, Optional
from pydantic import BaseModel, Field

class ElevenLabsConfig(BaseModel):
    voice_id: str
    stability: float = Field(default=0.5, ge=0.0, le=1.0)
    similarity_boost: float = Field(default=0.75, ge=0.0, le=1.0)
    style: float = Field(default=0.0, ge=0.0, le=1.0)
    use_speaker_boost: bool = True

class InworldAIConfig(BaseModel):
    character_id: str
    scene_id: Optional[str] = None

class CartesiaConfig(BaseModel):
    voice_id: str
    model_id: str = "sonic-english"

class GoogleCloudConfig(BaseModel):
    voice_id: str
    language_code: str = "en-US"

class MicrosoftAzureConfig(BaseModel):
    voice_id: str
    language_code: str = "en-US"

class AmazonPollyConfig(BaseModel):
    voice_id: str
    engine: str = "neural"
    language_code: str = "en-US"

# A unified type for configuration dict parsing if needed
VoiceProviderConfig = ElevenLabsConfig | InworldAIConfig | CartesiaConfig | GoogleCloudConfig | MicrosoftAzureConfig | AmazonPollyConfig | Dict[str, Any]
