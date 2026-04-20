from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, Dict, List, Any
from pydantic import BaseModel, Field
from app.shared.utils.time import now_utc
from app.modules.system.domain.enums import UserRole, VoiceProvider

class User(BaseModel):
    id: UUID
    user_email: str
    user_email_verified: bool = False
    user_display_name: str
    user_avatar_url: Optional[str] = None
    user_password_hash: str # Should be hidden in response DTO
    user_preferences: Dict[str, Any] = Field(default_factory=dict)
    user_role: UserRole = UserRole.WORKER
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    last_login_at: Optional[datetime] = None

class MetaAgent(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    meta_agent_system_prompt: str
    meta_agent_temperature: float = 0.7
    meta_agent_rag_enabled: bool = True
    meta_agent_system_knowledge_rags: List[Dict[str, Any]] = Field(default_factory=list)
    llm_model_id: Optional[UUID] = None

class VoiceMetaAgent(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    voice_provider: VoiceProvider
    voice_id: str
    meta_agent_system_prompt: str
    meta_agent_temperature: float = 0.7

class SystemAwarenessSearchResult(BaseModel):
    """
    Result returned by the SystemAwarenessRetrieverService.
    """
    entity_id: UUID
    entity_type: str
    payload: Dict[str, Any]
    similarity_score: float
