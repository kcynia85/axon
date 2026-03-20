"""
T4: crew_runner facade + Inngest handler
Delegates to current flow for migration without Big-Bang.
"""

import inngest
from uuid import UUID
from typing import Any
from app.shared.infrastructure.inngest_client import inngest_client
from app.modules.agents.application.orchestrator import create_session, run_turn_stream
from app.modules.agents.domain.enums import AgentRole


class CrewRunnerFacade:
    """
    T4: crew_runner facade - provides a unified interface for running crew operations.
    Currently delegates to the existing orchestrator flow.
    """

    @staticmethod
    async def run_crew_turn(
        project_id: UUID,
        agent_role: AgentRole,
        user_input: str,
        crew_config: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        """
        Run a single turn with a crew agent.
        Delegates to current orchestrator flow.
        """
        # Create session
        session = await create_session(project_id, agent_role)
        
        # Collect streaming response
        chunks = []
        async for chunk in run_turn_stream(session, user_input, inngest_client):
            chunks.append(chunk)
        
        return {
            "status": "success",
            "response": "".join(chunks),
            "session_id": str(session.id),
            "agent_role": str(agent_role)
        }

    @staticmethod
    async def run_sequential_crew(
        project_id: UUID,
        agent_sequence: list[AgentRole],
        user_input: str
    ) -> dict[str, Any]:
        """
        Run agents in sequence (Sequential Process).
        Each agent's output becomes the next agent's input.
        """
        current_input = user_input
        results = []
        
        for agent_role in agent_sequence:
            result = await CrewRunnerFacade.run_crew_turn(
                project_id=project_id,
                agent_role=agent_role,
                user_input=current_input
            )
            results.append(result)
            # Output of this agent becomes input for next
            current_input = result.get("response", current_input)
        
        return {
            "status": "success",
            "process_type": "sequential",
            "results": results,
            "final_output": current_input
        }

    @staticmethod
    async def run_hierarchical_crew(
        project_id: UUID,
        manager_agent: AgentRole,
        worker_agents: list[AgentRole],
        user_input: str
    ) -> dict[str, Any]:
        """
        Run hierarchical crew process.
        Manager delegates to workers and synthesizes results.
        Currently a stub - delegates to manager agent only.
        """
        # For now, just run the manager agent
        # Future: implement delegation and synthesis logic
        result = await CrewRunnerFacade.run_crew_turn(
            project_id=project_id,
            agent_role=manager_agent,
            user_input=user_input
        )
        
        return {
            "status": "success",
            "process_type": "hierarchical",
            "manager_result": result,
            "delegated_workers": [str(a) for a in worker_agents]
        }


# Inngest handler functions that use the facade
@inngest_client.create_function(
    fn_id="crew-sequential-run",
    trigger=inngest.TriggerEvent(event="crew/sequential.requested"),
)
async def crew_sequential_handler(ctx: inngest.Context, step: inngest.Step):
    """
    Inngest handler for sequential crew execution.
    """
    data = ctx.event.data
    
    project_id = UUID(data["project_id"])
    agent_roles = [AgentRole(role) for role in data["agent_sequence"]]
    user_input = data["user_input"]
    
    result = await CrewRunnerFacade.run_sequential_crew(
        project_id=project_id,
        agent_sequence=agent_roles,
        user_input=user_input
    )
    
    return result


@inngest_client.create_function(
    fn_id="crew-hierarchical-run",
    trigger=inngest.TriggerEvent(event="crew/hierarchical.requested"),
)
async def crew_hierarchical_handler(ctx: inngest.Context, step: inngest.Step):
    """
    Inngest handler for hierarchical crew execution.
    """
    data = ctx.event.data
    
    project_id = UUID(data["project_id"])
    manager_agent = AgentRole(data["manager_agent"])
    worker_agents = [AgentRole(role) for role in data["worker_agents"]]
    user_input = data["user_input"]
    
    result = await CrewRunnerFacade.run_hierarchical_crew(
        project_id=project_id,
        manager_agent=manager_agent,
        worker_agents=worker_agents,
        user_input=user_input
    )
    
    return result


@inngest_client.create_function(
    fn_id="crew-single-turn",
    trigger=inngest.TriggerEvent(event="crew/single-turn.requested"),
)
async def crew_single_turn_handler(ctx: inngest.Context, step: inngest.Step):
    """
    Inngest handler for single agent turn.
    """
    data = ctx.event.data
    
    project_id = UUID(data["project_id"])
    agent_role = AgentRole(data["agent_role"])
    user_input = data["user_input"]
    
    result = await CrewRunnerFacade.run_crew_turn(
        project_id=project_id,
        agent_role=agent_role,
        user_input=user_input
    )
    
    return result
