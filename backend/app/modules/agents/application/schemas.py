from pydantic import BaseModel
from uuid import UUID
from app.modules.agents.domain.enums import AgentRole

class ChatRequest(BaseModel):
    project_id: UUID
    agent_role: AgentRole
    message: str
