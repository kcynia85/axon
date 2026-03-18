# Plan Naprawy i Weryfikacji CRUD dla Template

## 1. Cel
Kompleksowa naprawa i weryfikacja cyklu życia encji `Template` (Szablon) w systemie AXON, ze szczególnym uwzględnieniem mechanizmów "Draft" (szkiców) w Studio oraz bezpiecznego usuwania danych po stronie Backend.

## 2. Zidentyfikowane Luki (Gap Analysis)

| Obszar | Problem | Rozwiązanie |
| :--- | :--- | :--- |
| **Frontend (Studio)** | Brak mechanizmu "Autosave / Draft". Odświeżenie strony usuwa wpisane dane. | Implementacja `useTemplateDraft` (localStorage) i integracja z formularzem. |
| **Backend (Delete)** | Brak sprawdzania więzów integralności. Można usunąć szablon używany przez inne encje (np. Space). | Dodanie sprawdzenia w `delete_template_use_case` czy szablon nie jest używany. |
| **Walidacja** | Zbyt luźna walidacja schema (opcjonalne opisy, brak typowania zagnieżdżeń). | Zaostrzenie `TemplateStudioSchema` (Zod) i poprawa komunikatów błędów. |
| **UX** | Brak wizualnego wskaźnika "Draft saved" lub "Unsaved changes". | Dodanie wskaźnika statusu zapisu w nagłówku Studio. |

## 3. Szczegółowy Plan Implementacji

### Faza 1: Frontend - Mechanizm Draftów (Studio)

1.  **Stworzenie Hooka `useTemplateDraft`**:
    *   Lokalizacja: `frontend/src/modules/studio/features/template-studio/application/hooks/useTemplateDraft.ts`
    *   Funkcjonalność:
        *   Zapisywanie stanu formularza (`watch`) do `localStorage` pod kluczem `draft_template_{workspaceId}_{templateId || 'new'}`.
        *   Debounce zapisu (np. 1000ms).
        *   Metoda `clearDraft()` wywoływana po udanym zapisie.
        *   Metoda `loadDraft()` do przywracania stanu przy inicjalizacji (jeśli istnieje i użytkownik potwierdzi/lub automatycznie).

2.  **Integracja z `TemplateStudioContainer`**:
    *   Podpięcie `useTemplateDraft` do formularza.
    *   Logika: Jeśli `initialData` przychodzi z API, ale istnieje nowszy draft lokalny -> zapytaj użytkownika lub nadpisz (polityka: Draft ma priorytet jeśli jest nowszy).
    *   Dodanie wskaźnika w UI: "Draft saved..." obok przycisku Save.

### Faza 2: Walidacja i Schema (Frontend)

1.  **Aktualizacja `TemplateStudioSchema`**:
    *   `description`: Zmiana na wymagane (min 10 znaków) - wymuszenie lepszej dokumentacji.
    *   `context_items` / `artefact_items`: Walidacja unikalności nazw pól.

### Faza 3: Backend - Bezpieczne Usuwanie

1.  **Analiza Zależności**:
    *   Sprawdzenie tabeli `spaces` (lub powiązanych węzłów grafu), czy nie przechowują referencji do ID szablonu.
    *   *Obserwacja*: W `SpaceTemplateNode` (Frontend) widoczna jest zależność. Należy zweryfikować, czy w bazie danych (tabela `patterns` lub struktura JSON grafu) zapisywane jest `templateId`.

2.  **Aktualizacja `delete_template_use_case`**:
    *   Przed usunięciem (soft-delete):
        *   Przeszukaj `PatternTable` (kolumna `pattern_graph_structure`) w poszukiwaniu węzłów o typie `template` i pasującym ID.
    *   Jeśli znaleziono użycie -> Rzuć wyjątek `HTTP 409 Conflict` z listą miejsc występowania.

### Faza 4: Weryfikacja (E2E / Manual)

1.  **Scenariusz Testowy (Draft)**:
    *   Wejdź do Studio (New Template).
    *   Wpisz nazwę i opis.
    *   Przeładuj stronę (F5).
    *   Oczekiwane: Formularz wypełniony danymi sprzed przeładowania.
    *   Kliknij Save.
    *   Wejdź ponownie w New Template.
    *   Oczekiwane: Pusty formularz (draft wyczyszczony).

2.  **Scenariusz Testowy (Delete Conflict)**:
    *   Stwórz Template A.
    *   Użyj Template A w Space/Pattern B.
    *   Próba usunięcia Template A.
    *   Oczekiwane: Błąd/Ostrzeżenie "Template is used in Pattern B".

## 4. Zadania (Checklist)

- [x] Utworzenie `useTemplateDraft.ts`
- [x] Integracja Draftów w `TemplateStudioContainer.tsx`
- [x] Aktualizacja `TemplateStudioSchema.ts`
- [x] Implementacja walidacji użycia w `delete_template_use_case` (Python)
- [x] Aktualizacja UI w `TemplateProfilePeek` (obsługa błędów usuwania)
