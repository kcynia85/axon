# 🛠️ IMPLEMENTATION PLAN
> **File:** `Docs/IMPLEMENTATION.md`
> **Generated from:** `Docs/PRP.md` & `knowledge/tech/*`

---

## 🧠 Memory & Context Check
Before starting, I have reviewed `knowledge/memory.md` and applied the following relevant lessons:
- [x] **uv dependency**: Using `uv add` and ensuring `pyproject.toml` compatibility.
- [ ] **CRITICAL KNOWLEDGE PROTOCOL**: I confirm I will strictly follow `knowledge/tech/*` and `knowledge/structure/*` for modern, efficient code.
- [ ] **CRITICAL TESTING PROTOCOL**: I confirm I will run tests after every significant change.
- [ ] **CRITICAL DOCS PROTOCOL**: I confirm I will update Tech & Non-Tech docs.

---

## 📚 Context & Sources (Grounding)
> **Mandatory:** List specific Global Context files used as the source of truth for this plan.

- **Tech PRD:** `docs/tech-prd-axon.md`
- **ADR:** `docs/ard-axon.md`
- **PRP:** `docs/PRP.md`
- **Architecture:** `docs/knowledge/structure/python-fastapi-ddd.md` (Backend), `docs/knowledge/structure/modular-monolith-nextjs.md` (Frontend)

---

## 🏗️ Architecture & Structure

### 📂 Directory Structure (Monorepo-style)
**Backend (`/backend`)** - Python/FastAPI (Modular Monolith)
```text
backend/app/
  modules/
    projects/       # Context: Projects, Artifacts
    agents/         # Context: Sessions, Orchestration
    knowledge/      # Context: RAG, Assets, Memories
  shared/           # Kernel: DB, Security, Utils
```

**Frontend (`/frontend`)** - Next.js (Modular Monolith)
```text
frontend/src/
  modules/
    projects/
    agents/
    knowledge/
  app/              # Dumb UI / Routing
```

---

## ✅ Task Checklist

### Phase 1: Foundation & Scaffolding (Infrastructure)
- [x] **Repo Setup:**
    - [x] Initialize Git.
    - [x] Create `.gitignore`.
- [x] **Backend Scaffolding (`/backend`):**
    - [x] Init `uv` project.
    - [x] Create `main.py` and `Dockerfile`.
    - [x] **Refactor:** Restructure to `modules/` based on DDD standards.
- [x] **Frontend Scaffolding (`/frontend`):**
    - [x] Init Next.js App Router.
    - [x] Install Shadcn/UI.
- [ ] **Verification:** Run `pytest` (even if empty) to verify environment.

### Phase 2: Domain Modeling (Backend Modules)
> **Ref:** `docs/PRP.md` Section 2

- [ ] **Shared Kernel (`backend/app/shared`):**
    - [x] `database.py`: Async Session Manager (SQLAlchemy).
    - [x] `vecs_client.py`: Vector DB Client.
    - [x] `config.py`: Settings management.
    - [ ] **Test:** Verify DB connection.
    - [ ] **Doc:** JSDoc/Docstring for shared utils.
- [ ] **Module: Projects (`backend/app/modules/projects`):**
    - [x] `domain/models.py`: `Project`, `Artifact` (Pydantic).
    - [x] `infrastructure/tables.py`: SQLAlchemy tables.
    - [x] `infrastructure/repo.py`: CRUD operations.
    - [x] `interface/router.py`: API endpoints.
    - [ ] **Test:** Unit tests for Project Repository.
    - [ ] **Doc:** Swagger docs verification.
- [ ] **Module: Knowledge (`backend/app/modules/knowledge`):**
    - [x] `domain/models.py`: `Asset`, `Memory`.
    - [x] `infrastructure/repo.py`: Asset retrieval (SQL) & Vector Search (`vecs`).
    - [x] `etl/ingest.py`: Knowledge Ingestion Script (Wisdom Path implemented).
    - [x] **Refactor:** Add Soft Delete to `Asset` model & repo.
    - [x] **Test:** Run ingestion script on sample data.
    - [ ] **Doc:** Update `docs/knowledge-migration-guide.md`.
- [ ] **Module: Agents (`backend/app/modules/agents`):**
    - [x] `domain/models.py`: `AgentConfig`, `ChatSession`.
    - [x] `application/orchestrator.py`: Router Logic & Fallback.
    - [x] **Test:** Mock Agent Orchestration.
    - [ ] **Doc:** Document Agent Strategy in `docs/agents.md`.

### Phase 3: Application Logic & RAG
- [ ] **RAG Implementation:**
    - [x] Implement `search_knowledge` and `get_asset` tools using Shared Kernel.
    - [x] **Test:** Verify RAG search results.
