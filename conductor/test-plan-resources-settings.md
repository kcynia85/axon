# Plan Testów (E2E/Integracyjnych) Vitest dla modułów Resources i Settings

Poniższy plan testów opiera się o zasady zdefiniowane w projektowych skillach (m.in. `code-review` oraz `test-generator`). Zakładamy tu użycie narzędzi **Vitest + React Testing Library** w celu symulacji przepływów E2E na poziomie komponentów i modułów (testowanie interakcji, hooków, komunikacji z mockowanym API), zgodnie z założeniami "Testing Pyramid".

## 1. Architektura Testów i Standardy (Zgodne z `code-review` i `test-generator`)

- **Behavioral Testing**: Testujemy zachowanie aplikacji (co robi komponent z punktu widzenia użytkownika), a nie jego implementację. Użytkownik widzi tekst i klika przyciski, więc szukamy elementów przez np. `findByRole`, `findByText`.
- **Pełne, opisowe nazwy (Readability over cleverness)**: W testach stosujemy pełne nazwy (np. `mockedKnowledgeResources`, `buttonSubmitResource`, `errorValidationMessage`), unikając skrótów (nie używamy `btn`, `err`, `ctx`, `cfg`).
- **Determinizm (Mocking Strategy)**: Mockujemy wyłącznie komunikację z zewnętrznym API (np. używając MSW - Mock Service Worker lub mockując `apiClient`), ale nie mockujemy wewnętrznej logiki stanu, chyba że jest to konieczne z perspektywy granicy modułu.
- **Pure Views vs Containers**: 
  - *Views* (`*View.tsx`): Testy są czysto renderowe. Sprawdzają mapowanie właściwości (`props`) na elementy DOM i wywołania callbacków. Zero logiki stanu.
  - *Containers*: Testy integracyjne sprawdzają pełny obieg od pobrania danych (mock), przez stan w Application Hooks, aż po wyrenderowany widok.
- **Brak Testowania Manualnych Optymalizacji**: Nie testujemy, czy `useCallback` czy `React.memo` zadziałało. Zakładamy poprawność działania React Compiler.

---

## 2. Moduł: Resources (Zasoby)
Główne komponenty: `PromptsBrowser`, `InternalToolsList`, `KnowledgeBrowser`.

### 2.1 Happy Path (Ścieżka Pozytywna)
**Scenariusz:** Pomyślne listowanie i zarządzanie narzędziami (Internal Tools)
1. Użytkownik wchodzi na widok `InternalToolsList`.
2. Aplikacja pobiera dane z API (zmockowana odpowiedź 200 OK z listą narzędzi).
3. Aplikacja poprawnie wyświetla wyrenderowane karty/wiersze z informacjami o narzędziach.
4. Użytkownik wpisuje w pole wyszukiwania frazę (np. "Calculator").
5. Aplikacja filtruje listę, pokazując wyłącznie dopasowane narzędzia.
6. Użytkownik klika przycisk "Usuń" na danym narzędziu.
7. Wyświetla się modal z potwierdzeniem (jeśli występuje) lub następuje akcja z Toastem potwierdzającym i możliwością "Cofnij" (undo). 
8. Lista jest aktualizowana.

### 2.2 Alternative Path (Ścieżka Alternatywna)
**Scenariusz:** Użytkownik podgląda szczegóły archetypu (PromptArchetypesList)
1. Użytkownik ładuje widok `PromptArchetypesList`.
2. Użytkownik klika dany element listy (lub ikonę podglądu).
3. Otwiera się komponent typu `SidePeek` (`PromptArchetypeEditor` lub widok).
4. Użytkownik edytuje jedno z pól (np. kontekst archetypu) i wychodzi klikając "Anuluj" lub klikając obok.
5. Aplikacja zamyka `SidePeek` bez zapisu do API (brak żądań typu PUT/POST) i bez zmiany danych na liście głównej.

### 2.3 Edge Cases / Negative Path (Przypadki brzegowe)
**Scenariusz A:** Brak zasobów (Empty State)
1. Użytkownik wchodzi do widoku. API zwraca pustą tablicę `[]`.
2. Aplikacja wyświetla dedykowany komponent `BrowserEmptyState` (lub odpowiednik) z komunikatem: "No templates registered. Draft some structures.".

