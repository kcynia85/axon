# ARD (Architecture Requirements Document) – vNext (Axon)
Produkt: Axon — AI Command Center
Wzorzec: DDD + Modular Monolith
Core: FastAPI (async), Next.js 16 (App Router), Supabase Postgres + pgvector (domyślnie 768‑d), Inngest, crewAI (orkiestracja) + LangChain (LLM/Retriever/VectorStore), SSE streaming

1. Bounded Contexts (Vertical Slices)
- projects, spaces (Canvas, JSONB graph, Workspace Zones visual-only), workspaces, resources/knowledge (RAG), agents, settings (LLMs + Knowledge Engine), workflows (Inngest)

2. Architecture
- API: FastAPI routers per slice; BFF via Next.js; SSE for agents (token/tool/final)
- Application: Inngest (durable runs) + crewAI (Agents/Tasks/Crew orchestracja)
- Domain: entities/value objects; soft-deletes
- Infrastructure (LangChain‑first):
    - LLM Gateway (port): domyślnie adapter LangChain (ChatGoogleGenerativeAI/OpenAI/Anthropic); opcjonalnie adapter ADK (fallback/alternatywa) – future‑proof
    - RAG: LangChain Retriever + VectorStore nad pgvector (JSONB+GIN filtry)
    - Embeddings: konfigurowalne (domyślnie 768‑d); reindeksacja przez Settings (KE)
    - Storage/Obs: MinIO/S3; Langfuse traces
- Security: JWT na routerach; Supabase RLS

3. IA alignment
- URLs per [docs/product/information_architecture/url_structure.md](docs/product/information_architecture/url_structure.md)
- Filters/search/sort per IA patterns; tabs/modals via query; anchors via #zone-*

4. Delta (v2→vNext)
- Adds: Workspaces-first Canvas; Settings baselines (LLMs/KE); Resources baseline; port `LLM Gateway` (LangChain adapter domyślny, ADK jako opcjonalny)
- Modifies: doprecyzowanie, że core = crewAI (orkiestracja) + LangChain (LLM/Retriever/VectorStore); ujednolicone 768‑d embeddings; ustandaryzowane query/hash w URL
- Removes: brak – crewAI/LangChain pozostaje rdzeniem; ADK traktowany jako opcjonalny adapter

5. Phasing
- P0: Spaces/Canvas, Resources/Knowledge baseline, Settings LLMs/KE, Agents SSE
- P1: Editors (Automations/Services/Tools), Agents/Crew editors, RAG Debugger
- P2: Global search, advanced filters/sort

6. Acceptance (high-level)
- URLs ok; lists follow IA patterns; SSE emits token/tool/final; citations enforced; 404/403/500 per spec; JWT+RLS; soft-deletes

7. Risks & DoD
- Risks: SSE reliability; debugger perf; embedding migration
- DoD: contracts stable; deep-links; Langfuse traces; tests green

---
Legacy v2 (crewAI & LangChain) content retained below for reference:
# 🏗️ ARD (Architecture Requirements Document) - v2 (crewAI & LangChain)
**Produkt:** RAGAS — AI Command Center  
**Wzorzec:** Domain-Driven Design (DDD) + Modular Monolith with crewAI/LangChain

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

### 2.2. Application Layer (Orkiestracja - crewAI)
*   **crewAI Orchestration:** Ta warstwa definiuje logikę biznesową poprzez kompozycję Agentów, Zadań (Tasks) i Zespołów (Crews). Zastępuje to potrzebę ręcznego tworzenia logiki routingu i zarządzania stanem.
    *   **Agents:** Deklaratywne definicje autonomicznych aktorów z określoną `role`, `goal`, `backstory` i zestawem narzędzi (`tools`).
    *   **Tasks:** Opisy konkretnych zadań do wykonania, przypisane do odpowiednich agentów.
    *   **Crews & Processes:** Kompozycja Agentów i Zadań w zespoły. Proces (`Process.sequential` lub `Process.hierarchical`) definiuje strategię orkiestracji, zastępując ręczny `Router Logic`.

### 2.3. Domain Layer (Core Business Logic)
*   Warstwa czysta, niezależna od frameworków AI.
*   **Modele:** Entities (Project, Task), Value Objects (SkillLevel).
*   **Logika:** Reguły biznesowe (np. zasady przyznawania punktów doświadczenia, walidacja statusów projektu).

