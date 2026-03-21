# Plan: Dodanie kolejnych 5 narzędzi do Axon Tools

Ten plan opisuje dodanie kolejnej partii 5 przydatnych narzędzi do `axon-tools` i ich synchronizację.

## Cel
Rozszerzenie biblioteki narzędzi o:
1. `get_crypto_price` (Ceny krypto)
2. `extract_emails` (Wyciąganie emaili z tekstu)
3. `format_json_string` (Formatowanie JSON)
4. `calculate_bmi` (Kalkulator BMI)
5. `generate_v4_uuid` (Generator UUID)

## Nowe narzędzia

### 1. Crypto Price (`crypto_tool.py`)
```python
@tool("Crypto Price Tracker")
def get_crypto_price(coin_id: str = "bitcoin") -> Dict[str, Any]:
    # Pobiera cenę z CoinGecko
```

### 2. Email Extractor (`regex_tool.py`)
```python
@tool("Email Extractor")
def extract_emails(text: str) -> Dict[str, Any]:
    # Używa regex do znalezienia emaili
```

### 3. JSON Formatter (`format_tool.py`)
```python
@tool("JSON Formatter")
def format_json_string(json_str: str) -> Dict[str, Any]:
    # Pretty print JSON string
```

### 4. BMI Calculator (`health_tool.py`)
```python
@tool("BMI Calculator")
def calculate_bmi(weight_kg: float, height_cm: float) -> Dict[str, Any]:
    # Liczy BMI i zwraca kategorię
```

### 5. UUID Generator (`uuid_tool.py`)
```python
@tool("UUID Generator")
def generate_v4_uuid() -> Dict[str, Any]:
    # Generuje losowy identyfikator UUID v4
```

## Kroki
1. Stworzenie plików w `axon-tools/backend/src/axon_tools/tools/`.
2. Test lokalny każdego narzędzia.
3. Synchronizacja z `axon-app` przez endpoint `/resources/internal-tools/sync-remote`.
4. Weryfikacja obecności w Resources.
