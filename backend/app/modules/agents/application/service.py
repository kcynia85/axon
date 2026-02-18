from fastapi import Depends
from typing import List, Optional
from uuid import UUID
import inngest
from backend.app.modules.agents.application.schemas import ChatRequest
from backend.app.modules.agents.application import orchestrator
from backend.app.modules.agents.dependencies import get_inngest_client, get_agent_repo
from backend.app.modules.agents.domain.models import Tool, AgentConfig
from backend.app.modules.agents.infrastructure.repo import AgentConfigRepository

# Function-First Service Layer

async def stream_chat_use_case(
    request: ChatRequest,
    inngest_client: inngest.Inngest = Depends(get_inngest_client)
):
    """
    Orchestrates the chat session creation and streaming response.
    Returns an async generator.
    """
    # 1. Create temporary session (in future: load by session_id)
    session = await orchestrator.create_session(request.project_id, request.agent_role)
    
    # 2. Return the generator directly, injecting infrastructure
    return orchestrator.run_turn_stream(
        session=session, 
        user_input=request.message,
        inngest_client=inngest_client
    )

async def get_available_tools() -> List[Tool]:
    """
    Returns a list of available tools in the system.
    """
    return [
        Tool(
            id="search_knowledge",
            name="Knowledge Search",
            description="Semantically search the project's vector database for relevant memories and assets.",
            type="NATIVE",
            status="ACTIVE"
        ),
        Tool(
            id="google_search",
            name="Google Web Search",
            description="Search the live internet for up-to-date information via Google API.",
            type="FUNCTION",
            status="ACTIVE"
        ),
         Tool(
            id="github_mcp",
            name="GitHub MCP",
            description="Model Context Protocol server for interacting with GitHub repositories.",
            type="MCP",
            status="ACTIVE"
        ),
         Tool(
            id="filesystem_mcp",
            name="Filesystem MCP",
            description="Safe access to the local filesystem for reading and writing files.",
            type="MCP",
            status="ACTIVE"
        )
    ]

# --- Agent CRUD ---

async def list_agents_use_case(
    repo: AgentConfigRepository = Depends(get_agent_repo)
) -> List[AgentConfig]:
    return await repo.list_all()

async def create_agent_use_case(
    agent: AgentConfig,
    repo: AgentConfigRepository = Depends(get_agent_repo)
) -> AgentConfig:
    return await repo.create(agent)

async def get_agent_use_case(
    id: UUID,
    repo: AgentConfigRepository = Depends(get_agent_repo)
) -> Optional[AgentConfig]:
    return await repo.get(id)

async def update_agent_use_case(
    id: UUID,
    agent: AgentConfig,
    repo: AgentConfigRepository = Depends(get_agent_repo)
) -> Optional[AgentConfig]:
    return await repo.update(id, agent.model_dump(exclude_unset=True))

async def delete_agent_use_case(
    id: UUID,
    repo: AgentConfigRepository = Depends(get_agent_repo)
) -> bool:
    return await repo.delete(id)

async def estimate_cost_use_case(
    id: UUID,
    repo: AgentConfigRepository = Depends(get_agent_repo)
) -> dict:
    agent = await repo.get(id)
    if not agent:
        return {}
    # Mock estimation
    return {
        "staticCost": 0.01,
        "dynamicCost": 0.05,
        "totalEstimate": 0.06,
        "breakdown": {
            "agentSetup": 0.01,
            "ragUsage": 0.02,
            "toolCalls": 0.02,
            "inputTokens": 0.005,
            "outputTokens": 0.005
        },
        "suggestions": ["Use cheaper model", "Reduce history"]
    }
