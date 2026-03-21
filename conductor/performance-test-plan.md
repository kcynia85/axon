# Plan Testów Performance: Axon Application (DevTools MCP)

Ten dokument definiuje strategię i procedury testowe mające na celu zapewnienie najwyższej wydajności aplikacji Axon, przy użyciu narzędzi Chrome DevTools MCP.

## 1. Cel i Zakres
Celem jest identyfikacja wąskich gardeł, optymalizacja Core Web Vitals (LCP, INP, CLS) oraz zapewnienie płynności interfejsu (60 FPS) we wszystkich kluczowych modułach.

**Zakres testów:**
*   **Resources** (Knowledge, Archetypes, Tools) – wydajność list i filtrowania.
*   **Studio** (Agent & Archetype Builder) – responsywność formularzy i ciężkich komponentów UI.
*   **Global Navigation** – wydajność przejść między modułami i Sidepeek.
*   **Data Table & Grids** – renderowanie dużych zbiorów danych i paginacja.

## 2. Metodologia (Narzędzia MCP)
Do testów wykorzystamy następujące funkcje MCP:
*   `performance_start_trace` / `performance_stop_trace`: Do głębokiej analizy cykli renderowania.
*   `performance_analyze_insight`: Do automatycznej interpretacji problemów (np. `INPBreakdown`, `ForcedReflow`).
*   `take_memory_snapshot`: Do wykrywania wycieków pamięci w długich sesjach w Studio.
*   `lighthouse_audit`: Do generowania raportów zgodnych ze standardami Google.

## 3. Kluczowe Wskaźniki (KPI)
| Metryka | Cel (Good) | Ostrzeżenie (Needs Improvement) |
| :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | < 1.2s | > 2.5s |
| **INP** (Interaction to Next Paint) | < 150ms | > 200ms |
| **CLS** (Cumulative Layout Shift) | < 0.05 | > 0.1 |
| **Long Tasks** | 0 tasks > 50ms | Dowolny task > 100ms |
| **JS Heap Size** | < 50MB (base) | Przyrost > 10MB po zamknięciu modala |

## 4. Scenariusze Testowe

### Scenariusz A: Resources Explorer (Heavy Listing)
1.  **Akcja**: Nawigacja do `/resources/tools` przy > 50 narzędziach w bazie.
2.  **Test**: Szybkie przewijanie (scroll) + wpisywanie w Search (INP test).
3.  **Weryfikacja**: Czy `React.memo` skutecznie blokuje re-rendery niepotrzebnych kart.
4.  **Narzędzie**: Trace z analizą `ForcedReflow`.

### Scenariusz B: Studio Form Complexity
1.  **Akcja**: Otwarcie Studio Agenta, przełączanie sekcji (Identity -> Engine -> Skills).
2.  **Test**: Dodawanie wielu narzędzi pod rząd i obserwacja czasu aktualizacji Context/Artefacts.
3.  **Weryfikacja**: Czy `useFormContext` nie powoduje lagów w polach tekstowych przy dużym stanie formularza.
4.  **Narzędzie**: Trace z analizą `Long Tasks`.

### Scenariusz C: Memory Leak (Sidepeek Usage)
1.  **Akcja**: Otwieranie i zamykanie Sidepeek dla 20 różnych narzędzi pod rząd.
2.  **Test**: Porównanie Heap Snapshot przed i po serii akcji.
3.  **Weryfikacja**: Czy obiekty `InternalToolDetailsView` są poprawnie usuwane z pamięci (Garbage Collection).
4.  **Narzędzie**: `take_memory_snapshot`.

## 5. Procedura Audytu (Krok po Kroku)

1.  **Przygotowanie**:
    *   Uruchomienie aplikacji w trybie produkcyjnym (`npm run build && npm run start`).
    *   Wyczyszczenie cache przeglądarki.
2.  **Nagrywanie**:
    ```typescript
    // Przykład użycia MCP
    performance_start_trace({ reload: true })
    // Wykonaj interakcje...
    performance_stop_trace({ filePath: "reports/studio-trace.json" })
    ```
3.  **Analiza Insightów**:
    *   Wywołaj `performance_analyze_insight` dla `INPBreakdown`.
    *   Sprawdź `LCPBreakdown` pod kątem opóźnionego renderowania obrazów/ikon.
4.  **Naprawa i Re-test**:
    *   Wprowadzenie poprawek (np. `useCallback`, `Lazy Loading`).
    *   Ponowne uruchomienie trace i porównanie metryk.

## 6. Harmonogram
*   **Raz w tygodniu**: Pełny `lighthouse_audit` dla kluczowych ścieżek.
*   **Przy każdym nowym module UI**: Test trace dla INP.
