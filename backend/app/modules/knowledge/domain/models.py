from pydantic import BaseModel, Field
from uuid import UUID, uuid4
from datetime import datetime
from typing import Optional, Dict, Any
from backend.app.shared.utils.time import now_utc

class Asset(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    slug: str
    title: str
    content: str
    type: str # template, sop, checklist
    domain: str # design, discovery, etc.
    metadata: Dict[str, Any] = Field(default_factory=dict)
    # description_embedding is handled by DB/Vector store, not usually in full Pydantic model unless needed
    is_deleted: bool = False
    created_at: datetime = Field(default_factory=now_utc)
    updated_at: datetime = Field(default_factory=now_utc)

class Memory(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    content: str
    domain: str
    source_url: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=now_utc)
