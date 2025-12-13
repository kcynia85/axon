# Axon Frontend — Technical Documentation

> **Role:** Developer Guide & Component Reference
> **Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI

## 🏗 System Architecture (Modular Monolith)

The frontend mirrors the backend's DDD structure in `src/modules/`.

### Core Modules
1.  **`projects`** (`src/modules/projects`)
    *   **Components:** `ProjectList`, `ProjectCard` (Shadcn UI based).
    *   **API:** `getProjects` (Fetch), `createProject`.
    *   **Tests:** Unit tests in `tests/` using Vitest + React Testing Library.

2.  **`agents`** (`src/modules/agents`)
    *   **Components:** `ChatSessionView`, `SessionMessageBubble`.
    *   **Hook:** `useAgentSession` - Manages the Chat Session lifecycle and SSE streaming.
    *   **DDD Naming:** Uses `submitUserQuery`, `sessionHistory`, `isAgentThinking` to match domain language.
    *   **Streaming:** Uses native `fetch` + `ReadableStream` to consume Server-Sent Events (SSE) from the backend.

### 🧪 Testing Strategy
- **Unit/Integration:** `Vitest` + `React Testing Library`.
- **E2E:** *Planned (Playwright)*.
- **Run Tests:** `npm run test` (mapped to `vitest run`).

### 🎨 UI Standards
- **Components:** Functional Components (Arrow Functions).
- **Styling:** Tailwind CSS.
- **State:** Server Components for initial fetch (RSC), Suspense for loading.