# 📘 TECH-PRD (Technical Product Requirements Document)
**Produkt:** RAGAS — AI Command Center for One-Man Agency

## 1. Wstęp i Cel Produktu
RAGAS to webowe centrum dowodzenia dla jednoosobowej agencji (skalowalne do 1–3 osób), integrujące 6 domen: Product Management, Discovery, Design, Delivery, Growth, Writing.
System eliminuje chaos, centralizując pracę w dashboardzie wspieranym przez 16 agentów AI. System opiera się na architekturze "All-in-one" z wykorzystaniem ekosystemu Google (ADK) oraz Supabase (SQL + Vector).

## 2. Grupa Docelowa
*   **MVP:** Freelancer "One-Man Army" / Solopreneur.
*   **Post-MVP:** Małe agencje (1–3 osoby).

## 3. Zakres Funkcjonalny (Core Features)

### 3.1. Dashboard
*   **Minimalistyczny UI:** Styl "Notion-like".

### 3.2. Warstwa Agentowa (ADK Core + Fallback Resilience)
*   **Orkiestracja:** Głównym silnikiem (Mózgiem) pozostaje **Google GenAI SDK** (ADK) w Pythonie.
*   **Resilience (Model Agnostic Fallback):** System posiada mechanizm **Fallback**, który w przypadku niedostępności lub przeciążenia API Gemini (Rate Limits/Downtime), automatycznie przekierowuje zapytania do modeli awaryjnych (np. OpenAI GPT-4o, Anthropic Claude) poprzez adaptery.
*   **Agenci (Role):** Docelowo 16 instancji.
    *   **Faza Alpha/MVP:** System ograniczony do 3 kluczowych ról: **Manager, Researcher, Builder**.
*   **Interakcja:** Chat (streaming) + Formularze (Structured Output).

### 3.3. Wiedza i RAG (Tool-based)
*   **Model RAG:** Agenci korzystają z wiedzy poprzez **Narzędzia (Tools)**. Model sam decyduje, kiedy przeszukać bazę (`search_knowledge_base`).
*   **Baza Wektorowa:** **Supabase Vector** (Postgres + pgvector).
*   **Zarządzanie Wektorami (Biblioteka):** **`vecs`** (oficjalny klient Python dla Supabase pgvector).
*   **Embeddings:** Domyślnie Google Gemini Embeddings, z możliwością konfiguracji innych modeli.
*   **Struktura Danych:** Kolekcje wektorowe per Hub domenowy.
*   **Rich Metadata Strategy:** Embeddingi muszą być wzbogacone o metadane (tagi, daty, autor, typ źródła), co pozwala na precyzyjne "scoping" wyszukiwania (np. "szukaj tylko w pdfach z 2024 roku").
*   **Grounding Attribution:** Interfejs użytkownika musi wyświetlać cytowania i źródła (inline citations) dla fragmentów wiedzy pochodzących z RAG (np. `[1]`, `[Memory]`), aby zapewnić weryfikowalność (Trustworthy AI).

### 3.4. Zarządzanie Projektami
*   Struktura projektów zgodna z DDD (Entities/Aggregates).
*   Agenci mają dostęp do kontekstu projektu poprzez Function Calling (`get_project_context`).
*   Statusy, pliki i zadania przechowywane w relacyjnej części Supabase.

### 3.5. Integracje (MVP)
*   **Realizacja:** Jako natywne narzędzia (Tools) dostępne dla agentów.
*   **Figma:** Pobieranie struktur i treści z plików projektowych.
*   **Notion:** Synchronizacja dokumentacji i eksport notatek.

### 3.6. Moduł Dokumentacji
*   Frontendowy widok `/docs`.
*   **Changelog:** Historia zmian generowana automatycznie z backendu.
*   **Backlog:** Lista planowanych funkcji.

### 3.7. Moduły Aplikacji (Frontend UI)
Aplikacja udostępnia następujące dedykowane widoki (zakładki):
1.  **Dashboard:** Centrum dowodzenia, statusy, gamifikacja.
2.  **Prompts:** Zarządzanie biblioteką promptów (CRUD, wersjonowanie).
3.  **Agents:** Konfiguracja agentów, edycja System Instructions, przypisywanie narzędzi.
4.  **Common Uses:** Biblioteka gotowych "One-click tasks" (np. "Wygeneruj raport SEO").
5.  **Workflows:** Kreator wielokrokowych procesów (Chain of Thought), łączących różne modele i artefakty.
6.  **LLMs:** Panel administracyjny do zarządzania kluczami API i wyborem modeli (Gemini, GPT-4, Claude).
7.  **Knowledge:** Przeglądarka bazy wiedzy (wgląd w zindeksowane chunki i kolekcje wektorowe).
8.  **Tools:** Katalog dostępnych narzędzi (Functions, MCPs, Search).
9.  **Profile:** Ustawienia użytkownika.
10. **Inbox:** Skrzynka odbiorcza na wygenerowane artefakty.

