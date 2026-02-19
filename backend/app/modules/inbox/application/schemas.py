from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from app.modules.inbox.domain.enums import InboxItemStatus, InboxItemType

class InboxItemResponse(BaseModel):
    id: UUID
    item_status: InboxItemStatus
    item_type: InboxItemType
    artifact_id: Optional[UUID] = None
    project_id: Optional[UUID] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

class BulkResolveRequest(BaseModel):
    item_ids: List[UUID]
