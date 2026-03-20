# Plan Implementacji: Lokalne Środowisko Deweloperskie dla Internal Tools (axon-tools)

## 1. Cel
Stworzenie `axon-tools`, niezależnego i lokalnego środowiska (CLI + Web UI) dla programistów tworzących narzędzia (Internal Tools) do frameworka CrewAI. Umożliwi ono lokalne testowanie funkcji w Pythonie przed ich synchronizacją z główną aplikacją Axon. 

## 2. Architektura Rozwiązania

Zgodnie z wymogami i sugestiami, architektura opiera się na **Next.js dla UI** oraz **Python/FastAPI dla środowiska wykonawczego**.

*   **Typ aplikacji**: Python CLI (`axon-tools`), które pod spodem uruchamia lekki serwer FastAPI. Serwer ten posiada dwa zadania: wystawia lokalne API do wykonywania testowanych funkcji oraz serwuje zbudowaną, statyczną aplikację UI.
*   **Frontend (Panel)**: Aplikacja oparta na **Next.js** (wykorzystująca opcję `output: 'export'`, czyli Static HTML Export). Taka architektura pozwala łatwo przenosić komponenty (Tailwind, Radix/Shadcn/HeroUI), logikę i design system bezpośrednio z głównego repozytorium Axona. Zbudowane pliki statyczne są dołączane do paczki instalacyjnej Pythona.
*   **Backend (Lokalny Serwer)**: FastAPI uruchamiane na maszynie dewelopera przez komendę CLI, odpowiedzialne za:
    *   Skanowanie lokalnego katalogu w poszukiwaniu plików Pythonowych.
    *   Wykrywanie funkcji oznaczonych dekoratorem (np. zgodnym z `@tool` z CrewAI).
    *   Dynamiczną izolowaną egzekucję narzędzi (wstrzykiwanie parametrów, przechwytywanie logów i outputu).
    *   Wysyłanie zweryfikowanych narzędzi do głównego API aplikacji Axon (mechanizm synchronizacji).

## 3. Szczegółowy Zakres Prac

### Faza 1: Backend Axona (Przygotowanie API pod synchronizację)
Zanim lokalne środowisko wyśle funkcję, Axon musi umieć ją przyjąć.
*   **Endpoint API (`POST /api/v1/resources/internal-tools/sync-remote`)**: Endpoint w backendzie Axona, który autoryzuje prośbę, odbiera treść pliku lub zserializowany kod, zapisuje go w `app/tools/` i wyzwala ponowne skanowanie narzędziem `ToolsScannerService`.

### Faza 2: Pakiet narzędziowy `axon-tools` (Lokalny Serwer i CLI w Pythonie)
*   **Interfejs CLI**: Zaimplementowanie interfejsu wiersza poleceń (np. przy użyciu biblioteki `typer`). Komenda `axon-tools dev .` uruchamia lokalny serwer Uvicorn/FastAPI.
*   **Mechanizm skanowania (Scanner)**: Kod ładujący moduły Pythonowe ze wskazanego przez użytkownika katalogu roboczego. Skaner za pomocą modułu `inspect` znajduje funkcje `@tool`, przetwarza ich metadane, docstringi i adnotacje typów (`type hints`) generując Pydantic / JSON Schema do dynamicznych formularzy.
*   **Środowisko wykonawcze (Runner)**: Endpoint w lokalnym FastAPI (np. `POST /api/tools/{tool_name}/run`), który odbiera payload z UI, wywołuje testowaną funkcję, przechwytuje strumienie `stdout`/`stderr` do odczytu logów w czasie rzeczywistym i zwraca wynik do UI.

### Faza 3: Środowisko Webowe (Next.js UI)
Lokalny panel zarządzania testami.
*   **Konfiguracja Next.js**: Utworzenie podprojektu (np. `packages/axon-tools-ui`) opartego o Next.js w trybie `output: "export"`.
*   **Stylizacja i Design System**: Replikacja designu aplikacji Axon (skopiowanie `tailwind.config.ts`, globalnych stylów, używanych komponentów z warstwy UI).
*   **Główny Widok (Rejestr Funkcji)**:
    *   Widok tabelaryczny ze wszystkimi znalezionymi narzędziami.
    *   Kolumny: Nazwa funkcji, Opis (z docstringa), Parametry wejściowe, Ostatni status (Sukces/Błąd/Nieprzetestowana), Status Sync (Lokalna/Zsynchronizowana).
*   **Widok Szczegółowy (Split View)**:
    *   **Lewy Panel (Input)**: Automatyczny generator formularzy dla parametrów wejściowych (wykorzystujący biblioteki zgodne z JSON Schema, np. powiązane z `react-hook-form`). Użytkownik wypełnia formularz i naciska przycisk "Uruchom".
    *   **Prawy Panel (Output - Konsola)**: Widok stylizowany na konsolę/terminal. W czasie rzeczywistym (lub po wykonaniu) pojawiają się tam surowe wyniki działania (Raw output), logi (`print()`), przechwycone błędy oraz informacja o czasie wykonania (Execution time).
*   **Przycisk "Synchronizuj z Axon"**: Przycisk aktywujący się tylko dla narzędzi ze statusem ostatniego testu "Sukces". Wysyła żądanie do lokalnego serwera z instrukcją zapushowania narzędzia do Axona.

### Faza 4: Dystrybucja "Zero config"
*   **Automatyzacja buildu**: Skrypt, który buduje projekt Next.js (wypluwa HTML/JS/CSS do folderu `out`) i kopiuje te pliki do podkatalogu `static/` wewnątrz paczki Pythonowej `axon-tools`.
*   Zapewnienie by polecenie `axon-tools dev` nie wymagało od użytkownika pobierania Node.js ani instalacji pakietów `npm` – całe UI musi być zaserwowane bezpośrednio ze statycznych plików przez FastAPI.

## 4. Wytyczne UX/UI
*   **Zgodność Wizualna**: Środowisko musi wyglądać jak wbudowana karta aplikacji Axon. Należy bezwzględnie zastosować powtarzalne wzorce UI (zaokrąglenia, typografia, tabele).
*   **Terminal Output**: Dla programisty wynik logów musi być czytelny. Należy zastosować fonty o stałej szerokości znaków (np. rodzina Mono), ciemne tło panelu wynikowego oraz kolorowanie składni dla logów (błędy na czerwono, output na zielono).

## 5. Standardowy Workflow Dewelopera
1. Tworzy w swoim repozytorium plik Python (np. `my_custom_tools.py`) z narzędziem oznaczonym dekoratorem (docelowo dla CrewAI).
2. Otwiera terminal w tym katalogu i wpisuje `axon-tools dev .`.
3. CLI uruchamia lokalny serwer i wita dewelopera adresem np. `http://localhost:8000`.
4. Deweloper otwiera przeglądarkę, widzi UI Next.js z tabelą wykrytych przez system funkcji.
5. Klika wybraną funkcję i widzi formularz po lewej stronie.
6. Wypełnia formularz dla danych testowych, wciska `Run`.
7. Ogląda logi w prawym panelu; jeśli wystąpił błąd – poprawia kod, serwer powinien automatycznie przeładować moduł. Ponawia test.
8. Gdy wynik w konsoli jest pomyślny, uaktywnia się przycisk `Sync`.
9. Deweloper klika `Sync`, a kod jego funkcji ląduje w głównej aplikacji Axon gotowy do użycia przez agentów.