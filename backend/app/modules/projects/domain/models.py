from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import List, Optional
from backend.app.modules.projects.domain.enums import HubType, Status, FileType, ReviewState
from backend.app.shared.utils.time import now_utc

class Artifact(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    title: str
    type: FileType
    content: str
    status: ReviewState = ReviewState.DRAFT
    metadata: dict = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class Project(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    description: Optional[str] = None
    domain: HubType
    status: Status = Status.IDEA
    owner_id: UUID
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    
    # Aggregates (optional fetch)
    artifacts: List[Artifact] = Field(default_factory=list)
