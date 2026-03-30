# 🤖 Backend Agent Guide (Python 3.10+ & FastAPI)

**Role:** Expert Backend Architect for Axon.
**Scope:** `axon-app/backend/`
**Philosophy:** Modular Monolith, Domain-Driven Design (DDD), Async-First.

---

## 🏗️ Architecture: Modular Monolith

The backend is structured as a collection of autonomous **Vertical Slices** (Modules).

### Directory Structure (`app/modules/`)
Each module must follow this strict layered pattern:
- **`interface/`**: FastAPI routers and Pydantic request/response schemas. This is the only layer that knows about HTTP.
- **`application/`**: Use cases and orchestration logic. It coordinates domain entities and infrastructure adapters.
- **`domain/`**: Pure business logic. Contains Entities, Value Objects, and Domain Services. **Strictly no framework or IO dependencies.**
- **`infrastructure/`**: Implementation details: Database repositories (SQLAlchemy), External API clients (Httpx), AI Providers.
- **`tests/`**: Unit and integration tests for the module.

---

## 🛠️ Tech Stack Standards

- **FastAPI:** Modern, high-performance web framework.
- **Pydantic v2:** For data validation and settings management.
- **SQLAlchemy 2.0 (Async):** Mandatory for all database interactions.
- **crewAI & LangChain:** Orchestration for multi-agent workflows and LLM interactions.
- **Inngest:** Durable execution for long-running background tasks.
- **pgvector:** Vector similarity search for RAG.

---

## ⚛️ Core Principles

### 1. 🧬 Dependency Injection (DI)
- Use FastAPI's **`Depends()`** in routers to inject services and use cases.
- Invert dependencies: High-level logic (Domain) defines interfaces/ports; Infrastructure implements them.

### 2. ⚡ Async-First IO
- **Mandatory `async/await`** for all database queries, network calls, and file operations.
- Avoid blocking code in the main thread. Use `run_in_executor` if strictly necessary for CPU-bound tasks.

### 3. 🔒 Security & Auth
- All protected routes must depend on `get_current_user`.
- Enforce **Row Level Security (RLS)** logic within repositories or use cases to ensure multi-tenant isolation.

---

## 🚦 Hard Rules (Non-Negotiable)

1.  **No Cross-Module Imports:** Modules must NOT import from each other directly. Use the `shared/` kernel or event-based communication.
2.  **Explicit Typing:** Use Python type hints everywhere. Avoid `Any`.
3.  **Ubiquitous Language:** Use domain terms from the project's documentation in code (e.g., `Artifact`, `Scenario`, `Crew`).
4.  **Soft Deletes:** Use `deleted_at` timestamps for critical entities (Projects, Agents) instead of hard deletes.
5.  **Error Handling:** Use custom domain exceptions and map them to HTTP status codes in the interface layer.
6.  **File Headers:** Always include the file path as a comment at the top (e.g., `# app/modules/agents/domain/models.py`).

---

## 🔄 AI & RAG Integration

- **Google ADK:** Use the shared ADK infrastructure for Gemini models.
- **Vector Search:** Use `vecs` or direct pgvector queries via SQLAlchemy for similarity search.
- **Streaming:** Token streaming must use **Server-Sent Events (SSE)** via `EventSourceResponse`.

---

## 🧪 Testing Guidelines

- **Unit Tests:** Focus on `domain/` and `application/` logic (Pytest).
- **Integration Tests:** Verify `infrastructure/` (e.g., DB repos) and `interface/` (Router tests with `TestClient`).
- **Mocks:** Use `unittest.mock` or `pytest-mock` for external services (LLM, Inngest).
