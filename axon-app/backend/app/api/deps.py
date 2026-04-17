from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from app.shared.security.schemas import UserPayload

from uuid import UUID

# This defines where to look for the token (Authorization: Bearer)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme)) -> UserPayload:
    """
    MOCK AUTH FOR TESTING: Returns a static Test User.
    Bypasses actual JWT validation.
    """
    # Return a static UUID that we can rely on for seeding/testing
    mock_user_id = "00000000-0000-0000-0000-000000000000"
    return UserPayload(
        sub=UUID(mock_user_id),
        email="test@example.com",
        role="authenticated",
        aud="authenticated",
        app_metadata={},
        user_metadata={}
    )
