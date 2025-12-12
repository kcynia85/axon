# 🏗️ ARD (Architecture Requirements Document)
**Produkt:** RAGAS — AI Command Center  
**Wzorzec:** Domain-Driven Design (DDD) + Google ADK Native Architecture (Modular Monolith)

## 1. Konteksty Domenowe (Bounded Contexts)
System podzielony jest na autonomiczne moduły biznesowe (Huby), odzwierciedlające strukturę pracy agencji:

1.  **Kernel / Meta Hub:** Zarządzanie systemem, użytkownikami i orkiestracją.
2.  **Product Management Hub:** Wizja, Roadmapy, OKR.
3.  **Discovery Hub:** Research, Data Analysis.
4.  **Design Hub:** UX/UI, Prototyping.
5.  **Delivery Hub:** Coding, QA, Architecture.
6.  **Growth & Market Hub:** Marketing, CRO, Analytics.
7.  **Writing Hub:** Copywriting, Content.
8.  **Gamification Context:** Streaks, XP, Avatar, Skill Maps.

## 2. Architektura Warstwowa (Backend - Python)

### 2.1. API Layer (Interface)
*   **Technologia:** FastAPI.
*   **Rola:** **Backend for Frontend (BFF) Pattern** via Next.js Route Handlers. Proxy to Python Core.
*   **Streaming:** **Server-Sent Events (SSE)** obsługiwane bezpośrednio przez połączenie Client -> Cloud Run (omijając Vercel Proxy/Next.js Backend, aby uniknąć timeoutów).
*   **Endpointy:** Mapowane na Use Cases (np. `POST /api/agents/generate`, `GET /api/projects/{id}`).

### 2.2. Application Layer (Orkiestracja ADK)
*   **Agent Factory:** Serwis odpowiedzialny za inicjalizację obiektów `GenerativeModel` z biblioteki `google-generativeai`. Wstrzykuje odpowiednie `System Instructions` oraz konfigurację narzędzi (`Tools`) w zależności od wybranej roli.
*   **Session Manager:** Zarządza stanem rozmowy (obiekt `ChatSession` z Google SDK), historią oraz kontekstem.
*   **Router Logic:** Logika decyzyjna (Router), która na podstawie inputu kieruje żądanie do odpowiedniego Agenta (Manager, Researcher lub Builder).

### 2.3. Domain Layer (Core Business Logic)
*   Warstwa czysta, niezależna od frameworków AI.
*   **Modele:** Entities (Project, Task), Value Objects (SkillLevel).
*   **Logika:** Reguły biznesowe (np. zasady przyznawania punktów doświadczenia, walidacja statusów projektu).

### 2.4. Infrastructure Layer (Adaptery & Tools)
*   **ADK Gateway:** Główny wrapper na `google.generativeai`.
*   **Semantic Cache:** Warstwa oszczędnościowa (Redis/Vector). Przed zapytaniem LLM sprawdzamy, czy podobne pytanie (cos sim > 0.95) nie padło wcześniej. Redukuje koszty i latencję dla powtarzalnych zapytań.
*   **Native Tools (Function Calling):** Funkcje Python udekorowane jako narzędzia dla Gemini.
    *   `rag_tools.py`: Wyszukiwanie w Supabase Vector (`query_vector_db`).
*   **Embedding Service:** Wrapper na `genai.embed_content` (obsługa modelu `text-embedding-004`). Standardowa wymiarowość (768) dla uproszczenia MVP.
*   **Persistence:** Repozytoria SQL (Supabase) i Vector (Supabase pgvector).
    *   **Hybrid Search Optimization:** Użycie kolumn `JSONB` z indeksem `GIN` do przechowywania i przeszukiwania metadanych niestrukturalnych.
    *   **Vector Client:** Biblioteka **`vecs`** (Python) do zarządzania kolekcjami w pgvector.
    *   **Soft Delete:** Wszystkie kluczowe encje (Projekty, Zadania) muszą implementować mechanizm logicznego usuwania (`deleted_at`), aby zapobiec przypadkowej utracie danych.
    *   **Multi-Tenancy:** Wymuszone Row Level Security (RLS) na poziomie bazy danych dla pełnej izolacji danych użytkowników.
