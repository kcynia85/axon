from enum import Enum

class InboxItemStatus(str, Enum):
    NEW = "New"
    RESOLVED = "Resolved"

class InboxItemType(str, Enum):
    ARTIFACT_READY = "artifact_ready"
    CONSULTATION = "consultation"
    APPROVAL_NEEDED = "approval_needed"
