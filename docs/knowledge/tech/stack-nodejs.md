# 🟢 TECH STACK: Node.js Backend
> **Role:** Standards for Backend-only JS/TS projects (Express, Fastify).

---

# 📚 Shared Foundation
**REQUIRED:** [Load Backend TS Common Standards](backend-ts-common.md) (Validation, DB, Error Handling).

---

# 🚀 Defaults
1.  **Runtime:** Node.js 20+ (LTS).
2.  **Framework:** Fastify (Perf) or Express (Simple).
3.  **Lang:** TypeScript (Strict).

---

# 🏗️ Architecture

## 1. Functional DDD (Standard)
**Structure:**
- `src/interface/` (HTTP/Controllers)
- `src/application/` (Use Cases)
- `src/domain/` (Pure Logic)
- `src/infrastructure/` (DB/External)

## 2. Hexagonal Architecture (AI Requirement)
**Rule:** When integrating LLMs (OpenAI/Anthropic), use **Ports & Adapters**.
- **Port:** `domain/ports/ai-provider.ts` (Interface)
- **Adapter:** `infrastructure/adapters/openai.ts` (Implementation)
- **Goal:** Swap models without touching Domain.

---

# 🧠 Standards
- **Async/Await:** Everywhere.
- **Logging:** `pino` (JSON struct).
- **Testing:** Vitest + Testcontainers.