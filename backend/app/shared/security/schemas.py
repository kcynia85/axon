from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from typing import Optional, Dict, Any

class UserPayload(BaseModel):
    sub: UUID
    email: EmailStr
    role: str = "authenticated"
    app_metadata: Dict[str, Any] = Field(default_factory=dict)
    user_metadata: Dict[str, Any] = Field(default_factory=dict)
    aud: str = "authenticated"
    exp: Optional[int] = None
    iat: Optional[int] = None
