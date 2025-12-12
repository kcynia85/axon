# 🛠️ CORE PRINCIPLES: Universal Technical Standards
> **Role:** Foundation for all projects, regardless of the technology stack.
> **Scope:** Architecture, Security, Performance, DDD, Testing.

---

# 🏗️ Architecture & Code Quality

## 1. Modularity & Separation of Concerns
- **Modules First:** Code must be organized by domain features/modules, not just technical layers.
- **Dependency Rule:** Source code dependencies can only point inward. High-level policies should not depend on low-level details.
- **Single Responsibility Principle (SRP):** Functions and modules should have one reason to change.
- **UI vs Logic:** Presentation components should only render data. Business logic belongs in services, stores, or hooks. Side effects must be isolated.

## 2. Functional Core, Imperative Shell
- **Business Logic:** Must be pure functions (deterministic, no side effects).
- **Side Effects:** Push I/O (DB, API) to the edges of the system (Infrastructure layer).
- **No Classes:** Prefer closures and functional composition over OOP inheritance (unless framework requires it).

## 3. Code Hygiene & General Conventions
- **File Limits:** No file should exceed 500 lines. Split modules if they grow too large.
- **Naming:** Use descriptive names (`UserProfile.tsx` vs `index.tsx`) to aid fuzzy search and debugging.
- **Scripts:** Always use `defer` or `async` for external scripts to avoid blocking the main thread.

---

# 🧠 Functional Domain-Driven Design (DDD)

## Universal Rules
1. **Immutability:** Functions must return new copies of data, never mutate arguments.
2. **Type Safety:** Use schemas (Zod, Pydantic) for Value Objects and Entity validation at runtime.
3. **Ubiquitous Language:** Use specific domain verbs (e.g., `submitApplication`) instead of generic CRUD (`create`).
4. **Layering:**
   - **Domain:** Types & Pure Logic.
   - **Application:** Use Cases / Orchestration.
   - **Infrastructure:** DB / API / External Adapters.

---

# 🔒 Security & Privacy (Universal)

## 1. Zero Trust & Defaults
- **Secrets:** Never commit secrets. Use environment variables.
- **Least Privilege:** Ask for minimum permissions necessary.
- **Input Validation:** Never trust input. Validate at the entry point.

## 2. Data Protection
- **Masking:** Mask PII (emails, phones) in logs.
- **Headers:** Always apply security headers (HSTS, NoSniff, CSP).
- **Rate Limiting:** Protect public endpoints against abuse.

---

# 🚀 Performance Guidelines (Universal)

## 1. Perceived Performance
- **Optimistic UI:** Update UI immediately, sync in background.
- **Skeleton Screens:** Show structure before data loads.
- **Feedback:** Immediate response (<100ms) to user interactions.

## 2. Efficiency
- **Lazy Loading:** Load resources only when needed (defer non-critical).
- **Caching:** Cache aggressively at the edge (CDN) and locally (Browser/Client), but invalidate smart.

---

# 🧪 Testing Strategy

## 1. The Pyramid
- **Unit:** Fast, isolated tests for pure logic.
- **Integration:** Test interactions between modules/DB.
- **E2E:** Critical user flows (simulated or real browser).

## 2. Rules
- **Mocking:** Mock external services (Stripe, Email) in tests.
- **CI/CD:** Tests must pass before merge.

---

# 🚢 Deployment & DevOps Standards

## 1. Environment & Configuration
- **Validation:** Application MUST fail at startup if required env vars are missing. Use `t3-env` (JS) or `pydantic-settings` (Python).
- **Secrets:** Never commit `.env`. Use `.env.example` template.
- **Immutable Builds:** Build artifacts should be environment-agnostic (inject config at runtime/container start).

## 2. Containerization (Docker)
- **Stateless:** Apps must be stateless (session in Redis/DB, not memory).
- **Logs:** Output logs to `stdout`/`stderr` (let Docker capture them).
- **Health Checks:** Implement `/health` or `/api/health` endpoint.
