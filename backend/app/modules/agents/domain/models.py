from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.app.modules.agents.domain.enums import AgentRole, ModelTier
from backend.app.shared.utils.time import now_utc

class Message(BaseModel):
    role: str # user, model, system
    content: str
    timestamp: datetime = Field(default_factory=now_utc)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class AgentConfig(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    role: AgentRole
    description: str = "" # UI Description
    model_tier: ModelTier = ModelTier.TIER_2_EXPERT
    tools: List[str] = Field(default_factory=list)
    system_instruction: str = "" # Full text of the prompt
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class ChatSession(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    agent_role: AgentRole
    history: List[Message] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
