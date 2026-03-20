from pydantic import BaseModel, Field, field_validator
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, List
from app.modules.projects.domain.enums import ProjectStatus, ResourceProvider, ApprovalStatus
from app.shared.utils.time import now_utc

class KeyResource(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    resource_provider_type: ResourceProvider
    resource_label: str
    resource_url: str
    resource_icon: Optional[str] = None
    project_id: UUID
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class Artifact(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    artifact_name: str
    artifact_source_path: str
    artifact_deliverable_url: str
    workspace_domain: Optional[str] = None
    artifact_approval_status: ApprovalStatus = ApprovalStatus.DRAFT
    approved_by_user_id: Optional[UUID] = None
    artifact_approved_at: Optional[datetime] = None
    project_id: UUID
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class Project(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    project_name: str
    project_status: ProjectStatus = ProjectStatus.IDEA
    project_summary: Optional[str] = None
    project_keywords: List[str] = Field(default_factory=list)
    project_strategy_url: Optional[str] = None
    space_id: Optional[UUID] = None
    owner_id: UUID
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
    
    # Relationships for DTOs
    key_resources: List[KeyResource] = Field(default_factory=list)
    artifacts: List[Artifact] = Field(default_factory=list)
    workspaces: List[str] = Field(default_factory=list) # Derived from Space Zones

    @field_validator("project_keywords", mode="before")
    @classmethod
    def validate_keywords(cls, v):
        if v is None:
            return []
        return v
