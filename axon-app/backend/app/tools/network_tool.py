from . import tool
import httpx
from typing import Dict, Any

@tool("URL Status Checker", keywords=["network", "utility", "http"])
def check_url_status(url: str) -> Dict[str, Any]:
    """
    Sprawdza czy podany URL jest dostępny (kod HTTP).
    Args:
        url: Pełny adres URL (musi zaczynać się od http/https).
    """
    if not url.startswith("http"):
        url = "https://" + url
    try:
        with httpx.Client(timeout=10.0, follow_redirects=True) as client:
            r = client.get(url)
            return {"url": url, "status_code": r.status_code, "is_online": r.status_code < 400}
    except Exception as e:
        return {"url": url, "is_online": False, "error": str(e)}
