from fastapi import Depends
from typing import List, Optional
from uuid import UUID
import inngest
from app.modules.agents.application.schemas import ChatRequest
from app.modules.agents.application import orchestrator
from app.modules.agents.dependencies import get_inngest_client, get_agent_repo
from app.modules.agents.domain.models import Tool, AgentConfig
from app.modules.agents.infrastructure.repo import AgentConfigRepository

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
    workspace: Optional[str] = None,
    repo: AgentConfigRepository = Depends(get_agent_repo)
) -> List[AgentConfig]:
    return await repo.list_all(workspace=workspace)

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

async def inspect_agent_deletion_use_case(
    id: UUID,
    repo: AgentConfigRepository = Depends(get_agent_repo)
) -> List[dict]:
    """Returns assignments that would be affected by deleting this agent."""
    return await repo.get_assigned_crews(id)

import tiktoken
from app.modules.settings.infrastructure.repo import SettingsRepository
from app.modules.settings.dependencies import get_settings_repo

async def estimate_cost_use_case(
    id: UUID,
    repo: AgentConfigRepository = Depends(get_agent_repo),
    settings_repo: SettingsRepository = Depends(get_settings_repo)
) -> dict:
    agent = await repo.get(id)
    if not agent:
        return {}
    
    model_id = agent.llm_model_id
    model = None
    if model_id:
        model = await settings_repo.get_llm_model(model_id)
    
    # 1. Calculate Prompt Tokens
    full_prompt = f"{agent.agent_role_text or ''}\n{agent.agent_goal or ''}\n{agent.agent_backstory or ''}"
    if agent.guardrails:
        full_prompt += "\n" + "\n".join(agent.guardrails.get("instructions", []))
        full_prompt += "\n" + "\n".join(agent.guardrails.get("constraints", []))
    
    # Simple token counting using cl100k_base (OpenAI default)
    # TODO: Use strategy from provider config if available
    try:
        encoding = tiktoken.get_encoding("cl100k_base")
        input_tokens = len(encoding.encode(full_prompt))
    except Exception:
        input_tokens = len(full_prompt) // 4
    
    # 2. Calculate Costs
    input_price_1m = 0.0
    output_price_1m = 0.0
    context_window = 4096
    
    if model:
        pricing = model.model_pricing_config or {}
        input_price_1m = pricing.get("input", 0.0)
        output_price_1m = pricing.get("output", 0.0)
        context_window = model.model_context_window or 4096
    
    input_cost = (input_tokens / 1_000_000) * input_price_1m
    
    # Estimate output cost (assuming average 500 tokens)
    avg_output_tokens = 500
    output_cost = (avg_output_tokens / 1_000_000) * output_price_1m
    
    static_setup_cost = 0.001
    rag_cost = 0.005 if agent.knowledge_hub_ids else 0.0
    
    total_estimate = input_cost + output_cost + static_setup_cost + rag_cost
    
    return {
        "staticCost": static_setup_cost + rag_cost,
        "dynamicCost": input_cost + output_cost,
        "totalEstimate": total_estimate,
        "contextUsage": {
            "current": input_tokens,
            "total": context_window
        },
        "breakdown": {
            "agentSetup": static_setup_cost,
            "ragUsage": rag_cost,
            "toolCalls": 0.0,
            "inputTokens": input_cost,
            "outputTokens": output_cost
        },
        "suggestions": ["Consider a shorter prompt" if input_tokens > 2000 else "Model configuration looks good"]
    }
