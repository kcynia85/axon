import inngest
from app.shared.infrastructure.inngest_client import inngest_client
# from app.shared.infrastructure.adk import GoogleADK
# from app.modules.agents.application.context_composer import ContextComposer
# from app.modules.agents.application.definitions import get_agent_definition, CRITIC_INSTRUCTION, REFINER_INSTRUCTION
from app.modules.agents.domain.enums import AgentRole

# New Imports for Persistence
# from app.shared.infrastructure.database import AsyncSessionLocal
# from app.modules.projects.infrastructure.repo import ArtifactRepository
# from app.modules.projects.domain.models import Artifact
# from app.modules.projects.domain.enums import FileType, ReviewState
# from app.shared.utils.time import now_utc
# from uuid import uuid4, UUID

@inngest_client.create_function(
    fn_id="agent-writer-loop",
    trigger=inngest.TriggerEvent(event="agent/turn.requested", expression="event.data.agent_role == 'AgentRole.WRITER'"),
)
async def writer_workflow(ctx, step):
    """
    Durable Workflow for the Writer Agent (Loop Pattern).
    """
    return {"status": "disabled"}

@inngest_client.create_function(
    fn_id="agent-generic-turn",
    trigger=inngest.TriggerEvent(event="agent/turn.requested", expression="event.data.agent_role != 'AgentRole.WRITER'"),
)
async def generic_agent_workflow(ctx, step):
    """
    Generic Durable Workflow for Standard Agents (Researcher, Builder, Manager).
    """
    import os
    import traceback
    
    print(f"WORKFLOW STARTED: agent-generic-turn | Event: {ctx.event.id}")
    print("Debug: This is a minimal print.")
    
    try:
        return {"status": "minimal_success"}
    except Exception as e:
        print(f"WORKFLOW FAILED (minimal): {e}")
        traceback.print_exc()
        raise e
