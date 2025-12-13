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
    - [x] `etl/ingest.py`: Knowledge Ingestion Script.
    - [ ] **Test:** Run ingestion script on sample data.
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
- [ ] **Implement Features:**
    - [x] Project Dashboard.
    - [x] Chat Interface (Streaming).
    - [ ] **Knowledge Browser (`/knowledge`):** View indexed chunks and assets.
    - [ ] **Prompt Library (`/prompts`):** CRUD for system instructions.
    - [ ] **Agent Config (`/agents`):** Manage roles and tools.
    - [ ] **LLM Settings (`/llms`):** API Key management.
    - [ ] **Inbox (`/inbox`):** Artifact review interface.
    - [ ] **Tools Catalog (`/tools`):** View available tools.
    - [ ] **Docs Viewer (`/docs`):** Markdown renderer for project docs.
    - [x] **Test:** Component Tests (Vitest).

### Phase 5: Verification & Cleanup
- [ ] **Testing:** Run Full Regression Suite.
- [ ] **Documentation:** Complete API Docs & README.

---

## ⚠️ Gap Analysis (Missing vs Tech PRD/ARD)
*   **Knowledge Browser:** Not implemented yet.
*   **Inbox UI:** Mentioned in Tech PRD but missing in PRP Plan.
*   **Soft Delete:** Required by ARD, missing in Backend Models.
*   **Prompts Management:** Hardcoded in Orchestrator, missing UI/DB.
*   **Knowledge Ingestion:** `ingest.py` is a draft; missing recursive parsing & "Wisdom" path.

---

## 🏁 Definition of Done
- [ ] All "Invariants" from PRP are satisfied.
- [ ] Backend follows strict `modules/` structure.
- [ ] Code passes `ruff` and `eslint`.
- [ ] **Testing:** Tests executed and passed after changes.
- [ ] **Documentation:** Tech Docs (Code) and Non-Tech Docs (Files) updated.