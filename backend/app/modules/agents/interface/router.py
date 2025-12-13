from fastapi import APIRouter
from pydantic import BaseModel
from uuid import UUID
from sse_starlette.sse import EventSourceResponse
from backend.app.modules.agents.domain.enums import AgentRole
from backend.app.modules.agents.application.orchestrator import AgentOrchestrator

router = APIRouter(prefix="/agents", tags=["agents"])

class ChatRequest(BaseModel):
    project_id: UUID
    agent_role: AgentRole
    message: str

# Instantiate Orchestrator
orchestrator = AgentOrchestrator()

@router.post("/chat/stream")
async def stream_chat(request: ChatRequest):
    """
    Streams the agent's response to a user message.
    """
    # 1. Create temporary session (in future: load by session_id)
    session = await orchestrator.create_session(request.project_id, request.agent_role)
    
    # 2. Return SSE
    return EventSourceResponse(
        orchestrator.run_turn_stream(session, request.message)
    )
