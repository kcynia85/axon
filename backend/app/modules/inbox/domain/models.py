from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional
from app.modules.inbox.domain.enums import InboxItemStatus, InboxItemType
from app.shared.utils.time import now_utc

class InboxItem(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    item_status: InboxItemStatus = InboxItemStatus.NEW
    item_type: InboxItemType
    artifact_id: Optional[UUID] = None
    project_id: Optional[UUID] = None
    created_at: datetime = Field(default_factory=now_utc)
    resolved_at: Optional[datetime] = None
