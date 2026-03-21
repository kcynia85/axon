# Axon Internal Tools Development Guide

Aby dodać nowe narzędzie (Internal Tool), które zostanie zmapowane i będzie widoczne w interfejsie testowym oraz w `axon-app`:

1.  **Utwórz nowy plik Python** w katalogu `@axon-tools/backend/src/axon_tools/tools/`. Na przykład `my_tool.py`.
2.  **Zaimportuj dekorator `@tool`** z pliku `__init__.py` w tym katalogu.
3.  **Zdefiniuj funkcję i oznacz ją dekoratorem `@tool`**. Dekorator jako argument przyjmuje nazwę narzędzia (która wyświetlać się będzie w tabeli i w UI).
4.  **Dodaj docstring**. To bardzo ważne, ponieważ tekst z docstringa jest automatycznie pobierany jako `description` narzędzia ("Business Goal").
5.  **Dodaj pełne typowanie argumentów wejściowych (Type Hints)**. Silnik Axon automatycznie rzutuje parametry wpisane w interfejsie przeglądarkowym i tworzy z nich schemat na bazie tych typów. Zdefiniowanie poprawnych typów np. `int`, `float`, `str`, `bool` jest wymagane.

## Przykład

Plik: `axon-tools/backend/src/axon_tools/tools/greeting.py`

```python
from . import tool

@tool("Personalized Greeting")
def generate_greeting(name: str, is_formal: bool, age: int) -> str:
    """
    Generuje spersonalizowane powitanie na podstawie imienia i wieku.
    Pokazuje jak używać wielu argumentów o różnych typach.
    """
    prefix = "Szanowny Panie / Szanowna Pani" if is_formal else "Cześć"
    
    if age < 18:
        return f"{prefix} {name}! Widzę, że jeszcze się uczysz."
    else:
        return f"{prefix} {name}! Witam dorosłego użytkownika."
```

## Proces:
1. Po zapisaniu pliku, system automatycznie rozpozna nowe narzędzie.
2. Narzędzie pojawi się w głównej tabeli `ToolsRegistryView`.
3. Możesz je przetestować z poziomu przeglądarki klikając w wiersz lub "Execute Test".
4. Jeżeli narzędzie działa zgodnie z oczekiwaniami w lokalnym interfejsie Axon Tools, kliknięcie `Deploy Source` wywoła endpoint `/api/tools/{tool_name}/sync`, który prześle kod narzędzia do głównego serwera bazy danych `axon-app` (endpoint: `/resources/internal-tools/sync-remote`). Zaktualizuje to listę `InternalTools` w głównym module resources.
