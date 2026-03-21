from . import tool
import httpx
from typing import Dict, Any

@tool("Weather Checker", keywords=["weather", "api", "external"])
def get_weather(city: str) -> Dict[str, Any]:
    """
    Pobiera aktualną pogodę dla podanego miasta (na razie statycznie dla Warszawy).
    
    Args:
        city: Nazwa miasta w języku angielskim (np. 'Warsaw', 'London').
        
    Returns:
        Słownik z temperaturą i opisem pogody.
    """
    url = f"https://api.open-meteo.com/v1/forecast?latitude=52.2297&longitude=21.0122&current_weather=true"
    
    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(url)
            if response.status_code == 200:
                data = response.json()
                current = data.get("current_weather", {})
                temp = current.get("temperature")
                wind = current.get("windspeed")
                
                print(f"SUKCES: Pobrano pogodę dla {city}: {temp}°C")
                
                return {
                    "city": city,
                    "temperature": temp,
                    "windspeed": wind,
                    "status": "Success"
                }
            else:
                return {"error": f"Błąd API pogodowego: {response.status_code}"}
    except Exception as e:
        return {"error": f"Błąd połączenia: {str(e)}"}