- [ ] **Agent Runtime:**
    - [x] Integrate Google ADK (Gemini) in `shared/infrastructure/adk.py`.
    - [x] Implement Streaming Response (SSE).
    - [x] **Test:** E2E Chat Test (Mocked LLM).

### Phase 4: Frontend Implementation
- [x] **Refactor:** Create `src/modules` structure.
- [x] **Refactor: Vertical Slices (Clean Arch):**
    - [x] **Shared Kernel:** Setup `src/shared/{domain,ui,lib}`.
    - [x] **Module: Projects:**
        - [x] Extract `domain` (Project Entity).
        - [x] Feature: `list-projects` (UI, App, Infra).
        - [x] Feature: `create-project` (UI, App, Infra).
        - [x] Feature: `project-details` (UI, App, Infra).
    - [x] **Module: Dashboard:** Refactor to `features/view-dashboard`.
    - [x] **Module: Brain (Knowledge):** Refactor to `features/browse-knowledge`.
    - [x] **Routing:** Update `app/*` to import containers from `features/*/ui`.
- [x] **Implement Features:**
    - [x] **Dashboard:** Project overview and status.
    - [x] **Workspace (`/workspace`):** Chat Interface (Streaming) & Split View.
    - [x] **Brain (`/brain`):** Knowledge browser (formerly `/knowledge`).
    - [x] **Inbox (`/inbox`):** Artifact review interface (Mocked Infrastructure).
    - [x] **Settings (`/settings`):**
        - [x] Prompts Management.
        - [x] Agent Config, LLMs, Tools, Profile.
    - [x] **Workflows (`/workflows`):** Workflow Management (Mocked Infrastructure).
    - [x] **Common Uses (`/common-uses`):** Scenario Catalog (Mocked Infrastructure).
    - [x] **Docs Viewer (`/docs`):** Markdown renderer.
    - [x] **Test:** Component Tests (Vitest).


### Phase 6: Advanced Capabilities (Post-MVP)
- [x] **Advanced Agent Logic:**
    - [x] **Fallback Resilience:** Implement adapter pattern for LLM switching (Gemini -> GPT-4).
    - [x] **Context Injection:** Middleware to inject Project/Memory context into System Prompt.
    - [x] **Citations:** Implement citation logic in `ChatSession` (Trustworthy Attribution).
- [ ] **Infrastructure:**
    - [ ] **Workflow Engine:** Setup Inngest (or mock for local development) for durable execution.
    - [ ] **Semantic Cache:** Implement Redis/Vector caching layer for cost optimization.
- [x] **Generative UI:**
    - [x] **StreamUI:** Implement Vercel AI SDK `streamUI` for dynamic React components.
- [ ] **Security & QA:**
    - [ ] **Guard Layer:** Implement input sanitization/filtering (Prompt Injection defense).
    - [ ] **Evals:** Setup basic LLM-as-a-Judge evaluation script.
- [ ] **Settings Deep-Dive:**
    - [ ] Implement full configuration logic for Agents, LLMs, and Tools (currently Shells).


### Phase X: Verification & Cleanup
- [ ] **Testing:** Run Full Regression Suite.
- [ ] **Documentation:** Complete API Docs & README.

---

## ⚠️ Gap Analysis (Resolved)
*   **Inbox UI:** Resolved (Mocked Infrastructure implemented).
*   **Soft Delete:** Resolved (Implemented in Backend).
*   **Knowledge Ingestion:** Resolved (Wisdom Path implemented).

---

## 🆘 Disconnection Recovery Plan

> **IF CONNECTION IS LOST:** Follow these steps to resume work immediately.



1.  **Frontend Status:**

    *   Navigate to `/frontend`.

    *   Run `npm run dev`.

    *   Check `http://localhost:3000`. If pages load with data, Mocks are working.

2.  **Backend Status:**

    *   Navigate to `/backend`.

    *   Run `uv run uvicorn app.main:app --reload`.

    *   Check `http://127.0.0.1:8000/docs`.

3.  **Resume Task:**

    *   Open `Docs/IMPLEMENTATION.md`.

    *   Find the first **unchecked** item in **Phase 4** or **Phase 5**.

    *   **Context:** If in the middle of "Frontend Mocks", verify `frontend/src/shared/infrastructure/mock-adapter.ts` exists.



---



## 🏁 Definition of Done

- [ ] All "Invariants" from PRP are satisfied.

- [ ] Backend follows strict `modules/` structure.

- [ ] Code passes `ruff` and `eslint`.

- [ ] **Testing:** Tests executed and passed after changes.

- [ ] **Documentation:** Tech Docs (Code) and Non-Tech Docs (Files) updated.