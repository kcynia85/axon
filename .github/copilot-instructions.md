# Axon AI Agent Instructions

## Project Overview

**Axon** is an AI-native command center for RAG (Retrieval-Augmented Generation) workflows, autonomous agents, and knowledge management. It follows a **Modular Monolith** architecture with **Domain-Driven Design (DDD)** principles across both frontend and backend.

- **Backend:** Python 3.10+, FastAPI with vertical slices (feature-based modules)
- **Frontend:** Next.js 16 with Tailwind CSS, Shadcn/UI, and Vercel AI SDK
- **Database:** Supabase (PostgreSQL + pgvector for vectors)
- **Workflow Engine:** Inngest for durable, long-running agent tasks
- **AI Core:** Google Generative AI SDK (ADK) with fallback resilience pattern

## Architecture & Critical Patterns

### Backend Vertical Slice Structure (`app/modules/`)

Each module is **fully autonomous** and follows this pattern:
```
modules/MODULE_NAME/
├── interface/        # FastAPI routers (HTTP layer)
├── application/      # Use cases & orchestration (GoogleADK, Inngest)
├── domain/           # Business logic & models (Entities, ValueObjects)
├── infrastructure/   # Adapters (Database, Vector Store, Storage)
└── tests/            # Unit & gration tests
```

**Key modules:**
- `projects`: Context & artifact management (Entities, Scenarios)
- `agents`: Chat orchestration, streaming responses, tool management
- `knowledge`: RAG engine, vector embeddings, asset management
- `workflows`: Durable execution via Inngest

**Important:** Modules import from `shared/` (infrastructure & security) but NOT from other modules directly.

### Dependency Injection via FastAPI `Depends()`

All service logic is accessed through `Depends()` in routers. This pattern inverts control:
```python
# In interface/router.py
@router.get("/projects")
async def list_projects(
    projects: List[Project] = Depends(service.list_projects_use_case)
):
    return projects

# service.list_projects_use_case() is a callable that performs the logic
```

This enables testing, clean separation of concerns, and late binding of dependencies.

### AI/Agent Integration (Google ADK + Tools)

**Agents** use Google's Generative AI SDK with hybrid RAG strategy:

1. **System Instructions + Context Injection:** Core project/decision context injected into every prompt
2. **Tool-Based Retrieval:** Model has `search_knowledge_base` tool for semantic search when needed
3. **Streaming:** `/agents/chat/stream` endpoint uses **Server-Sent Events (SSE)** to stream tokens
   - Returns JSON events: `{"type": "token", "content": "..."}`
   - Frontend receives real-time updates via `ai` (Vercel AI SDK)

**Key files:** [backend/app/shared/infrastructure/adk.py](backend/app/shared/infrastructure/adk.py), [backend/app/modules/agents/interface/router.py](backend/app/modules/agents/interface/router.py)

### Vector Search & RAG

- **Embeddings:** Google Gemini Embeddings (model: `text-embedding-004`, 768-dim)
- **Storage:** Supabase pgvector with rich metadata (tags, author, source type, hub)
- **Client:** Python `vecs` library for vector management
- **Hybrid Search:** JSONB + GIN indexes for metadata filtering + vector similarity

Agents search via tool: `query_vector_db(query, filters={"hub": "design"})`

### Workflow Engine (Inngest)

Long-running agent tasks use **Inngest** for durability:
```python
# In modules/workflows/
@inngest.create_function(
    fn_id="writer_workflow",
    trigger=inngest.TriggerEvent(event="workflow/write_content"),
)
async def writer_workflow(ctx: inngest.Context, data: dict):
    # Durable, retry-safe execution
```

Register functions in [backend/main.py](backend/main.py) when creating the Inngest handler.

## Frontend Architecture

### Module Organization (`src/modules/`)

Frontend mirrors backend structure:
```
src/
├── app/              # Next.js routing (dumb containers)
├── modules/          # Vertical slices (feature UI)
│   ├── agents/       # Chat UI, streaming
│   ├── projects/     # Project management
│   └── knowledge/    # Knowledge browser
├── shared/           # Shadcn/UI components, utils, types
└── ...
```

### Streaming UI & Generative Components

Uses **Vercel AI SDK** (`ai/react`) for streaming agent responses:
```typescript
const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/agents/chat',  // Route handler (BFF pattern)
});
```

**Contract-First Components:** Define Zod schemas for dynamic UI components before generating prompts. Validate structured output before rendering.

### State Management

- **React Query:** Data fetching & caching (`@tanstack/react-query`)
- **Zustand:** Simple client state (if needed; prefer server-side state)
- **React Hook Form:** Form state (with Zod validation)

## Developer Workflows

### Running the Application

**Backend:**
```bash
cd backend
uv sync              # Install deps (uses modern Python package manager)
./start.sh           # or: export PYTHONPATH=.. && uv run uvicorn backend.main:app --reload
# API at http://localhost:8000/docs
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
# App at http://localhost:3000
```

