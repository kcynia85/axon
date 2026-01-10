# Tech PRD: RAGAS Core System (v2 - `crewAI` & `LangChain` Migration)

## 1. Kontekst i Cel
*   **Dokument:** Technical Product Requirements Document (Tech PRD)
*   **Status:** Gotowy do Implementacji
*   **Cel:** Ten dokument definiuje techniczne wymagania dla refaktoryzacji rdzenia systemu RAGAS, migrując z niestandardowej logiki agentowej na architekturę opartą o frameworki `crewAI` (orkiestracja) i `LangChain` (abstrakcja infrastruktury).
*   **Źródło:** Ta wersja jest bezpośrednią konsekwencją decyzji architektonicznych zawartych w `ard_axon_v2.md`.

## 2. Kluczowe Zasady Techniczne (Core Principles)
1.  **Orkiestracja Deklaratywna:** Cała logika przepływu pracy agentów musi być zaimplementowana przy użyciu `crewAI` (Agenci, Zadania, Zespoły). Niestandardowe pętle `while` i logika routingu muszą zostać usunięte.
2.  **Abstrakcja Infrastruktury:** Wszystkie interakcje z zewnętrznymi systemami AI (LLM, modele embeddingów) i bazami danych wektorowych muszą odbywać się przez warstwę abstrakcji `LangChain`. Bezpośrednie wywołania SDK (np. `google-generativeai`) są niedozwolone.
3.  **Niezależność od Modeli (Model Agnostic):** Architektura musi umożliwiać zmianę dostawcy LLM lub modelu embeddingów poprzez modyfikację wyłącznie warstwy konfiguracyjnej/infrastrukturalnej, bez wpływu na logikę aplikacyjną.
4.  **Narzędzia jako API Agenta:** Wszystkie zdolności agenta do interakcji ze światem (czytanie plików, RAG, API) muszą być zaimplementowane jako `crewAI Tools` (`@tool`).
5.  **Trwałość Wykonania (Durable Execution):** Wszystkie długotrwałe operacje `Crew` muszą być uruchamiane asynchronicznie poprzez silnik workflow `Inngest`.

## 3. Główne Epiki i Historyjki Techniczne (MVP Refactoring)

### Epic 1: Refaktoryzacja Warstwy Orkiestracji na `crewAI`
*   **Cel:** Zastąpienie obecnej, niestandardowej logiki sterującej agentami przez deklaratywne komponenty `crewAI`.
*   **Historyjki Techniczne:**
    1.  **Jako deweloper, chcę zdefiniować agentów `Manager`, `Researcher` i `Builder` jako obiekty `Agent` z `crewAI`**, aby ich role, cele i narzędzia były jasno określone i łatwe do modyfikacji.
        *   **Akceptacja:** Istnieją pliki (np. `app/modules/agents/agents.py`) zawierające konfiguracje agentów z `role`, `goal`, `backstory`, `tools` i przypisanym `llm` z `LangChain`.
    2.  **Jako deweloper, chcę zamodelować istniejące przepływy pracy jako obiekty `Task` i `Crew` z `crewAI`**, aby logika biznesowa była czytelna i oddzielona od implementacji.
        *   **Akceptacja:** Istnieją pliki (np. `app/modules/agents/crews.py`) definiujące `Crew` dla kluczowych scenariuszy (np. `research_crew`, `code_generation_crew`).
    3.  **Jako deweloper, chcę zastąpić wszystkie wywołania niestandardowej pętli agenta jednym wywołaniem `crew.kickoff()`**, aby uprościć kod i polegać na sprawdzonym mechanizmie frameworka.
        *   **Akceptacja:** W kodzie aplikacyjnym nie ma już ręcznie zaimplementowanej pętli `Think -> Tool -> Act`.

### Epic 2: Abstrakcja Warstwy Infrastruktury przez `LangChain`
*   **Cel:** Uniezależnienie kodu od konkretnych dostawców AI i baz danych.
*   **Historyjki Techniczne:**
    1.  **Jako deweloper, chcę stworzyć centralny serwis (`LLMService`)**, który dostarcza skonfigurowane instancje modeli czatu `LangChain` (np. `ChatGoogleGenerativeAI`, `ChatOpenAI`).
        *   **Akceptacja:** Agenci `crewAI` otrzymują obiekt `llm` z tego serwisu, a nie tworzą go samodzielnie.
    2.  **Jako deweloper, chcę zrefaktoryzować logikę RAG**, aby korzystała ze standardowych interfejsów `LangChain VectorStore` i `Retriever`.
        *   **Akceptacja:** Cała logika połączenia i przeszukiwania `pgvector` jest zamknięta wewnątrz obiektu `LangChain Retriever`.
    3.  **Jako deweloper, chcę opakować wszystkie funkcje pomocnicze (np. `query_vector_db`, `read_file`) w dekorator `@tool` z `crewai_tools`**, aby stały się one formalnymi narzędziami dostępnymi dla agentów.
        *   **Akceptacja:** Narzędzia mają jasne opisy (`docstring`), które służą agentowi do podejmowania decyzji o ich użyciu.

## 4. Specyfikacja Komponentów Technicznych

