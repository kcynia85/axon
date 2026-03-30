# Plan Analizy i Dopełnienia Data Flow: Providers, Models, Routers

## 1. Cel (Objective)
Zapewnienie 100% sprawności CRUD, pełnej hydracji w Studiach oraz nieprzerwanego przepływu danych (Browser -> SidePeek -> Studio -> Save -> Browser) dla trzech kluczowych encji LLM.

## 2. Zidentyfikowane luki (Current Gaps)
- **Providers**: Link "Konfiguruj" w SidePeek prowadzi do nieistniejącej trasy `/settings/llms/providers/[id]`. Brak strony edycji.
- **Models**: Hydracja w `ModelStudio` pomija zaawansowane parametry (`custom_params`, `system_prompt`), które nie są jeszcze obsługiwane przez API/mapowanie.
- **Routers**: Strona edycji `/settings/llms/routers/[id]` nie posiada logiki pobierania danych (initialData), przez co Studio otwiera się puste.

## 3. Kroki Analizy i Implementacji

### Faza 1: Providers (Full CRUD & Edit Flow)
1. **Utworzenie trasy edycji**: Dodanie `axon-app/frontend/src/app/(studio)/settings/llms/providers/[id]/page.tsx`.
2. **Implementacja Hydracji**: W nowej stronie dodać `useLLMProvider(id)` i mapowanie na `initialData` dla `ProviderStudioContainer`.
3. **Weryfikacja SidePeek**: Upewnienie się, że `onConfigure` nawiguje do poprawnej trasy edycji.

### Faza 2: Models (Advanced Hydration)
1. **Audit Backend API**: Sprawdzenie w `service.py` i `schemas.py`, czy modele obsługują już `custom_params` i `system_prompt`.
2. **Dopełnienie Mapowania**: Aktualizacja `ModelEditPageContent`, aby poprawnie przekazywał wszystkie dane do `ModelStudio`.
3. **Synchronizacja UI**: Upewnienie się, że `ModelStudio` poprawnie renderuje te dane po załadowaniu.

### Faza 3: Routers (Hydration & Priority Chain)
1. **Implementacja Fetchingu**: Dodanie `useLLMRouter(id)` w `RouterStudioEditPageContent`.
2. **Mapowanie Priority Chain**: Upewnienie się, że skomplikowana struktura `priority_chain` (lista modeli) poprawnie ładuje się do `react-hook-form` (useFieldArray).
3. **Weryfikacja Zapisu**: Sprawdzenie, czy `updateLLMRouter` poprawnie wysyła zaktualizowaną listę kroków.

### Faza 4: Global Data Flow
1. **Invalidation**: Weryfikacja, czy każdy `mutate` (create/update/delete) poprawnie unieważnia query `["llm-providers"]`, `["llm-models"]`, `["llm-routers"]`.
2. **Navigation UX**: Sprawdzenie, czy po zapisie w Studio użytkownik zawsze wraca do odpowiedniego Browsera z odświeżoną listą.

## 4. Weryfikacja (Verification)
- Przejście ścieżki: Browser -> Klik w kartę -> SidePeek -> Konfiguruj -> Zmiana danych w Studio -> Zapisz -> Powrót do Browsera -> Weryfikacja zmian w SidePeek.
- Wykonanie tej ścieżki dla każdej z 3 encji.
