# RAGAS Axon — AI Command Center

Axon is an AI-Native Command Center designed for complex RAG (Retrieval-Augmented Generation) workflows, autonomous agents, and knowledge management.

## 🏗 Architecture

The project follows a **Modular Monolith** architecture with a clear separation of concerns:

### 🐍 Backend (`/backend`)
*   **Framework:** Python 3.10+, FastAPI.
*   **Architecture:** Domain-Driven Design (DDD) with Vertical Slices (`modules/`).
*   **Key Modules:**
    *   `projects`: Context & Artifact management.
    *   `agents`: Orchestration (Google ADK) & Chat Sessions.
    *   `knowledge`: RAG Engine (pgvector + Assets).
    *   `workflows`: Durable execution (Inngest).
*   **Infrastructure:** Supabase (PostgreSQL + pgvector).

### ⚛️ Frontend (`/frontend`)
*   **Framework:** Next.js 16 (App Router).
*   **UI Library:** Shadcn/UI + Tailwind CSS.
*   **State:** Vercel AI SDK (RSC + StreamUI) for Generative UI.
*   **Architecture:** Feature Sliced Design (FSD) / Vertical Slices.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 20+
*   Python 3.10+
*   `uv` (Python Package Manager) -> `pip install uv`
*   Supabase Project (or local Docker)

### 1. Backend Setup
```bash
cd backend
cp .env.example .env # Configure SUPABASE_URL, SUPABASE_KEY, GOOGLE_API_KEY
uv sync              # Install dependencies
uv run uvicorn app.main:app --reload
```
API will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
App will be available at: `http://localhost:3000`

---

## 🧪 Testing

### Backend
```bash
cd backend
uv run pytest        # Run Unit & Integration Tests
uv run ruff check .  # Linting
```

### Frontend
```bash
cd frontend
npm run test         # Run Vitest
npm run lint         # Run ESLint
```

---

## 📚 Documentation
*   [Technical PRD](docs/tech-prd-axon.md)
*   [Architecture Decisions](docs/ard-axon.md)
*   [Implementation Plan](docs/IMPLEMENTATION.md)
*   [Agent Strategy](docs/agents.md)