*   **Workflow Engine (Durable Execution):** **Inngest** (Serverless) do obsługi długotrwałych procesów agentowych, retry policies i odporności na timeouty.
*   **Object Storage:** Abstrakcja nad systemem plików.
    *   **Local/Dev:** MinIO (S3-compatible).
    *   **Cloud/Prod:** Cloudflare R2 (brak opłat za egress).

### 2.5. Data Strategy (JSONB + GIN Implementation)
Wykorzystanie PostgreSQL jako "Document Store" dla danych o zmiennej strukturze, z indeksem GIN dla wydajnego wyszukiwania.

1.  **RAG Metadata:** Przechowywanie atrybutów wektorów (tagi, autor, typ źródła `pdf/memo`, hub `design`). GIN umożliwia filtrowanie: `WHERE metadata @> '{"hub": "design"}'`.
2.  **Agent Configs:** Dynamiczne konfiguracje ról (system instructions, toolset, model tier). Pozwala na wersjonowanie i "Hot-Swap" zachowania agenta bez migracji schematu.
3.  **Conversation States:** Historia czatu, tokeny pamięci i tool calls w jednym dokumencie. Ułatwia audyt i odtwarzanie kontekstu ("Time Travel").
4.  **Dynamic Workflows:** Definicje kroków, parametrów i warunków dla modułu Automation. GIN pozwala wyszukiwać workflowy używające konkretnego narzędzia.
5.  **Prompts Library:** Wersjonowanie promptów z metadanymi (typ, domena, tagi). Szybkie filtrowanie w bibliotece.
6.  **One-Click Tasks:** Konfiguracja gotowych zadań (wymagane inputy, opis).
7.  **Telemetry & Audit:** Logi działania agenta (użyte modele, fallbacki). GIN pozwala filtrować np. `WHERE log @> '{"fallback_used": true}'` do analizy kosztów i błędów.

## 3. Kluczowe Komponenty Architektoniczne (Google ADK Specific)

### 3.1. Agent Definitions (System Instructions) - Alpha
W fazie MVP (Alpha) ograniczamy system do 3 wyspecjalizowanych instancji modelu:
1.  **Manager:** Decyduje "co robimy" i deleguje zadania.
2.  **Researcher:** Przeszukuje wiedzę, analizuje dane.
3.  **Builder:** Generuje kod, struktury plików, specyfikacje.

Reszta ról (z `domains.md`) zostaje w Backlogu do późniejszego wdrożenia jako specjalizacje.

### 3.2. Hybrid RAG Strategy (Context Injection + Tools)
Zamiast polegać wyłącznie na decyzji modelu (Tool-use), stosujemy podejście hybrydowe dla większej niezawodności w MVP.
*   **Explicit Context Injection:** Kluczowe informacje (Aktualny Projekt, Ostatnie Decyzje PDR, Fakty z Memory) są **zawsze** pobierane i wstrzykiwane do System Promptu przed rozpoczęciem rozmowy.
*   **Tool-based Retrieval:** Narzędzie `search_knowledge_base` jest dostępne dla modelu do dopytania o szczegóły ("Deep Dive"), których nie ma w kontekście podręcznym.

### 3.3. Pętla Wykonawcza (Execution Loop)
Aplikacja implementuje pętlę obsługi Function Calling (opartą na pętli while/generatorze):
1.  Model zwraca żądanie wywołania funkcji.
2.  Backend wykonuje funkcję (np. pobiera dane z bazy).
3.  Backend zwraca wynik do modelu.
4.  Model generuje finalną odpowiedź dla użytkownika (streamowaną przez SSE).

