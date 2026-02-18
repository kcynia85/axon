- Page views
    
    Oto kompletna, finalna specyfikacja projektowa (Design Spec) dla modułu **External Services** w aplikacji Axon.
    
    Dokumentacja ta uwzględnia wszystkie iteracje, decyzje architektoniczne (DDD), taksonomię (`⚡ Utility` vs `✨ GenAI`) oraz wzorce UX (Split Layout, Magic Wand, Progressive Disclosure).
    
    ---
    
    ### Spis Treści
    
    1. **Widok: External Services Overview** (Katalog i Podgląd)
    2. **Modal: Intention Selector** (Wybór Typu)
    3. **Widok: Edit Utility Service** (Narzędzia np. Phantombuster)
    4. **Widok: Edit Generative AI Service** (Silniki np. Higgsfield)
    5. **Modal: Feature Extraction** (Import z URL)
    6. **Wizualizacja: Service Node** (Na Canvasie)
    
    ---
    
    ### 1. WIDOK: External Services Overview
    
    **Cel:** Szybkie wyszukiwanie, filtrowanie i weryfikacja możliwości narzędzi.
    
    - **Układ:** 2-kolumnowy (Lista + Panel Podglądu).
    - **Interakcja:** Kliknięcie w wiersz ładuje dane w Prawym Panelu (bez przeładowania).
    
    ```
    +-----------------------------------------------------------------------------+
    | Settings > External Services                                                |
    |-----------------------------------------------------------------------------+
    | [🔌] Services (42)                                       [ + Dodaj Własny ] |
    |-----------------------------------------------------------------------------+
    |                                                                             |
    | [🔍 Szukaj narzędzia...]  [⚡ Ikona Filtra]                                 |
    | Aktywne filtry: [ ● Ready x ] [ ✨ GenAI x ] [ □ Growth & Market x ]        |
    |                                                                             |
    |-----------------------------------------------------------------------------+
    |                                       |                                     |
    |  LISTA USŁUG (Wyniki: 12)             |  KARTA SERWISU (Prawa Kolumna)      |
    |                                       |                                     |
    |  +---------------------------------+  |  +-------------------------------+  |
    |  | [✨] Higgsfield AI              |  |  |                               |  |
    |  |    ● Ready                      |  |  | [✨] Higgsfield AI ↗          |  |
    |  |    [ Edytuj > ]                 |  |  | higgsfield.ai                 |  |
    |  +---------------------------------+  |  |                               |  |
    |                                       |  | ● Ready (Gotowy)              |  |
    |  +---------------------------------+  |  |                               |  |
    |  | [✨] Freepik AI                 |  |  | ----------------------------- |  |
    |  |    ● Ready                      |  |  |                               |  |
    |  |    [ Edytuj > ]                 |  |  | AI CONTEXT                    |  |
    |  +---------------------------------+  |  | "Platforma generatywna wideo  |  |
    |                                       |  | i wektorów. Specjalizacja:    |  |
    |  +---------------------------------+  |  | kontrola ruchu."              |  |
    |  | [⚡] Phantombuster              |  |  |                               |  |
    |  |    ● Ready                      |  |  | ----------------------------- |  |
    |  |    [ Edytuj > ]                 |  |  |                               |  |
    |  +---------------------------------+  |  | TRYBY PRACY (MODES)           |  |
    |                                       |  | Warianty wybieralne na Node:  |  |
    |  +---------------------------------+  |  |                               |  |
    |  | [⚡] Make                       |  |  | 1. Cinema Studio              |  |
    |  |    ○ Draft                      |  |  | 2. Relight                    |  |
    |  |    [ Konfiguruj > ]             |  |  | 3. Motion Control             |  |
    |  +---------------------------------+  |  |                               |  |
    |                                       |  | [ + 2 inne tryby... ] (Hover) |  |
    |  ...                                  |  |                               |  |
    |                                       |  | ----------------------------- |  |
    |  <  1  2  3  >                        |  |                               |  |
    |                                       |  | DEFINICJA ARTEFAKTÓW (I/O)    |  |
    |                                       |  | Input:  [Tekst] [Plik]        |  |
    |                                       |  | Output: [Video Asset (Link)]  |  |
    |                                       |  |                               |  |
    |                                       |  | DOSTĘPNOŚĆ (WORKSPACES)       |  |
    |                                       |  | [□ Growth & Market]           |  |
    |                                       |  |                               |  |
    |                                       |  | [ ✏️ Edytuj Definicję ]        |  |
    |                                       |  +-------------------------------+  |
    +-----------------------------------------------------------------------------+
    
    ```
    
    **Kluczowe detale UX:**
    
    - **Truncation:** `[ + 2 inne tryby... ]` zapobiega rozpychaniu panelu przy dużej liczbie funkcji.
    - **Ikony:** `⚡` dla Utility, `✨` dla GenAI.
    - **Status:** `● Ready` (Zielony) vs `○ Draft` (Szary).
    
    ---
    
    ### 2. MODAL: Intention Selector
    
    **Cel:** Przekierowanie użytkownika do właściwego formularza (Routing).
    
    ```
    +-----------------------------------------------------------------------------+
    | Dodaj Nowy Serwis                                                   [ X ]   |
    |-----------------------------------------------------------------------------+
    | Wybierz typ integracji. Pomoże to Axonowi dostosować opcje konfiguracji.    |
    |                                                                             |
    |  +-----------------------------+   +-----------------------------+          |
    |  | [⚡] Narzędzie Użytkowe     |   | [✨] Silnik Generatywny     |          |
    |  | (Utility / Tool)            |   | (AI Engine / Model)         |          |
    |  |                             |   |                             |          |
    |  | Automatyzacja, bazy danych, |   | Tworzenie nowych treści:    |          |
    |  | CRM, Scrapery.              |   | Wideo, Obraz, Audio.        |          |
    |  |                             |   |                             |          |
    |  | [ Wybierz Użytkowe → ]      |   | [ Wybierz Generatywne → ]   |          |
    |  +-----------------------------+   +-----------------------------+          |
    |                                                                             |
    |  -------------------------------------------------------------------------  |
    |                                                                             |
    |              [ 📝 Pusta Definicja (Zacznij bez konfiguracji) ]              |
    |              *Dodaj jako Draft i skonfiguruj szczegóły później.*            |
    |                                                                             |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ---
    
    ### 3. WIDOK EDYCJI: Utility Service (`⚡`)
    
    **Przykład:** Phantombuster, HubSpot.
    **Focus:** Lista Akcji (Capabilities) i Import z URL.
    
    ```
    +-----------------------------------------------------------------------------+
    | Settings > External Services > Edycja: Phantombuster                        |
    |-----------------------------------------------------------------------------+
    | [⚡▼] [ Phantombuster ]                     [ Anuluj ] [ Zapisz Serwis ]    |
    |-----------------------------------------------------------------------------+
    |                                                   |                         |
    |  LEWA KOLUMNA (EDYCJA)                            |  PRAWA KOLUMNA (AI)     |
    |  -----------------------------------------------  |  -----------------------|
    |  1. TOŻSAMOŚĆ                                     |  [🧠] Semantic Profiler |
    |  Nazwa: [ Phantombuster                       ]   |                         |
    |  Typ:   [ (◉) Utility ] [ ( ) GenAI ]             |  Status: [ ● Aktywny ]  |
    |  Tagi:  [ Business x ] [ Scraping x ]             |                         |
    |                                                   |  WYKRYTA KATEGORIA      |
    |  -----------------------------------------------  |  Automation / Scraper   |
    |  2. MOŻLIWOŚCI (CAPABILITIES)                     |                         |
    |  Zdefiniuj akcje dostępne na Węźle w Space.       |  SUGESTIA UŻYCIA        |
    |                                                   |  "Użyj do automatyzacji |
    |  [ + Dodaj ]   [ 🌐 Importuj z URL / Docs ]       |  pozyskiwania leadów z  |
    |                                                   |  social media."         |
    |  +---------------------------------------------+  |                         |
    |  | NAZWA AKCJI    | OPIS INTENCJI (DLA AI)     | |  |  ZROZUMIENIE I/O        |
    |  |----------------|--------------------------|-|  |  "Wymaga listy URLi.    |
    |  | Profile Scraper| Pobiera dane do CSV      |x|  |  Produkuje pliki."      |
    |  | Network Booster| Wysyła zaproszenia       |x|  |                         |
    |  +---------------------------------------------+  |                         |
    |                                                   |                         |
    |           [ ● Włącz Asystenta AI (Analiza Listy)] | <--- TOGGLE (ON)        |
    |  -----------------------------------------------  |                         |
    |  3. SZABLON ARTEFAKTÓW (INTERFEJS)                |                         |
    |                                                   |                         |
    |  ▼ Wymagane Zasoby (Wejście)                      |                         |
    |    [ 🪄 Generuj schemat z Możliwości ]            |                         |
    |  +---------------------------------------------+  |                         |
    |  | ETYKIETA ZASOBU | TYP ZASOBU    | WYMAGANY? |  |                         |
    |  |-----------------|---------------|-----------|  |                         |
    |  | Profile Link    | [ Link (URL)▼]| [Tak]     |  |                         |
    |  | Session Key     | [ Tekst     ▼]| [Tak]     |  |                         |
    |  +---------------------------------------------+  |                         |
    |                                                   |                         |
    |  ▼ Produkowane Artefakty (Wyjście)                |                         |
    |  +---------------------------------------------+  |                         |
    |  | ETYKIETA ZASOBU | TYP ZASOBU    | DOSTĘPNY? |  |                         |
    |  |-----------------|---------------|-----------|  |                         |
    |  | Leads CSV       | [ Plik (Link)▼]| [Tak]     |  |                         |
    |  +---------------------------------------------+  |                         |
    |                                                   |                         |
    |  -----------------------------------------------  |                         |
    |  4. DOSTĘPNOŚĆ (WORKSPACES)                       |                         |
    |  [✓] Growth & Market                              |                         |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ---
    
    ### 4. WIDOK EDYCJI: AI Creative Platform (`✨`)
    
    **Przykład:** Higgsfield, Freepik.
    **Focus:** Profil Generatywny i Tryby (Modes).
    
    ```
    +--------------------------------------------------------------------------------+
    | Settings > External Services > Higgsfield                                      |
    +--------------------------------------------------------------------------------+
    | [🎬 AI Creative Platform]  Higgsfield AI        [ Anuluj ] [ Zapisz ]          |
    +--------------------------------------------------------------------------------+
    
    ┌──────────────────────────────────────────────────────────────────────────────┐
    │ 1. TOŻSAMOŚĆ SERWISU                                                           │
    ├──────────────────────────────────────────────────────────────────────────────┤
    │ Nazwa:        [ Higgsfield AI                               ]                 │
    │ Kategoria:    AI Creative Platform                                           │
    │ Charakter:    Produkt GenAI z własnymi presetami i workflowami               │
    │ Tagi:         [ Video × ] [ Image × ] [ Cinematic × ]                         │
    │                                                                                │
    │ (ℹ) Serwis nie udostępnia bezpośredniego API generowania                       │
    │     i działa jako zewnętrzna platforma kreatywna                               │
    └──────────────────────────────────────────────────────────────────────────────┘
    
    ┌──────────────────────────────────────────────────────────────────────────────┐
    │ 2. ZAKRES MOŻLIWOŚCI PLATFORMY                                                 │
    │ Opis wysokopoziomowy – bez konfiguracji technicznej                            │
    ├──────────────────────────────────────────────────────────────────────────────┤
    │ Typy generowania:                                                             │
    │ [✓] Video Generation                                                          │
    │ [✓] Image-to-Video                                                            │
    │ [✓] Relighting / Scene Control                                                │
    │                                                                                │
    │ Charakterystyka:                                                              │
    │ • Presety ruchu kamery i sceny                                                 │
    │ • Silna kontrola wizualna                                                      │
    │ • Workflow nastawiony na jakość, nie szybkość                                 │
    │                                                                                │
    │ (i) Modele AI są zarządzane wewnętrznie przez Higgsfield                       │
    └──────────────────────────────────────────────────────────────────────────────┘
    
    ┌──────────────────────────────────────────────────────────────────────────────┐
    │ 3. PRESETY PLATFORMY (CAPABILITIES)                                            │
    │ Presety są zamkniętymi scenariuszami użycia                                   │
    ├──────────────────────────────────────────────────────────────────────────────┤
    │ [ + Dodaj Preset Referencyjny ]   [ 🌐 Import Presetów ]                       │
    │                                                                                │
    │ ┌──────────────────────────────────────────────────────────────────────────┐ │
    │ │ Preset: Cinematic Video from Prompt                                       │ │
    │ ├──────────────────────────────────────────────────────────────────────────┤ │
    │ │ Cel:                                                                      │ │
    │ │ Wysokiej jakości wideo generowane z opisu tekstowego                       │ │
    │ │                                                                            │ │
    │ │ Typ pracy:                                                                │ │
    │ │ Manual / Creative Platform                                                 │ │
    │ │                                                                            │ │
    │ │ Wymagane Inputy (dla Node):                                                │ │
    │ │ • Prompt (Text)                                                           │ │
    │ │                                                                            │ │
    │ │ Oczekiwany Outcome:                                                       │ │
    │ │ • Video Asset (URL / File)                                                 │ │
    │ │                                                                            │ │
    │ │ Informacyjnie:                                                            │ │
    │ │ • Kinowy styl, długi czas generacji                                        │ │
    │ │ • Wysoka wrażliwość na jakość promptu                                      │ │
    │ │                                                                            │ │
    │ │ [ Edytuj opis ] [ Usuń ]                                                   │ │
    │ └──────────────────────────────────────────────────────────────────────────┘ │
    │                                                                                │
    │ ┌──────────────────────────────────────────────────────────────────────────┐ │
    │ │ Preset: Relight Existing Video                                            │ │
    │ ├──────────────────────────────────────────────────────────────────────────┤ │
    │ │ Cel:                                                                      │ │
    │ │ Zmiana oświetlenia i klimatu istniejącego materiału                        │ │
    │ │                                                                            │ │
    │ │ Wymagane Inputy:                                                          │ │
    │ │ • Prompt (Text)                                                           │ │
    │ │ • Reference Video (URL / File)                                             │ │
    │ │                                                                            │ │
    │ │ Outcome:                                                                  │ │
    │ │ • Updated Video Asset                                                     │ │
    │ │                                                                            │ │
    │ │ [ Edytuj opis ] [ Usuń ]                                                   │ │
    │ └──────────────────────────────────────────────────────────────────────────┘ │
    └──────────────────────────────────────────────────────────────────────────────┘
    
    ┌──────────────────────────────────────────────────────────────────────────────┐
    │ 4. DOSTĘPNOŚĆ (WORKSPACES)                                                     │
    ├──────────────────────────────────────────────────────────────────────────────┤
    │ [✓] Design                                                                    │
    │ [✓] Growth & Market                                                           │
    └──────────────────────────────────────────────────────────────────────────────┘
    
    ```
    
    ---
    
    ### 5. MODAL: Import z URL (Feature Extraction)
    
    **Cel:** Automatyzacja wypełniania tabeli "Możliwości/Tryby" na podstawie strony WWW.
    
    ```
    +---------------------------------------------------------------+
    | 🌐 Import Możliwości (Feature Extraction)                     |
    |---------------------------------------------------------------|
    | Wklej link do strony Features/Docs. AI wyodrębni funkcje      |
    | istotne dla mapowania procesów.                               |
    |                                                               |
    | URL: [ <https://higgsfield.ai/features_________________> ]      |
    |                                                               |
    | [ Anuluj ]                              [ ⚡ Analizuj Stronę ] |
    +---------------------------------------------------------------+
    |                                                               |
    | WYNIKI ANALIZY (Znaleziono: 3)                                |
    | Zaznacz funkcje, które chcesz dodać jako Tryby/Akcje.         |
    |                                                               |
    | [x] Relight                                                   |
    |     "Zmiana oświetlenia sceny wideo."                         |
    |     Wejście: Wideo, Tekst                                     |
    |                                                               |
    | [x] Motion Control                                            |
    |     "Sterowanie ruchem kamery na statycznym obrazie."         |
    |     Wejście: Obraz, Tekst                                     |
    |                                                               |
    | [ ] iOS App Export                                            |
    |     (Pominięto - funkcja nieistotna dla API)                  |
    |                                                               |
    |---------------------------------------------------------------|
    | [ Dodaj Zaznaczone (2) ]                                      |
    +---------------------------------------------------------------+
    
    ```
    
    ---