from enum import Enum

class HubType(str, Enum):
    PRODUCT = "product"
    DISCOVERY = "discovery"
    DESIGN = "design"
    DELIVERY = "delivery"
    GROWTH = "growth"
    WRITING = "writing"

class Status(str, Enum):
    IDEA = "idea"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    DONE = "done"
    ARCHIVED = "archived"

class FileType(str, Enum):
    MARKDOWN = "markdown"
    CODE = "code"
    JSON = "json"
    IMAGE = "image"

class ReviewState(str, Enum):
    DRAFT = "draft"
    REVIEWED = "reviewed"
    APPROVED = "approved"
