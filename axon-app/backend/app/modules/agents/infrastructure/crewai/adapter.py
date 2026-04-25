import asyncio
from typing import Dict, Any, List
from crewai import Agent, Task, Crew as CrewAIEngine, Process
from pydantic import ValidationError
from langchain_openai import ChatOpenAI

from app.modules.agents.domain.ports.crew_engine import ICrewEngine
from app.modules.agents.domain.models import AgentConfig
from app.modules.workspaces.domain.models import Crew
from app.modules.workspaces.domain.enums import ProcessType
from app.config import settings

from .tools import resolve_crewai_tools

class CrewAIAdapter(ICrewEngine):
    """
    Adapter bridging Axon's domain entities to CrewAI execution engine.
    Ensures that the core application remains agnostic of the underlying framework.
    """

    def _get_llm(self, model_name: Optional[str] = None) -> Any:
        """
        Returns a Langchain Chat Model instance.
        Defaults to gpt-5-nano as requested for testing.
        """
        model = model_name or "gpt-5-nano"
        return ChatOpenAI(
            model=model,
            api_key=settings.OPENAI_API_KEY,
            temperature=0.7
        )

    def _map_agent(self, axon_agent: AgentConfig) -> Agent:
        """
        Maps an Axon AgentConfig to a CrewAI Agent.
        """
        role = axon_agent.agent_role_text or axon_agent.agent_name or "Assistant"
        goal = axon_agent.agent_goal or f"Complete tasks assigned to the {role} role."
        backstory = axon_agent.agent_backstory or "You are a helpful AI assistant."

        # Merge system instructions into backstory or goal if needed
        if axon_agent.system_instruction:
            backstory += f"\n\nSystem Instructions:\n{axon_agent.system_instruction}"

        # Setup Guardrails if present
        if axon_agent.guardrails:
            instructions = "\n".join(axon_agent.guardrails.get("instructions", []))
            constraints = "\n".join(axon_agent.guardrails.get("constraints", []))
            if instructions or constraints:
                backstory += f"\n\nGuardrails:\n{instructions}\n{constraints}"

        return Agent(
            role=role,
            goal=goal,
            backstory=backstory,
            verbose=True,
            allow_delegation=False,  # Can be mapped based on agent configuration
            tools=resolve_crewai_tools(axon_agent.tools),
            llm=self._get_llm() # Uses gpt-5-nano by default
        )

    async def kickoff_crew(self, crew_config: Crew, hydrated_agents: List[AgentConfig], user_input: str) -> Dict[str, Any]:
        """
        Executes a Crew process with multiple agents and tasks using CrewAI.
        Captures detailed execution logs via callbacks.
        """
        execution_logs = []

        def step_callback(step):
            """Captures each step taken by an agent, including tool usage."""
            log_entry = {
                "agent": getattr(step, "agent", "Unknown"),
                "tool": getattr(step, "tool", "None"),
                "tool_input": getattr(step, "tool_input", "None"),
                "observation": getattr(step, "observation", "None"),
                "thought": getattr(step, "thought", "None")
            }
            execution_logs.append(log_entry)
            print(f"  [Step Captured] Agent: {log_entry['agent']} | Tool: {log_entry['tool']}")

        # 1. Map Agents
        agent_map: Dict[str, Agent] = {}
        for a in hydrated_agents:
            agent_map[str(a.id)] = self._map_agent(a)
            # Add step callback to each agent
            agent_map[str(a.id)].step_callback = step_callback

        # 2. Map Tasks
        tasks = []
        raw_tasks = crew_config.metadata.get("tasks", [])
        
        if not raw_tasks:
            for i, agent in enumerate(hydrated_agents):
                crew_agent = agent_map[str(agent.id)]
                desc = f"Address the user's request: '{user_input}'" if i == 0 else "Review and continue the process based on previous outputs."
                t = Task(description=desc, expected_output="Result", agent=crew_agent)
                tasks.append(t)
        else:
            for raw_task in raw_tasks:
                specialist_id = raw_task.get("specialist_id")
                desc = raw_task.get("description", "Perform operation.")
                if len(tasks) == 0: desc += f"\n\nContext: {user_input}"
                
                crew_agent = agent_map.get(str(specialist_id)) or (list(agent_map.values())[0] if agent_map else None)
                if crew_agent:
                    tasks.append(Task(description=desc, expected_output="Completion of task.", agent=crew_agent))

        # 3. Construct Engine
        crew_engine = CrewAIEngine(
            agents=list(agent_map.values()),
            tasks=tasks,
            process=Process.hierarchical if crew_config.crew_process_type == ProcessType.HIERARCHICAL else Process.sequential,
            verbose=True
        )

        # 4. Execute
        result = await asyncio.to_thread(crew_engine.kickoff)

        return {
            "status": "success",
            "process_type": "crew",
            "final_output": str(result),
            "execution_trace": execution_logs,
            "raw_result": result
        }

    async def run_single_agent(self, agent_config: AgentConfig, user_input: str) -> Dict[str, Any]:
        """
        Executes a single agent process and captures its tool usage.
        """
        execution_logs = []

        def step_callback(step):
            execution_logs.append({
                "tool": getattr(step, "tool", "None"),
                "observation": getattr(step, "observation", "None"),
                "thought": getattr(step, "thought", "None")
            })

        crew_agent = self._map_agent(agent_config)
        crew_agent.step_callback = step_callback
        
        task = Task(
            description=f"Address user request: {user_input}",
            expected_output="Detailed response",
            agent=crew_agent
        )

        crew_engine = CrewAIEngine(agents=[crew_agent], tasks=[task], process=Process.sequential, verbose=True)
        result = await asyncio.to_thread(crew_engine.kickoff)

        return {
            "status": "success",
            "process_type": "single_agent",
            "final_output": str(result),
            "execution_trace": execution_logs,
            "raw_result": result
        }
