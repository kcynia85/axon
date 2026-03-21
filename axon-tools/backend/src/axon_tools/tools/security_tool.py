from . import tool
import secrets
import string
from typing import Dict, Any

@tool("Password Generator", keywords=["security", "utility", "random"])
def generate_password(length: int = 12, include_special: bool = True) -> Dict[str, Any]:
    """
    Generuje bezpieczne losowe hasło.
    Args:
        length: Długość hasła (min 8).
        include_special: Czy dołączyć znaki specjalne.
    """
    if length < 8: length = 8
    alphabet = string.ascii_letters + string.digits
    if include_special:
        alphabet += "!@#$%^&*()_+-="
    
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return {"password": password, "length": length}