### 3.8. Generative UI Framework
Strategia renderowania interaktywnych komponentów zamiast czystego tekstu.
*   **Contract-First:** Definicja schematów Zod dla komponentów (np. `TableComponent`, `ChartComponent`) przed implementacją promptów.
*   **Protocol:** Użycie `Vercel AI SDK` (`streamUI`) do strumieniowania strukturalnych danych JSON, które frontend zamienia na React Components w czasie rzeczywistym.
*   **Validation:** Każdy komponent jest walidowany przez Zod przed renderowaniem, aby uniknąć błędów w UI ("White Screen of Death").

## 4. Wymagania Techniczne (Tech Stack)

### 4.1. Frontend
*   **Framework:** Next.js 14/15 (App Router).
*   **Styling:** Tailwind CSS + Shadcn/UI.
*   **Komunikacja:** REST API + WebSockets (opcjonalnie do streamingu).
*   **Rendering Strategy:** **Streaming SSR** (Suspense) dla natychmiastowego ładowania szkieletu aplikacji.
*   **BFF Pattern:** Wykorzystanie Next.js Route Handlers jako warstwy pośredniej (Backend for Frontend) do agregacji danych z API Pythonowego i formatowania ich pod widoki React.

### 4.2. Backend
*   **Język:** Python 3.10+.
*   **API Framework:** FastAPI.
*   **AI Core:** **Google GenAI SDK** (`google-generativeai`).
*   **Vector Client:** **`vecs`** (Python).
*   **Architektura:** **Modular Monolith + Vertical Slice Architecture**.
    *   Kod zorganizowany funkcjonalnie (per Feature), a nie technicznie (Warstwy).
    *   Każdy "Slice" (np. `CreateProject`) zawiera pełen stack: Endpoint, Command, Handler, Domain Logic.

### 4.3. Baza Danych i Auth
*   **Platforma:** **Supabase** (All-in-one).
*   **Relacyjna:** PostgreSQL (dane aplikacji).
*   **Wektorowa:** **pgvector** (wiedza i embeddings).
*   **Auth:** Supabase Auth.
*   **Storage:** **MinIO** (Localhost / Self-hosted) lub **Cloudflare R2** (Cloud) – zgodnie z ARD (Local-First Development).

### 4.4. Infrastruktura i Deployment
*   **Dev (Lokalnie):**
    *   Backend: Python (FastAPI) na `localhost:8000`.
    *   Frontend: Next.js na `localhost:3000`.
    *   Baza: Połączenie do projektu **Supabase Cloud (Dev)** (dla uproszczenia konfiguracji wektorów).
*   **Prod (Docelowo):**
    *   Frontend: Vercel.
    *   Backend: **Google Cloud Run** (Docker). Wymagane dla długotrwałych procesów agentowych i stabilnego streamingu SSE (omijając limity czasu Vercel).
    *   *   **Shadow Mode:** Testowanie nowych promptów na produkcji (dla admina) równolegle ze starymi.

### 5.8. Resilience & Durable Execution (Post-MVP)
Planowane mechanizmy dla długotrwałych procesów agentowych (powyżej 60s).
*   **Durable Workflow Engine:** Wdrożenie silnika (np. Inngest/Temporal) do zarządzania stanem agenta w sposób odporny na restarty serwera.
*   **State Persistence:** Każdy krok agenta (Plan -> Search -> Act) jest zapisywany w bazie, umożliwiając wznowienie pracy od ostatniego punktu awarii.
*   **Idempotency:** Gwarancja, że ponowienie kroku (np. wysłanie maila) nie spowoduje duplikacji akcji.

---

## 6. Struktura Katalogów i Kodu (Source Code Structure)

Architektura fizyczna projektu podzielona jest na backend (Python/ADK) oraz frontend (Next.js).

### 6.1. Backend (Python / FastAPI / Google ADK)
*Zarządzanie zależnościami: `uv`*
*Deployment: Docker (Cloud Run)*

