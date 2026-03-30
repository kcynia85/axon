# Plan: Rozszerzenie bazy danych Routera LLM o Łańcuch Priorytetów

Celem jest umożliwienie zapisywania nieograniczonej liczby modeli w łańcuchu routera, wraz z ich indywidualnymi ustawieniami (timeout, nadpisywanie parametrów).

## Zmiany w Backendzie

### 1. Model Domenowy (`app/modules/settings/domain/models.py`)
- Zaktualizowanie klasy `LLMRouter` o nowe pole `priority_chain: List[Dict[str, Any]]`.
- Pole to będzie przechowywać pełną strukturę kroków ze Studio.

### 2. Tabele Bazy Danych (`app/modules/settings/infrastructure/tables.py`)
- Dodanie kolumny `priority_chain = Column(JSONB, default=[])` do tabeli `LLMRouterTable`.
- Zmiana `primary_model_id` na `nullable=True`, aby umożliwić migrację na nowy format (docelowo dane będą w JSONB).

### 3. Schematy API (`app/modules/settings/application/schemas.py`)
- Dodanie `priority_chain` do `CreateLLMRouterRequest`, `UpdateLLMRouterRequest` oraz `LLMRouterResponse`.

### 4. Repozytorium i Serwis (`app/modules/settings/infrastructure/repo.py`, `service.py`)
- Obsługa zapisu i odczytu pola `priority_chain`.
- Automatyczne uzupełnianie `primary_model_id` i `fallback_model_id` z pierwszych dwóch elementów JSONB (dla zachowania kompatybilności wstecznej tam, gdzie systemy oczekują pojedynczych ID).

### 5. Migracja Alembic
- Wygenerowanie i wykonanie migracji `add_priority_chain_to_routers`.

## Zmiany we Frontendzie

### 1. Schema Zod (`shared/domain/settings.ts`)
- Dodanie `priority_chain` do `LLMRouterSchema`.

### 2. Router Studio (`RouterStudioContainer.tsx`)
- Przesyłanie pełnego obiektu `priority_chain` do API zamiast tylko dwóch pierwszych ID.
- Usunięcie sztucznego ograniczenia do 2 kroków w UI.

## Weryfikacja
1. Dodanie 3 modeli w Studio i zapisanie routera.
2. Odświeżenie strony i sprawdzenie, czy wszystkie 3 modele zostały poprawnie załadowane.
3. Sprawdzenie Sidepeek – czy wyświetla wszystkie modele z łańcucha.
