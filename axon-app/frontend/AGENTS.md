# 🤖 Frontend Agent Guide (Next.js 16 + React 19)

**Role:** Expert Frontend Architect for Axon.
**Scope:** `axon-app/frontend/`
**Philosophy:** Pure View, Zero useEffect, Modular Monolith.

---

## 🏗️ Architecture: Modular Monolith

We follow a **Vertical Slice** architecture. Logic is co-located with features.

### Directory Structure
- **`src/app/`**: Next.js App Router. Routes, Layouts, and Page containers. Pages should be "thin" adapters that compose components from `modules/`.
- **`src/modules/`**: Vertical slices (e.g., `agents`, `knowledge`, `studio`). Each slice contains its own:
  - `ui/`: Components specific to this module.
  - `application/`: Hooks, state management, and orchestration logic.
  - `domain/`: Business logic, types, and domain-specific constants.
  - `infrastructure/`: API clients, external service adapters.
- **`src/shared/`**: Global reusable assets.
  - `ui/`: Shadcn/UI components and primitive atoms.
  - `lib/`: Utilities, common hooks, and global providers.

---

## ⚛️ Core Principles

### 1. 🖼️ Pure View Principle
- **Components are View only.** They should receive data and callbacks via props or minimal module-specific hooks.
- **No Complex Logic in JSX.** Move calculations to `useMemo` or the application layer.
- **Logic belongs in Hooks/Services.** Business rules stay in `domain/` or `application/`.

### 2. ⏳ Zero useEffect Paradigm
- **Avoid `useEffect` for data fetching.** Use **React Query** (`useQuery`) or Next.js **Server Components**.
- **Avoid `useEffect` for state synchronization.** Use derived state or event handlers.
- **React 19 Hooks:** Prefer `useActionState`, `useFormStatus`, and `useOptimistic` for form handling.

### 3. 🧪 Testing & Verification
- **Unit Tests:** Logic in `domain/` and `application/` (Vitest).
- **Component Tests:** User interactions (Testing Library).
- **E2E Tests:** Critical user paths (Playwright).

---

## 🛠️ Tech Stack Standards

- **Next.js 16 (App Router):** Use Server Components by default. Use `"use client"` only for interactivity.
- **React 19:** Leverage new `use` hook and improved ref handling.
- **Tailwind CSS 4:** Use utility-first styling. Avoid complex CSS-in-JS.
- **Zustand:** For global client-side state (keep it minimal).
- **React Query:** Mandatory for all server-state management and caching.
- **Zod:** Mandatory validation for API responses and Form schemas.

---

## 🚦 Hard Rules (Non-Negotiable)

1.  **Strict Typing:** No `any`. Use TypeScript `type` for contracts and `interface` only when extending.
2.  **Immutability:** Never mutate state or props. Use spread operators or `immer`.
3.  **Colocation:** Keep types, skeletons, and sub-components in the same directory as the main component.
4.  **Error Boundaries:** Wrap feature modules in Error Boundaries.
5.  **Performance:** Memoize expensive components with `React.memo` only after profiling.
6.  **Accessibility:** All interactive elements must be keyboard navigable and ARIA compliant.

---

## 🔄 Interaction with Backend (BFF)

- **Next.js Route Handlers:** Use as a proxy to the Python FastAPI backend to handle CORS and secrets.
- **Server Actions:** Preferred for mutations that don't require real-time streaming.
- **Streaming:** Use `ai` (Vercel AI SDK) for token streaming from agent endpoints.
