# Plan: Poprawa hydracji i przepływu danych w Chunking Studio i Sidepeek

## Cel
Zapewnienie spójności danych między widokiem edycji (Chunking Studio) a widokiem podglądu (Sidepeek) poprzez synchronizację lokalnych szkiców (draftów) z wyświetlanymi informacjami.

## Analiza
Obecnie `ChunkingStrategySidePeek` wyświetla dane pobrane z bazy danych (przez `react-query` w `ChunkingStrategiesList`). Zmiany wprowadzane w `ChunkingStudioView` są zapisywane jako lokalny szkic (draft) w `localStorage` (przez `useChunkingStrategyDraft`). Podgląd w `Sidepeek` nie wie o istnieniu tego szkicu, dopóki zmiany nie zostaną trwale zapisane w bazie danych.

## Proponowane Rozwiązanie

### 1. Synchronizacja w Sidepeek
Modyfikacja `ChunkingStrategySidePeek`, aby sprawdzała czy dla danej strategii istnieje lokalny szkic. Jeśli tak, Sidepeek powinien wyświetlać dane ze szkicu (hydracja).

### 2. Rozszerzenie `useChunkingStrategyDraft`
Upewnienie się, że hook `useChunkingStrategyDraft` (i bazowy `useEntityDraft`) poprawnie identyfikuje szkice dla istniejących ID.

### 3. Poprawa formatowania (zrobione wstępnie)
Ujednolicenie formatowania nazw metod w Sidepeek (np. "Recursive character" zamiast "Recursive_Character"), aby UI był spójny z wartościami w Studio.

## Kroki Implementacji

1.  **Modyfikacja `ChunkingStrategySidePeek.tsx`**:
    *   Dodanie użycia hooka `useChunkingStrategyDraft(strategy?.id)`.
    *   Użycie danych ze szkicu (jeśli istnieją) jako priorytetowych nad danymi z `strategy` przekazanego w propsach.
    *   Dodanie wizualnego wskaźnika (np. Badge "Draft" lub "Modified"), jeśli wyświetlane są dane ze szkicu.

2.  **Modyfikacja `ChunkingStudioView.tsx`**:
    *   Upewnienie się, że `saveDraft` jest wywoływane przy każdej istotnej zmianie (już jest przez `onSyncDraft` w sekcjach).

3.  **Weryfikacja**:
    *   Uruchomienie Playwright, aby potwierdzić że po zmianie separatora w Studio i powrocie do listy (bez zapisu do bazy), Sidepeek pokazuje nową wartość separatora.

## Alternatywy
*   Przejście na w pełni zsynchronizowany stan w `react-query` (bez localStorage) – odrzucone, ponieważ `localStorage` zapewnia przetrwanie zmian po odświeżeniu strony/zamknięciu przeglądarki przed ostatecznym zapisem.
