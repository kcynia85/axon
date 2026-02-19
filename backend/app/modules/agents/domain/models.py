from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import List, Dict, Any, Literal, Optional
from app.modules.agents.domain.enums import AgentRole, ModelTier
from app.shared.utils.time import now_utc

class Tool(BaseModel):
    id: str
    name: str
    description: str
    type: Literal["NATIVE", "MCP", "FUNCTION"]
    status: Literal["ACTIVE", "INACTIVE"]

class Message(BaseModel):
    role: str # user, model, system
    content: str
    timestamp: datetime = Field(default_factory=now_utc)
    metadata: Dict[str, Any] = Field(default_factory=dict)

class AgentConfig(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    # Legacy fields
    role: Optional[AgentRole] = None
    description: str = "" # UI Description
    model_tier: ModelTier = ModelTier.TIER_2_EXPERT
    tools: List[str] = Field(default_factory=list)
    system_instruction: str = "" # Full text of the prompt
    
    # vNext Fields
    agent_name: Optional[str] = None
    agent_role_text: Optional[str] = None # Replacing enum role for custom agents
    agent_goal: Optional[str] = None
    agent_backstory: Optional[str] = None
    guardrails: Dict[str, List[str]] = Field(default_factory=lambda: {"instructions": [], "constraints": []})
    few_shot_examples: List[Dict[str, Any]] = Field(default_factory=list)
    reflexion: bool = False
    temperature: float = 0.7
    rag_enforcement: bool = False
    input_schema: Optional[Dict[str, Any]] = None
    output_schema: Optional[Dict[str, Any]] = None
    availability_workspace: List[str] = Field(default_factory=list)
    agent_keywords: List[str] = Field(default_factory=list)
    
    llm_model_id: Optional[UUID] = None
    knowledge_hub_ids: Optional[List[UUID]] = None
    
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    deleted_at: Optional[datetime] = None

class ChatSession(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    agent_role: Optional[AgentRole] = None # Legacy? Or still used?
    history: List[Message] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
