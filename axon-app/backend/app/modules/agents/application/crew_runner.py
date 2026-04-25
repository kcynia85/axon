import inngest
from uuid import UUID
from typing import Dict, Any, List

from app.modules.agents.domain.ports.crew_engine import ICrewEngine
from app.modules.agents.infrastructure.repo import AgentConfigRepository
from app.modules.workspaces.infrastructure.repo import WorkspaceRepository
from app.shared.infrastructure.inngest_client import inngest_client

class CrewRunnerUseCase:
    """
    Application use case for executing CrewAI processes via Hexagonal Ports & Adapters.
    """
    def __init__(
        self, 
        crew_engine: ICrewEngine, 
        agent_repo: AgentConfigRepository, 
        workspace_repo: WorkspaceRepository
    ):
        self.crew_engine = crew_engine
        self.agent_repo = agent_repo
        self.workspace_repo = workspace_repo

    async def execute_crew(self, crew_id: UUID, user_input: str) -> Dict[str, Any]:
        """
        Fetches the crew and its members from repos, hydrates them, and runs kickoff via CrewEngine adapter.
        """
        # 1. Fetch Crew
        crew = await self.workspace_repo.get_crew(crew_id)
        if not crew:
            raise ValueError(f"Crew {crew_id} not found")

        # 2. Fetch and Hydrate Agents
        hydrated_agents = []
        for agent_id in crew.agent_member_ids:
            agent = await self.agent_repo.get(agent_id)
            if agent:
                hydrated_agents.append(agent)
                
        if not hydrated_agents and crew.manager_agent_id:
             manager = await self.agent_repo.get(crew.manager_agent_id)
             if manager:
                 hydrated_agents.append(manager)

        # 3. Delegate to Engine
        result = await self.crew_engine.kickoff_crew(crew, hydrated_agents, user_input)
        
        return result

    async def execute_single_agent(self, agent_id: UUID, user_input: str) -> Dict[str, Any]:
        """
        Fetches a single agent and executes it via CrewEngine adapter.
        """
        agent = await self.agent_repo.get(agent_id)
        if not agent:
            raise ValueError(f"Agent {agent_id} not found")
            
        result = await self.crew_engine.run_single_agent(agent, user_input)
        return result


# --- Inngest Handlers ---

@inngest_client.create_function(
    fn_id="crewai-execution-requested",
    trigger=inngest.TriggerEvent(event="crewai/execution.requested"),
)
async def crewai_execution_handler(ctx: inngest.Context, step: inngest.Step):
    """
    Inngest handler for CrewAI execution (both single agent and full crews).
    """
    from app.modules.agents.infrastructure.crewai.adapter import CrewAIAdapter
    from app.shared.infrastructure.database import async_session_maker
    
    data = ctx.event.data
    entity_type = data.get("entity_type") # "crew" or "agent"
    entity_id = UUID(data["entity_id"])
    user_input = data.get("user_input", "Execute the assigned process.")
    
    # Since Inngest handlers are out of FastAPI's request lifecycle, we manually inject dependencies
    async with async_session_maker() as session:
        agent_repo = AgentConfigRepository(session)
        workspace_repo = WorkspaceRepository(session)
        crew_engine = CrewAIAdapter()
        
        use_case = CrewRunnerUseCase(
            crew_engine=crew_engine,
            agent_repo=agent_repo,
            workspace_repo=workspace_repo
        )
        
        if entity_type == "crew":
            result = await use_case.execute_crew(entity_id, user_input)
        elif entity_type == "agent":
            result = await use_case.execute_single_agent(entity_id, user_input)
        else:
            raise ValueError(f"Unsupported entity_type: {entity_type}")
            
    # Send completion event back
    await inngest_client.send(
        inngest.Event(
            name="system.entity.progress_updated",
            data={
                "entity_id": str(entity_id),
                "status": "done",
                "result": result
            }
        )
    )
    
    return result
