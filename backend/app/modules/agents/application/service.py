from fastapi import Depends
from typing import List
import inngest
from backend.app.modules.agents.application.schemas import ChatRequest
from backend.app.modules.agents.application import orchestrator
from backend.app.modules.agents.dependencies import get_inngest_client
from backend.app.modules.agents.domain.models import Tool

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
