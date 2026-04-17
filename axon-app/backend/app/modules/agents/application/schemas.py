from pydantic import BaseModel, Field
from uuid import UUID
from typing import List, Optional
from app.modules.agents.domain.enums import AgentRole

class ChatRequest(BaseModel):
    project_id: UUID
    agent_role: Optional[AgentRole] = None
    message: str

class ContextUsage(BaseModel):
    current: int
    total: int

class CostBreakdown(BaseModel):
    agentSetup: float
    ragUsage: float
    toolCalls: float
    inputTokens: float
    outputTokens: float

class CostEstimateResponse(BaseModel):
    staticCost: float
    dynamicCost: float
    totalEstimate: float
    contextUsage: ContextUsage
    breakdown: CostBreakdown
    suggestions: List[str] = Field(default_factory=list)

class AffectedCrew(BaseModel):
    id: str
    name: str
    role: str
