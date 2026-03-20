from fastapi import APIRouter, Depends, status, HTTPException
from typing import List, Optional
from uuid import UUID
from sse_starlette.sse import EventSourceResponse
from app.modules.agents.application import service
from app.modules.agents.domain.models import Tool, AgentConfig
from app.api.deps import get_current_user

from app.modules.resources.application.service import ResourcesService
from app.modules.resources.dependencies import get_resources_service
from app.modules.resources.application.schemas import PromptArchetypeResponse

router = APIRouter(
    prefix="/agents", 
    tags=["agents"],
    dependencies=[Depends(get_current_user)]
)

# --- Chat & Tools ---

@router.post("/chat/stream")
async def stream_chat(
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

# --- Agent CRUD ---

@router.get("/", response_model=List[AgentConfig])
async def list_agents(
    workspace: Optional[str] = None,
    agents: List[AgentConfig] = Depends(service.list_agents_use_case)
):
    """List all agents, optionally filtered by workspace."""
    return agents

@router.post("/", response_model=AgentConfig, status_code=status.HTTP_201_CREATED)
async def create_agent(
    agent: AgentConfig = Depends(service.create_agent_use_case)
):
    """Create a new agent configuration."""
    return agent

@router.get("/{id}", response_model=AgentConfig)
async def get_agent(
    agent: Optional[AgentConfig] = Depends(service.get_agent_use_case)
):
    """Get agent details."""
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.put("/{id}", response_model=AgentConfig)
async def update_agent(
    agent: Optional[AgentConfig] = Depends(service.update_agent_use_case)
):
    """Update agent details."""
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_agent(
    deleted: bool = Depends(service.delete_agent_use_case)
):
    """Delete an agent."""
    if not deleted:
        raise HTTPException(status_code=404, detail="Agent not found")
    return

@router.get("/{id}/inspect-deletion", response_model=List[dict])
async def inspect_agent_deletion(
    id: UUID,
    assignments: List[dict] = Depends(service.inspect_agent_deletion_use_case)
):
    """Check what crews will be affected by deleting this agent."""
    return assignments

@router.post("/{id}/cost-estimate")
async def estimate_cost(
    estimate: dict = Depends(service.estimate_cost_use_case)
):
    """Estimate cost for an agent."""
    if not estimate:
        raise HTTPException(status_code=404, detail="Agent not found")
    return estimate

@router.get("/archetypes", response_model=List[PromptArchetypeResponse])
async def list_agent_archetypes(
    resources_service: ResourcesService = Depends(get_resources_service)
):
    """List all prompt archetypes (proxy to resources)."""
    return await resources_service.list_prompt_archetypes()