### 3.4. Grounding & Citations Engine
Mechanizm weryfikowalności odpowiedzi (Trustworthy AI).
*   **Source Attribution:** Każdy fragment wiedzy pochodzący z RAG (`search_knowledge_base`) lub Pamięci (`get_memory`) musi zostać oznaczony w odpowiedzi modelu.
*   **Format:** Model jest instruowany, aby stosować format cytowań inline (np. `...według NN Group [1]`).
*   **Metadata Injection:** Backend dołącza metadane źródeł (tytuł pliku, fragment tekstu, link) do payloadu odpowiedzi, co pozwala Frontendowi na wyświetlenie dymków (tooltips) lub panelu źródeł ("Sources used in this response").

### 3.5. Model Assignment Matrix (AI Tiering)
Strategia doboru modelu do roli w celu optymalizacji stosunku Quality/Cost/Latency.

| Tier | Model | Zastosowanie | Przykładowe Role |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Supreme)** | **Gemini 3 Pro** | Najwyższa zdolność rozumowania, planowanie strategiczne, rozwiązywanie konfliktów. | `Boss Architect`, `Product Manager` |
| **Tier 2 (Expert)** | **Gemini 2.5 Pro** | Zadania specjalistyczne, kodowanie, analiza deep-dive, multimodalność. | `Senior Developer`, `UX Researcher`, `UI Designer` |
| **Tier 3 (Fast)** | **Gemini 2.0 Flash** | Szybkie zadania operacyjne, proste transformacje tekstu, niskie opóźnienia. | `QA Tester`, `Content Editor`, `SEO Checker` |

## 4. Przepływ Danych (Data Flow)
**Scenariusz:** Użytkownik prosi o audyt strony.
1.  **Frontend:** Wysyła prompt do `/api/chat`.
2.  **App Layer:** Router (Manager) identyfikuje intencję -> Przekazuje do `Researcher` (Gemini Pro).
3.  **Agent (Gemini):** Analizuje prompt, decyduje o użyciu narzędzia `fetch_url_content`.
4.  **Infra Layer:** Wykonuje scraping/pobranie treści. Zwraca tekst do Agenta.
5.  **Agent:** Analizuje treść, następnie decyduje o użyciu `search_knowledge_base` (kolekcja Design) w poszukiwaniu heurystyk.
6. **Infra Layer (Supabase Vector):** Zwraca pasujące wektory (Heurystyki Nielsena).
7.  **Agent:** Generuje audyt w oparciu o pobraną treść i wiedzę z bazy.
8.  **Frontend:** Wyświetla wynik strumieniowo (SSE) w AI Inbox.

## 5. Warstwa AI-Orchestration

### 5.1. Security Guard Layer
Pierwsza linia obrony (Defense in Depth).
*   **Regex / Keyword Filter:** Blokowanie prób Prompt Injection i Jailbreakingu na poziomie wzorców tekstowych (przed wysłaniem do drogiego modelu).
*   **Sanityzacja:** Oczyszczanie inputu z potencjalnie niebezpiecznych znaczników.

### 5.2. Agent Selector (Router)
- **Input:** Zadanie użytkownika + Kontekst Projektu.
- **Logic:** Klasyfikacja intencji (np. "To zadanie badawcze").
- **Output:** Inicjalizacja Agenta: Manager / Researcher / Builder.

### 5.3. RAG Engine
- **Embeddings:** Google Gemini (`text-embedding-004`).
- **Vector Store:** **Supabase Vector** (pgvector).
- **Retrieval:** Hybrid Search (Słowa kluczowe + Wektory).
- **Metadata Filtering:** Każdy wektor musi zawierać bogate metadane (source_type, date, author, tags, hub_id) umożliwiające precyzyjne filtrowanie kontekstu przed wyszukiwaniem semantycznym (Pre-filtering).

### 5.4. Prompt Manager
- **Templates:** Pliki `.md` z instrukcjami dla 3 ról Alpha.
- **Dynamic Context:** Wstrzykiwanie danych projektu do promptu systemowego.

### 5.5. Context Composer (Middleware)
- **Funkcja:** Implementacja "Context Sandwich" (Instrukcja -> Dane -> Przypomnienie).
- **Kompresja:** Skracanie historii czatu przed wysłaniem do modelu (Token Efficiency).

