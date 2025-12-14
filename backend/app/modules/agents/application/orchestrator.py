import json
from uuid import UUID
from typing import Dict
from backend.app.modules.agents.domain.models import ChatSession, Message
from backend.app.modules.agents.domain.enums import AgentRole
from backend.app.shared.utils.time import now_utc
from backend.app.shared.infrastructure.adk_agents import (
    agent, sequential, loop, ToolContext, AgentRunner
)

# Configuration Constants
MODEL_NAME = "gemini-1.5-flash"
COMPLETION_PHRASE = "DOCUMENT_IS_PERFECT"
STATE_CURRENT_DOC = "current_document"

# --- Tool Definitions ---

def exit_loop(tool_context: ToolContext):
    """Call this function ONLY when the critique indicates no further changes are needed."""
    print(f"[Tool Call] exit_loop triggered by {tool_context.agent_name}")
    tool_context.actions.escalate = True
    return {}

# --- Orchestrator ---

class AgentOrchestrator:
    def __init__(self):
        self._agents = self._build_agents()

    def _build_agents(self) -> Dict[str, AgentRunner]:
        """
        Declarative definition of Agents using the ADK functional pattern.
        """
        
        # 1. Researcher
        researcher = agent(
            model=MODEL_NAME,
            name="researcher",
            description="Analyzes project context and searches knowledge base.",
            instruction="""
            You are an expert Researcher in the RAGAS system.
            Your goal is to find relevant information to answer the user's request.
            Current Context: {user_input}
            """,
            tools=[], 
            output_key="research_output"
        )

        # 2. Builder
        builder = agent(
            model=MODEL_NAME,
            name="builder",
            description="Generates code and artifacts.",
            instruction="""
            You are an expert Builder/Developer.
            Generate clean, production-ready code or content based on:
            {research_output}
            """,
            tools=[],
            output_key="builder_output"
        )

        # 3. Writer (Loop Pattern)
        critic = agent(
            model=MODEL_NAME,
            name="CriticAgent",
            description="Reviews the document.",
            instruction=f"""
            Analyze the **Current Document**.
            If it is perfect, return ONLY: "{COMPLETION_PHRASE}".
            Otherwise, provide constructive **Critique/Suggestions**.

            **Current Document:**
            {{{STATE_CURRENT_DOC}}}
            """,
            output_key="criticism"
        )

        refiner = agent(
            model=MODEL_NAME,
            name="RefinerAgent",
            instruction=f"""
            You are a Creative Writing Assistant.
            **Current Document:** {{{STATE_CURRENT_DOC}}}
            **Critique:** {{criticism}}

            Task:
            If critique is "{COMPLETION_PHRASE}", call `exit_loop`.
            Else, rewrite the document to fix issues. Output ONLY the refined text.
            """,
            tools=[exit_loop],
            output_key=STATE_CURRENT_DOC
        )

        writer_loop = loop(
            name="WriterRefinementLoop",
            sub_agents=[critic, refiner],
            max_iterations=3
        )

        # 4. Manager (Root)
        manager = agent(
            model=MODEL_NAME,
            name="manager",
            description="Project Manager.",
            instruction="""
            You are the Project Manager. Coordinate tasks.
            """,
            output_key="manager_output"
        )

        return {
            AgentRole.RESEARCHER: researcher,
            AgentRole.BUILDER: builder,
            AgentRole.WRITER: writer_loop,
            AgentRole.MANAGER: manager,
        }

    async def create_session(self, project_id: UUID, agent_role: AgentRole) -> ChatSession:
        return ChatSession(project_id=project_id, agent_role=agent_role)

    async def run_turn_stream(self, session: ChatSession, user_input: str):
        """
        Executes a turn using the functional Agent infrastructure.
        """
        # 1. Update History
        user_msg = Message(role="user", content=user_input, timestamp=now_utc())
        session.history.append(user_msg)
        session.updated_at = now_utc()
        
        # 2. Select Agent
        active_agent = self._agents.get(session.agent_role, self._agents[AgentRole.MANAGER])
        
        full_response = ""
        
        # Context Setup
        context_data = {
            "user_input": user_input,
            "current_document": user_input,
            "research_output": "(No research yet)",
            "criticism": "(No criticism yet)"
        }
        tool_ctx = ToolContext(data=context_data, agent_name=str(session.agent_role))

        try:
            # 3. Run Agent
            # Check if the function object has a 'stream' attribute (attached by 'agent' factory)
            if hasattr(active_agent, 'stream'):
                async for chunk in active_agent.stream(tool_ctx):
                    text_chunk = chunk if isinstance(chunk, str) else str(chunk)
                    full_response += text_chunk
                    yield json.dumps({"type": "token", "content": text_chunk})
            else:
                # For Loop or complex flows that don't support direct streaming yet
                yield json.dumps({"type": "token", "content": "Processing complex workflow...\n"})
                
                # Execute the function directly
                result = await active_agent(tool_ctx)
                
                if session.agent_role == AgentRole.WRITER:
                    final_output = result.get(STATE_CURRENT_DOC, "")
                else:
                    final_output = str(result)
                
                full_response = final_output
                yield json.dumps({"type": "token", "content": final_output})
                
        except Exception as e:
            err_msg = f" [System Error: {str(e)}]"
            full_response += err_msg
            yield json.dumps({"type": "error", "content": err_msg})

        # 4. Save Response
        model_msg = Message(role="model", content=full_response, timestamp=now_utc())
        session.history.append(model_msg)