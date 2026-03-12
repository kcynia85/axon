# Szczegółowy Plan Refaktoryzacji: Moduły `resources` i `studio` (Frontend)

Poniższy dokument przedstawia kompleksowy plan refaktoryzacji dla modułów `resources` i `studio` w aplikacji frontendowej, ze ścisłym uwzględnieniem zasad "Core Refactor" oraz paradygmatu "Zero useEffect" dla React / Next.js.

## 1. Wzorzec "Pure View" i Architektura Komponentów (Component-first, SRP)
Obecne komponenty UI łamią zasadę Pure View, integrując logikę biznesową, mutacje (React Query/Server Actions) oraz skomplikowane zarządzanie stanem wewnątrz warstwy prezentacji (np. `AutomationForm.tsx`, `ExternalServiceForm.tsx`).

**Akcje do wykonania:**
*   **Wdrożenie wzorca Container-Presenter:**
    *   Utworzenie komponentów kontenerowych (np. `AutomationFormContainer.tsx`), które przejmą całą logikę biznesową, komunikację z API oraz zarządzanie stanem formularza.
    *   Redukcja obecnych komponentów (np. `AutomationForm.tsx`) do roli "głupich" widoków (Presenter), które przyjmują wyłącznie ściśle typowane właściwości (props: dane, callbacks, statusy ładowania).
*   **Dekompozycja dużych formularzy (Modular-first, KISS):**
    *   Podział monolitycznych plików z instrukcjami warunkowymi (np. `step === "Definition"`) na mniejsze, spójne komponenty, takie jak:
        *   `AutomationDefinitionStep.tsx`
        *   `AutomationConnectionStep.tsx`
        *   `AutomationDataStep.tsx`
    *   Dzięki temu każdy z komponentów zachowa pojedynczą odpowiedzialność (SRP) i będzie łatwiejszy w testowaniu.

## 2. Dekompozycja Hooków Aplikacyjnych (SRP, ISP)
"Grube" hooki, takie jak `useAutomationsBrowser.ts`, łączą pobieranie danych ze stanem UI (otwarcie paska bocznego), logiką filtrowania i zarządzaniem widokami, co łamie zasadę jednej odpowiedzialności.

**Akcje do wykonania:**
*   Rozbicie gigantycznych hooków na mniejsze, wyspecjalizowane jednostki:
    *   `useAutomationsQuery` – dedykowany wyłącznie do komunikacji z API i pobierania danych.
    *   `useAutomationsFilter` – czysta funkcja/hook zajmująca się filtrowaniem i sortowaniem kolekcji na podstawie przekazanych kryteriów (wyliczanie w czasie renderowania, bez użycia `useEffect`).
    *   `useAutomationsView` – wyizolowane zarządzanie stanem prezentacji (np. tryb Grid vs List).
*   Wyniesienie stanu paska bocznego (`selectedAutomationId`, `isSidebarOpen`) wyżej w hierarchii drzewa komponentów (do układu lub dedykowanego kontekstu), co odciąży logikę domenową z problemów związanych stricte z UI.

## 3. "Zero useEffect" Paradigm & React 19+ Actions
Mimo widocznych prób unikania `useEffect`, wciąż występują miejsca podatne na błędy, oparte na ręcznej synchronizacji stanu lub nieoptymalnym zarządzaniu stanem formularzy.

**Akcje do wykonania:**
*   **Derived State (Stan wyliczany):** Zastąpienie duplikowania stanu i synchronizacji przez zdarzenia podejściem, w którym wartości są wyliczane "w locie" (z ewentualnym użyciem `useMemo`). Np. śledzenie aktywnej sekcji w oknie Studio (takie jak `activeSection` w `AutomationStudio.tsx`) powinno opierać się na `useSyncExternalStore` i natywnym API przeglądarki (Intersection Observer), a nie na ręcznym przypisywaniu stanów podczas scrollowania.
*   **Integracja z React 19+ Actions:**
    *   Eliminacja ręcznego śledzenia stanów ładowania (boolean flags w event handlerach) w plikach takich jak `CrewStudioContainer.tsx`.
    *   Zastąpienie `mutateAsync` i ręcznego `.catch()` natywnymi hookami: `useActionState` (dla Server Actions) oraz `useFormStatus` (dla oznaczania zablokowanych przycisków i formularzy w trakcie wysyłania danych).
*   **Czyste Event Handlery:** Upewnienie się, że wszelkie efekty uboczne (zapis, nawigacja) zachodzą wyłącznie w funkcjach `onClick` / `onSubmit` (bez delegowania ich do `useEffect`).

## 4. Nazewnictwo, Typowanie i Domenowe Podejście (Readability, Explicit over implicit, DDD)
Kod zawiera nieczytelne skróty oraz omijanie systemu typów, co jest bezpośrednim naruszeniem zasady "Readability over cleverness".

**Akcje do wykonania:**
*   **Eradikacja skrótów:** Refaktoryzacja wszystkich krótkich i nieczytelnych zmiennych.
    *   Iteratory: zmiana z `p` na `platform`, `a` na `automation`, `m` na `method` (np. w wywołaniach `.map()` i `.filter()`).
    *   Zmienne ogólne: zmiana `err` na `error`, `btn` na `button`, `cfg` na `configuration`, `ctx` na `context`.
*   **Bezwzględne usunięcie `any`:**
    *   W pliku `studio/features/crew-studio/application/useCrewForm.ts` zidentyfikowano obejścia typów (`as any`).
    *   Konieczna jest naprawa i uszczegółowienie schematów `Zod` (np. `CrewStudioFormData`) oraz interfejsów TypeScript, co wyeliminuje ryzyko błędów na etapie kompilacji (ISP – małe, ścisłe typy zamiast jednego przepastnego `any`).

## 5. Hermetyzacja Funkcji i Immutability (Functional-first, DRY)
Transformacje danych w aplikacjach frontendowych wymagają pełnego zachowania zasady niemutowalności.

**Akcje do wykonania:**
*   **Generyczne moduły filtrowania:** Funkcje takie jak `filterItems` (z `useAutomationsBrowser.ts`) zostaną wyabstrahowane do niezależnych, reużywalnych utilities (np. `createResourceFilter`).
*   **Strict Immutability:** Przegląd wszystkich operacji na tablicach i obiektach. Zwrócenie szczególnej uwagi na `.sort()`, które mutuje oryginalną tablicę w JS. Zastąpienie go bezpiecznym `.toSorted()` lub uprzednim klonowaniem tablicy (np. `[...items].sort()`), aby wyeliminować ukryte błędy re-renderowania Reacta.

---
**Status:** Plan zapisany. Oczekuje na akceptację i instrukcje rozpoczęcia wykonywania poszczególnych punktów.