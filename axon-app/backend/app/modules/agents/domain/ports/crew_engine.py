from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.modules.agents.domain.models import AgentConfig
from app.modules.workspaces.domain.models import Crew

class ICrewEngine(ABC):
    @abstractmethod
    async def kickoff_crew(self, crew_config: Crew, hydrated_agents: List[AgentConfig], user_input: str) -> Dict[str, Any]:
        """
        Executes a Crew process with multiple agents and sequential/hierarchical tasks.
        """
        pass
        
    @abstractmethod
    async def run_single_agent(self, agent_config: AgentConfig, user_input: str) -> Dict[str, Any]:
        """
        Executes a single agent process. In CrewAI this can be modeled as a single-agent crew.
        """
        pass