**Local Services (MinIO, Supabase):**
```bash
docker-compose up    # Starts MinIO (S3-compatible) at localhost:9000
```

### Testing

**Backend:**
```bash
cd backend
uv run pytest                          # All tests
uv run pytest app/modules/agents/tests/  # Specific module
uv run ruff check .                    # Linting
```

**Frontend:**
```bash
cd frontend
npm run test         # Vitest
npm run test:ui      # Interactive UI
npm run lint         # ESLint
```

### Database Migrations

Alembic manages schema changes:
```bash
cd backend
uv run alembic revision --autogenerate -m "description"
uv run alembic upgrade head
```

## Configuration & Secrets

### Environment Variables

Create `.env` in root directories (backend, frontend):

**Backend (`backend/.env`):**
- `DATABASE_URL`: Async PostgreSQL URL (postgresql+asyncpg://...)
- `SUPABASE_URL`, `SUPABASE_KEY`: API keys
- `SUPABASE_JWT_SECRET`: For auth
- `GOOGLE_API_KEY`: Gemini API key
- `INNGEST_SIGNING_KEY`, `INNGEST_EVENT_KEY`: Workflow signing
- `STORAGE_*`: MinIO credentials (default: minioadmin/minioadmin)

**Frontend (`frontend/.env.local`):**
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Any public API endpoints

## Common Patterns & Conventions

### Error Handling

Backend has global exception handler in [backend/main.py](backend/main.py):
```python
@app.exception_handler(Exception)
async def debug_exception_handler(request: Request, exc: Exception):
    # Logs to api_crash.log and returns 500 with traceback
```

### Async/Await Everywhere

All database queries and API calls are **async**:
```python
async def get_db() -> AsyncGenerator:
    async with AsyncSessionLocal() as session:
        yield session

# Usage: session = Depends(get_db)
```

### Authentication

All router endpoints have `dependencies=[Depends(get_current_user)]` to enforce auth via JWT. Implement in `app/api/deps.py` and use in routers.

### Soft Deletes

Key entities (Projects, Tasks) implement `deleted_at` timestamp instead of hard deletes for audit trails.

### CORS & Middleware

CORS configured for `localhost:3000` in development. Adjust in [backend/main.py](backend/main.py) for production.

## Important Integration Points

1. **Supabase Row Level Security (RLS):** Multi-tenant data isolation at the database level
2. **Fallback Resilience:** If Google API fails (rate limit, downtime), system can fallback to mock responses or secondary providers
3. **Semantic Cache:** Deduplicates similar queries before hitting the LLM (reduces cost & latency)
4. **MinIO/S3-Compatible Storage:** Artifact storage abstraction (local dev vs. Cloud R2)

## Key Files by Purpose

| Purpose | Files |
|---------|-------|
| AI/Model integration | [backend/app/shared/infrastructure/adk.py](backend/app/shared/infrastructure/adk.py), [adk_agents.py](backend/app/shared/infrastructure/adk_agents.py) |
| Vector database | [backend/app/shared/infrastructure/vecs_client.py](backend/app/shared/infrastructure/vecs_client.py) |
| Workflow orchestration | [backend/app/shared/infrastructure/inngest_client.py](backend/app/shared/infrastructure/inngest_client.py) |
| Configuration | [backend/app/config.py](backend/app/config.py) |
| API entry point | [backend/main.py](backend/main.py) |
| DB connection | [backend/app/shared/infrastructure/database.py](backend/app/shared/infrastructure/database.py) |
| Agent routes | [backend/app/modules/agents/interface/router.py](backend/app/modules/agents/interface/router.py) |
| Knowledge/RAG | [backend/app/modules/knowledge/interface/router.py](backend/app/modules/knowledge/interface/router.py) |
| Frontend state | [frontend/src/shared/lib/hooks.ts](frontend/src/shared/lib/hooks.ts) |

## When Adding New Features

1. **Backend:** Create feature in vertical slice under `app/modules/`
   - Define domain model in `domain/models.py`
   - Implement use case in `application/service.py`
   - Expose via `interface/router.py`
   - Add tests in `tests/`

2. **Frontend:** Add corresponding UI module under `src/modules/`
   - Leverage Shadcn/UI components from `src/shared/ui/`
   - Use React Query for data fetching
   - Validate forms with Zod + React Hook Form

3. **Integrate:** Wire up router to [backend/main.py](backend/main.py) and create Next.js route handler as proxy (BFF pattern)

## Gotchas & Debugging

- **PYTHONPATH:** Backend requires `export PYTHONPATH=..` when running scripts
- **Async imports:** Some Google SDK utilities may require event loop; wrap in `asyncio.run()`
- **Vector search:** Always include metadata filters to scope results (hub, type, date)
- **SSE streaming:** Client must keep connection alive; network interruptions break stream
- **Inngest:** Requires `INNGEST_SIGNING_KEY` for production; dev mode allows empty
