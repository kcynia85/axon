from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field

class MetaAgentAttachment(BaseModel):
    name: str
    content_type: str
    content_base64: Optional[str] = None
    size_bytes: int

class MetaAgentProposalRequest(BaseModel):
    space_id: str
    query: str
    context: Optional[Dict[str, Any]] = Field(default_factory=dict)
    attachments: Optional[List[MetaAgentAttachment]] = Field(default_factory=list)

class MetaAgentDraftEntity(BaseModel):
    entity: Literal["agent", "crew", "knowledge", "unknown"] = Field(
        ..., description="The type of entity the user wants to create or modify."
    )
    status: Literal["draft"] = Field("draft", description="Always set to 'draft'.")
    name: str = Field(..., description="Suggested name for the entity.")
    description: str = Field(..., description="Suggested description or role.")
    visual_url: Optional[str] = Field(None, description="The URL of the entity's avatar/icon if it exists in the system.")
    target_workspace: Literal["ws-discovery", "ws-design", "ws-delivery", "ws-product", "ws-growth"] = Field(
        "ws-discovery", 
        description="The target workspace zone on the canvas where this entity should be placed."
    )
    agent_member_ids: Optional[List[str]] = Field(
        default_factory=list, 
        description="For CREW entities ONLY: An array of names of the Agent entities that belong to this Crew."
    )
    crew_process_type: Optional[str] = Field(
        None, 
        description="For CREW entities ONLY: The process type, e.g. 'Sequential', 'Hierarchical'."
    )
    agent_role_text: Optional[str] = Field(
        None, 
        description="For AGENT entities ONLY: The role of the agent."
    )
    system_instruction: Optional[str] = Field(
        None, 
        description="For AGENT entities ONLY: The system instructions or prompt for the agent."
    )
    payload: Dict[str, Any] = Field(
        default_factory=dict, 
        description="Any other specific fields required to instantiate the entity."
    )

class MetaAgentProposalConnection(BaseModel):
    source_draft_name: str = Field(..., description="Name of the source draft entity.")
    target_draft_name: str = Field(..., description="Name of the target draft entity.")

class MetaAgentContextStats(BaseModel):
    space_canvas_tokens: int = 0
    system_awareness_tokens: int = 0
    knowledge_tokens: int = 0
    project_context_tokens: int = 0
    notion_tokens: int = 0
    attachments_tokens: int = 0
    total_tokens: int = 0

class MetaAgentProposalResponse(BaseModel):
    drafts: List[MetaAgentDraftEntity] = Field(..., description="List of proposed entities forming the flow.")
    connections: List[MetaAgentProposalConnection] = Field(
        default_factory=list, 
        description="Proposed connections between the drafted entities."
    )
    reasoning: str = Field(..., description="Explanation of why this flow was proposed.")
    context_stats: Optional[MetaAgentContextStats] = Field(default_factory=MetaAgentContextStats)
