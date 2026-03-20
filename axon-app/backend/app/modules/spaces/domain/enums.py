from enum import Enum

class SpaceStatus(str, Enum):
    DRAFT = "Draft"
    LINKED = "Linked"

class WorkspaceDomain(str, Enum):
    DISCOVERY = "Discovery"
    DESIGN = "Design"
    DELIVERY = "Delivery"
    GROWTH = "Growth"

class NodeExecutionStatus(str, Enum):
    IDLE = "Idle"
    MISSING_CONTEXT = "Missing Context"
    WORKING = "Working"
    BRIEFING = "Briefing"
    CONSULTATION = "Consultation"
    DONE = "Done"
    ERROR = "Error"

class LogStatus(str, Enum):
    RUNNING = "Running"
    COMPLETED = "Completed"
    FAILED = "Failed"
    CANCELLED = "Cancelled"

class SessionStatus(str, Enum):
    ACTIVE = "Active"
    RESOLVED = "Resolved"
