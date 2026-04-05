from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from uuid import UUID

class AssetUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[str] = None
    domain: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class SuccessResponse(BaseModel):
    message: str
    id: Optional[UUID] = None
