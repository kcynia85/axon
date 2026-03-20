from pydantic import BaseModel
from typing import Optional, Dict, Any

class AssetUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[str] = None
    domain: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
