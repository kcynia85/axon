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
    entity: Literal["agent", "crew", "task", "tool", "knowledge", "unknown"] = Field(
        ..., description="The type of entity the user wants to create or modify."
    )
    status: Literal["draft"] = Field("draft", description="Always set to 'draft'.")
    name: str = Field(..., description="Suggested name for the entity.")
    description: str = Field(..., description="Suggested description or role.")
    target_workspace: Literal["ws-discovery", "ws-design", "ws-delivery", "ws-product", "ws-growth"] = Field(
        "ws-discovery", 
        description="The target workspace zone on the canvas where this entity should be placed."
    )
    payload: Dict[str, Any] = Field(
        default_factory=dict, 
        description="Specific fields required to instantiate the entity (e.g., prompt, tools for an agent)."
    )

class MetaAgentProposalConnection(BaseModel):
    source_draft_name: str = Field(..., description="Name of the source draft entity.")
    target_draft_name: str = Field(..., description="Name of the target draft entity.")

class MetaAgentProposalResponse(BaseModel):
    drafts: List[MetaAgentDraftEntity] = Field(..., description="List of proposed entities forming the flow.")
    connections: List[MetaAgentProposalConnection] = Field(
        default_factory=list, 
        description="Proposed connections between the drafted entities."
    )
    reasoning: str = Field(..., description="Explanation of why this flow was proposed.")
