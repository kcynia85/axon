# Plan Wdrożenia Optymalizacji Performance (Marzec 2026)

Ten plan opisuje techniczne kroki mające na celu wyeliminowanie lagów i poprawę płynności aplikacji Axon na podstawie raportu audytu.

## 1. Optymalizacja Responsywności Studio (Agent Studio)
**Cel:** Eliminacja opóźnień podczas pisania w polach tekstowych.

*   **Memoizacja Sekcji:** Owinięcie sekcji (`IdentitySection`, `CognitionSection`, itd.) w `React.memo`.
*   **Optymalizacja `syncDraft`:** Upewnienie się, że `syncDraft` jest wywoływany wyłącznie `onBlur`, a nie przy każdym znaku.
*   **Stabilizacja Referencji:** Użycie `useCallback` dla funkcji przekazywanych do sekcji.

## 2. Eliminacja Layout Thrashingu (Sidebar & Navigation)
**Cel:** Zapobieganie przeliczaniu całego drzewa DOM przy prostych animacjach.

*   **Sidebar Optimization:** Dodanie `will-change: width` do kontenera Sidebaru oraz optymalizacja przejść.
*   **ResourcesNavIsland:** Uproszczenie animacji zakładki. Usunięcie `layoutId` z Framer Motion na rzecz prostszego przejścia opartego na `transform` lub standardowego CSS transition, jeśli `layoutId` powoduje zbyt duże obciążenie procesora graficznego.

## 3. Knowledge View - Poprawa Renderowania
**Cel:** Skrócenie czasu LCP i Render Delay w widoku wiedzy.

*   **Lazy Loading Ikon:** Zastosowanie dynamicznych importów lub opóźnionego renderowania dla ikon w listach zasobów.
*   **Wirtualizacja List (Opcjonalnie):** Jeśli lista zasobów przekracza 20 elementów, wprowadzenie prostego mechanizmu okienkowania.

## 4. Harmonogram Prac

### Krok 1: Studio & React.memo
*   Modyfikacja sekcji w `AgentStudioView.tsx`.
*   Weryfikacja czasu INP w DevTools.

### Krok 2: Sidebar & CSS
*   Modyfikacja `shared/ui/layout/sidebar.tsx`.
*   Użycie `transform: scaleX` lub stałych szerokości tam, gdzie to możliwe.

### Krok 3: Navigation Island
*   Refaktoryzacja `ResourcesNavIsland.tsx`.
*   Testowanie płynności przełączania między Knowledge/Tools.
