# Plan: Dodanie i synchronizacja nowej funkcji w Axon Tools

Ten plan opisuje kroki niezbędne do dodania nowej funkcji (narzędzia) w `axon-tools`, jej przetestowania oraz synchronizacji z główną aplikacją `axon-app`.

## Cel
Dodanie funkcji `get_weather` do `axon-tools`, która będzie zwracać pogodę dla podanego miasta, przetestowanie jej lokalnie i przesłanie do `axon-app`.

## Kroki implementacji

### 1. Przygotowanie nowej funkcji w `axon-tools`
Stworzymy nowy plik `weather_tool.py` w katalogu `axon-tools/backend/src/axon_tools/tools/`.

**Plik:** `axon-tools/backend/src/axon_tools/tools/weather_tool.py`
```python
from . import tool
import httpx
from typing import Dict, Any

@tool("Weather Checker")
def get_weather(city: str) -> Dict[str, Any]:
    """
    Pobiera aktualną pogodę dla podanego miasta.
    
    Args:
        city: Nazwa miasta w języku angielskim (np. 'Warsaw', 'London').
        
    Returns:
        Słownik z temperaturą i opisem pogody.
    """
    url = f"https://api.open-meteo.com/v1/forecast?latitude=52.2297&longitude=21.0122&current_weather=true"
    # Uwaga: Dla uproszczenia używamy stałych koordynatów dla Warszawy, 
    # w pełnej wersji należałoby najpierw zrobić geocoding.
    
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
```

### 2. Weryfikacja lokalna (Testowanie)
1. Uruchomienie `axon-tools` (jeśli nie działa):
   ```bash
   cd axon-tools/backend
   source .venv/bin/activate
   python -m axon_tools.main
   ```
2. Otwarcie interfejsu `axon-tools` (zwykle `http://localhost:3001`).
3. Wybranie narzędzia "Weather Checker" z listy.
4. Wpisanie parametru `city="Warszawa"` i kliknięcie "Execute".
5. Sprawdzenie outputu (powinien pojawić się JSON z temperaturą).

### 3. Synchronizacja z `axon-app`
Synchronizacja odbywa się poprzez kliknięcie przycisku w UI (Deploy/Sync) lub ręczne wywołanie endpointu synchronizacji.

Gdy klikniesz "Deploy" w UI `axon-tools`:
1. `axon-tools` (backend) wysyła zawartość pliku `weather_tool.py` do `axon-app`.
2. `axon-app` odbiera plik w endpoincie `POST /resources/internal-tools/sync-remote`.
3. Plik jest zapisywany w `axon-app/backend/app/tools/weather_tool.py`.
4. `axon-app` wykonuje `service.sync_tools()`, co dodaje metadane narzędzia do bazy danych.

## Weryfikacja w `axon-app`
1. Sprawdzenie czy plik istnieje: `ls axon-app/backend/app/tools/weather_tool.py`.
2. Sprawdzenie logów backendu `axon-app` pod kątem "Successfully added new tool: Weather Checker".
3. Weryfikacja w bazie danych (np. przez `debug_sync.py`).

## Przewidywane efekty
- Nowe narzędzie dostępne w Resources -> Tools w aplikacji Axon.
- Możliwość wykorzystania narzędzia przez Agenty AI w `axon-app`.