### 2.4. Infrastructure Layer (Adaptery & Tools - LangChain)
*   **LLM Gateway (LangChain):** Warstwa abstrakcji nad różnymi modelami językowymi. Zapewnia ujednolicony interfejs, co czyni system **Model Agnostic**. Zmiana z `Gemini` na `GPT-4` sprowadza się do zmiany obiektu `ChatModel` z `LangChain`.
*   **Semantic Cache (LangChain):** Wbudowany mechanizm cache'owania zapytań do LLM. Przed zapytaniem do modelu, warstwa sprawdza, czy podobne zapytanie (`cos sim > 0.95`) nie padło wcześniej. Implementowane via `langchain.cache`.
*   **crewAI Tools:** Proste funkcje Python udekorowane `@tool`, które stanowią narzędzia dla agentów. Wewnętrznie korzystają z komponentów `LangChain` do interakcji z zewnętrznymi systemami.
    *   `rag_tools.py`: Narzędzia wykorzystujące `LangChain Retrievers` do przeszukiwania baz wektorowych.
*   **Embedding Service (LangChain):** Wrapper na różne modele embeddingów (`text-embedding-004`, `text-embedding-3-small` etc.) z ujednoliconym interfejsem.
*   **Persistence (LangChain Integration):** Repozytoria SQL (Supabase) i Vector (Supabase pgvector) zintegrowane poprzez `LangChain VectorStore` API.
    *   **Hybrid Search Optimization:** Użycie kolumn `JSONB` z indeksem `GIN` do przechowywania i przeszukiwania metadanych.
    *   **Vector Client:** Abstrakcja `LangChain` nad `pgvector`.
    *   **Soft Delete & Multi-Tenancy (RLS):** Pozostają bez zmian, implementowane na poziomie bazy danych.
*   **Workflow Engine (Durable Execution):** **Inngest** (Serverless) jest "runnerem" dla `crewAI`. Długotrwałe procesy są uruchamiane jako zadania Inngest, które wewnątrz wywołują `crew.kickoff()`, zapewniając odporność na timeouty.
*   **Object Storage:** Abstrakcja nad systemem plików (MinIO/R2).

### 2.5. Data Strategy (JSONB + GIN Implementation)
(Bez zmian - ta strategia jest niezależna od frameworków AI i pozostaje kluczowa).

## 3. Kluczowe Komponenty Architektoniczne AI

### 3.1. Agent Definitions (crewAI)
System definiuje wyspecjalizowanych agentów w sposób deklaratywny:
1.  **Manager:** Agent z celem delegowania zadań, używany w `Process.hierarchical`.
2.  **Researcher:** Agent wyposażony w narzędzia do wyszukiwania wiedzy (`LangChain Retrievers`).
3.  **Builder:** Agent z narzędziami do generowania kodu i artefaktów.
Role są definiowane przez `role`, `goal`, `backstory` i przekazany zestaw `tools`.

### 3.2. Hybrid RAG Strategy (Context Injection + Tools)
Podejście hybrydowe pozostaje, ale jego implementacja jest uproszczona:
*   **Explicit Context Injection:** Kluczowe informacje są zbierane przez `Context Composer` i wstrzykiwane do właściwości `context` obiektu `Task` w `crewAI`.
*   **Tool-based Retrieval:** Narzędzie `search_knowledge_base` oparte na `LangChain Retriever` jest dostępne dla agenta do "dopytania o szczegóły".

### 3.3. Pętla Wykonawcza (Execution Loop)
Pętla `Think -> Tool -> Observe` jest **wewnętrznym, zarządzanym mechanizmem każdego agenta `crewAI`**. Nie jest już implementowana ręcznie w aplikacji. To jedna z kluczowych korzyści migracji, drastycznie redukująca złożoność kodu.

### 3.4. Grounding & Citations Engine
(Bez zmian - mechanizm pozostaje ten sam, model jest instruowany, aby stosować cytowania, a backend dołącza metadane).

### 3.5. Model Assignment Matrix (AI Tiering)
(Bez zmian - strategia doboru modelu jest realizowana przez przekazanie odpowiedniej instancji `llm` z `LangChain` do konkretnego agenta `crewAI`).

## 4. Przepływ Danych (Data Flow)
**Scenariusz:** Użytkownik prosi o audyt strony.
1.  **Frontend:** Wysyła prompt do `/api/chat`.
2.  **API Layer:** Triggeruje zadanie w **Inngest**.
3.  **Inngest Worker:**
    a. Uruchamia `Crew` z odpowiednimi agentami (`Researcher`, `Builder`) i zadaniami.
    b. **`Researcher` Agent (`crewAI`)** otrzymuje zadanie. Jego wewnętrzna pętla decyzyjna wybiera narzędzie `fetch_url_content`.
    c. **`Infrastructure Layer` (`LangChain`)** wykonuje narzędzie.
    d. Agent analizuje treść i ponownie używa narzędzia `search_knowledge_base`.
    e. **`Infrastructure Layer` (`LangChain Retriever`)** zwraca pasujące wektory.
    f. `Researcher` kończy zadanie, przekazując wynik do następnego zadania.
    g. **`Builder` Agent (`crewAI`)** generuje audyt.
