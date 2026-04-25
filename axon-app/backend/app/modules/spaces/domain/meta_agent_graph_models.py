from typing import TypedDict, List, Dict, Any, Annotated, Optional
from pydantic import BaseModel, Field
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage
from app.modules.spaces.domain.meta_agent_models import MetaAgentProposalRequest, MetaAgentProposalResponse, MetaAgentContextStats

class MetaAgentState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    request: MetaAgentProposalRequest
    canvas_state: Dict[str, Any]
    project_context: str
    project_strategy_url: Optional[str]
    plan: str
    search_queries: List[str]
    rag_context: str
    system_entities: List[Dict[str, Any]]
    draft_response: MetaAgentProposalResponse | None
    validation_errors: List[str]
    iteration_count: int
    context_stats: MetaAgentContextStats
    is_out_of_scope: bool

class PlannerOutput(BaseModel):
    reasoning: str = Field(..., description="Explanation of what entities need to be created and why.")
    search_queries: List[str] = Field(default_factory=list, description="Targeted search queries for the vector database to find templates, tools, and context.")
    execution_plan: str = Field(..., description="A step-by-step high-level plan for the Drafter to execute.")
    is_out_of_scope: bool = Field(False, description="Set to True if the user request is unrelated to designing AI flows, agents, or project architecture.")
