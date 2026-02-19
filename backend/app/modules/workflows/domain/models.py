from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, Dict, Any, List
from app.shared.utils.time import now_utc

class Workflow(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    project_id: UUID
    title: str
    description: str
    status: str = "DRAFT" # ACTIVE, DRAFT, ARCHIVED
    steps_count: int = 0
    last_run: Optional[datetime] = None
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)
