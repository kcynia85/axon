from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from backend.app.modules.projects.domain.enums import HubType, Status

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    domain: HubType
    status: Status = Status.IDEA

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[Status] = None

class ScenarioCreate(BaseModel):
    project_id: UUID
    title: str
    description: str
    category: str
    prompt_template: str
    icon: Optional[str] = None
