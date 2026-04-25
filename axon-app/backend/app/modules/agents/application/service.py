from fastapi import Depends
from typing import List, Optional
from uuid import UUID
import inngest
from sqlalchemy.ext.asyncio import AsyncSession
from app.modules.agents.application.schemas import ChatRequest, CostEstimateResponse, ContextUsage, CostBreakdown, AffectedCrew
from app.modules.agents.application import orchestrator
from app.modules.agents.dependencies import get_inngest_client, get_db
from app.modules.agents.domain.models import Tool, AgentConfig
from app.modules.agents.infrastructure import repo as agent_repo
from app.shared.infrastructure.inngest_client import inngest_client

# Function-First Service Layer

async def stream_chat_use_case(
    request: ChatRequest,
    inngest_client_dep: inngest.Inngest = Depends(get_inngest_client)
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
        inngest_client=inngest_client_dep
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
    session: AsyncSession = Depends(get_db)
) -> List[AgentConfig]:
    return await agent_repo.list_agent_configs(session, workspace=workspace)

async def create_agent_use_case(
    agent: AgentConfig,
    session: AsyncSession = Depends(get_db)
) -> AgentConfig:
    created = await agent_repo.create_agent_config(session, agent)
    try:
        await inngest_client.send(
            inngest.Event(
                name="system.entity.upserted",
                data={
                    "entity_id": str(created.id),
                    "entity_type": "agent",
                    "payload": created.model_dump(mode="json")
                }
            )
        )
    except Exception as e:
        print(f"Failed to send Inngest event for agent creation: {e}")
    return created

async def get_agent_use_case(
    id: UUID,
    session: AsyncSession = Depends(get_db)
) -> Optional[AgentConfig]:
    return await agent_repo.get_agent_config(session, id)

async def update_agent_use_case(
    id: UUID,
    agent: AgentConfig,
    session: AsyncSession = Depends(get_db)
) -> Optional[AgentConfig]:
    updated = await agent_repo.update_agent_config(session, id, agent.model_dump(exclude_unset=True))
    if updated:
        try:
            await inngest_client.send(
                inngest.Event(
                    name="system.entity.upserted",
                    data={
                        "entity_id": str(updated.id),
                        "entity_type": "agent",
                        "payload": updated.model_dump(mode="json")
                    }
                )
            )
        except Exception as e:
            print(f"Failed to send Inngest event for agent update: {e}")
    return updated

async def delete_agent_use_case(
    id: UUID,
    session: AsyncSession = Depends(get_db)
) -> bool:
    success = await agent_repo.delete_agent_config(session, id)
    if success:
        try:
            await inngest_client.send(
                inngest.Event(
                    name="system.entity.deleted",
                    data={
                        "entity_id": str(id),
                        "entity_type": "agent"
                    }
                )
            )
        except Exception as e:
            print(f"Failed to send Inngest event for agent deletion: {e}")
    return success

async def inspect_agent_deletion_use_case(
    id: UUID,
    session: AsyncSession = Depends(get_db)
) -> List[AffectedCrew]:
    """Returns assignments that would be affected by deleting this agent."""
    crews = await agent_repo.get_agent_assigned_crews(session, id)
    return [AffectedCrew(**c) for c in crews]

import tiktoken

async def estimate_cost_use_case(
    id: UUID,
    session: AsyncSession = Depends(get_db)
) -> Optional[CostEstimateResponse]:
    agent = await agent_repo.get_agent_config(session, id)
    if not agent:
        return None
    
    model_id = agent.llm_model_id
    model = None
    if model_id:
        # Assuming settings repo also refactored to functions
        from app.modules.settings.infrastructure.repo import get_llm_model
        model = await get_llm_model(session, model_id)
    
    # 1. Calculate Prompt Tokens
    full_prompt = f"{agent.agent_role_text or ''}\n{agent.agent_goal or ''}\n{agent.agent_backstory or ''}"
    if agent.guardrails:
        full_prompt += "\n" + "\n".join(agent.guardrails.get("instructions", []))
        full_prompt += "\n" + "\n".join(agent.guardrails.get("constraints", []))
    
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
    avg_output_tokens = 500
    output_cost = (avg_output_tokens / 1_000_000) * output_price_1m
    
    static_setup_cost = 0.001
    rag_cost = 0.005 if agent.knowledge_hub_ids else 0.0
    
    total_estimate = input_cost + output_cost + static_setup_cost + rag_cost
    
    return CostEstimateResponse(
        staticCost=static_setup_cost + rag_cost,
        dynamicCost=input_cost + output_cost,
        totalEstimate=total_estimate,
        contextUsage=ContextUsage(
            current=input_tokens,
            total=context_window
        ),
        breakdown=CostBreakdown(
            agentSetup=static_setup_cost,
            ragUsage=rag_cost,
            toolCalls=0.0,
            inputTokens=input_cost,
            outputTokens=output_cost
        ),
        suggestions=["Consider a shorter prompt" if input_tokens > 2000 else "Model configuration looks good"]
    )
