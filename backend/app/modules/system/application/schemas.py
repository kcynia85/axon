from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from uuid import UUID
from backend.app.modules.system.domain.enums import VoiceProvider

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
    voice_id: str
    meta_agent_system_prompt: str

class UpdateVoiceMetaAgentRequest(BaseModel):
    voice_provider: Optional[VoiceProvider] = None
    voice_id: Optional[str] = None
    meta_agent_system_prompt: Optional[str] = None
