# Plan Implementacji: CRUD dla LLM Providers

## Cel (Objective)
Zapewnienie pełnej funkcjonalności CRUD (Create, Read, Update, Delete) dla dostawców LLM (Providers) w sekcji Settings.

## Stan obecny (Current State)
- **Read**: Zaimplementowane w `LLMProvidersBrowser`.
- **Create**: Istnieje `LLMProviderForm` (dialog), ale planowany jest `ProviderStudio` (widok 3-kolumnowy).
- **Update**: Brak.
- **Delete**: Przycisk w `LLMProviderSidePeek`, ale brak logiki usuwania.

## Zmiany (Proposed Changes)

### 1. Warstwa Infrastruktury (`infrastructure/api.ts`)
- Dodanie metod:
  - `updateLLMProvider(id, data)`
  - `deleteLLMProvider(id)`

### 2. Warstwa Aplikacji (`application/useLLMProviders.ts`)
- Dodanie hooków:
  - `useUpdateLLMProvider()`
  - `useDeleteLLMProvider()`

### 3. Warstwa UI
#### A. Create/Update (Provider Studio)
- Implementacja `ProviderStudio` zgodnie z `provider-studio-plan.md`.
- Obsługa trybu "Edit" przy przekazaniu `id` w URL (`/settings/llms/providers/[id]`).

#### B. Read (Browser)
- `LLMProvidersBrowser`: Kliknięcie w kartę otwiera `LLMProviderSidePeek` (obecne).
- `LLMProviderSidePeek`: Implementacja akcji "Konfiguruj" (nawigacja do Studio) oraz "Usuń" (wywołanie `useDeleteLLMProvider`).

## Weryfikacja (Verification)
- Dodanie nowego dostawcy przez `ProviderStudio`.
- Edycja istniejącego dostawcy.
- Usunięcie dostawcy z poziomu `SidePeek` i weryfikacja odświeżenia listy.