### 5.6. Workflow Engine
- Obsługa interakcji Chat (SSE Streaming).
- Obsługa formularzy (Structured Output).
- Automatyczne generowanie artefaktów (Pliki, Taski) do AI Inbox.

### 5.7. QA & Evals Strategy
Strategia testowania systemów niedeterministycznych ("Testing Trophy").
*   **Deterministic Tests:** Unit testy logiki (Router, Parsery) uruchamiane przy każdym commicie. Wymagane użycie **VCR / Replay** do mockowania API Gemini (zero kosztów w CI/CD).
*   **LLM-as-a-Judge:** Automatyczna ocena jakości odpowiedzi (Faithfulness, Relevancy) przy użyciu silniejszego modelu (Tier 1) jako sędziego.
*   **Shadow Mode:** Testowanie nowych promptów na produkcji (dla admina) równolegle ze starymi.

### 5.8. Security Guardrails (Tainted Data Pattern)

*   **Tainted Data Concept:** Każdy output z LLM jest traktowany jako "niezaufany" (tainted) domyślnie.

*   **Frontend Sanitization:** Wymuszona sanityzacja HTML (DOMPurify) przed renderowaniem jakiegokolwiek contentu generowanego przez AI.

*   **Backend Validation:** Walidacja strukturalna (Zod) dla wszystkich odpowiedzi JSON. W przypadku błędu walidacji, system uruchamia procedurę "Self-Correction" (ponowne zapytanie do modelu z informacją o błędzie).



### 5.9. Data Integrity & Cost Management

*   **Data Lineage (Citations):** Każdy wygenerowany fakt musi posiadać metadane źródłowe (`source_url`, `chunk_index`). Backend przechowuje te metadane w odpowiedzi API, a frontend wyświetla je jako przypisy.

*   **Token Bucket Rate Limiting:** Ochrona przed nadmiernym zużyciem kosztów API. Limitowanie na poziomie tokenów (TPM - Tokens Per Minute), a nie tylko requestów (RPM). Estymacja kosztu zapytania (`tiktoken`) przed wysłaniem do LLM.

### 5.9. Data Integrity & Cost Management
*   **Data Lineage (Citations):** Każdy wygenerowany fakt musi posiadać metadane źródłowe (`source_url`, `chunk_index`). Backend przechowuje te metadane w odpowiedzi API, a frontend wyświetla je jako przypisy.
*   **Token Bucket Rate Limiting:** Ochrona przed nadmiernym zużyciem kosztów API. Limitowanie na poziomie tokenów (TPM - Tokens Per Minute), a nie tylko requestów (RPM). Estymacja kosztu zapytania (`tiktoken`) przed wysłaniem do LLM.

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
Implementacja zasad **Perceived Performance** w celu maskowania latencji AI:

1.  **Skeleton Screens:** Zamiast spinnerów, UI natychmiast wyświetla szkielet struktury (Skeleton UI), dając poczucie, że "layout już jest, dane zaraz będą".
2.  **Optimistic UI:** Wprowadzanie zmian w interfejsie natychmiast po akcji użytkownika, jeszcze przed potwierdzeniem z serwera (zakładając sukces operacji).
3.  **Instant Rendering:** Wykorzystanie SSR i streamingu (Next.js), aby krytyczny layout renderował się w pierwszej kolejności.
4.  **Critical Rendering Path:** Minimalizacja zasobów blokujących (fonty, CSS, JS) dla First Contentful Paint.
5.  **Fast/Slow Path Backend:** Rozdzielenie szybkich operacji (np. zapisanie promptu) od wolnych (generowanie odpowiedzi LLM).
6.  **API Loading Events:** Backend emituje eventy o zmianie stanu (np. "Thinking...", "Searching docs...", "Generating code..."), które Frontend natychmiast wizualizuje.
7.  **Scoped View Transitions:** Płynne łączenie stanów UI (View Transitions API), aby zmiany kontekstu były postrzegane jako ciągłe i natychmiastowe.

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