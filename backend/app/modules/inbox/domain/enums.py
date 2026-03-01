from enum import Enum

class InboxItemStatus(str, Enum):
    NEW = "NEW"
    RESOLVED = "RESOLVED"
    ARCHIVED = "ARCHIVED"

class InboxItemType(str, Enum):
    ARTIFACT_READY = "ARTIFACT_READY"
    ERROR_ALERT = "ERROR_ALERT"
    SYSTEM_MESSAGE = "SYSTEM_MESSAGE"
    ACTION_REQUIRED = "ACTION_REQUIRED"
    CONSULTATION = "CONSULTATION"
    APPROVAL_NEEDED = "APPROVAL_NEEDED"

class InboxItemPriority(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    NORMAL = "NORMAL"
    LOW = "LOW"
