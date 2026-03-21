from . import tool
from typing import Dict, Any

@tool("BMI Calculator", keywords=["health", "math", "utility"])
def calculate_bmi(weight_kg: float, height_cm: float) -> Dict[str, Any]:
    """
    Oblicza wskaźnik masy ciała (BMI) na podstawie wagi i wzrostu.
    Args:
        weight_kg: Waga w kilogramach.
        height_cm: Wzrost w centymetrach.
    """
    if height_cm <= 0 or weight_kg <= 0:
        return {"error": "Wartości muszą być większe od zera"}
        
    height_m = height_cm / 100
    bmi = weight_kg / (height_m ** 2)
    bmi_rounded = round(bmi, 2)
    
    category = ""
    if bmi < 18.5: category = "Niedowaga"
    elif bmi < 25: category = "Waga prawidłowa"
    elif bmi < 30: category = "Nadwaga"
    else: category = "Otyłość"
    
    print(f"SUKCES: BMI={bmi_rounded} ({category})")
    return {
        "bmi": bmi_rounded,
        "category": category,
        "weight_kg": weight_kg,
        "height_cm": height_cm
    }
