from . import tool
import uuid
from typing import Dict, Any

@tool("UUID Generator", keywords=["dev", "utility", "random"])
def generate_v4_uuid() -> Dict[str, Any]:
    """
    Generuje unikalny identyfikator UUID w wersji 4.
    """
    new_uuid = str(uuid.uuid4())
    print(f"SUKCES: Wygenerowano UUID: {new_uuid}")
    return {
        "uuid": new_uuid,
        "version": 4
    }
