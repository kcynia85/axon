from enum import Enum

class ProjectStatus(str, Enum):
    IDEA = "Idea"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"

class ResourceProvider(str, Enum):
    NOTION = "Notion"
    FIGMA = "Figma"
    GITHUB = "Github"
    OTHER = "Other"

class ApprovalStatus(str, Enum):
    DRAFT = "Draft"
    IN_REVIEW = "In Review"
    APPROVED = "Approved"