### 4.1. Agenci (`crewAI` Agents)
| Rola | Cel (Goal) | Backstory | Kluczowe Narzędzia | Model (`LangChain`) |
| :--- | :--- | :--- | :--- | :--- |
| **Manager** | Orkiestracja i delegacja zadań do specjalistów. | Doświadczony project manager... | - | `Tier 1 (Gemini 3 Pro)` |
| **Researcher** | Wyszukiwanie i synteza informacji. | Ekspert od researchu... | `search_knowledge_base`, `fetch_url_content` | `Tier 2 (Gemini 2.5 Pro)` |
| **Builder** | Tworzenie konkretnych artefaktów. | Starszy inżynier oprogramowania... | `write_artifact_to_project`, `read_file` | `Tier 2 (Gemini 2.5 Pro)` |

### 4.2. Narzędzia (`crewAI Tools`)
Wszystkie narzędzia muszą być zdefiniowane w module `app/modules/knowledge/tools.py` lub podobnym. Muszą posiadać typowanie argumentów i czytelny `docstring`.
*   `search_knowledge_base(query: str) -> str`: Przeszukuje bazę wektorową (RAG).
*   `get_asset(slug: str) -> str`: Pobiera pełną treść zasobu (SOP, szablon) po jego unikalnym identyfikatorze.
*   `fetch_url_content(url: str) -> str`: Pobiera i czyści treść z podanego adresu URL.
*   `write_artifact_to_project(project_id: str, file_name: str, content: str) -> str`: Zapisuje plik w kontekście danego projektu.
*   `read_file(file_path: str) -> str`: Odczytuje plik z systemu plików.

## 5. Niezmienniki Systemowe i Wymagania Niefunkcjonalne
(Przeniesione z `prp_axon.md` - pozostają w mocy)
1.  **Trustworthy Attribution:** Każda odpowiedź z RAG MUSI zawierać cytaty do źródeł.
2.  **Project Isolation (RLS):** Dostęp do danych musi być ograniczony na poziomie bazy danych per użytkownik.
3.  **Idempotent Execution:** Narzędzia modyfikujące stan muszą być idempotentne.
4.  **Contract-First UI:** Backend musi dostarczać JSON zgodny z predefiniowanym schematem Zod.
5.  **Fallback Resilience:** System musi automatycznie przełączyć się na model zapasowy w razie awarii głównego.
... (i pozostałe z `prp_axon.md`)

## 6. Techniczna Checklista Implementacji (v2)
- [ ] **Zależności:** Dodaj `crewai`, `crewai_tools`, `langchain`, `langchain-google-genai`, `langchain-community` do `pyproject.toml`.
- [ ] **Nowa Struktura Modułów Backendu:**
    - [ ] Utwórz katalog `app/modules/orchestration/`.
    - [ ] Utwórz plik `app/modules/orchestration/task_builder.py` odpowiedzialny za konstruowanie zadań `crewAI` z `I/O Schema`.
    - [ ] Utwórz plik `app/modules/orchestration/crew_runner.py` do uruchamiania załóg.
    - [ ] W `app/modules/agents/` umieść logikę CRUD i walidacji dla Agentów.
    - [ ] W `app/modules/crews/` umieść logikę CRUD i walidacji dla Załóg.
    - [ ] W `app/modules/flows/` umieść logikę CRUD i walidacji dla Przepływów.
- [ ] **Struktura Modułu `knowledge`:**
    - [ ] Utwórz `app/modules/knowledge/tools.py` dla definicji Narzędzi `@tool`.
    - [ ] Utwórz `app/modules/knowledge/retrievers.py` do konfiguracji `LangChain Retrievers`.
- [ ] **Warstwa Infrastruktury (`app/shared/infrastructure`):**
    - [ ] Utwórz serwis `llms.py` do zarządzania instancjami `LangChain ChatModels`.
    - [ ] Utwórz serwis `embeddings.py` do zarządzania instancjami `LangChain Embeddings`.
- [ ] **Nowa Struktura Frontend (`frontend/src/modules`):**
    - [ ] Zaimplementuj `frontend/modules/agents/utils/schemaSuggester.ts` z logiką inteligentnego wypełniania.
    - [ ] Zbuduj komponenty `AgentForm.tsx`, `SimpleSchemaInput.tsx` i `StructuredSchemaEditor.tsx`.
    - [ ] Stwórz reużywalny hook `frontend/shared/hooks/useAutoSave.ts`.
- [ ] **Refaktoryzacja API & Orkiestracji:**
    - [ ] Zmodyfikuj endpointy API, aby przekazywały zadania do `Inngest`.
    - [ ] Funkcja `Inngest` powinna używać `crew_runner.py` do uruchamiania załóg, a `task_builder.py` do przygotowywania zadań.
- [ ] **Usunięcie Starego Kodu:** Zidentyfikuj i usuń niestandardową logikę pętli agenta, `Agent Factory` i `Router Logic`.

## 7. Poza Zakresem MVP tej Refaktoryzacji
*   Pełna implementacja `LLM-as-a-Judge` (zostaje jako proces manualny).
*   Zaawansowany `Semantic Cache` (na razie polegamy na podstawowym cache'u `LangChain`).
*   Nowe narzędzia (Tools) wykraczające poza te już istniejące w obecnej implementacji.