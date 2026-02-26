# Plan Implementacji: Crew Node i Crew Panel Inspector (vNext)

Zgodnie z architekturą opartą na **crewAI** (orkiestracja) i **LangChain** (RAG/infrastruktura), wprowadzamy węzeł zespołu (Crew Node), który zarządza wieloma agentami i zadaniami.

## Faza 1: Rozbudowa Modeli Domenowych (Domain & Mappers)
- [ ] **Rozszerzenie `SpaceCrewDomainData`** w `frontend/src/modules/spaces/domain/types.ts`:
    - Dodanie pól: `state` (idle, working, consultation, done), `tasks` (lista zadań z przypisaniem agentów), `active_agent_id`, `shared_memory` (faktografia), `execution_logs`, `requires_consultation`.
- [ ] **Rozszerzenie `SpaceCrewViewModel`** w `frontend/src/modules/spaces/domain/types.ts`:
    - Dodanie pól prezentacyjnych: `progressValue`, `isWorking`, `isConsultation`, `isDone`.
- [ ] **Aktualizacja `mapCrewToViewModel`** w `frontend/src/modules/spaces/domain/mappers/SpaceNodeViewModelMapper.ts`:
    - Implementacja logiki wyliczania postępu zespołu na podstawie ukończonych zadań.

## Faza 2: Budowa "Control Room" (Crew Panel Inspector)
- [ ] **Implementacja `SpaceCrewNodeInspector.tsx`**:
    - Zakładka **Orchestration**: Wizualizacja łańcucha zadań (Task Chain) i logów orkiestracji (kto-do-kogo-co).
    - Zakładka **Roster**: Lista agentów wchodzących w skład Crew wraz z ich rolami.
    - Zakładka **Shared Memory**: "Tablica korkowa" z faktami ustalonymi przez zespół.
    - Zakładka **Artefacts**: Rezultaty prac całego zespołu.
    - Obsługa stanów **Consultation** i **Alignment** na poziomie zespołu.

## Faza 3: Aktualizacja widoku na Canvasie (Crew Node View)
- [ ] **Przebudowa/Stworzenie `SpaceCrewNodeView.tsx`**:
    - Dodanie dynamicznego wskaźnika postępu (np. kołowy progress bar).
    - Wyświetlanie aktywnego agenta (kto aktualnie "ma pałeczkę").
    - Wizualizacja stanów blokujących (Consultation required).

## Faza 4: Integracja danych testowych i Weryfikacja
- [ ] **Aktualizacja `frontend/src/modules/spaces/domain/defaults.ts`**:
    - Skonfigurowanie testowej załogi (np. "Marketing Content Crew") z wieloma agentami i zadaniami.

## Faza 5: Testy Regresyjne - Space Canvas Dry-Run Verification (UI & Interaction)

**Cel:** Weryfikacja, czy komponenty Space Canvas (Węzły, Sidebary, Menu Kontekstowe) renderują się i reagują poprawnie w środowisku mockowanym, zapewniając stabilność UI przed pełną integracją z backendem.

### 1. Środowisko Canvasa i Viewport
- [x] **Stan początkowy:** Nawigacja do `/spaces/test-canvas`. Weryfikacja, czy React Flow ładuje domyślne węzły (Strefy: Discovery, Product, Design, Delivery).
- [x] **Nawigacja:** Test operacji Zoom i Pan. Sprawdzenie, czy tło (Background Dots) i siatka reagują płynnie.

### 2. Renderowanie i Interakcja (Kompletna Macierz Testowa)
Zweryfikowano każdy typ komponentu we wszystkich Workspace'ach:
- [x] **Discovery:** Patterns, Crews, Agents, Templates, Services, Automations - **PASS**
- [x] **Product Management:** Patterns, Crews, Agents, Templates, Services, Automations - **PASS**
- [x] **Design:** Patterns, Crews, Agents, Templates, Services, Automations - **PASS**
- [x] **Delivery:** Patterns, Crews, Agents, Templates, Services, Automations - **PASS**
- [x] **Growth & Market:** Patterns, Crews, Agents, Templates, Services, Automations - **PASS**

**Szczegóły weryfikacji:**
- [x] **Poprawność dodawania:** Każdy komponent z sidebaru pomyślnie pojawia się na Canvasie.
- [x] **Inspekcja:** Kliknięcie w dowolny nowo dodany węzeł otwiera poprawny Inspector (Right Sidebar).
- [x] **Brak błędów:** Brak "React Error Boundary" czy krytycznych błędów w konsoli podczas renderowania złożonych widoków (np. Crew Orchestration, Template Checklist).

### 3. Menu Kontekstowe i Przejścia Stanów (Mock)
- [x] **Zmiana stanu:** Prawy przycisk myszy na węźle "Idle" -> Wybór "Run". Weryfikacja wizualnej zmiany na "Working" (animacja spinnera).
- [x] **Manipulacja:** Test funkcji "Duplicate" oraz "Delete" poprzez menu kontekstowe.

### 4. Integralność Połączeń (Edges)
- [x] Stworzenie nowego połączenia między węzłami.
- [x] Weryfikacja, czy `SpaceCanvasCustomEdge` podąża za węzłami podczas ich przesuwania.

## Faza 6: UI Consistency & UX State Integrity Across Workspaces

**Cel:** Weryfikacja, czy reaktywne elementy UI (inputy, przyciski, walidacja) zachowują się identycznie pod kątem interakcji, mimo różnic w motywach kolorystycznych (Blue, Purple, Pink, Green, Yellow).

### 1. Macierz kolorystyczna i reaktywność (Theming)
- [ ] **Focus State:** Kliknięcie w input/textarea w Inspektorze. Czy `ring` lub `border-focus` używa poprawnej zmiennej koloru (np. `--workspace-primary`)?
- [ ] **Hover States:** Sprawdzenie interaktywnych elementów w sidebarze. Czy przejścia (transitions) są płynne i zachowują spójny kontrast?
- [ ] **Skeleton Loading:** Weryfikacja kolorystyki animacji ładowania (shimmer effect) – czy adaptuje się do tła workspace'u.

### 2. Standaryzacja Walidacji (Error & Success States)
- [ ] **Input Error:** Wpisanie błędnych danych/pozostawienie pustego pola wymaganego. Czy komunikat błędu i obramowanie są spójne (zgodne z `error-red`) i nie "gryzą się" z kolorem bazowym workspace'u?
- [ ] **Validation Logic:** Czy tooltipy/popovery z błędami pojawiają się w tych samych pozycjach względem pól?
- [ ] **Disabled States:** Sprawdzenie, czy pola "read-only" mają ten sam stopień przeźroczystości i szarości.

### 3. Konsystencja Typografii i Odstępów (Spacing & Typography)
- [ ] **Nagłówki sekcji:** Porównanie wielkości fontów i wag (font-weight) w Inspektorach różnych modułów.
- [ ] **Paddingi/Marginesy:** Automatyczny pomiar odstępów między polami formularza, aby wyryć "pływający" layout.

### 4. Interakcje Modalne i Overlaye
- [ ] **Z-index Integrity:** Czy menu kontekstowe i tooltipy zawsze pojawiają się nad elementami React Flow we wszystkich widokach?
- [ ] **Dark/Light Mode:** Test sprawdzający, czy przejście kolorystyczne workspace'u poprawnie reaguje na zmianę motywu systemowego.
