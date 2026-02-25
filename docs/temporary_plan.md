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
- [ ] **Weryfikacja Playwright**:
    - Przejście całego flow od inicjalizacji zespołu po finalizację artefaktów.
