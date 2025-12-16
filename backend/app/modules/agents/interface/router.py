from fastapi import APIRouter, Depends
from typing import List
from sse_starlette.sse import EventSourceResponse
from backend.app.modules.agents.application import service
from backend.app.modules.agents.domain.models import Tool
from backend.app.api.deps import get_current_user

router = APIRouter(
    prefix="/agents", 
    tags=["agents"],
    dependencies=[Depends(get_current_user)]
)

@router.post("/chat/stream")
async def stream_chat(
    # Service returns the generator, we wrap it here because SSE is an Interface concern
    generator = Depends(service.stream_chat_use_case)
):
    """
    Streams the agent's response to a user message.
    """
    return EventSourceResponse(generator)

@router.get("/tools", response_model=List[Tool])
async def list_tools(
    tools: List[Tool] = Depends(service.get_available_tools)
):
    """
    List all available tools.
    """
    return tools