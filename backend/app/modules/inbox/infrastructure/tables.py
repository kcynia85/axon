from sqlalchemy import Column, String, ForeignKey, DateTime, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from backend.app.shared.infrastructure.base import Base
from backend.app.shared.utils.time import now_utc
from backend.app.modules.inbox.domain.enums import InboxItemStatus, InboxItemType

class InboxItemTable(Base):
    __tablename__ = "inbox_items"

    id = Column(UUID(as_uuid=True), primary_key=True)
    item_status = Column(SAEnum(InboxItemStatus), default=InboxItemStatus.NEW, nullable=False)
    item_type = Column(SAEnum(InboxItemType), nullable=False)
    artifact_source_id = Column(UUID(as_uuid=True), nullable=False)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=now_utc)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
