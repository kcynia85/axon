# 🌐 RAGAS Axon — AI-Native Command Center

Axon is a high-performance, **AI-Native Command Center** designed for complex RAG (Retrieval-Augmented Generation) workflows, autonomous multi-agent orchestration, and deep knowledge management. It transforms static documentation into a dynamic, "living" knowledge base that agents can reason over in real-time.

---

## ✨ Key Features

- **🧠 Intelligent RAG Engine:** Advanced retrieval using `pgvector` and LangChain, supporting citations and source attribution.
- **🤖 Autonomous Agents:** Multi-agent orchestration powered by **crewAI** and **LangChain**, capable of generating artifacts and executing tasks.
- **⚡ Real-time Streaming:** Seamless, low-latency communication via **Server-Sent Events (SSE)** for AI interactions.
- **🏗 Modular Monolith:** A clean, scalable architecture following Domain-Driven Design (DDD) principles.
- **🎨 Generative UI:** Interactive components and real-time canvas built with **Next.js 16** and **Vercel AI SDK**.

---

## 🏗 High-Level Architecture

Axon follows a **Modular Monolith** pattern, ensuring high cohesion within vertical slices while maintaining clear boundaries between modules.

### 🐍 Backend (`/backend`)
- **Core:** Python 3.11+, FastAPI.
- **Orchestration:** crewAI (Agents/Tasks/Crews) + Inngest (Durable Execution).
- **AI/LLM:** LangChain (Chat models, Retrievers, Vector Stores).
- **Database:** Supabase (PostgreSQL + `pgvector`).
- **Structure:** Vertical slices (`app/modules/`) containing `domain`, `application`, and `infrastructure` layers.

### ⚛️ Frontend (`/frontend`)
- **Framework:** Next.js 16 (App Router).
- **State & AI:** Vercel AI SDK (RSC + StreamUI).
- **UI:** Tailwind CSS + Shadcn/UI.
- **Patterns:** Feature-Sliced Design (FSD) / Vertical Slices for feature isolation.

---

## 📂 Project Structure

```text
.
├── backend/            # Python FastAPI backend (The "Brain")
│   ├── app/
│   │   ├── modules/    # Vertical business slices (agents, knowledge, projects)
│   │   └── shared/     # Cross-cutting infrastructure and ports
├── frontend/           # Next.js React frontend (The "Face")
│   ├── src/
│   │   ├── modules/    # Vertical UI slices matching backend logic
│   │   └── shared/     # Reusable components and logic
├── docs/               # Detailed documentation, PRDs, and ADRs
└── data/               # Local development data and mocks
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+**
- **Python 3.11+**
- **`uv`** (Python package manager) -> `pip install uv`
- **Supabase** (PostgreSQL + pgvector)

### Setup & Run
1. **Backend:**
   ```bash
   cd backend
   cp .env.example .env
   uv sync
   uv run uvicorn app.main:app --reload
   ```
2. **Frontend:**
   ```bash
   cd frontend
   cp .env.example .env.local
   npm install
   npm run dev
   ```

---

## 🧪 Quality & Testing

| Layer | Tool | Command |
| :--- | :--- | :--- |
| **Backend Tests** | Pytest | `cd backend && uv run pytest` |
| **Backend Lint** | Ruff | `cd backend && uv run ruff check .` |
| **Frontend Tests** | Vitest | `cd frontend && npm run test` |
| **Frontend Lint** | ESLint | `cd frontend && npm run lint` |

---

## 📚 Detailed Documentation

- 🗺 **[Architecture Overview](docs/ARCHITECTURE.md)** - Deep dive into DDD and Modular Monolith.
- 🛠 **[Developer Guide](docs/DEVELOPER_GUIDE.md)** - Onboarding, workflows, and standards.
- 📋 **[Technical PRD](docs/tech_prd_axon_v2.md)** - Product requirements and roadmap.
- ⚖️ **[Architecture Decisions (ADR)](docs/ard_axon_v2.md)** - Record of key architectural choices.
