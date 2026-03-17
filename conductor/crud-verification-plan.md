# Szczegółowy Plan Weryfikacji CRUD dla Encji w Workspaces i Resources

## 1. Cel i Zakres
Plan ma na celu systematyczną weryfikację poprawności operacji CRUD (Create, Read, Update, Delete) dla sześciu kluczowych encji: **Agent, Crew, Template, Service, Automation, Archetype**. Szczególny nacisk kładziemy na badanie spójności przepływu danych (Data Flow) między widokami listowymi (Karty), panelami podglądu (Sidepeeks) oraz pełnoekranowymi kreatorami formularzy w module Studio.

## 2. Analiza Przepływu Danych (Data Flow)
Weryfikacja musi uwzględniać trzy główne warstwy interakcji i stanów:
1. **Listy i Karty (Workspaces / Resources)**: Pobieranie danych (np. przez React Query) i renderowanie widoków takich jak `WorkspaceCard` czy `MainListItem`. Cache musi być prawidłowo inwalidowany po mutacjach.
2. **Sidepeeks (np. `AgentProfilePeek`, `CrewProfilePeek`)**: Wysuwane panele podglądu. Otwarcie karty powinno przekazać aktualne dane do Sidepeek'a. Widok ten służy jako pomost (akcje "Edit", "Delete").
3. **Moduł Studio (np. `AgentStudio`, `CrewStudio`)**: Skomplikowane formularze wielokrokowe oparte na `React Hook Form` i walidacji `Zod`. Posiadają własny mechanizm zapisywania wersji roboczych (Drafts) przed finalnym zatwierdzeniem mutacji (Save/Submit).

---

## 3. Ogólny Zestaw Weryfikacyjny CRUD (Aplikowany do każdej encji)

### [C] Create (Tworzenie)
1. **Inicjalizacja**: Kliknięcie "Create/New" w widoku Workspaces/Resources poprawnie przekierowuje do odpowiedniego URL w `/studio`.
2. **Autosave / Drafts**: Wprowadzenie danych w formularzach Studio na bieżąco aktualizuje stan szkicu (Draft). Odświeżenie strony nie powinno powodować utraty wpisanych, ale niezapisanych danych.
3. **Walidacja**: Wysłanie pustego lub błędnie wypełnionego formularza uruchamia walidację Zod (np. brak wymaganej nazwy lub roli).
4. **Zapis i Przepływ Powrotny**: Po udanym zapisie (`submit`) następuje:
   - Zakończenie mutacji API z sukcesem.
   - Usunięcie zapisanego szkicu (Draft) dla tej encji.
   - Powrót (routing) do widoku Workspaces/Resources.
   - Płynne (bez wymuszonego przeładowania strony) pojawienie się nowej Karty na liście dzięki inwalidacji cache'u.

### [R] Read (Odczyt)
1. **Spójność Karty**: Nowo utworzona encja wyświetla poprawne metadane na Karcie (Tytuł, tagi, ikony statusu).
2. **Ładowanie Sidepeeka**: Kliknięcie w Kartę płynnie wysuwa `ProfilePeek`. Dane w panelu w 100% zgadzają się z API oraz podsumowaniem na Karcie.
3. **Brak "Stale Data"**: Przełączanie się między różnymi encjami tego samego typu natychmiast odświeża kontekst w Sidepeeku (brak migania starych danych).

### [U] Update (Aktualizacja)
1. **Hydracja Danych**: Kliknięcie "Edit" z poziomu Sidepeeka (lub Karty) przechodzi do Studio. Formularz musi zostać w pełni nawodniony (hydrated) istniejącymi danymi encji (brak pustych pól, które wcześniej były uzupełnione).
2. **Edycja i Draft**: Zmiana danych (np. nazwy) nadpisuje Draft dla konkretnego ID.
3. **Zapis i Re-render**: Po udanym `update`:
   - Przekierowanie do widoku Workspaces/Resources.
   - Zarówno Karta, jak i (po ponownym kliknięciu) Sidepeek pokazują zaktualizowane dane od razu (optimistic update lub re-fetch).

### [D] Delete (Usuwanie)
1. **Ostrzeżenie**: Akcja usunięcia (z Sidepeeka lub menu kontekstowego Karty) wywołuje odpowiedni Modal z prośbą o potwierdzenie.
2. **Kaskadowość / Błędy**: Próba usunięcia encji przypisanej do innej (np. Agent przypisany do Crew) powinna albo ostrzec użytkownika, albo być zablokowana przez walidację backendową z przyjaznym komunikatem.
3. **Zniknięcie z UI**: Po potwierdzeniu, encja natychmiast znika z listy widoku Workspaces/Resources. Wszelkie otwarte Sidepeeki tej encji powinny zostać automatycznie zamknięte.

---

## 4. Specyficzne Punkty Weryfikacji per Encja

### 1. Agent
- **Karty i Sidepeek**: Weryfikacja wyświetlania przypisanej roli (Role), awatara oraz słów kluczowych.
- **Studio (`AgentStudio`)**: Przepływ między sekcjami `Identity`, `Cognition`, `Skills`, `Engine`.
- **Weryfikacja zmian**: Dodanie nowych `InternalSkills` (przez `InternalSkillsModal`) i upewnienie się, że zapisują się w profilu Agenta.

### 2. Crew
- **Karty i Sidepeek**: Weryfikacja wyświetlania listy przypisanych Agentów (Manager vs Worker) oraz typu procesu (Sequential / Hierarchical).
- **Studio (`CrewStudio`)**: Test poprawnego mapowania ID agentów. Wizualny "Live Graph" w Studio musi poprawnie odświeżać się po dodaniu lub usunięciu agenta z ekipy.
- **Spójność relacyjna**: Usunięcie Agenta będącego częścią Crew musi odzwierciedlić się w widoku Crew (albo zablokować usunięcie Agenta).

### 3. Template
- **Karty i Sidepeek**: Poprawne formatowanie i renderowanie instrukcji / promptów.
- **Studio (`TemplateStudio`)**: Test sekcji definicji, wstrzykiwania zmiennych i parametrów wejściowych (szablony zagnieżdżone). Poprawne renderowanie i parsowanie wejściowych inputów na liście.

### 4. Service
- **Karty i Sidepeek**: Odpowiednia kategoryzacja (GenAI, Scraping, Utility, Business).
- **Studio (`ServiceStudio`)**: Bezpieczne obsługiwanie i ukrywanie kluczy API/Tokenów podczas edycji (nie powinny wracać do frontendowego klienta w postaci jawnej po zapisie).

### 5. Automation
- **Karty i Sidepeek**: Informacja o typie platformy (n8n, Zapier, Custom), widoczny webhook URL i metoda HTTP (GET/POST).
- **Studio (`AutomationStudio`)**: Weryfikacja sekcji autoryzacji, schematów wejścia/wyjścia (Input/Output Schema) oraz panelu symulatora (`AutomationSimulatorPanel`). Zmiany parametrów muszą natychmiast odzwierciedlać się w symulatorze.

### 6. Archetype
- **Karty i Sidepeek**: Podgląd zachowania, roli i celów bazowych dla Prompt Archetype w zakładce Resources.
- **Studio (`ArchetypeStudio`)**: Testowanie zapisywania "Guardrails", bazy wiedzy (Knowledge Hubs) oraz słów kluczowych (Keywords). Weryfikacja ładowania danych przez `ArchetypeLoaderModal` z powrotem do innych procesów (np. przy tworzeniu Agenta na bazie Archetypu).