**Scenariusz B:** Błąd pobierania danych (500 Internal Server Error) z API
1. Zmockowane API zwraca błąd 500 przy żądaniu pobrania narzędzi lub archetypów.
2. Aplikacja reaguje graceful degradation - pokazuje komponent błędu lub toast (np. z biblioteki `sonner`) informujący o awarii sieci ("Failed to load resources"). Brak wywalenia całej strony (Error Boundary handling).

**Scenariusz C:** Próba zapisu niekompletnych danych archetypu (Błąd Walidacji)
1. Użytkownik wypełnia formularz archetypu i czyści wymagane pole nazwy.
2. Formularz (oparty o Zod/Pydantic) nie pozwala na submit - API w ogóle nie jest strzelane. Pojawia się błąd obok pola "Name is required".

---

## 3. Moduł: Settings (Ustawienia)
Główne komponenty: `LLMModelsList`, `VectorDatabasesList`, `LLMProvidersBrowser`.

### 3.1 Happy Path (Ścieżka Pozytywna)
**Scenariusz:** Konfiguracja Bazy Wektorowej (Vector Database)
1. Użytkownik wchodzi w ustawienia baz wektorowych (`VectorDatabasesList`).
2. Klika przycisk "Dodaj Bazę Wektorową".
3. Uzupełnia wymagane pola (Name, URL, API Key) za pomocą testowego tekstu.
4. Użytkownik klika "Zapisz".
5. Aplikacja wysyła poprawne żądanie do zmockowanego API, odbiera poprawną odpowiedź 200 OK.
6. Formularz/SidePeek się zamyka. Wyświetla się pozytywny Toast.
7. Nowa baza wektorowa jest dodana do widoku listy ustawień.

### 3.2 Alternative Path (Ścieżka Alternatywna)
**Scenariusz:** Zmiana statusu wybranego modelu LLM
1. Lista modeli LLM jest poprawnie załadowana i wyświetlona.
2. Użytkownik chce przełączyć dany model z aktywnego na nieaktywny (Toggle/Switch).
3. Aplikacja optymistycznie odświeża interfejs użytkownika (Optimistic UI - o ile jest zaimplementowane).
4. Wysyła żądanie do API. Po powrocie odpowiedzi 200 OK weryfikowane jest, że przełącznik zachował stan "wyłączony".

### 3.3 Edge Cases / Negative Path (Przypadki brzegowe)
**Scenariusz A:** Błąd autoryzacji przy próbie dodania klucza dostawcy (403 Forbidden)
1. Użytkownik w sekcji `LLMProvidersBrowser` wpisuje nowy klucz API i klika zapisz.
2. Zmockowane API zwraca status 403 Forbidden.
3. Aplikacja odrzuca formularz z komunikatem błędu. Toast/Validation Error informuje "Access Denied" lub "Invalid Credentials". Zmiana nie pojawia się na liście.

**Scenariusz B:** Zapis błędnego URL dla Vector DB (Walidacja na froncie)
1. Użytkownik podaje ciąg znaków "not-a-url" w polu "Vector Database URL".
2. Walidator w `VectorDatabaseSidePeek` (lub dedykowanym komponencie formularza) przechwytuje problem.
3. API w ogóle nie zostaje wywołane.
4. Komunikat o błędzie "Invalid URL format" pojawia się czytelnie dla użytkownika.

**Scenariusz C:** Usunięcie dostawcy LLM i opcja Undo (Cofnij)
1. Użytkownik klika usuń dostawcę.
2. Włącza się weryfikacja z użyciem `useDeleteWithUndo`. Interfejs znika (optymistycznie). 
3. Pojawia się toast "Dostawca usunięty" z przyciskiem "Cofnij".
4. W teście użytkownik klika "Cofnij".
5. Element pojawia się z powrotem na liście, a faktyczne żądanie DELETE do serwera zostaje przerwane lub jest odwracane, zależnie od implementacji.
