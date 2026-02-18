# Tech PRD: Axon Core System (vNext — crewAI + LangChain, Inngest, pgvector)

Spec definiuje vNext z core: crewAI (orkiestracja) + LangChain (LLM/Retriever/VectorStore), z trwałością przez Inngest, SSE streamingiem oraz Supabase+pgvector (domyślnie 768‑d). ADK jest opcjonalnym adapterem przez port LLM Gateway (future‑proof).

1. Context and goal
- Status: Ready to implement
- Goal: Deliver P0 critical path (Spaces/Canvas Workspaces-first, Resources/Knowledge baseline, Settings LLMs/Knowledge Engine, Agents SSE), then P1 depth and P2 enhancements

2. Core principles
- Vertical slices only; no cross‑module imports (tylko shared)
- Orkiestracja: crewAI (Agents/Tasks/Crew) wywoływana durable przez Inngest
- Infrastruktura LLM/RAG: LangChain (Chat*, Retrievers, VectorStore pgvector)
- LLM Gateway (port): domyślnie adapter LangChain; ADK jako opcjonalny adapter (fallback/alternatywa)
- SSE‑first; FastAPI async; JWT na routerach; Supabase RLS; soft deletes
- Contract‑first (Zod); cytowania obowiązkowe

3. DDD & Vertical Slice invariants
- Granice slice’a: każdy moduł w backend/app/modules/<slice> posiada {interface, application, domain, infrastructure} i jest autonomiczny.
- Imports: dozwolone wyłącznie z własnego slice’a lub ze shared/; bezpośrednie importy między różnymi modules/* są zabronione.
- Dependency Injection: routery (interface) wstrzykują use‑cases przez FastAPI Depends(); use‑cases są czystymi callable’ami.
- Dostęp do danych: tylko przez infrastrukturę slice’a (repozytoria/adapters); brak dostępu do repo innego slice’a.
- Workflow: Inngest functions deklarowane w workflows slice; wywoływane z warstwy application innych slice’ów przez klienta (bez importów kodu).
- SSE: emisja zdarzeń wyłącznie w warstwie interface; format zdarzeń kontraktowy {type: token|tool|final, ...}.
- Frontend BFF: Next.js route handlers wyłącznie proxy do FastAPI; zero logiki biznesowej w FE.
- Testy: unit (domain, application), integration (interface/SSE), contract tests (schematy Zod dla list/SSE).
- Nazewnictwo i URL: kebab‑case, kolekcje w liczbie mnogiej; tabs/modals w query; anchors w hash – zgodnie z url_structure.md.

3. Routes (per [docs/product/information_architecture/url_structure.md](docs/product/information_architecture/url_structure.md))
- Projects: /projects, /projects/:id?tab=overview|resources|artifacts
- Spaces: /spaces, /spaces/:id, ?node=..., #zone-:workspace
- Workspaces: /workspaces, /workspaces/:workspace?tab=agents|crews|patterns|templates|services|automations
- Resources: /resources/knowledge (hubs, sources, P1: /debugger or ?modal=debugger)
- Settings: /settings/llms/(providers|models|routers), /settings/knowledge-engine/(embedding|chunking|vectors)

4. APIs and contracts (slices)
- Agents — POST /agents/chat (SSE). Events: { type: token|tool|final, ... }. Backend: crewAI run (crew.kickoff()) w workerze Inngest; narzędzia emitują zdarzenia tool
- Knowledge — list/ingest/detail; ingest → Inngest (durable indexing)
- Projects — CRUD incl. createNewSpace/existingSpaceId per Projects plan
- Settings — CRUD providers/models/routers; Knowledge Engine configs (embedding/chunking/vectors)

5. Data and NFRs
- pgvector (domyślnie 768‑d); JSONB GIN filters; Langfuse traces
- SSE resilience; auth; RLS; cost/latency metrics; CORS for localhost:3000

5a. Niezmienniki systemowe (pozostają bez zmian)
- Trustworthy Attribution: odpowiedzi z RAG zawierają cytowania (źródło/hub/sourceId/chunk).
- Project isolation: Supabase RLS; JWT na routerach; soft‑deletes domyślnie filtrowane.
- Async + idempotencja: narzędzia modyfikujące stan są idempotentne; operacje długie przez Inngest.
- Contract‑first: listy/SSE zgodne z ustalonymi schematami; błędy 404/403/500 per error_states.

6. Phasing and AC
- P0: Spaces/Canvas, Resources/Knowledge baseline, Settings LLMs/KE, Agents SSE (crewAI+LangChain baseline; ADK opcjonalny)
- AC: URLs/tabs/modals/anchors per rules; lists per filter/search/sort; SSE token/tool/final; citations; 404/403/500 per spec
- P1: Editors (Automations/Services/Tools), Agents/Crew editors, RAG Debugger
- P2: Global search; advanced filters/sort

6a. Transitional “today‑ready” bridge (status: Ready to Implement od 2026‑02‑17)
Cel: zachować bieżące działanie i umożliwić płynne przejście na crewAI + LangChain bez Big‑Bang.

- Krok T1: Port LLM Gateway (shared/ports/illm_gateway)
	- Zdefiniuj interfejs (generate(request) → response z usage/cost). 
	- AC: istnieje port + test jednostkowy; brak zmian funkcjonalnych.

- Krok T2: Adapter domyślny (CurrentAdapter)
	- Zaimplementuj adapter używający aktualnego klienta LLM (obecny ADK/klient w projekcie), spięty z portem.
	- Podmień wywołania w agents application na port (DI), zostawiając bieżące zachowanie.
	- AC: endpoint /agents/chat działa identycznie; SSE bez zmian; Langfuse metryki zbierane.

- Krok T3: Szkielet adaptera LangChain (LangChainAdapter)
	- Dodaj implementację opartą o LangChain Chat* + mapowanie parametrów (może być za feature‑flagiem, bez domyślnego włączenia).
	- AC: test integracyjny z mockiem; flaga off by default.

- Krok T4: Facade orkiestracji crewAI
	- Utwórz crew_runner (application) i crew definitions (stub), ale na razie deleguj do obecnego przepływu (bridge). 
	- Zarejestruj funkcję Inngest o docelowym API; wewnątrz wywołuj aktualny kod do czasu migracji agentów.
	- AC: Inngest handler istnieje; brak regresji; logi/trace spójne.

- Krok T5: Retriever Port dla RAG
	- Zdefiniuj port IKnowledgeRetriever; dodaj adapter CurrentRetriever (oparty o vecs) + stub LangChainRetriever (flaga off).
	- AC: wyszukiwanie działa jak dziś; flaga pozwala na testy LangChain bez wpływu na prod.

- Krok T6: KE/Embedding
	- Jeśli obecny wymiar ≠ 768‑d, zostaw aktualny; pokaż ostrzeżenie o reindeksacji w Settings (P1). 
	- AC: brak wymuszonej migracji; status KE wyświetla bieżący wymiar.

- DoD (dla T1–T6):
	- Brak zmian w kontraktach FE (SSE/listy); testy kontraktowe zielone.
	- Wydajność i koszty bez regresji (>‑= baseline).
	- Feature‑flagi i DI pozwalają włączać adaptery per środowisko.

7. Risks & Assumptions
- Risks: SSE proxying; debugger perf; embedding dim migration
- Assumptions: Workspace Zones are visual-only (no separate entity)

11. Changelog vNext
- Adds: Workspaces-first Canvas; Settings LLMs/KE; Resources/Knowledge baseline; Agents SSE; LLM Gateway (port) z adapterami
- Clarifies: Core = crewAI (orkiestracja) + LangChain (LLM/Retriever/VectorStore); ADK = opcjonalny adapter
- Modifies: embeddings (domyślnie 768‑d); standardized tabs/modals/anchors
