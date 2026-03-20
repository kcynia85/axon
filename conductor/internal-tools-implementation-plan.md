# Plan implementacji: Moduł Internal Tools (Frontend & Backend)

## 1. Analiza i Kontekst

Celem jest pełna implementacja modułu **Internal Tools**, który umożliwia synchronizację funkcji Pythonowych (zdefiniowanych przez deweloperów) z systemem Axon, ich podgląd w UI oraz wykorzystanie w Agent Studio.

### Obecny stan:
*   **Frontend**:
    *   Istnieje nawigacja w `ResourcesNavIsland` prowadząca do `/resources/tools`.
    *   Istnieje zalążek widoku `InternalToolsList` (prawdopodobnie mock lub pusty).
    *   W Agent Studio (`SkillsSection`) istnieje modal `InternalSkillsModal`, który jest gotowy do pobierania narzędzi, ale wymaga integracji z API.
*   **Backend**:
    *   Istnieje moduł `resources` z modelem `InternalTool`.
    *   Istnieje tabela `internal_tools`.
    *   Brak mechanizmu automatycznego skanowania plików Python w poszukiwaniu dekoratora `@tool`.
    *   Brak endpointu wystawiającego listę narzędzi dla frontendu.
    *   Brak logiki wstrzykiwania importów narzędzi do generowanego kodu agenta.

---

## 2. Specyfikacja Backend (Python / FastAPI)

Backend będzie odpowiedzialny za trzy kluczowe funkcje:
1.  **Skanowanie i Synchronizacja**: Przeszukiwanie określonego katalogu w poszukiwaniu funkcji udekorowanych `@tool` (z biblioteki `crewai` lub własnego wrapper'a), parsowanie ich metadanych (nazwa, opis, argumenty) i aktualizacja bazy danych.
2.  **Serwowanie Danych**: API REST zwracające listę dostępnych narzędzi.
3.  **Generowanie Kodu**: Dostarczanie informacji o imporcie narzędzia do modułu generującego kod agenta.

### Architektura:
*   **Lokalizacja Narzędzi**: `backend/app/tools/` (nowy katalog dla narzędzi użytkownika).
*   **Model Danych**: Rozszerzenie `InternalTool` o pola: `args_schema` (JSON), `file_path`, `import_path`.
*   **Serwis Synchronizacji**: `ToolsScannerService`.

### Zadania Backend:

#### B1. Utworzenie katalogu na narzędzia
*   Utwórz `backend/app/tools/__init__.py`.
*   Dodaj przykładowe narzędzie `calculator.py` z dekoratorem `@tool`.

#### B2. Implementacja skanera (Scanner Service)
*   Stwórz serwis `backend/app/modules/resources/application/tools_scanner.py`.
*   Użyj `pkgutil` lub `importlib` do dynamicznego ładowania modułów z `backend/app/tools/`.
*   Dla każdego modułu sprawdź funkcje/klasy pod kątem dekoratora `@tool`.
*   Wyciągnij:
    *   Nazwę funkcji.
    *   Docstring (opis).
    *   Sygnaturę argumentów (Type Hints -> JSON Schema).

#### B3. Logika Synchronizacji (Sync Logic)
*   W `ResourcesService` zaimplementuj metodę `sync_internal_tools()`.
*   Logika:
    1.  Uruchom skaner.
    2.  Pobierz wszystkie istniejące narzędzia z DB.
    3.  Dla każdego wykrytego narzędzia: `upsert` w DB.
    4.  Dla narzędzi w DB, których nie ma w kodzie: oznacz jako `MISSING` lub usuń (soft delete).

#### B4. API Endpointy
*   W `backend/app/modules/resources/interface/router.py`:
    *   `GET /internal-tools` -> Zwraca listę narzędzi (z filtrowaniem i paginacją).
    *   `POST /internal-tools/sync` -> Wymusza synchronizację (dla przycisku "Refresh" w UI).

#### B5. Integracja z Generatorem Kodu (CrewAI)
*   Zmodyfikuj serwis generujący kod agenta (prawdopodobnie w `backend/app/modules/agents/application/agent_factory.py` lub `crew_factory.py`).
*   Przy generowaniu agenta, jeśli ma przypisane `internal_tool_ids`:
    *   Pobierz metadane narzędzi.
    *   Wygeneruj linię importu: `from app.tools.nazwa_pliku import nazwa_funkcji`.
    *   Dodaj narzędzie do listy `tools=[nazwa_funkcji]`.

---

## 3. Specyfikacja Frontend (Next.js)

Frontend będzie służył wyłącznie do podglądu i przypisywania narzędzi. Nie będzie edytora kodu.

### Zadania Frontend:

#### F1. API Client
*   Zaktualizuj `frontend/src/modules/resources/infrastructure/api.ts`:
    *   Dodaj `getInternalTools()`.
    *   Dodaj `syncInternalTools()`.

#### F2. Widok "Internal Tools" (Resources Tab)
*   Lokalizacja: `frontend/src/app/(main)/resources/tools/page.tsx`.
*   Komponent: `InternalToolsList`.
*   Funkcjonalności:
    *   Wyświetlanie kart/tabeli z narzędziami.
    *   Przycisk "Sync" (wywołuje `POST /sync`).
    *   Podgląd szczegółów (nazwa, opis, argumenty) - np. w SidePeek lub Modalu.
    *   Status synchronizacji (np. "Synced", "Missing in code").

#### F3. Integracja z Agent Studio (Skills)
*   Zmodyfikuj `InternalSkillsModal` (`frontend/src/modules/studio/features/agent-studio/ui/components/InternalSkillsModal.tsx`).
*   Podepnij pobieranie danych z `useQuery(['internal-tools'])`.
*   Umożliw wielokrotny wybór.
*   Zapisz wybrane ID w stanie formularza Agenta (`useAgentForm`).

---

## 4. Harmonogram Implementacji (Checklist)

### Faza 1: Backend Core & Sync
- [ ] Utworzenie struktury katalogów `backend/app/tools`.
- [ ] Implementacja `ToolsScannerService` (wykrywanie `@tool`).
- [ ] Implementacja `sync_internal_tools` w serwisie i repozytorium.
- [ ] Dodanie endpointu `POST /internal-tools/sync`.

### Faza 2: Backend API & Code Gen
- [ ] Implementacja `GET /internal-tools`.
- [ ] Aktualizacja generatora kodu CrewAI o obsługę importów narzędzi.

### Faza 3: Frontend Resources View
- [ ] Aktualizacja klienta API (`resourcesApi`).
- [ ] Implementacja widoku listy `InternalToolsList`.
- [ ] Dodanie przycisku "Refresh/Sync".

### Faza 4: Frontend Agent Studio Integration
- [ ] Podpięcie `InternalSkillsModal` do prawdziwego API.
- [ ] Obsługa zapisu wybranych narzędzi w formularzu agenta.

### Faza 5: Weryfikacja
- [ ] Dodanie przykładowego narzędzia w Pythonie.
- [ ] Kliknięcie "Sync" w UI -> narzędzie pojawia się na liście.
- [ ] Przypisanie narzędzia do Agenta.
- [ ] Wygenerowanie Agenta -> sprawdzenie czy kod zawiera poprawny import.
