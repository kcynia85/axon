# Axon Backend (RAGAS API)

This is the backend service for the Axon system, built with **FastAPI** and **Python 3.10+**. It implements a Modular Monolith architecture driven by Domain-Driven Design (DDD) principles.

## 🏗 Architecture

The application is structured into vertical modules located in `app/modules/`:

- **`projects`**: Manages user Projects and Artifacts.
- **`agents`**: Handles Chat Sessions, Agent Roles, and Orchestration.
- **`knowledge`**: Manages Knowledge Assets, Memories, and RAG (Retrieval-Augmented Generation).
- **`shared`**: Shared infrastructure (Database, Vector Store, Google ADK).

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **uv** (Modern Python package manager)
- **Docker** (optional, for local DB)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repo_url>
    cd axon/backend
    ```

2.  **Install dependencies using `uv`:**
    ```bash
    uv sync
    ```

3.  **Environment Setup:**
    Copy `.env.example` (or create new) to `.env`:
    ```ini
    DATABASE_URL=postgresql+asyncpg://user:pass@host:port/dbname
    SUPABASE_URL=https://your-project.supabase.co
    SUPABASE_KEY=your-anon-key
    GOOGLE_API_KEY=your-gemini-key
    ```

### 🏃‍♂️ Running the Server

Start the development server with hot-reload:

```bash
uv run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
Swagger UI docs are at `http://localhost:8000/docs`.

### 🧪 Running Tests

We use `pytest` for unit and integration testing.

```bash
# Run all tests
uv run pytest

# Run specific module tests
uv run pytest app/modules/agents/tests/
```

## 🔑 Key Concepts

### Agents & Streaming
The `/agents/chat/stream` endpoint uses **Server-Sent Events (SSE)** to stream LLM responses.
- **Input:** `project_id`, `agent_role`, `message`.
- **Output:** Stream of JSON events `{"type": "token", "content": "..."}`.

### RAG (Knowledge)
The system uses **Google GenAI** for embeddings and **Supabase (pgvector)** for storage.
- **Assets:** Full documents (templates, SOPs).
- **Memories:** Semantic chunks of wisdom.

## 🛠 Tech Stack
- **Framework:** FastAPI
- **Database:** SQLAlchemy (Async), Supabase (Postgres)
- **AI:** Google Generative AI SDK (Gemini 1.5)
- **Vector Store:** `vecs` (pgvector client)
- **Testing:** Pytest, Asyncio
