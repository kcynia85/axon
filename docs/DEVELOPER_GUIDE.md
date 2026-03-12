# 🛠 Developer Guide: Contributing to Axon

This guide is for developers working on the Axon repository. It covers environment setup, daily workflows, and the engineering standards that keep the codebase healthy.

---

## 🏗 Coding Standards (Mandatory)

Axon follows strict coding standards for both TypeScript (Frontend) and Python (Backend). These standards are managed via **Gemini Skills** located in `.gemini/skills/` (specifically `code-review` and `react-architecture-refactor`).

### Core Principles
- **Functional-first:** Favor functions over classes.
- **Immutability:** Treat data as immutable by default.
- **Ubiquitous Language (DDD):** Use domain-specific terms (e.g., `Artifact`, `Hub`, `AgentRole`) in code and variable names.
- **Vertical Slices:** Code belongs to a business module first, then a technical layer.

---

## 🐍 Backend Workflow (Python)

We use **`uv`** as our primary dependency manager and project runner.

### 1. Daily Setup
```bash
cd backend
uv sync             # Ensure dependencies are up to date
uv run ruff check . # Check for linting issues
```

### 2. Database Migrations
We use **Alembic** for managing PostgreSQL schema changes.
- **Create Migration:** `uv run alembic revision --autogenerate -m "description"`
- **Apply Migration:** `uv run alembic upgrade head`

### 3. Running Tests
Tests are located in `backend/app/modules/<slice>/tests/`.
```bash
uv run pytest # Run all tests
```

---

## ⚛️ Frontend Workflow (Next.js)

### 1. Daily Setup
```bash
cd frontend
npm install
npm run lint
```

### 2. Component Development
- **UI Components:** Use Shadcn/UI primitives stored in `shared/ui`.
- **Business Components:** Colocate logic and UI within `modules/<slice>/components/`.
- **Zero useEffect:** Avoid `useEffect` where possible; favor Server Components, Event Handlers, or React Query for data fetching.

### 3. Running Tests
We use **Vitest** for unit and integration tests.
```bash
npm run test # Run tests in CLI
npm run test:ui # Open the Vitest UI dashboard
```

---

## 🚀 Common Tasks

### Adding a New Business Module
1. Create the folder in `backend/app/modules/<name>/`.
2. Implement the standard layers: `interface`, `application`, `domain`, `infrastructure`.
3. Register the router in `backend/app/main.py`.
4. Create the corresponding module in `frontend/src/modules/<name>/`.

### Working with Agents
- Agent roles are defined in the `agents` module.
- Prompts are managed centrally to ensure consistency.
- Any tool used by an agent must be declared in the `infrastructure` layer of the relevant module.

---

## 🧪 Definition of Done

A task is considered **DONE** only when:
1. All unit and integration tests pass.
2. The code adheres to the architecture rules (no forbidden imports).
3. The documentation in the `docs/` folder is updated if any behavior changed.
4. Linting and type-checking pass for both Frontend and Backend.