```text
/backend
  Dockerfile             # Konfiguracja obrazu Docker (uv + python)
  uv.lock                # Zależności (uv)
  pyproject.toml         # Konfiguracja projektu
  /app
    /api                 # Kontrolery FastAPI (Endpoints)
      /routes            # Routing (chat, projects, docs)
      deps.py            # Dependency Injection
    /core
       config.py         # Zmienne środowiskowe, API Keys
       adk_client.py     # Klient google.generativeai (Singleton)
    /domain              # Czysta logika DDD (Hexagonal Core)
       /models           # Pydantic/SQLAlchemy models
       /ports            # Interfejsy (AIProvider, Repository)
       /services         # Czyste serwisy domenowe
    /infrastructure
       /supabase         # Klient Supabase (SQL + Vector)
       /adapters         # Implementacje portów (GeminiAdapter)
       /tools            # NATIVE ADK TOOLS
          rag_tools.py   # Wyszukiwanie w Supabase
    /agents              # Konfiguracja Agentów
       registry.py       # Fabryka agentów (Manager, Researcher, Builder)
       /prompts          # Pliki z System Instructions
    /services            # Warstwa Aplikacji
       session_manager.py
       router.py
       context_composer.py
       evals.py
  main.py                # Entry point
```

### 6.2. Frontend (Next.js / TypeScript)
```text
/frontend
  /app                   # Next.js App Router
    /dashboard           # Główny panel
    /prompts             # Zarządzanie promptami
    /agents              # Konfiguracja Agentów
    /common-uses         # Gotowe scenariusze
    /workflows           # Kreator procesów
    /llms                # Config modeli i kluczy API
    /knowledge           # Przeglądarka bazy wiedzy
    /tools               # Narzędzia i MCP
    /profile             # Profil użytkownika
    /chat                # Chat z AI (SSE Client)
    /inbox               # AI Inbox
    /docs                # Dokumentacja
    layout.tsx
    page.tsx
  /components            # Komponenty React (Generative UI ready)
    /ai-inbox
    /gamification
    /forms
    /ui
  /lib                   # Logika
    /api-client
    /hooks
    /types
```

### 6.3. Frontend UX Patterns & Performance Strategy
Implementacja zasad **Modern Web Architecture** w celu maskowania latencji AI:

1.  **Skeleton Loading (Anti-CLS):** Zamiast spinnerów, UI wyświetla pulsujące szkielety (szare bloki) o wymiarach docelowej treści. Zapobiega to przesunięciom układu (Cumulative Layout Shift) i daje natychmiastowe poczucie "ładowania". Kluczowe dla widoku czatu podczas "myślenia" modelu.
2.  **Optimistic UI (Zero-Latency Feel):** Dla akcji CRUD (np. "Dodaj zadanie", "Zmień status") interfejs aktualizuje się natychmiast, nie czekając na odpowiedź serwera. Request leci w tle. W razie błędu następuje automatyczny Rollback i toast z informacją.
3.  **Instant Rendering (Streaming SSR):** Wykorzystanie `<Suspense>` i React Server Components, aby krytyczny layout (Sidebar, Header) renderował się natychmiast, podczas gdy cięższe dane (np. historia czatu) są domykowane strumieniowo.
4.  **Critical Rendering Path:** Minimalizacja zasobów blokujących (fonty, CSS, JS) dla First Contentful Paint.
5.  **API Loading Events:** Wizualizacja stanów pośrednich agenta (np. "Searching knowledge base...", "Generating code...") w czasie rzeczywistym.
6.  **Scoped View Transitions:** Płynne animacje przejść między widokami, aby zmiany kontekstu (np. wejście w projekt) były postrzegane jako ciągłe.

---

## 7. Deployment

### 7.1. Lokalny (Dev)
- **Backend:** `uv run fastapi dev` (lub `docker compose up`) na `localhost:8000`.
- **Frontend:** `npm run dev` na `localhost:3000`.
- **Baza:** **Supabase Cloud** (Projekt Dev).
- **Storage:** MinIO (Docker).

### 7.2. Docelowy (Prod)
- **Frontend:** Vercel (Edge Network).
- **Backend:** **Google Cloud Run** (Docker Container).
    - *Scale-to-Zero* włączone dla optymalizacji kosztów (płacisz tylko za użycie).
    - Frontend łączy się bezpośrednio z URL Cloud Run dla SSE.
- **Baza:** **Supabase Cloud** (Projekt Prod).
- **Storage:** Cloudflare R2.

---

## 8. Architektura Informacji (IA & UX Structure)

> **Compliance:** Oparta na standardach `03. Design/C. Content & IA`.
> **Wybrany Schemat:** **Zadaniowy (Task-Based)** + **Płaski (Flat)** – dedykowany dla aplikacji SaaS/Web App (wg `Structure_Design_Kit.md`).

### 8.1. Mapa Strony (Sitemap & Navigation Tree)
Struktura zoptymalizowana pod kątem minimalizacji kliknięć ("3-Click Rule").

