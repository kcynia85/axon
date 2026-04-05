# Comprehensive Module-by-Module Refactoring Plan

## 🎯 Objectives & Core Principles
This plan outlines a systematic refactoring strategy for the Axon workspace (Frontend and Backend) adhering strictly to project guidelines and the specific `.gemini` skills (`code-review`, `nextjs-architecture-audit`, `python-fastapi-expert`, `react-architecture-refactor`).

### General Quality Standards (Code Review)
- **Naming & Readability:** Full descriptive names. No abbreviations (`err`, `btn`, `cfg`, `ctx`, `usr`, `msg`).
- **Architecture & DDD:** Adhere to Ubiquitous Language. Validate inputs using Zod/Pydantic.
- **Principles:** SRP, ISP, DRY, functional-first, immutability by default. Generic functions over specific.
- **Explicit > Implicit:** Zero magic.

---

## 🎨 Frontend Refactoring (Next.js & React)
**Core Standards (`react-architecture-refactor`, `nextjs-architecture-audit`):**
- **Architecture Audit:** Maximize Server Components, push Client Components to the leaves. Remove duplicated logic, ensure data fetching patterns utilize React 19 capabilities (e.g., RSCs).
- **Pure View Principle:** UI components (`[Name]View.tsx`) must contain 0% business logic and 0% `useEffect`. They should purely render UI and utilize `useFormStatus` internally for states.
- **Zero useEffect:** Remove all `useEffect` calls in favor of derived state or specialized hooks.
- **Zero Manual Optimization:** Remove all `useCallback`, `useMemo`, and `React.memo` usages. React Compiler handles these optimizations automatically.
- **Containers & Actions:** Business logic stays in Container components or custom application hooks. Mutations must use React 19 Actions (`useActionState`).

### Module-by-Module Execution Strategy

#### 1. `agents`
- **Audit:** Analyze `page.tsx` and nested components to push data fetching into Server Components.
- **Refactor:** Restructure agent cards and details into Pure Views (`AgentCardView.tsx`, `AgentDetailsView.tsx`).
- **Actions:** Migrate agent creation/updates from `useEffect`/client mutations to `useActionState`.

#### 2. `auth`
- **Audit:** Ensure authentication state aligns with Next.js middleware and Server Components best practices.
- **Refactor:** Create `LoginView.tsx` avoiding any side effects on mount. Rely on actions to handle sign-ins.

#### 3. `home` (located in `dashboard` folder)
- **Audit:** Evaluate performance of the home view. Ensure data is fetched efficiently via Server Components.
- **Refactor:** Convert complex widget components into Pure Views (`HomeView.tsx`) receiving typed props. Implement custom hooks to handle data derivations if any interactivity is required.

#### 4. `inbox`
- **Audit:** Verify real-time updates/polling (if any) are implemented idiomatically without chaotic `useEffect` chains.
- **Refactor:** Isolate message rendering into `MessageItemView.tsx` and `InboxListView.tsx`. Ensure container handles selection and marking read/unread via Server Actions.

#### 5. `projects` & `workspaces`
- **Audit:** Eliminate shared/duplicate state logic between workspaces and projects.
- **Refactor:** Centralize logic into custom application hooks. Convert project and workspace settings/lists into `[Name]View.tsx` patterns. Validate all forms using Zod before submission via Server Actions.

#### 6. `prompts` & `resources`
- **Audit:** Check for overly heavy client bundles due to editors or file uploaders.
- **Refactor:** Decouple standard UI from complex third-party wrappers. Use Pure Views for display forms. Ensure file uploads and prompt saves use `useActionState`.

#### 7. `settings` & `system`
- **Audit:** Review routing structure. Ensure system configuration forms do not leak state globally unnecessarily.
- **Refactor:** Clean up configuration tabs. Apply strict "Pure View" patterns. Implement Zod validation on configuration forms.

#### 8. `spaces`, `studio`, `tools`
- **Audit:** These interactive modules often contain hidden `useEffect` spaghetti for drag-and-drop or canvas logic. Isolate client-side interactivity properly.
- **Refactor:** Extract state to deterministic Containers. Leave `StudioCanvasView.tsx` or `ToolConfigView.tsx` as pure presenters relying on well-defined prop contracts.

---

## ⚙️ Backend Refactoring (Python FastAPI)
**Core Standards (`python-fastapi-expert`):**
- **Modular Monolith:** Strict layer isolation per module (`domain/`, `application/`, `infrastructure/`, `interface/`).
- **Pydantic Everything:** Use Pydantic V2 strictly for all DTOs and Domain Models. No raw dicts.
- **SQLAlchemy 2.0 & Async:** `async def` for I/O, `AsyncSession` with 2.0 execution (`select`, `execute`).
- **Dependency Injection:** Use `FastAPI.Depends` injected at the router level. Never import services globally.

### Module-by-Module Execution Strategy

#### 1. `agents` & `workspaces`
- **Audit:** Verify that routers (`interface/`) inject dependencies correctly and don't contain business logic.
- **Refactor:** Move agent execution/configuration logic into the `application/` layer. Ensure `domain/` contains only pure functions and Pydantic schemas. Migrate any legacy ORM queries to SQLAlchemy 2.0 async.

#### 2. `inbox`
- **Audit:** Ensure database operations are fully async. Check for potential N+1 query issues.
- **Refactor:** Implement strict Pydantic DTOs for inbox messages. Refactor infrastructure repositories to return Domain objects, not SQLAlchemy models directly to the router.

#### 3. `knowledge` & `resources`
- **Audit:** Vector databases or file handling often leak into routers.
- **Refactor:** Isolate external API clients (e.g., embeddings, storage) in the `infrastructure/` layer. Application services orchestrate the embedding and saving processes. Routers only handle `UploadFile` and pass Pydantic models to services.

#### 4. `projects` & `spaces`
- **Audit:** Verify domain constraints (e.g., spaces belonging to projects) are enforced in the domain layer, not just at the DB constraint level.
- **Refactor:** Implement pure Python functions in `domain/` for validations. Ensure strict static typing (`mypy`/`pyright`) across all functions.

#### 5. `settings` & `system`
- **Audit:** Check for global state variables or tightly coupled configurations.
- **Refactor:** Inject configuration via FastAPI dependencies. Refactor system health checks and configuration endpoints to use strict DTOs.

## 🛠 Next Steps
1. **Approval:** Review this module-by-module plan.
2. **Execution:** Proceed with refactoring, addressing one module at a time. Each step must adhere strictly to the "Speak Before You Act" and "Extreme Brevity" rules during implementation.