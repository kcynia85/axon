from . import tool
import re
from typing import Dict, Any

@tool("Email Extractor", keywords=["text", "regex", "utility"])
def extract_emails(text: str) -> Dict[str, Any]:
    """
    Wyciąga wszystkie adresy email z podanego tekstu za pomocą wyrażeń regularnych.
    Args:
        text: Dowolny tekst zawierający adresy email.
    """
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_pattern, text)
    
    # Usuwamy duplikaty zachowując kolejność
    unique_emails = list(dict.fromkeys(emails))
    
    print(f"SUKCES: Znaleziono {len(unique_emails)} adresów email.")
    return {
        "emails": unique_emails,
        "count": len(unique_emails)
    }
