# Plan Implementacji: CRUD dla LLM Routers

## Cel (Objective)
Zapewnienie pełnej funkcjonalności CRUD dla routerów LLM w sekcji Settings.

## Stan obecny (Current State)
- **Read**: Zaimplementowane w `LLMRoutersBrowser`.
- **Create/Update**: Brak. Planowany `RouterStudio`.
- **Delete**: Brak.

## Zmiany (Proposed Changes)

### 1. Warstwa Infrastruktury (`infrastructure/api.ts`)
- Dodanie metod:
  - `createLLMRouter(data)`
  - `updateLLMRouter(id, data)`
  - `deleteLLMRouter(id)`

### 2. Warstwa Aplikacji (`application/useSettings.ts` lub `useLLMRouters.ts`)
- Dodanie hooków:
  - `useCreateLLMRouter()`
  - `useUpdateLLMRouter()`
  - `useDeleteLLMRouter()`

### 3. Warstwa UI
#### A. Create/Update (Router Studio)
- Implementacja `RouterStudio` zgodnie z `router-studio-plan.md`.
- Obsługa trybu "Edit" (URL: `/settings/llms/routers/[id]`).

#### B. Read & Delete (SidePeek)
- Utworzenie `LLMRouterSidePeek` do podglądu szczegółów routera.
- Integracja `LLMRouterSidePeek` z `LLMRoutersBrowser`.
- Dodanie akcji "Konfiguruj" (edycja w Studio) i "Usuń".

## Weryfikacja (Verification)
- Dodanie routera przez `RouterStudio`.
- Edycja istniejącego routera.
- Testowanie routera przed zapisem (akcja "Test").
- Usunięcie routera i weryfikacja zniknięcia z listy.
