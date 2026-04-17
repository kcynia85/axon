from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from app.modules.projects.domain.enums import ProjectStatus, ResourceProvider

# --- Command DTOs (Input) ---

class ProjectCreateDTO(BaseModel):
    project_name: str
    project_status: ProjectStatus = ProjectStatus.IDEA
    project_summary: Optional[str] = None
    project_keywords: List[str] = Field(default_factory=list)
    project_strategy_url: Optional[str] = None
    # space_id is optional, can be linked later

class ProjectUpdateDTO(BaseModel):
    project_name: Optional[str] = None
    project_status: Optional[ProjectStatus] = None
    project_summary: Optional[str] = None
    project_keywords: Optional[List[str]] = None
    project_strategy_url: Optional[str] = None
    space_id: Optional[UUID] = None

class ResourceCreateDTO(BaseModel):
    resource_provider_type: ResourceProvider
    resource_label: str
    resource_url: str
    resource_icon: Optional[str] = None

class ArtifactCreateDTO(BaseModel):
    artifact_name: str
    artifact_source_path: str
    artifact_deliverable_url: str
    workspace_domain: Optional[str] = None
    # Approval defaults to Draft

# --- Response DTOs (Output) ---
# We can often reuse Domain Models for simple outputs, 
# but DTOs allow for computed fields or hiding internal IDs.
# For now, we will return Domain Models directly from Service.
