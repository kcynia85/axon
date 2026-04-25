from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from app.modules.system.domain.enums import VoiceProvider, VoiceInteractionMode

class MetaAgentResponse(BaseModel):
    id: UUID
    meta_agent_system_prompt: str
    meta_agent_temperature: float
    meta_agent_rag_enabled: bool
    meta_agent_system_knowledge_rags: List[Dict[str, Any]]
    llm_model_id: Optional[UUID]

class UpdateMetaAgentRequest(BaseModel):
    meta_agent_system_prompt: Optional[str] = None
    meta_agent_temperature: Optional[float] = None
    meta_agent_rag_enabled: Optional[bool] = None
    meta_agent_system_knowledge_rags: Optional[List[Dict[str, Any]]] = None
    llm_model_id: Optional[UUID] = None

class VoiceMetaAgentResponse(BaseModel):
    id: UUID
    voice_provider: VoiceProvider
    interaction_mode: VoiceInteractionMode
    provider_config: Dict[str, Any]
    meta_agent_system_prompt: str
    meta_agent_temperature: float

class UpdateVoiceMetaAgentRequest(BaseModel):
    voice_provider: Optional[VoiceProvider] = None
    interaction_mode: Optional[VoiceInteractionMode] = None
    provider_config: Optional[Dict[str, Any]] = None
    meta_agent_system_prompt: Optional[str] = None
    meta_agent_temperature: Optional[float] = None

class SystemAwarenessSettingsResponse(BaseModel):
    id: UUID
    embedding_model_id: Optional[UUID]
    indexing_enabled: bool
    realtime_sync_enabled: bool

class UpdateSystemAwarenessSettingsRequest(BaseModel):
    embedding_model_id: Optional[UUID] = None
    indexing_enabled: Optional[bool] = None
    realtime_sync_enabled: Optional[bool] = None
