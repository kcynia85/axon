from dataclasses import dataclass, field
from typing import List, Callable
from app.modules.agents.domain.enums import AgentRole
from app.modules.agents.application.tools import search_knowledge_base, exit_loop

@dataclass
class AgentDefinition:
    role: AgentRole
    name: str
    instruction: str
    tools: List[Callable] = field(default_factory=list)
    output_key: str = "output"
    model: str = "gemini-2.0-flash"
    is_loop: bool = False

# --- Prompts ---

RESEARCHER_INSTRUCTION = """
You are an expert Researcher in the RAGAS system.
Your goal is to find relevant information to answer the user's request.

GLOBAL PROJECT CONTEXT:
{global_context}

INSTRUCTIONS:
1. Use `search_knowledge_base` to find facts.
2. When answering, YOU MUST CITATE YOUR SOURCES inline using [Source ID]. 
   Example: "The project uses Python [Source 1]."
3. If no information is found, state that clearly.

Current Request: {user_input}
"""

BUILDER_INSTRUCTION = """
You are an expert Builder/Developer.
Generate clean, production-ready code or content based on the research.

GLOBAL PROJECT CONTEXT:
{global_context}

Current Request: {user_input}
"""

MANAGER_INSTRUCTION = """
You are the Project Manager. Coordinate tasks.

GLOBAL PROJECT CONTEXT:
{global_context}

Current Request: {user_input}
"""

CRITIC_INSTRUCTION = """
Analyze the **Current Document**.
If it is perfect, return ONLY: "DOCUMENT_IS_PERFECT".
Otherwise, provide constructive **Critique/Suggestions**.

GLOBAL CONTEXT: {global_context}

**Current Document:**
{current_document}
"""

REFINER_INSTRUCTION = """
You are a Creative Writing Assistant.
**Current Document:** {current_document}
**Critique:** {criticism}
GLOBAL CONTEXT: {global_context}

Task:
Rewrite the document to fix issues based on the critique. 
Output ONLY the refined text.
"""

# --- Registry ---

def get_agent_definition(role: AgentRole) -> AgentDefinition:
    if role == AgentRole.RESEARCHER:
        return AgentDefinition(
            role=role,
            name="researcher",
            instruction=RESEARCHER_INSTRUCTION,
            tools=[search_knowledge_base],
            output_key="research_output"
        )
    elif role == AgentRole.BUILDER:
        return AgentDefinition(
            role=role,
            name="builder",
            instruction=BUILDER_INSTRUCTION,
            tools=[],
            output_key="builder_output"
        )
    elif role == AgentRole.MANAGER:
        return AgentDefinition(
            role=role,
            name="manager",
            instruction=MANAGER_INSTRUCTION,
            tools=[],
            output_key="manager_output"
        )
    elif role == AgentRole.WRITER:
        return AgentDefinition(
            role=role,
            name="writer",
            instruction="", # Special Loop Logic
            tools=[exit_loop],
            is_loop=True
        )
    else:
        # Default to Manager
        return AgentDefinition(
            role=AgentRole.MANAGER,
            name="manager",
            instruction=MANAGER_INSTRUCTION,
            tools=[],
            output_key="manager_output"
        )
