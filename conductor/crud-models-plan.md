# Plan Implementacji: CRUD dla LLM Models

## Cel (Objective)
Zapewnienie pełnej funkcjonalności CRUD dla modeli LLM (Inventory) w sekcji Settings.

## Stan obecny (Current State)
- **Read**: Zaimplementowane w `LLMModelsList` (widok tabelaryczny).
- **Create**: Przycisk "Register Model" nieobsłużony.
- **Update**: Brak.
- **Delete**: Brak.

## Zmiany (Proposed Changes)

### 1. Warstwa Infrastruktury (`infrastructure/api.ts`)
- Dodanie metod:
  - `createLLMModel(data)`
  - `updateLLMModel(id, data)`
  - `deleteLLMModel(id)`

### 2. Warstwa Aplikacji (`application/useSettings.ts`)
- Dodanie hooków:
  - `useCreateLLMModel()`
  - `useUpdateLLMModel()`
  - `useDeleteLLMModel()`

### 3. Warstwa UI
#### A. Register/Edit (Model Form/Studio)
- Utworzenie `LLMModelForm` (dialog lub lekki widok).
- Rejestracja modelu wymaga przypisania do istniejącego `provider_id`.
- Pola: alias modelu, identyfikator techniczny, tier (Tier1/Tier2), flagi możliwości (vision, tool_use itp.), okno kontekstowe, cennik.

#### B. Read & Actions (SidePeek)
- Utworzenie `LLMModelSidePeek` do podglądu parametrów modelu.
- Dodanie akcji "Edytuj" (otwiera form) i "Usuń".
- Integracja z `LLMModelsList` (kliknięcie w wiersz tabeli otwiera SidePeek).

## Weryfikacja (Verification)
- Rejestracja nowego modelu i przypisanie go do dostawcy.
- Edycja parametrów modelu (np. zmiana cennika).
- Usunięcie modelu z inwentarza.
