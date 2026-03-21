from . import tool
from typing import Dict, Any

@tool("Unit Converter", keywords=["math", "utility", "conversion"])
def convert_units(value: float, from_unit: str, to_unit: str) -> Dict[str, Any]:
    """
    Konwertuje proste jednostki (km na mile, stopnie C na F).
    Args:
        value: Wartość numeryczna.
        from_unit: Jednostka źródłowa ('km', 'mi', 'c', 'f').
        to_unit: Jednostka docelowa ('km', 'mi', 'c', 'f').
    """
    from_u = from_unit.lower()
    to_u = to_unit.lower()
    
    if from_u == "km" and to_u == "mi":
        res = value * 0.621371
    elif from_u == "mi" and to_u == "km":
        res = value / 0.621371
    elif from_u == "c" and to_u == "f":
        res = (value * 9/5) + 32
    elif from_u == "f" and to_u == "c":
        res = (value - 32) * 5/9
    else:
        return {"error": "Nieobsługiwana konwersja"}
        
    return {"result": round(res, 2), "unit": to_unit}
