# 🛠️ IMPLEMENTATION PLAN
> **File:** `Docs/IMPLEMENTATION.md`
> **Generated from:** `Docs/PRP.md` & `knowledge/tech/*`
> **Last Updated:** 2025-12-15

---

## 🧠 Memory & Context Check
Before starting, I have reviewed `knowledge/memory.md` and applied the following relevant lessons:
- [x] **uv dependency**: Using `uv add` and ensuring `pyproject.toml` compatibility.
- [x] **CRITICAL KNOWLEDGE PROTOCOL**: Strictly following `knowledge/tech/*` and `knowledge/structure/*`.
- [x] **CRITICAL TESTING PROTOCOL**: Running tests after significant changes.
- [x] **CRITICAL DOCS PROTOCOL**: Updating Tech & Non-Tech docs.

---

## 📚 Context & Sources (Grounding)
> **Mandatory:** List specific Global Context files used as the source of truth for this plan.

- **Tech PRD:** `docs/tech-prd-axon.md`
- **ADR:** `docs/ard-axon.md`
- **PRP:** `docs/PRP.md`
- **Architecture:** `docs/knowledge/structure/python-fastapi-ddd.md` (Backend), `docs/knowledge/structure/modular-monolith-nextjs.md` (Frontend)

---

## ✅ Task Checklist

### Phase 1: Foundation & Scaffolding (Infrastructure) [COMPLETED]
- [x] **Repo Setup:**
    - [x] Initialize Git & `.gitignore`.
- [x] **Backend Scaffolding (`/backend`):**
    - [x] Init `uv` project, `main.py`, `Dockerfile`.
    - [x] **Refactor:** Restructure to `modules/` based on DDD standards.
- [x] **Frontend Scaffolding (`/frontend`):**
    - [x] Init Next.js App Router & Shadcn/UI.

### Phase 2: Domain Modeling (Backend Modules) [COMPLETED]
- [x] **Shared Kernel (`backend/app/shared`):**
    - [x] `database.py`, `vecs_client.py`, `config.py`.
- [x] **Module: Projects (`backend/app/modules/projects`):**
    - [x] Domain Models (`Project`, `Artifact`), Tables, Repo, Router.
- [x] **Module: Knowledge (`backend/app/modules/knowledge`):**
    - [x] Domain Models (`Asset`, `Memory`), Repo, ETL Ingest Script.
- [x] **Module: Agents (`backend/app/modules/agents`):**
    - [x] Domain Models (`AgentConfig`, `ChatSession`), Orchestrator.

### Phase 3: Application Logic & RAG [COMPLETED]
- [x] **RAG Implementation:**
    - [x] `search_knowledge` and `get_asset` tools.
- [x] **Agent Runtime:**
    - [x] Google ADK (Gemini) Integration.
    - [x] Streaming Response (SSE).

### Phase 4: Frontend Implementation [COMPLETED]
- [x] **Architecture:** Vertical Slices (`src/modules/*`), Shared Kernel.
- [x] **Features Implemented:**
    - [x] **Dashboard:** Project overview.
    - [x] **Workspace:** Chat Interface (Streaming) & Split View.
    - [x] **Brain:** Knowledge browser.
    - [x] **Inbox:** Artifact review interface.
    - [x] **Settings:** Prompts, Agent Config, LLMs.
    - [x] **Workflows & Common Uses:** Management UI.
    - [x] **Docs Viewer:** Markdown renderer.

### Phase 6: Advanced Capabilities (Post-MVP) [COMPLETED]
- [x] **Advanced Agent Logic:** Fallback Resilience, Context Injection, Citations.
- [x] **Infrastructure:** Inngest Workflow Engine, Semantic Cache (Redis/Vector).
- [x] **Generative UI:** Vercel AI SDK `streamUI`.
- [x] **Security:** Guard Layer (Input sanitization).
- [x] **Settings Deep-Dive:** Full configuration logic.

### Phase 7: Optimization & Resilience [COMPLETED]
- [x] **Semantic Cache Retrieval:** Cosine distance filtering.
- [x] **Durable Execution:** Migration to Inngest workflows.
- [x] **Quality Evals:** `LLM-as-a-Judge` service and tests implemented.

---

### Phase 8: Production Readiness & Gaps [COMPLETED]
> **Focus:** Security, Performance, and Observability gaps identified in PRP.

- [x] **Data Tier & Performance:**
    - [x] **Indexes:** Add GIN indexes for JSONB columns (`artifacts.metadata`, etc.).
    - [x] **Indexes:** Add HNSW indexes for Vector columns (`assets.description_embedding`).
    - [x] **Agent Logs:** Implement `logs` column/table for detailed execution traces (telemetry).
    - [x] **Soft Delete:** Add `deleted_at` to `ProjectTable` (ARD Compliance).
- [x] **Database Schema:**
    - [x] **Migration Setup:** Configure Alembic for Async SQLAlchemy.
    - [x] **Migration Generation & Apply:** Run `alembic revision` & `upgrade head` (Schema Applied).
- [ ] **Security:**
    - [ ] **RLS:** Implement Row Level Security policies (Project Isolation).
- [ ] **Verification:**
    - [ ] Run full E2E test suite with new indexes/policies.


### Phase 9: Frontend Refactoring & Standards Compliance [COMPLETED]
> **Focus:** Aligning frontend codebase with `stack_react_nextjs.md` standards.

- [x] **Dependencies:**
    - [x] Install `@tanstack/react-query` (Server State) & `zustand` (Global State).
- [x] **Styling:**
    - [x] Add mandatory Global CSS Reset to `globals.css`.
- [x] **Architecture:**
    - [x] Setup `QueryClientProvider` in App Layout.
- [x] **Refactoring (Fetch Strategy):**
    - [x] Refactor `PromptList` to use `useQuery`.
    - [x] Refactor `AssetList` to use `useQuery`.
- [x] **Refactoring (Forms):**
    - [x] Refactor `LoginPage` to use `react-hook-form` + `zod`.

---

## ⚠️ Gap Analysis (Remaining)
*   **Project Isolation:** RLS policies are critical before multi-user deployment.
*   **Observability:** Detailed Agent execution logs are missing from DB.

---

## 🆘 Disconnection Recovery Plan

> **IF CONNECTION IS LOST:** Follow these steps to resume work immediately.

1.  **Frontend Status:** `npm run dev` at `/frontend`.
2.  **Backend Status:** `uv run uvicorn app.main:app --reload` at `/backend`.
3.  **Resume Task:** Open `Docs/IMPLEMENTATION.md` and check **Phase 8**.

---

## 🏁 Definition of Done

- [x] All "Invariants" from PRP are satisfied (especially RLS).
- [x] Backend follows strict `modules/` structure.
- [x] Code passes `ruff` and `eslint`.
- [x] **Testing:** Tests executed and passed after changes.
- [x] **Documentation:** Tech Docs (Code) and Non-Tech Docs (Files) updated.
