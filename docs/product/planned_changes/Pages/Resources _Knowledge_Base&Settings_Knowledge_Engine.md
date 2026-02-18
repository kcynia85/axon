- Page views
    
    ```markdown
    backend/app/
    ├── modules/
    │   ├── knowledge/              # <--- CAŁA DOMENA WIEDZY
    │   │   ├── models.py           # DB: Resource, Chunk, Strategy, HubLink
    │   │   ├── schemas.py          # Pydantic: IngestRequest, SearchQuery
    │   │   ├── router.py           # API: Upload, Search, Config
    │   │   │
    │   │   └── services/
    │   │       ├── ingestion.py    # ETL Pipeline: Load -> Split -> Embed -> Store
    │   │       ├── loaders.py      # Obsługa PDF, MD, TXT, URL
    │   │       ├── splitters.py    # Logika Chunkowania (Strategies)
    │   │       ├── vector_store.py # Wrapper na pgvector (CRUD wektorów)
    │   │       └── auto_tagger.py  # AI Service do generowania metadanych
    │   │
    │   └── shared/
    │       └── ports/
    │           └── iknowledge_retriever.py # Interfejs dla Agentów
    │
    frontend/src/
    ├── modules/
    │   ├── resources/              # <--- WIDOKI OPERACYJNE
    │   │   ├── knowledge/
    │   │   │   ├── pages/
    │   │   │   │   ├── KnowledgeBasePage.tsx  # Overview (Lista)
    │   │   │   │   └── EditResourcePage.tsx   # Split Layout (Edycja)
    │   │   │   │
    │   │   │   ├── components/
    │   │   │   │   ├── ResourceList.tsx
    │   │   │   │   ├── MetadataEditor.tsx     # Prawa kolumna edycji
    │   │   │   │   └── IngestModal.tsx        # Upload + Wybór Strategii
    │   │   │
    │   ├── settings/               # <--- WIDOKI KONFIGURACYJNE
    │   │   ├── knowledge-engine/
    │   │   │   ├── pages/
    │   │   │   │   ├── EngineOverviewPage.tsx # Dashboard RAG
    │   │   │   │
    │   │   │   ├── components/
    │   │   │   │   ├── StrategyBuilder.tsx    # Edytor Chunkowania
    │   │   │   │   └── ChunkSimulator.tsx     # Testowanie podziału tekstu
    │   │   │
    │   └── shared/
    │       └── api/
    │           └── knowledge.ts    # Klient API
    ```
    
    # Knowledge Base
    
    ---
    
    ### 1. WIDOK: Knowledge Base Overview (Biblioteka)
    
    Główny widok zarządzania.
    
    **Układ:** Split Layout (Lista + Inspektor).
    **Nagłówek:** Zawiera skrót do konfiguracji technicznej (`[ ⚙️ Silnik RAG ]`).
    
    ```
    +-----------------------------------------------------------------------------+
    | Resources > Knowledge Base                                                  |
    |-----------------------------------------------------------------------------+
    | [📚] Baza Wiedzy (142 pliki)        [ ⚙️ Silnik RAG ]   [ + Dodaj Zasób ]   |
    |      Status RAG: ✅ Wszystkie zindeksowane (450k wektorów)                  |
    |-----------------------------------------------------------------------------+
    |                                                                             |
    | [🔍 Szukaj po treści...]   [⚡ Filtruj: Hub / Typ / Status]                 |
    | Aktywne: [ 🏷️ Hub: Product x ] [ ⚙️ Strat: General x ]                     |
    |                                                                             |
    |-----------------------------------------------------------------------------+
    |                                       |                                     |
    |  LISTA ZASOBÓW                        |  INSPEKTOR ZASOBU (Prawa Kolumna)   |
    |  (Kliknij wiersz, aby podglądnąć)     |                                     |
    |                                       |  +-------------------------------+  |
    |  +---------------------------------+  |  |                               |  |
    |  | [📄] Roadmap_2025.md            |  |  | [📄] Roadmap_2025.md          |  |
    |  |    ● Ready (15 chunks)          |  |  | 24kb • Markdown               |  |
    |  |    [📈 Product] [🔍 Discovery]  |  |  |                               |  |
    |  +---------------------------------+  |  | ● Ready (Zindeksowano)        |  |
    |                                       |  |                               |  |
    |  +---------------------------------+  |  | ----------------------------- |  |
    |  | [🌐] Competitor Analysis        |  |  |                               |  |
    |  |    ● Ready (42 chunks)          |  |  | PARAMETRY PRZETWARZANIA       |  |
    |  |    [🚀 Growth]                  |  |  | Jak Axon "widzi" ten plik?    |  |
    |  +---------------------------------+  |  |                               |  |
    |                                       |  | Strategia: [📄 General Text]  |  |
    |  +---------------------------------+  |  | Model:     text-embedding-3   |  |
    |  | [🐍] backend_api.py             |  |  | Chunks:    15                 |  |
    |  |    ● Ready (120 chunks)         |  |  | Wymiary:   1536D              |  |
    |  |    [📦 Delivery]                |  |  |                               |  |
    |  +---------------------------------+  |  | [ 🔎 Podgląd Chunków (Debug) ]|  |
    |                                       |  |                               |  |
    |  +---------------------------------+  |  | ----------------------------- |  |
    |  | [📄] Legacy_Specs.pdf           |  |  |                               |  |
    |  |    ⚠️ Error (Parsing)           |  |  | METADANE (DLA AI / FILTRY)    |  |
    |  |    [📦 Delivery]                |  |  | Kluczowe dla precyzji RAG.    |  |
    |  +---------------------------------+  |  |                               |  |
    |                                       |  | [ 🪄 Auto-Tagowanie AI ]      |  |
    |  ...                                  |  |                               |  |
    |                                       |  | type: strategy                |  |
    |  <  1  2  3  >                        |  | quarter: Q3                   |  |
    |                                       |  | status: draft                 |  |
    |                                       |  | [ + Dodaj Pole ]              |  |
    |                                       |  |                               |  |
    |                                       |  | ----------------------------- |  |
    |                                       |  |                               |  |
    |                                       |  | PRZYPISANIE (HUBY)            |  |
    |                                       |  | Gdzie plik jest widoczny?     |  |
    |                                       |  |                               |  |
    |                                       |  | [📈 Product Management]       |  |
    |                                       |  | [🔍 Discovery]                |  |
    |                                       |  |                               |  |
    |                                       |  | [ 🗑️ Usuń ] [ ✏️ Pełna Edycja ]|  |
    |                                       |  +-------------------------------+  |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ---
    
    ### 2. MODAL: Add New Resource (Ingestia)
    
    Punkt wejścia. Wymaga od użytkownika decyzji o **Strategii Przetwarzania** (profil chunkowania).
    
    ```
    +-----------------------------------------------------------------------------+
    | Dodaj Zasób do Bazy Wiedzy                                          [ X ]   |
    |-----------------------------------------------------------------------------+
    |                                                                             |
    | 1. WYBIERZ ŹRÓDŁO                                                           |
    | [ 📤 Upload Pliku ]   [ 🌐 Import URL ]   [ 📝 Notatka ]                    |
    |                                                                             |
    |  Wybrano: [ 🐍 payment_service.py (12KB) ]  [ Zmień ]                       |
    |                                                                             |
    | --------------------------------------------------------------------------- |
    | 2. STRATEGIA PRZETWARZANIA (CHUNKING PROFILE)                               |
    | Wybierz profil optymalny dla tego typu treści (zdefiniowane w Settings).    |
    |                                                                             |
    | [ 📄 General Text ]  [ 🐍 Codebase ]  [ 📜 Precise / Legal ]                |
    |                      ^--- (Rekomendowane dla .py)                           |
    |                                                                             |
    | *Użyje: CodeSplitter, Chunk: 500, Overlap: 0*                               |
    |                                                                             |
    | --------------------------------------------------------------------------- |
    | 3. PRZYPISANIE DO HUBÓW (WORKSPACES)                                        |
    | W których obszarach ten plik ma być widoczny dla Agentów?                   |
    |                                                                             |
    | [ 🔍 Wybierz Huby...                                                    ▼ ] |
    | Wybrane: [ 📦 Delivery x ]                                                  |
    |                                                                             |
    | [ Anuluj ]                                      [ Zapisz i Indeksuj 🚀 ]    |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ---
    
    ### 3. WIDOK: Edit Resource (Pełna Edycja)
    
    Dostępny po kliknięciu `[ ✏️ Pełna Edycja ]`. Umożliwia weryfikację treści i zaawansowane tagowanie.
    
    ```
    +-----------------------------------------------------------------------------+
    | Resources > Wiedza > Edycja: Roadmap_2025.md                                |
    |-----------------------------------------------------------------------------+
    | [📄] Roadmap_2025.md                        [ 🗑️ Usuń ] [ Zapisz Zmiany ]  |
    |-----------------------------------------------------------------------------+
    |                                                   |                         |
    |  LEWA KOLUMNA (PODGLĄD TREŚCI)                    |  PRAWA KOLUMNA (RAG)    |
    |  -----------------------------------------------  |  -----------------------|
    |  [ Podgląd ]  [ Źródło ]                          |  [🧠] Ustawienia RAG    |
    |                                                   |                         |
    |  # Roadmap Q4 2025                                |  STATUS INDEKSU:        |
    |                                                   |  ✅ Ready (Zsynchroniz.)|
    |  ## 🎯 Strategic Goals                            |  📊 15 chunków          |
    |  Nadrzędnym celem jest stabilizacja               |  📅 Last sync: 2min temu|
    |  modułu LLM Settings.                             |                         |
    |                                                   |  [ ↻ Wymuś Re-Indeks ]  |
    |  ## ⛔ Anti-Goals                                 |                         |
    |  - Nie wdrażamy jeszcze wersji mobilnej.          |  ---------------------  |
    |  - Wstrzymujemy integrację z Zapierem.            |  PRZYPISANIE (HUBY):    |
    |                                                   |                         |
    |  ## 🟢 Now                                        |  [ 📈 Product Mgmt x ]  |
    |  1. Refactoring modułu Agents.                    |  [ 🔍 Discovery x    ]  |
    |  2. Implementacja MCP Client.                     |  [ + Przypisz...     ]  |
    |                                                   |                         |
    |  ... (Reszta treści pliku) ...                    |  ---------------------  |
    |                                                   |  METADANE (FILTRY):     |
    |                                                   |  Kluczowe dla Self-Query|
    |                                                   |  Retrievera w Agencie.  |
    |                                                   |                         |
    |                                                   |  [ 🪄 Auto-Taguj (AI) ] |
    |                                                   |  (Skanuje treść obok)   |
    |                                                   |                         |
    |                                                   |  +--------------------+ |
    |                                                   |  | type : strategy    | |
    |                                                   |  +--------------------+ |
    |                                                   |  | period : Q4 2025   | |
    |                                                   |  +--------------------+ |
    |                                                   |  | priority : high    | |
    |                                                   |  +--------------------+ |
    |                                                   |  [ + Dodaj Pole ]       |
    |                                                   |                         |
    |                                                   |  ---------------------  |
    |                                                   |  ZASTOSOWANA STRATEGIA: |
    |                                                   |  📄 General Text        |
    |                                                   |  [ ⚙️ Zmień i Przelicz ]|
    |                                                   |                         |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ---
    
    ### 4. MODAL: Chunk Debugger (Inspektor Wektorów)
    
    Narzędzie diagnostyczne. Pozwala zobaczyć, jak dokładnie tekst został podzielony. Dostępne z poziomu Inspektora (Prawa Kolumna).
    
    ```
    +-----------------------------------------------------------------------------+
    | Inspektor Wektorów (RAG Debugger)                                   [ X ]   |
    |-----------------------------------------------------------------------------+
    | Plik: Roadmap_2025.md                                                       |
    | Strategia: General Text (1000 chars / 200 overlap)                          |
    |                                                                             |
    | [ < ] Chunk 1 / 15 [ > ]                                                    |
    |                                                                             |
    | TREŚĆ KAWAŁKA (VECTOR CONTENT):                                             |
    | ┌─────────────────────────────────────────────────────────────────────────┐ |
    | │ # Roadmap Q4 2025                                                       │ |
    | │                                                                         │ |
    | │ ## 🎯 Strategic Goals                                                   │ |
    | │ Nadrzędnym celem jest stabilizacja modułu LLM Settings.                 │ |
    | │ Chcemy osiągnąć 99.9% uptime dla...                                     │ |
    | │ (Tu widać koniec chunka)                                                │ |
    | └─────────────────────────────────────────────────────────────────────────┘ |
    |                                                                             |
    | METADANE TEGO KAWAŁKA (JSONB):                                              |
    | {                                                                           |
    |   "source": "Roadmap_2025.md",                                              |
    |   "header_1": "Strategic Goals",                                            |
    |   "chunk_index": 0                                                          |
    | }                                                                           |
    |                                                                             |
    | [ Zamknij ]                                                                 |
    +-----------------------------------------------------------------------------+
    
    ```
    
    Te widoki zamykają temat **Bazy Wiedzy**. Mamy tu pełen cykl życia dokumentu: od ingestii, przez przetwarzanie (strategie), po zarządzanie dostępem (Huby).
    
    ---
    
    # Knowledge Engine
    
    ### 1. WIDOK: Knowledge Engine Overview (Panel Sterowania)
    
    To tutaj trafiasz po kliknięciu `[ ⚙️ Silnik RAG ]` w widoku Bazy Wiedzy.
    
    **Układ:** Dashboard techniczny podzielony na 3 kluczowe sekcje.
    
    ```
    +-----------------------------------------------------------------------------+
    | Settings > Knowledge Engine                                                 |
    |-----------------------------------------------------------------------------+
    | [🧠] Embedding (Model)      [✂️] Strategie (Chunking)    [🗄️] Baza (Vector DB)|
    | (Aktywna Zakładka: Przegląd)                                                |
    |-----------------------------------------------------------------------------+
    |                                                                             |
    | 1. AKTYWNY MODEL EMBEDDINGU (THE BRAIN)                                     |
    | Odpowiada za "rozumienie" tekstu. Zmiana wymaga pełnej re-indeksacji.       |
    |                                                                             |
    | ┌─────────────────────────────────────────────────────────────────────────┐ |
    | │ [OpenAI Icon]  text-embedding-3-small                    [ ● Active ]   │ |
    | │                                                                         │ |
    | │ Wymiary (Dimensions):  [ 1536 ]  <-- Kluczowe dla tabeli SQL            │ |
    | │ Koszt:                 [ $ 0.02 / 1M tokenów ]                          │ |
    | │ Max Input:             [ 8191 tokenów ]                                 │ |
    | │                                                                         │ |
    | │ [ ⚙️ Zmień Model / Konfiguruj ]                                         │ |
    | └─────────────────────────────────────────────────────────────────────────┘ |
    |                                                                             |
    | 2. MAGAZYN WEKTORÓW (THE STORAGE)                                           |
    | Gdzie Axon trzyma Twoją wiedzę?                                             |
    |                                                                             |
    | ┌─────────────────────────────────────────────────────────────────────────┐ |
    | │ [🐘] Postgres (pgvector)                                 [ ● Connected ]│ |
    | │ Host: aws-eu-central-1...                                               │ |
    | │ Tabela: `knowledge_vectors_1536`                                        │ |
    | │                                                                         │ |
    | │ Statystyki:                                                             │ |
    | │ [📊 450,200 wektorów]   [💾 45 MB]   [⏱️ Avg. Query: 24ms]              │ |
    | │                                                                         │ |
    | │ [ 🔧 Ustawienia Połączenia ]   [ 🗑️ Wyczyść/Resetuj Bazę ]               │ |
    | └─────────────────────────────────────────────────────────────────────────┘ |
    |                                                                             |
    | 3. PROFILE PRZETWARZANIA (CHUNKING STRATEGIES)                              |
    | Zdefiniowane metody cięcia plików. Używane przy imporcie (Ingestii).        |
    |                                                                             |
    | +---------------------+-----------------------+---------------------------+ |
    | | NAZWA PROFILU       | METODA                | PARAMETRY                 | |
    | |---------------------|-----------------------|---------------------------| |
    | | 📄 General Text     | Recursive Character   | 1000 / 200                | |
    | | (Domyślny)          |                       |                           | |
    | |---------------------|-----------------------|---------------------------| |
    | | 🐍 Codebase         | Code Splitter (Py)    | 500 / 0                   | |
    | |---------------------|-----------------------|---------------------------| |
    | | 📜 Precise (Legal)  | Token Splitter        | 256 / 64                  | |
    | +---------------------+-----------------------+---------------------------+ |
    | [ + Utwórz Nową Strategię ]                                                 |
    |                                                                             |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ---
    
    ### 2. WIDOK: Konfiguracja Modelu (Change Model)
    
    To jest **"Czerwona Strefa"**. Zmiana modelu oznacza, że stare wektory stają się śmieciami (są matematycznie niekompatybilne). UI musi przed tym ostrzec.
    
    ```
    +-----------------------------------------------------------------------------+
    | Konfiguracja Modelu Embeddingu                                      [ X ]   |
    |-----------------------------------------------------------------------------+
    | ⚠️ UWAGA: Zmiana modelu unieważni obecny indeks. Wymagana RE-INDEKSACJA.    |
    |                                                                             |
    | 1. WYBÓR DOSTAWCY                                                           |
    | Dostawca:                                                                   |
    | [ OpenAI                                     ▼ ]                            |
    |                                                                             |
    | Model ID:                                                                   |
    | [ text-embedding-3-small (Recommended)       ▼ ]                            |
    |                                                                             |
    | 2. PARAMETRY TECHNICZNE (READ-ONLY / AUTO)                                  |
    | Axon pobrał te dane z API dostawcy.                                         |
    |                                                                             |
    | Wymiary (Dimensions):    [ 1536 ]                                           |
    | *Baza danych zostanie zmigrowana do tabeli obsługującej ten wymiar.*        |
    |                                                                             |
    | Max Context (Tokens):    [ 8191 ]                                           |
    |                                                                             |
    | 3. EKONOMIA                                                                 |
    | Koszt (Input):           [ $ 0.02      ] / 1M tokenów                       |
    |                                                                             |
    | --------------------------------------------------------------------------- |
    | PLAN MIGRACJI (Co się stanie po zapisie?):                                  |
    | 1. Utworzenie nowej tabeli `vectors_1536_v2`.                               |
    | 2. Pobranie treści (raw content) wszystkich plików z `Resources`.           |
    | 3. Ponowne przeliczenie wektorów (Koszt estymowany: $0.12).                 |
    |                                                                             |
    | [ Anuluj ]                        [ ☢️ Zapisz i Przeindeksuj (Hard Reset) ] |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ---
    
    ### 3. WIDOK: Edycja Strategii Chunkowania
    
    Tutaj definiujesz precyzję cięcia. To narzędzie dla Ciebie, aby dostosować RAG do specyfiki Twoich dokumentów.
    
    ```
    +-----------------------------------------------------------------------------+
    | Settings > Knowledge Engine > Strategia: General Text                       |
    |-----------------------------------------------------------------------------+
    | [📄] General Text                           [ Anuluj ] [ Zapisz Strategię ] |
    |-----------------------------------------------------------------------------+
    |                                                                             |
    |  LEWA KOLUMNA (USTAWIENIA)                PRAWA KOLUMNA (PODGLĄD / TEST)    |
    |  ---------------------------------------  --------------------------------  |
    |  1. METODA PODZIAŁU (SPLITTER)            [🧪] Symulator Chunkowania        |
    |  Wybierz algorytm dzielenia tekstu.                                         |
    |                                           Wklej tekst, aby zobaczyć, jak    |
    |  [ (◉) Recursive Character ]              zostanie pocięty.                 |
    |  *Dzieli po akapitach, potem zdaniach.                                      |
    |   Najlepsze dla prozy/dokumentacji.*      [ # Wstęp                         |
    |                                             Axon to system modułowy...      |
    |  [ ( ) Code Splitter (AST) ]                ... (długi tekst)             ] |
    |  [ ( ) Token Splitter (Hard Limit) ]                                        |
    |                                           [ ▶ Testuj Podział ]              |
    |  ---------------------------------------                                    |
    |  2. PARAMETRY ROZMIARU                    --------------------------------  |
    |                                           WYNIK (CHUNKS):                   |
    |  Chunk Size (Wielkość):                   Liczba kawałków: 3                |
    |  [ 1000 ] znaków                                                            |
    |  *Zalecane: 500-1500.*                    Chunk 1 (980 chars):              |
    |                                           ┌──────────────────────────────┐  |
    |  Chunk Overlap (Nakładka):                │ # Wstęp                      │  |
    |  [ 200  ] znaków                          │ Axon to system modułowy...   │  |
    |  *Zapobiega ucięciu kontekstu.*           └──────────────────────────────┘  |
    |                                                                             |
    |  ---------------------------------------  Chunk 2 (1000 chars):             |
    |  3. SEPARATORY (Dla Recursive)            ┌──────────────────────────────┐  |
    |  Gdzie ciąć w pierwszej kolejności?       │ ... (Overlap) ...            │  |
    |                                           │ Rozdział 1: Architektura     │  |
    |  1. [ "\\n\\n" ] (Podwójny Enter)           └──────────────────────────────┘  |
    |  2. [ "\\n"   ] (Nowa linia)                                                 |
    |  3. [ " "    ] (Spacja)                                                     |
    |                                                                             |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ### 4. WIDOK: Vector Database Settings (Baza Danych)
    
    Konfiguracja "magazynu".
    
    ```
    +-----------------------------------------------------------------------------+
    | Konfiguracja Bazy Wektorowej                                        [ X ]   |
    |-----------------------------------------------------------------------------+
    | Typ Bazy:                                                                   |
    | [ (◉) Postgres (pgvector) ]   [ ( ) Pinecone ]   [ ( ) Qdrant ]             |
    |                                                                             |
    | Connection String (URI):                                                    |
    | [ postgresql://user:pass@aws-rds-axon:5432/axon_db_________ ]  [ 🔒 ]       |
    |                                                                             |
    | Tabela Wektorowa (Prefix):                                                  |
    | [ axon_knowledge_vectors_                                   ]               |
    | *System doda suffix wymiarów, np. _1536.*                                   |
    |                                                                             |
    | Indeksowanie (Index Type):                                                  |
    | [ (◉) HNSW (Szybkie / Więcej RAM) ]   [ ( ) IVFFlat (Wolniejsze) ]          |
    |                                                                             |
    | [ Test Połączenia ]                                       [ Zapisz ]        |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ### Podsumowanie UX
    
    1. **Bezpieczeństwo:** Użytkownik nie może przypadkowo zepsuć bazy przez zmianę modelu. Ostrzeżenie o "Hard Reset" jest wyraźne.
    2. **Edukacja:** Symulator w edycji strategii pokazuje *wizualnie*, czym jest Chunking i Overlap. To pomaga dobrać parametry bez zgadywania.
    3. **Elastyczność:** Możesz mieć osobne strategie dla kodu (małe kawałki, brak overlapu) i dla umów prawnych (duże kawałki, duży overlap), co jest kluczowe dla jakości RAG.
- Plan Implementacji
    
    Oto szczegółowy **Plan Implementacji** dla modułów **Knowledge Base** (Zarządzanie Treścią) oraz **Knowledge Engine** (Infrastruktura RAG).
    
    Plan ten realizuje architekturę **Modular Monolith** z podejściem **Vertical Slices**. Traktujemy "Wiedzę" jako jedną dużą domenę, która ma dwa interfejsy użytkownika:
    
    1. **Operacyjny:** `Resources > Knowledge Base` (Dla użytkownika wrzucającego pliki).
    2. **Konfiguracyjny:** `Settings > Knowledge Engine` (Dla administratora ustawiającego RAG).
    
    ---
    
    ### I. Mapa Plików (Struktura Projektu)
    
    ```
    backend/app/
    ├── modules/
    │   ├── knowledge/              # <--- CAŁA DOMENA WIEDZY
    │   │   ├── models.py           # DB: Resource, Chunk, Strategy, HubLink
    │   │   ├── schemas.py          # Pydantic: IngestRequest, SearchQuery
    │   │   ├── router.py           # API: Upload, Search, Config
    │   │   │
    │   │   └── services/
    │   │       ├── ingestion.py    # ETL Pipeline: Load -> Split -> Embed -> Store
    │   │       ├── loaders.py      # Obsługa PDF, MD, TXT, URL
    │   │       ├── splitters.py    # Logika Chunkowania (Strategies)
    │   │       ├── vector_store.py # Wrapper na pgvector (CRUD wektorów)
    │   │       └── auto_tagger.py  # AI Service do generowania metadanych
    │   │
    │   └── shared/
    │       └── ports/
    │           └── iknowledge_retriever.py # Interfejs dla Agentów
    │
    frontend/src/
    ├── modules/
    │   ├── resources/              # <--- WIDOKI OPERACYJNE
    │   │   ├── knowledge/
    │   │   │   ├── pages/
    │   │   │   │   ├── KnowledgeBasePage.tsx  # Overview (Lista)
    │   │   │   │   └── EditResourcePage.tsx   # Split Layout (Edycja)
    │   │   │   │
    │   │   │   ├── components/
    │   │   │   │   ├── ResourceList.tsx
    │   │   │   │   ├── MetadataEditor.tsx     # Prawa kolumna edycji
    │   │   │   │   └── IngestModal.tsx        # Upload + Wybór Strategii
    │   │   │
    │   ├── settings/               # <--- WIDOKI KONFIGURACYJNE
    │   │   ├── knowledge-engine/
    │   │   │   ├── pages/
    │   │   │   │   ├── EngineOverviewPage.tsx # Dashboard RAG
    │   │   │   │
    │   │   │   ├── components/
    │   │   │   │   ├── StrategyBuilder.tsx    # Edytor Chunkowania
    │   │   │   │   └── ChunkSimulator.tsx     # Testowanie podziału tekstu
    │   │   │
    │   └── shared/
    │       └── api/
    │           └── knowledge.ts    # Klient API
    
    ```
    
    ---
    
    ### II. Faza 1: Backend - Baza Danych i Model (Postgres + pgvector)
    
    Musimy zaprojektować schemat, który obsłuży pliki, relacje z Hubami (Workspaces) i same wektory.
    
    **Plik:** `backend/app/modules/knowledge/models.py`
    
    ```python
    from sqlalchemy import Column, String, ForeignKey, Integer, Text
    from sqlalchemy.dialects.postgresql import JSONB, ARRAY, UUID
    from pgvector.sqlalchemy import Vector
    from app.shared.db.base import Base
    
    class KnowledgeResource(Base):
        """Fizyczny plik lub link."""
        __tablename__ = "knowledge_resources"
    
        id = Column(UUID, primary_key=True)
        title = Column(String)
        source_type = Column(String) # 'file', 'url', 'text'
        content_path = Column(String) # Ścieżka do S3/Disk lub URL
    
        # Kluczowe dla RAG
        metadata_ = Column("metadata", JSONB, default=dict) # Tagi, Autor, Rok
        hubs = Column(ARRAY(String)) # Lista ID Workspace'ów: ['design', 'growth']
    
        # Konfiguracja użyta przy ingesti
        processing_strategy = Column(String) # np. 'general_text'
        chunk_count = Column(Integer, default=0)
        status = Column(String) # 'pending', 'indexed', 'error'
    
    class KnowledgeChunk(Base):
        """Pocięty fragment tekstu z wektorem."""
        __tablename__ = "knowledge_chunks"
    
        id = Column(UUID, primary_key=True)
        resource_id = Column(UUID, ForeignKey("knowledge_resources.id"))
    
        content = Column(Text) # Czysty tekst fragmentu
        chunk_index = Column(Integer)
    
        # Metadane odziedziczone z Resource + specyficzne dla chunka (np. nagłówek)
        metadata_ = Column("metadata", JSONB, default=dict)
    
        # Wektor (1536 wymiarów dla text-embedding-3-small)
        embedding = Column(Vector(1536))
    
    ```
    
    ---
    
    ### III. Faza 2: Backend - Serwis Ingestii (ETL Pipeline)
    
    To jest "silnik", który mieli pliki.
    
    **Plik:** `backend/app/modules/knowledge/services/ingestion.py`
    
    ```python
    class IngestionService:
        async def process_resource(self, resource_id: str):
            # 1. Pobierz zasób z bazy
            resource = db.get(resource_id)
    
            # 2. Załaduj treść (Loader Factory)
            raw_text = Loaders.load(resource.source_type, resource.content_path)
    
            # 3. Wybierz strategię chunkowania
            strategy_config = Strategies.get(resource.processing_strategy)
            splitter = TextSplitterFactory.create(strategy_config)
    
            # 4. Potnij tekst
            chunks = splitter.split_text(raw_text)
    
            # 5. Wygeneruj Embeddings (Batchowo)
            vectors = await OpenAIEmbedding.embed_documents([c.page_content for c in chunks])
    
            # 6. Zapisz do tabeli wektorowej
            for i, chunk in enumerate(chunks):
                db_chunk = KnowledgeChunk(
                    resource_id=resource.id,
                    content=chunk.page_content,
                    embedding=vectors[i],
                    metadata_={**resource.metadata_, **chunk.metadata}
                )
                db.add(db_chunk)
    
            resource.status = 'indexed'
            db.commit()
    
    ```
    
    ---
    
    ### IV. Faza 3: Frontend - Zarządzanie Wiedzą (Resources)
    
    ### 1. Ingest Modal (Dodawanie pliku)
    
    Komponent, który pozwala wybrać plik i przypisać go do Hubów.
    
    **Logika:**
    
    - Upload pliku -> Backend zapisuje plik w `tmp` lub S3.
    - Użytkownik wybiera Huby (Multi-select) i Strategię (Dropdown).
    - Kliknięcie "Zapisz i Indeksuj" uruchamia `IngestionService` w tle (Background Task).
    
    ### 2. Metadata Editor (Prawa Kolumna)
    
    Używa przycisku **Magic Wand**, aby automatycznie wygenerować tagi.
    
    ```tsx
    // frontend/src/modules/resources/knowledge/components/MetadataEditor.tsx
    
    const handleAutoTag = async () => {
      setIsLoading(true);
      // Backend czyta pierwsze 2k znaków pliku i prosi LLM o JSON z metadanymi
      const tags = await api.knowledge.autoTag(resourceId);
      form.setValue('metadata', tags);
      setIsLoading(false);
    };
    
    ```
    
    ---
    
    ### V. Faza 4: Frontend - RAG Settings (Maszynownia)
    
    ### 1. Strategy Builder (Konfigurator Chunkowania)
    
    Pozwala zdefiniować preset, np. "Codebase".
    
    - **Pola:** Chunk Size (liczba), Overlap (liczba), Separators (lista).
    - **Symulator:**
        - Wklejasz tekst po lewej.
        - Po prawej widzisz wizualizację: `[Chunk 1] [Chunk 2 (Overlap)]`.
        - Implementacja: Prosty skrypt JS, który tnie stringa według zadanych parametrów (dla podglądu nie musimy wysyłać do backendu, chyba że używamy tokenizera, wtedy tak).
    
    ---
    
    ### VI. Faza 5: Integracja z Agentami (Port)
    
    To kluczowy moment łączenia modułów. Moduł `Agents` nie importuje `vector_store.py`. Używa abstrakcji.
    
    **Plik:** `backend/app/shared/ports/iknowledge_retriever.py`
    
    ```python
    class RetrievalQuery(BaseModel):
        query: str
        hub_ids: List[str] # Context filtering (WHERE hubs && [...])
        filters: Dict[str, Any] = {} # Metadata filtering (WHERE metadata->>...)
        k: int = 5
    
    class IKnowledgeRetriever(Protocol):
        async def search(self, request: RetrievalQuery) -> List[Document]:
            ...
    
    ```
    
    **Implementacja w `modules/knowledge/services/retriever.py`:**
    Używa `pgvector` z operatorem cosine distance (`<=>`) i filtrowaniem po kolumnie JSONB.
    
    ---
    
    ### Harmonogram Wdrożenia (Roadmap)
    
    1. **Tydzień 1: Backend Core**
        - Instalacja `pgvector` w Dockerze.
        - Modele SQL i migracje (`KnowledgeResource`, `KnowledgeChunk`).
        - Podstawowy `IngestionService` (tylko pliki tekstowe/MD).
    2. **Tydzień 2: Frontend - Resources**
        - Lista plików (Overview) z filtrowaniem.
        - Modal Uploadu.
        - Podpięcie endpointu statusu (Polling: `indexing` -> `ready`).
    3. **Tydzień 3: RAG Engine & Search**
        - Implementacja `RetrieverService` (wyszukiwanie wektorowe).
        - Widok `Settings > Knowledge Engine`.
        - Testy: Czy Agent widzi pliki z przypisanego Huba?
    4. **Tydzień 4: Advanced Features**
        - Auto-tagowanie metadanych (Magic Wand).
        - Chunk Debugger (Wizualizacja wektorów).
        - Obsługa PDF (biblioteka `unstructured` lub `pypdf`).
    
    Ten plan daje Ci kompletny system zarządzania wiedzą ("Drugi Mózg" dla firmy), który jest w pełni zintegrowany z resztą architektury Axon.