# 🗺 Architecture Overview: RAGAS Axon

Axon is built as a **Modular Monolith** using **Domain-Driven Design (DDD)** principles. This architecture provides the scalability of microservices with the simplicity of a single deployment unit.

---

## 🏗 Modular Monolith Design

The system is partitioned into independent **Vertical Slices** (Modules). Each slice is a self-contained unit of business logic.

### Core Modules
1.  **`agents`**: Orchestrates AI workflows. Uses **crewAI** for multi-agent collaboration and **LangChain** for LLM interactions.
2.  **`knowledge`**: The RAG (Retrieval-Augmented Generation) engine. Handles document ingestion, chunking, embedding, and semantic search via `pgvector`.
3.  **`projects`**: Manages the lifecycle of user projects, including artifacts, metadata, and workspace configuration.
4.  **`shared`**: Common infrastructure, utility functions, and global types/ports.

---

## 📐 Layered Architecture (Backend)

Inside each module in `backend/app/modules/`, logic is separated into layers:

- **`interface`**: API routes (FastAPI), request/response schemas, and SSE handlers.
- **`application`**: Use cases and orchestration logic. This layer coordinates domain entities and infrastructure adapters.
- **`domain`**: Pure business logic, entities, and value objects. **No dependencies on frameworks or IO.**
- **`infrastructure`**: Database repositories, external API clients, and specific implementations of domain ports.

### Hard Rules:
- **No Cross-Module Imports:** Modules must not import from each other. Communication happens via the `shared/` kernel or events.
- **Dependency Inversion:** High-level logic (Domain) depends on abstractions (Ports), not low-level details (Adapters).

---

## ⚛️ Frontend Architecture

The frontend uses **Feature-Sliced Design (FSD)** adapted for a vertical slice approach.

- **`src/app`**: Routing and page composition.
- **`src/modules`**: Vertical slices matching the backend. Each contains its own components, hooks, and local state.
- **`src/shared`**: Cross-cutting UI components (Shadcn/UI), utility libraries, and domain types.

---

## 🛠 Tech Stack Deep Dive

### AI & RAG
- **crewAI:** Manages hierarchical and sequential agent tasks.
- **LangChain:** Provides the abstraction layer for LLMs (Gemini, OpenAI) and Vector Stores.
- **pgvector:** PostgreSQL extension for high-performance vector similarity search.

### Execution & State
- **Inngest:** Handles durable, reliable background jobs (e.g., document indexing, long-running agent crews).
- **Vercel AI SDK:** Powers the Generative UI, allowing the LLM to trigger React component rendering directly in the chat.

### Infrastructure
- **Supabase:** Used as the primary data store and authentication provider.
- **Server-Sent Events (SSE):** Used for real-time token streaming and agent status updates.
