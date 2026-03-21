from . import tool
import json
from typing import Dict, Any

@tool("JSON Formatter", keywords=["text", "json", "dev"])
def format_json_string(json_str: str) -> Dict[str, Any]:
    """
    Formatuje surowy ciąg znaków JSON na czytelną, wciętą formę (pretty-print).
    Args:
        json_str: Surowy ciąg znaków JSON do sformatowania.
    """
    try:
        data = json.loads(json_str)
        formatted = json.dumps(data, indent=2, ensure_ascii=False)
        return {
            "formatted_json": formatted,
            "status": "Success"
        }
    except Exception as e:
        return {"error": f"Nieprawidłowy format JSON: {str(e)}", "status": "Error"}
