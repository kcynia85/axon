from typing import Any, Dict
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from backend.app.config import settings

# This defines where to look for the token (Authorization: Bearer)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """
    Validates the Supabase JWT token from the Authorization header.
    Returns the decoded token payload if valid.
    """
    # [DEV MODE] Mock Auth to allow UI testing without Supabase Login
    # Remove this block for Production!
    return {
        "sub": "00000000-0000-0000-0000-000000000000",
        "role": "authenticated",
        "email": "dev@axon.local"
    }

    if not token:
        # Allow unauthenticated access for now if we want to ease into it, 
        # OR raise 403. 
        # For a secure system, we raise 401.
        # But for 'auto_error=False' usage, we handle it here.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # Supabase uses HS256 by default with the JWT Secret
        payload = jwt.decode(
            token, 
            settings.SUPABASE_JWT_SECRET, 
            algorithms=["HS256"],
            audience="authenticated" # Supabase default audience
        )
        
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
            
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )
