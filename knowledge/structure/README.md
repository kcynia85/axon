# 🏗️ Structure & Code Conventions Orchestrator

This directory contains detailed documentation on specific architectural patterns.

## 🏛️ Architectures

### 1. [Modular Monolith (Next.js)](./modular-monolith-nextjs.md)
The default architecture for Next.js applications.
- **Key Concepts:** Modules First, Layer Isolation, Public API.
- **Structure:** `src/modules/`, `src/app/`.

### 2. [React SPA (Vite Standard 2025) — Simplified FSD](./react-spa-fsd.md)
The "Golden Mean" for SaaS, Dashboards, and MVP+ projects using React (Vite).
- **Key Concepts:** Features, Common (Shared Kernel), Colocation.
- **Structure:** `src/features/`, `src/common/`.

### 3. [Node.js (Express/Fastify) — Functional DDD](./nodejs-functional-ddd.md)
For backend applications without Next.js "magic".
- **Key Concepts:** Interface Layer, Use Cases, Framework Isolation.
- **Structure:** `src/modules/` with `interface/` layer.

### 4. [Python (FastAPI) — Functional DDD](./python-fastapi-ddd.md)
For Python backend services.
- **Key Concepts:** Pydantic Models, Dependency Injection, Async.
- **Structure:** `src/modules/` with Pydantic domain models.

---

> **Note:** Always adhere to the specific architecture defined for your project. If in doubt, consult the [Architecture Decision Record (ADR)](../../templates/adr-template.md).
