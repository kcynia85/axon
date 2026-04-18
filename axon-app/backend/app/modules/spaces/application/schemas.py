from pydantic import BaseModel, Field, ConfigDict
from uuid import UUID
from typing import Any, List, Optional
from app.modules.spaces.domain.models import Space

# --- React Flow Specific Schemas ---

class ReactFlowNodePosition(BaseModel):
    x: float
    y: float

class ReactFlowNodeData(BaseModel):
    model_config = ConfigDict(extra="allow")
    
    label: Optional[str] = None
    status: str # NodeExecutionStatus
    # Allows generic key-value pairs for component specific data (Agent config, Crew state)
    # This maps to 'node_runtime_state' from DB
    runtime: dict[str, Any] = Field(default_factory=dict) 

class ReactFlowNode(BaseModel):
    model_config = ConfigDict(extra="allow")
    
    id: str # UUID as string for JS
    type: str # component_type
    position: ReactFlowNodePosition
    data: ReactFlowNodeData
    width: Optional[float] = None
    height: Optional[float] = None

class ReactFlowEdge(BaseModel):
    model_config = ConfigDict(extra="allow")
    
    id: str # UUID as string
    source: str # UUID
    target: str # UUID
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class ReactFlowViewport(BaseModel):
    model_config = ConfigDict(extra="allow")
    
    x: float
    y: float
    zoom: float

# --- API Response DTO ---

class ReactFlowZone(BaseModel):
    id: str
    workspaceDomain: str
    position: ReactFlowNodePosition
    width: float
    height: float
    color: Optional[str] = None

class SpaceDetailDTO(BaseModel):
    """
    Aggregate response optimized for React Flow Canvas initialization.
    """
    id: UUID
    name: str
    description: Optional[str] = None
    status: str
    projectId: Optional[UUID] = None
    projectName: Optional[str] = None
    
    # Canvas State
    viewport: ReactFlowViewport
    nodes: List[ReactFlowNode]
    edges: List[ReactFlowEdge]
    zones: List[ReactFlowZone]

    @classmethod
    def from_domain(cls, space: Space) -> "SpaceDetailDTO":
        # Mapper logic
        
        # 1. Map Nodes
        nodes = []
        # Accessing relationship via ORM object attached to Pydantic model 
        # (This assumes the Space object passed here has populated .nodes/.edges attributes, 
        # which usually requires ORM model -> Pydantic parsing that includes relations, 
        # or we pass the ORM object directly. For cleaner DDD, we should pass domain lists.)
        
        # NOTE: The current Pydantic 'Space' model in domain/models.py does NOT include list[SpaceNode].
        # It's a pure aggregate root representation. 
        # We need to fetch nodes/edges separately or extend the domain model for this DTO.
        
        # Let's assume we construct this DTO in the Service layer where we have all lists.
        return cls(
            id=space.id,
            name=space.space_name,
            description=space.space_description,
            status=space.space_status.value,
            viewport=ReactFlowViewport(
                x=space.space_viewport_config.get("x", 0),
                y=space.space_viewport_config.get("y", 0),
                zoom=space.space_viewport_config.get("zoom", 1)
            ),
            nodes=[], # Populated by service
            edges=[], # Populated by service
            zones=[]  # Populated by service
        )

# --- Incoming API Requests (Canvas Save) ---

class SpaceUpdateDTO(BaseModel):
    space_name: Optional[str] = None
    space_description: Optional[str] = None
    space_status: Optional[str] = None
    project_id: Optional[UUID] = None

class CanvasGraphUpdate(BaseModel):
    """
    Payload sent by React Flow's 'onSave' or auto-save.
    """
    viewport: ReactFlowViewport
    nodes: List[ReactFlowNode]
    edges: List[ReactFlowEdge]