*   **Poziom 0: Global Navigation (Sidebar)**
    *   **`/dashboard` (Start):**
        *   Widżet: *Recent Activity* (Ostatnie pliki).
        *   Widżet: *Quick Actions* (Nowy Chat, Nowy Projekt).
    *   **`/workspace` (Centrum Operacyjne):**
        *   Selektor: *Agent Role* (Manager / Researcher / Builder).
        *   Widok: *Chat Interface* (Streaming).
        *   Widok: *Artifact Split-View* (Podgląd generowanych treści).
    *   **`/projects` (Konteksty):**
        *   Lista: *Active Projects*.
        *   Filtry: *Status* (Active, Archived), *Domain* (Design, Dev...).
    *   **`/inbox` (Outputy):**
        *   Lista: *Unreviewed Artifacts* (Pliki do akceptacji).
        *   Akcje: *Approve*, *Reject*, *Refine*.
    *   **`/brain` (Knowledge Graph - dawne Huby):**
        *   *Memories:* Asocjacyjna pamięć faktów.
        *   *Sources:* Zindeksowane dokumenty (PDF, MD).
    *   **`/settings`:**
        *   *LLM Config:* Klucze API.
        *   *Agent Config:* Prompty systemowe.

### 8.2. Modelowanie Treści (Content Model)
Definicja obiektów systemowych zgodnie z `Modelowanie Treści.md`. Format techniczny (Draft Prisma Schema) dla backendu.

```prisma
// 1. PROJECT (Agregat główny)
model Project {
  id          String      @id @default(uuid())
  name        String      // np. "Redesign Sklepu"
  domain      HubType     // np. DESIGN, DELIVERY
  status      Status      // ACTIVE, COMPLETED, ON_HOLD
  artifacts   Artifact[]  // Relacja: Projekt ma wiele plików
  memories    Memory[]    // Relacja: Projekt ma swoje fakty
}

// 2. ARTIFACT (Wynik pracy Agenta)
model Artifact {
  id          String      @id @default(uuid())
  title       String      // np. "Audit_UX.md"
  type        FileType    // MARKDOWN, CODE, JSON, IMAGE
  content     Text        // Treść właściwa
  status      ReviewState // DRAFT, REVIEWED, APPROVED
  projectId   String      // Link do projektu
  tags        Tag[]       // Fasety do filtrowania
}

// 3. MEMORY (Atom wiedzy)
model Memory {
  id          String      @id @default(uuid())
  fact        String      // np. "Klient preferuje styl minimalistyczny"
  vector      Float[]     // Embedding dla RAG
  source      String      // Skąd to wiemy? (np. "Chat ID: 123")
  confidence  Float       // 0.0 - 1.0
}
```

### 8.3. Taksonomia i System Etykiet (Labeling)
Zasady nazewnictwa oparte na `IA_Audit_Protocol.md`.

*   **Etykiety Menu:** Rzeczowniki, jednowyrazowe (Dashboard, Projekty, Mózg).
*   **Statusy Projektów (Fasety):**
    *   `Idea` (Pomysł)
    *   `In Progress` (W toku)
    *   `Review` (Do sprawdzenia)
    *   `Done` (Gotowe)
*   **Tagi Artefaktów:** Automatycznie generowane przez AI (np. `#seo`, `#ux`, `#bugfix`).

### 8.4. UX Writing & Microcopy Strategy
Zgodnie z `UX Writing Guide.md`:

*   **Voice (Głos):** "Inteligentny Partner" (Smart Companion).
*   **Tone (Ton):**
    *   *Sukces:* Precyzyjny ("Raport wygenerowany"), nie euforyczny.
    *   *Błąd:* Proaktywny ("Nie mogę połączyć się z Gemini. Przełączam na GPT-4...").
    *   *Czekanie:* Transparentny ("Analizuję 5 plików PDF...", "Generuję kod...").
*   **Zasada "Human-in-the-loop Governance":** System nie zmienia krytycznych dokumentów (PDR, PRD) "po cichu". System **proponuje** zmiany (np. "Zrozumiałem, że zmieniamy bazę danych. Czy dodać wpis do PDR?"), a użytkownik je zatwierdza jednym kliknięciem. Buduje to zaufanie i zapobiega halucynacjom.

### 8.5. Scenariusze Testowe (Navigation Testing)
Do weryfikacji drzewa (`Navigation_Testing_SOP.md`):

1.  **Zadanie Findability:** "Znajdź fakt dotyczący kolorystyki ustalonej w zeszłym tygodniu." -> Oczekiwana ścieżka: `/brain` -> Search lub `/projects/{id}` -> Context.
2.  **Zadanie Action:** "Zleć poprawkę kodu w module logowania." -> Oczekiwana ścieżka: `/workspace` -> Wybór Agenta "Builder".
3.  **Zadanie Review:** "Zatwierdź wygenerowany artykuł na bloga." -> Oczekiwana ścieżka: `/inbox`.