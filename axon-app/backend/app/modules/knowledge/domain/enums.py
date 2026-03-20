from enum import Enum

class SourceFileFormat(str, Enum):
    PDF = "pdf"
    MD = "md"
    TXT = "txt"
    DOCX = "docx"
    URL = "url"

class RAGIndexingStatus(str, Enum):
    PENDING = "Pending"
    INDEXING = "Indexing"
    READY = "Ready"
    ERROR = "Error"