4.  **Inngest:** Zapisuje finalny artefakt w bazie i informuje Frontend (np. przez WebSockets).
5.  **Frontend:** Wyświetla wynik w AI Inbox.

## 5. Warstwa AI-Orchestration
(Ta sekcja mapuje się teraz bezpośrednio na komponenty `crewAI` i `LangChain`)

### 5.1. Security Guard Layer
(Bez zmian - działa jako warstwa "przed" przekazaniem zapytania do `crewAI`).

### 5.2. Agent Selector (Router)
Realizowane przez:
- W `Process.sequential`: Kolejność zdefiniowanych `Tasks`.
- W `Process.hierarchical`: Decyzje podejmowane przez agenta `Manager`.

### 5.3. RAG Engine
- **Embeddings:** `LangChain Embeddings` (abstrakcja).
- **Vector Store:** `LangChain VectorStore` (abstrakcja nad `pgvector`).
- **Retrieval:** `LangChain Retriever` z mechanizmami Pre-filtering.

### 5.4. Prompt Manager
- **Templates:** Pliki `.md` z instrukcjami (`backstory`, `goal`) dla agentów `crewAI`.
- **Dynamic Context:** Wstrzykiwany do `Task` `crewAI`.

### 5.5. Context Composer (Middleware)
(Bez zmian - działa jako warstwa "przed" `crewAI`, przygotowując kontekst dla `Task`).

### 5.6. Workflow Engine
Połączenie **Inngest** (dla trwałości i asynchroniczności) oraz **crewAI** (dla logiki agentowej).

### 5.7. QA & Evals Strategy
(Bez zmian - strategia pozostaje, z możliwością użycia `crewAI` do zbudowania "zespołu ewaluacyjnego").

### 5.8. Security Guardrails (Tainted Data Pattern)
(Bez zmian - wzorzec pozostaje krytyczny).

### 5.9. Data Integrity & Cost Management
(Bez zmian - wzorce pozostają krytyczne).

---

## 6. Struktura Katalogów i Kodu (Source Code Structure)

### 6.1. Backend & Frontend (Full Project Structure)
*Poniższa struktura odzwierciedla podział na moduły (`features`) zarówno w backendzie, jak i frontendzie, zapewniając spójność architektoniczną.*

```text
axon/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/           # Endpoints API (np. agents.py, crews.py, flows.py)
│   │   ├── modules/              # Logika biznesowa (serce DDD)
│   │   │   ├── agents/           # CRUD, walidacja, logika specyficzna dla Agentów
│   │   │   ├── crews/            # Logika dla Załóg
│   │   │   ├── flows/            # Logika dla Przepływów
│   │   │   └── ...
│   │   │
│   │   ├── orchestration/        # NOWY MODUŁ: Orkiestracja (crewAI, LangChain)
│   │   │   ├── task_builder.py   # Buduje 'Task' z I/O Schema
│   │   │   └── crew_runner.py    # Uruchamia zdefiniowane załogi
│   │   │
│   │   └── shared/               # Współdzielona infrastruktura (baza danych, security)
│   │       └── infrastructure/   # Inicjalizacja klientów LangChain (LLMs, Embeddings)
│   │
│   ├── main.py                   # Główny plik startowy FastAPI
│   └── pyproject.toml            # Zależności Python (FastAPI, crewAI, LangChain)
│
├── frontend/
│   ├── src/
│   │   ├── app/                  # Routing (Next.js App Router)
│   │   │   └── (main)/
│   │   │       └── workspaces/
│   │   │           └── [workspaceId]/
│   │   │               ├── agents/
│   │   │               │   ├── new/page.tsx      # Widok Nowego Agenta
│   │   │               │   └── [agentId]/page.tsx # Widok Edycji Agenta
│   │   │               └── ...
│   │   │
│   │   ├── modules/              # Komponenty i logika UI (odpowiednik backend/modules)
│   │   │   ├── agents/
│   │   │   │   ├── components/
│   │   │   │   │   ├── AgentForm.tsx         # Główny komponent formularza
│   │   │   │   │   └── StructuredSchemaEditor.tsx # Zaawansowany edytor I/O
│   │   │   │   │
│   │   │   │   └── utils/
│   │   │   │       └── schemaSuggester.ts  # Logika INTELIGENTNEGO WYPEŁNIANIA
│   │   │   └── ...
│   │   │
│   │   └── shared/               # Współdzielone komponenty (Button, Input), hooks, utils
│   │       ├── hooks/
│   │       │   └── useAutoSave.ts    # Hook do automatycznego zapisu
│   │       │
│   │       └── types/
│   │           └── index.ts        # Globalne typy (np. DataType enum)
│   │
│   └── next.config.ts              # Konfiguracja Next.js
│
└── docker-compose.yml              # Definicja usług (backend, frontend, baza danych)
```