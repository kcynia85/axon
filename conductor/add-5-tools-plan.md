# Plan: Dodanie 5 nowych narzędzi do Axon Tools i synchronizacja

Ten plan opisuje dodanie 5 nowych, użytecznych narzędzi do `axon-tools`, ich lokalną weryfikację oraz automatyczną synchronizację z `axon-app`.

## Cel
Wzbogacenie biblioteki narzędzi Axon o 5 nowych funkcji:
1.  `get_exchange_rate` (Kursy walut NBP)
2.  `text_summarizer` (Proste podsumowanie tekstu)
3.  `password_generator` (Generator bezpiecznych haseł)
4.  `unit_converter` (Konwerter jednostek)
5.  `check_url_status` (Sprawdzanie dostępności URL)

## Kroki implementacji

### 1. Przygotowanie narzędzi w `axon-tools`
Utworzymy nowe pliki w `axon-tools/backend/src/axon_tools/tools/`.

#### Narzędzie 1: Kursy walut (NBP API)
**Plik:** `axon-tools/backend/src/axon_tools/tools/currency_tool.py`
```python
from . import tool
import httpx
from typing import Dict, Any

@tool("Currency Exchange Rates")
def get_exchange_rate(currency_code: str) -> Dict[str, Any]:
    """
    Pobiera aktualny kurs waluty z NBP (Tabela A).
    Args:
        currency_code: Kod waluty (np. 'USD', 'EUR', 'GBP').
    """
    url = f"https://api.nbp.pl/api/exchangerates/rates/a/{currency_code}/?format=json"
    try:
        with httpx.Client(timeout=10.0) as client:
            r = client.get(url)
            if r.status_code == 200:
                data = r.json()
                rate = data['rates'][0]['mid']
                print(f"SUKCES: Kurs {currency_code}: {rate} PLN")
                return {"currency": currency_code, "rate": rate, "base": "PLN"}
            return {"error": f"Błąd NBP: {r.status_code}"}
    except Exception as e:
        return {"error": str(e)}
```

#### Narzędzie 2: Generator haseł
**Plik:** `axon-tools/backend/src/axon_tools/tools/security_tool.py`
```python
from . import tool
import secrets
import string
from typing import Dict, Any

@tool("Password Generator")
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
```

#### Narzędzie 3: Sprawdzanie URL
**Plik:** `axon-tools/backend/src/axon_tools/tools/network_tool.py`
```python
from . import tool
import httpx
from typing import Dict, Any

@tool("URL Status Checker")
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
```

#### Narzędzie 4: Konwerter jednostek
**Plik:** `axon-tools/backend/src/axon_tools/tools/unit_tool.py`
```python
from . import tool
from typing import Dict, Any

@tool("Unit Converter")
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
```

#### Narzędzie 5: Statystyki tekstu
**Plik:** `axon-tools/backend/src/axon_tools/tools/text_tool.py`
```python
from . import tool
from typing import Dict, Any

@tool("Text Statistics")
def get_text_stats(text: str) -> Dict[str, Any]:
    """
    Analizuje tekst i zwraca statystyki (liczba słów, znaków, zdań).
    Args:
        text: Tekst do analizy.
    """
    chars = len(text)
    words = len(text.split())
    sentences = text.count('.') + text.count('!') + text.count('?')
    
    return {
        "characters": chars,
        "words": words,
        "sentences": max(sentences, 1 if words > 0 else 0)
    }
```

### 2. Weryfikacja lokalna
Uruchomienie skryptu testowego dla wszystkich 5 plików w `axon-tools`.

### 3. Synchronizacja z `axon-app`
Wywołanie endpointu `sync-remote` dla każdego z nowych plików.

### 4. Weryfikacja końcowa
Uruchomienie `debug_sync.py` w `axon-app` w celu potwierdzenia obecności 5 nowych narzędzi w bazie danych.
