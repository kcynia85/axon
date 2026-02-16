- Page views + Modals
    1. **Main Overview (Lista Definicji)** – Główne centrum dowodzenia.
    2. **Global Execution Log (Historia)** – Często pomijany, a krytyczny widok: "Co się właściwie działo w systemie?".
    3. **Empty State** – Widok startowy.
    
    ---
    
    ## 1. Main Overview: Rejestr Automatyzacji
    
    **Cel:** Szybkie odnalezienie procesu, sprawdzenie jego statusu i skopiowanie Webhooka bez wchodzenia w detale.
    
    **Elementy kluczowe:**
    
    - **Wskaźnik `[🧠]`**: Informuje, czy automatyzacja jest zindeksowana w bazie wektorowej (czy Agent ją widzi).
    - **Quick Actions**: Kopiowanie URL, szybkie uruchomienie (Manual Trigger).
    
    ```
    +-----------------------------------------------------------------------------+
    | Settings > Automations                                                      |
    +-----------------------------------------------------------------------------+
    |                                                                             |
    |  [ DEFINITIONS (12) ]    [ Execution Logs ]                                 |
    |                                                                             |
    |  +-----------------------------------------------------------------------+  |
    |  | [🔍 Search automations...]   [ Filter by Tag ▾ ]    [ + New Autom. ]  |  |
    |  +-----------------------------------------------------------------------+  |
    |                                                                             |
    |  NAZWA & OPIS                       KLUCZ / METODA       STATUS   AKCJE     |
    |  ---------------------------------  -------------------  -------  --------  |
    |                                                                             |
    |  ⚡ Invoice OCR Process [🧠]        POST                 🟢       [ ▶ ]    |
    |  Extracts NIP and Amount from PDF   auto_invoice_ocr     Active   [ ⚙️ ]    |
    |  #finance #ocr                                                    [ 🔗 ]    |
    |                                                                             |
    |  ⚡ Client Onboarding [🧠]          POST                 🟢       [ ▶ ]    |
    |  Setup GDrive, Slack & Jira         auto_client_onboard  Active   [ ⚙️ ]    |
    |  #sales #hr                                                       [ 🔗 ]    |
    |                                                                             |
    |  ⚡ Weekly Report Generator         POST                 🔴       [ ▶ ]    |
    |  Aggregates KPIs from SQL           auto_weekly_kpi      Draft    [ ⚙️ ]    |
    |  #reporting                         (Not Indexed)                 [ 🔗 ]    |
    |                                                                             |
    |  ⚡ Server Restart Sequence [🧠]    POST                 🟡       [ ▶ ]    |
    |  Safe reboot of prod layout         auto_srv_restart     Maint.   [ ⚙️ ]    |
    |  #devops #dangerous                                               [ 🔗 ]    |
    |                                                                             |
    |  ---------------------------------  -------------------  -------  --------  |
    |  Showing 1-4 of 12                                      <  1  2  3  >       |
    |                                                                             |
    +-----------------------------------------------------------------------------+
    
    ```
    
    **Legenda Akcji:**
    
    - `[🧠]` (Brain Icon) – Obok nazwy: Potwierdzenie, że embedding istnieje.
    - `[ ▶ ]` (Play) – Otwiera Modal w trybie "Quick Run" (sam prawy panel symulatora).
    - `[ ⚙️ ]` (Cog) – Otwiera pełny Modal Edycji.
    - `[ 🔗 ]` (Link) – Kopiuje `Prod Webhook URL` do schowka (Toast: "Webhook Copied").
    
    ---
    
    ## 2. Global Execution Log: Historia Wykonań
    
    **Cel:** Observability. Widok "Co system robił, gdy spałem?". Jeśli Agent w nocy uruchomił 50 automatyzacji, tutaj zobaczysz, które się powiodły, a które nie (bez wchodzenia do n8n).
    
    ```
    +-----------------------------------------------------------------------------+
    | Settings > Automations                                                      |
    +-----------------------------------------------------------------------------+
    |                                                                             |
    |  [ Definitions ]    [ EXECUTION LOGS ]                                      |
    |                                                                             |
    |  +-----------------------------------------------------------------------+  |
    |  | [🔍 Search by Exec ID...]    [ Status: Any ▾ ]      [ Date Range ▾ ]  |  |
    |  +-----------------------------------------------------------------------+  |
    |                                                                             |
    |  TIMESTAMP            AUTOMATION           TRIGGERED BY     STATUS   TIME   |
    |  -------------------  -------------------  ---------------  -------  -----  |
    |                                                                             |
    |  Today, 14:32:01      Invoice OCR Process  👨🏻‍💻 P.Miki       🟢 200   1.2s   |
    |  ID: exec_8829...     (Manual Run)         (User)                           |
    |                                                                             |
    |  Today, 14:30:55      Client Onboarding    🤖 Sales Agent   🔴 500   5.4s   |
    |  ID: exec_8828...     (Space: Sales flow)  (System)         Error           |
    |                                                                             |
    |  Today, 12:15:00      Server Restart Seq   ⏰ Scheduler     🟢 200   15s    |
    |  ID: exec_8827...     (Auto-maintenance)   (System)                         |
    |                                                                             |
    |  Yesterday, 23:11     Weekly Report Gen    🤖 Analyst Bot   🟡 408   30s+   |
    |  ID: exec_8810...     (Task #123)          (System)         Timeout         |
    |                                                                             |
    +-----------------------------------------------------------------------------+
    
    ```
    
    **Kliknięcie w wiersz** otwiera "Drawer" (panel boczny) ze szczegółami:
    
    - **Request Payload:** Co dokładnie wysłaliśmy do n8n?
    - **Response Body:** Co n8n odpowiedział (błąd stack trace)?
    - **Context:** W ramach jakiego Workspace/Projektu to uruchomiono?
    
    ---
    
    ## 3. Empty State (Pierwsze uruchomienie)
    
    **Cel:** Edukacja użytkownika. Axon bez automatyzacji jest tylko notatnikiem. Musimy zachęcić do podpięcia n8n.
    
    ```
    +-----------------------------------------------------------------------------+
    | Settings > Automations                                                      |
    +-----------------------------------------------------------------------------+
    |                                                                             |
    |  [ DEFINITIONS ]    [ Execution Logs ]                                      |
    |                                                                             |
    |           +-----------------------------------------------------+           |
    |           |                 ⚡                                  |           |
    |           |         No Automations Defined Yet                  |           |
    |           |                                                     |           |
    |           |   Automations are the "Hands" of your System.       |           |
    |           |   Connect n8n workflows to let Agents execute       |           |
    |           |   real-world tasks.                                 |           |
    |           |                                                     |           |
    |           |   [ + Create First Automation ]                     |           |
    |           |                                                     |           |
    |           |   [📚 Read Documentation: Connecting n8n]           |           |
    |           +-----------------------------------------------------+           |
    |                                                                             |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ---
    
    ## 4. Delete Confirmation (Safety Check)
    
    O tym często się zapomina w projektach, a w systemach opartych o ID (jak bazy wektorowe) usunięcie rekordu jest destrukcyjne.
    
    Jeśli użytkownik spróbuje usunąć automatyzację z widoku listy:
    
    ```
    +-----------------------------------------------------------------------+
    | 🗑️ Delete "Invoice OCR"?                                              |
    +-----------------------------------------------------------------------+
    |  This action cannot be undone.                                        |
    |                                                                       |
    |  Are you sure you want to remove this automation?                     |
    |  The Semantic Index will be updated immediately.                      |
    |                                                                       |
    |  [ Cancel ]                                       [ Yes, Delete ]     |
    +-----------------------------------------------------------------------+
    
    ```
    
    ### Podsumowanie UX
    
    Mamy teraz kompletny ekosystem modułu:
    
    1. **Overview:** Zarządzanie i monitoring statusu indeksacji.
    2. **Logs:** Debugowanie historii (niezależne od logów n8n, bo widzimy to z perspektywy Axona).
    3. **Edit Modal:** Konfiguracja techniczna i semantyczna.
    4. **Simulate:** Testowanie.
    
    To zamyka temat **Automations** od strony UI/UX. Możemy śmiało implementować.
    
    ## Modals
    
    Oto kompletny zestaw widoków dla modułu **Settings > Automations**.
    
    Skupiamy się na głównym oknie edycji (Modalu), które jest sercem tego modułu, oraz na mniejszych stanach pomocniczych (Import, Usuwanie).
    
    Wszystkie widoki są zgodne z filozofią **Split Layout** oraz przygotowane pod **indeksowanie w bazie wektorowej** (zaznaczone sekcje semantyczne).
    
    ---
    
    ## 1. Główny Modal: Kreator Automatyzacji (Create / Edit)
    
    To tutaj użytkownik definiuje "niebieski druk" (blueprint) dla procesu.
    
    - **Cel:** Połączenie definicji technicznej (Webhook) z opisem semantycznym (dla AI) i interfejsem użytkownika (Formularz).
    - **Układ:** Split Layout (Left: Config, Right: Simulator).
    
    ```
    +-----------------------------------------------------------------------------+
    | [⚡] EDYCJA AUTOMATYZACJI: "Generate Report PDF"                             |
    +-----------------------------------------------------------------------------+
    |                                                                             |
    |  LEWA KOLUMNA (KONFIGURACJA BLUEPRINTU)   PRAWA KOLUMNA (SYMULATOR / TEST)  |
    |  ---------------------------------------  --------------------------------  |
    |  1. AI SEMANTICS (DO INDEKSOWANIA)        [🧪] Live Playground              |
    |  Te dane pozwolą Agentowi Architektowi    Testuj bez opuszczania Axona.     |
    |  zrozumieć i użyć tego klocka.                                              |
    |                                           Środowisko:                       |
    |  Nazwa (Human Readable):                  [ (●) TEST ]  [ PROD ]            |
    |  [ Generate Report PDF              ]     --------------------------------  |
    |                                           PODGLĄD FORMULARZA (INPUTS):      |
    |  Unikalny Klucz (System ID):              *Tak to zobaczy User lub Agent*   |
    |  [ auto_gen_report_v1               ]                                       |
    |                                           Report Type:                      |
    |  Opis (Dla Vector Search):                [ Summary ▾              ]        |
    |  [ Przyjmuje dane JSON, generuje doku- ]                                    |
    |  [ ment PDF via n8n i zwraca link do   ]  Target Emails:                    |
    |  [ publicznego zasobu.                 ]  [ zarzad@firma.pl        ]        |
    |                                                                             |
    |  Tagi: [ #reporting ] [ #pdf ]            Include Charts:                   |
    |                                           [x]                               |
    |  ---------------------------------------                                    |
    |  2. CONNECTION (DRIVER)                   --------------------------------  |
    |  Gdzie Axon ma wysłać request?            [ ▶ URUCHOM TEST (POST) ]         |
    |                                           --------------------------------  |
    |  Metoda: [ POST ▾ ]                       KONSOLA WYNIKÓW:                  |
    |                                                                             |
    |  Test URL (Sandbox):                      Status: 🟢 200 OK (0.8s)          |
    |  [ <https://n8n>.../webhook-test/... ]                                        |
    |                                           Response Body:                    |
    |  Prod URL (Live):                         {                                 |
    |  [ <https://n8n>.../webhook/...      ]        "status": "success",            |
    |                                             "url": "<https://cdn>.../x.pdf",  |
    |  Auth Headers: [ + Dodaj ]                  "generated_at": "2024-01-..."   |
    |                                           }                                 |
    |  ---------------------------------------                                    |
    |  3. INTERFACE (INPUT FIELDS)                                                |
    |  Zdefiniuj parametry wejściowe.                                             |
    |                                                                             |
    |  [ 🪄 Import z JSON ] [ + Dodaj Pole ]                                      |
    |                                                                             |
    |  | Etykieta (Label) | Klucz (Key)    | Typ       | Wymagane? | Akcje |    |
    |  |------------------|----------------|-----------|-----------|-------|    |
    |  | Report Type      | type           | [Select ▾]|    [x]    | [🗑️] |    |
    |  | Target Emails    | emails         | [Text   ▾]|    [x]    | [🗑️] |    |
    |  | Include Charts   | with_charts    | [Bool   ▾]|    [ ]    | [🗑️] |    |
    |                                                                             |
    |  [x] Doklej kontekst systemowy (User ID, Workspace ID)                      |
    |                                                                             |
    +-----------------------------------------------------------------------------+
    | [ Anuluj ]                                       [ Zapisz i Indeksuj ⚡ ]  |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ### Logika przycisku "Zapisz i Indeksuj":
    
    1. Walidacja pól (czy URL są poprawne).
    2. Zapis do bazy SQL (`automations`).
    3. Trigger `Background Task`:
        - Pobiera Nazwę, Opis, Tagi i definicję Inputów.
        - Generuje Embedding.
        - Zapisuje w tabeli `system_embeddings`.
    
    ---
    
    ## 2. Modal Pomocniczy: Import z JSON (Magic Wand)
    
    Pojawia się po kliknięciu `[ 🪄 Import z JSON ]` w sekcji 3. Służy do błyskawicznego tworzenia pól formularza na podstawie przykładowego payloadu z n8n.
    
    ```
    +-----------------------------------------------------------------------+
    | 🪄 Importuj Strukturę Danych (Magic Input)                            |
    +-----------------------------------------------------------------------+
    |                                                                       |
    |  Wklej przykładowy JSON (Input Body), którego oczekuje Twój           |
    |  workflow w n8n. Axon automatycznie wykryje typy pól.                 |
    |                                                                       |
    |  INPUT JSON:                                                          |
    |  +-----------------------------------------------------------------+  |
    |  | {                                                               |  |
    |  |   "invoice_id": "FV/2024/01/99",                                |  |
    |  |   "amount": 1250.00,                                            |  |
    |  |   "is_paid": false,                                             |  |
    |  |   "category": "marketing"                                       |  |
    |  | }                                                               |  |
    |  +-----------------------------------------------------------------+  |
    |                                                                       |
    |  WYKRYTE POLA:                                                        |
    |  [x] invoice_id (Text)                                                |
    |  [x] amount (Number)                                                  |
    |  [x] is_paid (Boolean)                                                |
    |  [x] category (Text)                                                  |
    |                                                                       |
    +-----------------------------------------------------------------------+
    | [ Anuluj ]                                         [ Generuj Pola ]   |
    +-----------------------------------------------------------------------+
    
    ```
    
    ---
    
    ## 3. Modal Pomocniczy: Ustawienia Pola (Field Detail)
    
    Pojawia się po dodaniu nowego pola lub edycji istniejącego w tabeli Interface. Pozwala na precyzyjną konfigurację (np. opcje dla Listy Rozwijanej).
    
    ```
    +-----------------------------------------------------------------------+
    | ⚙️ Konfiguracja Pola: "Report Type"                                   |
    +-----------------------------------------------------------------------+
    |                                                                       |
    |  Etykieta (Label):       Klucz JSON (Key):                            |
    |  [ Report Type    ]      [ type           ]                           |
    |  *Widoczna dla ludzi*    *Wysyłana do n8n*                            |
    |                                                                       |
    |  Typ Danych:                                                          |
    |  [ Select (Dropdown) ▾ ]                                              |
    |                                                                       |
    |  Opcje (oddziel przecinkami):                                         |
    |  [ Summary, Detailed, Raw Data           ]                            |
    |                                                                       |
    |  Domyślna Wartość:       Pomoc (Placeholder):                         |
    |  [ Summary        ]      [ Wybierz rodzaj raportu... ]                |
    |                                                                       |
    |  [x] Pole Wymagane                                                    |
    |                                                                       |
    +-----------------------------------------------------------------------+
    | [ Usuń ]                                            [ Zatwierdź ]     |
    +-----------------------------------------------------------------------+
    
    ```
    
    ---
    
    ## 4. Modal: Potwierdzenie Usunięcia (Delete Hazard)
    
    Musimy ostrzec użytkownika, że usunięcie automatyzacji usunie ją też z indeksu wektorowego, przez co Agent przestanie ją "widzieć".
    
    ```
    +-----------------------------------------------------------------------+
    | ⚠️ Usunąć Automatyzację?                                              |
    +-----------------------------------------------------------------------+
    |                                                                       |
    |  Czy na pewno chcesz usunąć "Generate Report PDF"?                    |
    |                                                                       |
    |  Konsekwencje:                                                        |
    |  1. Usunięcie definicji z bazy danych.                                |
    |  2. Usunięcie wektora z Pamięci Systemowej (Agent zapomni skill).     |
    |  3. Procesy w "Space" używające tego klocka przestaną działać.        |
    |                                                                       |
    |  Aby potwierdzić, wpisz nazwę automatyzacji:                          |
    |  [ Generate Report PDF              ]                                 |
    |                                                                       |
    +-----------------------------------------------------------------------+
    | [ Anuluj ]                                    [ Usuń Bezpowrotnie ]   |
    +-----------------------------------------------------------------------+
    
    ```
    
    To kompletny zestaw. Pozwala on na pełny cykl życia automatyzacji (CRUD) z uwzględnieniem specyficznych potrzeb Twojej architektury (RAG + n8n).
    
- Plan Implementacji
    
    ---
    
    # 📅 Faza 1: Backend Foundation (Baza Danych i Modele)
    
    **Cel:** Przygotowanie struktur danych pod przechowywanie definicji oraz logów wykonania.
    
    ### 1.1. Migracje Bazy Danych (SQLAlchemy + Alembic)
    
    Stworzenie tabel w schemacie `settings` lub `core`.
    
    - **Tabela `automations`:**
        - `id` (UUID), `name`, `description` (Text), `tags` (Array/JSONB).
        - `method` (POST/GET), `prod_url`, `test_url`, `auth_headers` (Encrypted/JSONB).
        - `input_schema` (JSONB) – definicja pól formularza.
        - `is_active` (Bool).
    - **Tabela `automation_executions` (Logs):**
        - `id` (UUID), `automation_id` (FK), `triggered_by` (User/System ID).
        - `status_code` (Int), `duration_ms` (Int).
        - `request_payload` (JSONB), `response_body` (JSONB).
        - `created_at` (Timestamp).
    - **Tabela `system_embeddings` (Centralny Indeks):**
        - `entity_id` (UUID), `entity_type` (String - 'automation').
        - `embedding` (Vector 1536 - pgvector).
        - `metadata` (JSONB - cache nazwy/opisu).
    
    ### 1.2. Modele Domenowe (Pydantic DTOs)
    
    - `AutomationCreateDTO`: Walidacja URL-i, struktura pól input.
    - `AutomationResponseDTO`: Pełny obiekt z ID.
    - `ExecutionResultDTO`: Wynik testu (status, body, czas).
    
    ---
    
    # 🧠 Faza 2: Vector Engine (Operational RAG)
    
    **Cel:** Implementacja "Samoświadomości Systemu". Agent musi widzieć te automatyzacje.
    
    ### 2.1. Protokół `SearchableEntity`
    
    Zdefiniowanie interfejsu w `app/domain/interfaces/searchable.py`.
    
    - Metoda `get_search_payload()`: Konkatenacja Nazwy, Opisu, Tagów i nazw pól Input.
    
    ### 2.2. Serwis Indeksujący (`IndexingService`)
    
    - Implementacja logiki w `app/services/indexing.py`.
    - Integracja z `LangChain` / `OpenAIEmbeddings`.
    - Funkcja `upsert_embedding(entity)`: Generuje wektor -> Zapisuje do `system_embeddings`.
    
    ### 2.3. Asynchroniczność (Background Tasks)
    
    - Wpięcie serwisu w endpointy `Create/Update/Delete`.
    - Użycie `FastAPI.BackgroundTasks`, aby nie blokować zapisu w UI.
    
    ---
    
    # ⚙️ Faza 3: Backend Logic (API & Execution)
    
    **Cel:** Logika CRUD oraz silnik wykonawczy (Proxy do n8n).
    
    ### 3.1. CRUD Endpoints (`/api/v1/automations`)
    
    - `GET /`: Lista z paginacją i filtrowaniem.
    - `POST /`: Tworzenie + Trigger indeksowania.
    - `PUT /{id}`: Edycja + Re-indeksowanie.
    - `DELETE /{id}`: Usuwanie rekordu SQL + Usuwanie wektora.
    
    ### 3.2. Endpoint Wykonawczy (`POST /{id}/execute`)
    
    To serce modułu "Runner".
    
    1. Pobiera definicję automatyzacji.
    2. Wybiera URL (Test vs Prod) na podstawie flagi w requeście.
    3. Dokleja `Context Injection` (user_id, workspace_id).
    4. Wysyła request do n8n (używając `httpx` async client).
    5. Mierzy czas i zapisuje wynik w `automation_executions`.
    6. Zwraca odpowiedź do Frontend'u.
    
    ---
    
    # 🖥️ Faza 4: Frontend (UI/UX - React)
    
    **Cel:** Implementacja widoków zaprojektowanych w ASCII.
    
    ### 4.1. Komponenty Współdzielone (UI Kit)
    
    - `SplitLayout`: Kontener 8/4 kolumn.
    - `StatusBadge`: (Green/Red/Yellow).
    - `MethodBadge`: (POST/GET).
    
    ### 4.2. Widok Listy (Overview)
    
    - Tabela z kolumnami: Nazwa, Metoda, Status Indexu `[🧠]`, Akcje.
    - Logika pobierania danych z API (React Query).
    
    ### 4.3. Modal Edycji (The Heart)
    
    - **State Management:** `useForm` (React Hook Form) do trzymania całego stanu konfiguracji.
    - **Lewa Kolumna (Config):**
        - Formularz Identity.
        - Sekcja "Field Builder" (Dynamiczna lista inputów: Label, Key, Type).
        - "Magic Wand": Funkcja parsująca wklejony JSON na strukturę Field Buildera.
    - **Prawa Kolumna (Simulator):**
        - Komponent `DynamicFormRenderer`: Renderuje inputy na podstawie stanu z Lewej Kolumny.
        - Obsługa przycisku "Run Test": Strzał do Axon API -> n8n.
        - Wyświetlanie wyniku w konsoli (JSON syntax highlight).
    
    ### 4.4. Widok Logów (History)
    
    - Tabela `Execution Logs` z filtrowaniem po statusie i dacie.
    - Drawer (panel boczny) ze szczegółami request/response.
    
    ---
    
    # 🔗 Faza 5: Integration & Polish
    
    **Cel:** Spięcie wszystkiego w całość.
    
    ### 5.1. Seed Data
    
    - Dodanie skryptu tworzącego pierwszą, przykładową automatyzację (np. "Echo Test"), aby baza nie była pusta.
    
    ### 5.2. Error Handling
    
    - Obsługa sytuacji, gdy n8n nie odpowiada (Timeout).
    - Obsługa błędów walidacji.
    
    ### 5.3. Testy
    
    - **Backend:** Unit testy dla `IndexingService` (mockowanie OpenAI).
    - **Backend:** Integration testy dla CRUD (baza testowa).
    - **E2E:** Przejście ścieżki: Utwórz -> Zdefiniuj Pola -> Uruchom Symulację.
    
    ---
    
    # ⏱️ Estymacja Czasowa (Sugerowana)
    
    | Zadanie | Czas (Senior Dev) |
    | --- | --- |
    | **Backend Models & Migrations** | 1 dzień |
    | **Vector Indexing & Service** | 1-2 dni |
    | **Backend API & Runner Logic** | 2 dni |
    | **Frontend: List & Logs** | 1 dzień |
    | **Frontend: Edit Modal & Simulator** | 3-4 dni |
    | **Testing & Refinement** | 1-2 dni |
    | **RAZEM** | **ok. 2 Tygodnie (Sprint)** |
    
    Plan jest gotowy do wrzucenia do backlogu (Jira/Linear). Możemy zaczynać od backendu.
    
- Plan Implementacji Status