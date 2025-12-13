# Axon Backend — Technical Documentation

> **Role:** Developer Guide & Architecture Reference
> **Stack:** Python 3.10+, FastAPI, SQLAlchemy (Async), Google GenAI

## 🏗 System Architecture (Modular Monolith)

The backend follows a **Domain-Driven Design (DDD)** approach with a "Modular Monolith" structure.
Everything resides in `backend/app/modules/`.

### Core Modules
1.  **`agents`** (`backend/app/modules/agents`)
    *   **Responsibility:** Orchestrating AI chat sessions, managing Agent Roles, and handling the "Thinking" loop.
    *   **Key Components:** `AgentOrchestrator`, `ChatSession` model, `GoogleADK` integration.
    *   **API:** Exposes SSE endpoints (`/chat/stream`) for real-time streaming.

2.  **`knowledge`** (`backend/app/modules/knowledge`)
    *   **Responsibility:** RAG (Retrieval-Augmented Generation). Storing and retrieving "Assets" (full docs) and "Memories" (chunks).
    *   **Key Components:** `RAGService`, `KnowledgeVectorStore`, `Ingestion` scripts.
    *   **Storage:** Uses `pgvector` (via `vecs` library) for vector search.

3.  **`projects`** (`backend/app/modules/projects`)
    *   **Responsibility:** CRUD for Projects and Artifacts. The "file system" of the user's workspace.

4.  **`shared`** (`backend/app/shared`)
    *   **Responsibility:** Infrastructure kernel. DB connections (`database.py`), Config, Utils.

---

## 🚀 Developer Setup

### Prerequisites
- **Python 3.10+**
- **uv** (Package Manager) -> `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Docker** (optional, for local Supabase/Postgres)

### Installation
1.  Navigate to backend: `cd backend`
2.  Install dependencies: `uv sync`

### Environment Variables
Create `.env` in `backend/`:
```ini
DATABASE_URL=postgresql+asyncpg://postgres:pass@db.supabase.co:5432/postgres
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
GOOGLE_API_KEY=AIzaSy...
```

### 🏃‍♂️ Running the System

**Development Server:**
```bash
uv run uvicorn main:app --reload
```
- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

**Running Tests:**
```bash
# All tests
uv run pytest

# Specific module
uv run pytest app/modules/agents/tests/
```

---

## 🔑 Key Technical Implementation Details

### Streaming Response (SSE)
We utilize **Server-Sent Events** to stream tokens from the LLM.
- **Library:** `sse-starlette`
- **Flow:** `Router` -> `Orchestrator.run_turn_stream()` -> `GoogleADK.generate_content_stream()` -> `yield JSON`
- **Event Format:** `{"type": "token", "content": "..."}`

### RAG Pipeline
- **Embedding Model:** Google `text-embedding-004` (768 dimensions).
- **Vector DB:** Supabase `vecs` client.
- **Logic:** `RAGService` handles the "hybrid search" logic (Vector Search + Metadata filtering).
