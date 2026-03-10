# ⚛️ TECH STACK: React & TypeScript
> **Role:** Standards for Frontend (Next.js/Vite).

---

# 🚀 Defaults
1.  **Framework:** Next.js (v16+) or Vite.
2.  **Lang:** TypeScript (Strict).
3.  **Styling:** Tailwind CSS.
4.  **State:** Zustand (Global), TanStack Query (Server State), and Local State (direct).

---

# 🏛️ Architecture & Rendering (Modern Next.js)
- **Server Actions:** Use `"use server"` for data mutations instead of traditional API Routes. Call them directly from client components.
- **Suspense & Error Boundaries:** Wrap async components in `<Suspense fallback={<Skeleton />}>` and use `error.tsx` (Next.js) to isolate UI failures. Avoid manual `if (isLoading)` and `if (isError)` conditional returns.
- **Partial Prerendering (PPR):** Enable PPR where applicable to serve a static HTML shell instantly while streaming dynamic parts (wrapped in Suspense) in the background.

---

# 🚫 "Zero useEffect" Paradigm
Treat `useEffect` strictly as an *escape hatch*, never as a standard tool for business logic.
- **Derived State:** Calculate values directly during render. Never copy props to state.
- **Event Handlers:** Execute side effects (fetching, routing, storage) inside event handlers (`onClick`, `onSubmit`), not in effects.
- **Data Fetching:** Absolute ban on fetching inside `useEffect`. Use Server Components or TanStack Query.
- **React 19+ Actions:** Use `useActionState`, `useFormStatus`, and `useOptimistic` instead of manual loading flags.
- **DOM & Subscriptions:** Use ref callbacks, native browser APIs, or `useSyncExternalStore`.

---

# 🧠 Core Libraries & Patterns
- **Data Fetching:** Next.js RSC for initial loads; `TanStack Query` for client interactivity, caching, and mutations.
- **Forms:** React Hook Form + Zod. Integrate natively with Server Actions or TanStack mutations.
- **Authentication:** Better Auth (default for new apps).

---

# 🧩 UI & Components
- **Native Browser APIs:** Use the native **Popover API** as the default for Context Menus, Dropdowns, Tooltips, Dialogs, and Toggles (improves performance, zero JS conditional rendering).
- **Headless UI:** For complex accessible components lacking native support (e.g., advanced comboboxes, date pickers, focus-trapped modals), use **Radix UI Primitives** or **React Aria**. Do not build them from scratch.

---

# 🛠️ DX & Tooling
- **Linting & Formatting:** **Biome** (blazing fast, all-in-one Rust-based replacement for ESLint + Prettier).
- **Testing (E2E):** **Playwright** (modern, fast, default choice).
- **Testing (Unit):** **Vitest** (fast, lightweight, out-of-the-box TypeScript support).

---

# 🌐 TanStack Ecosystem
Use as recommended dependencies to reduce complexity:
- **Query:** Async data fetching/caching.
- **Router:** Type-safe routing (for Vite/SPAs).
- **Others:** Pacer, DB, Store, Table, Form, Virtual (evaluate stability before production use).

---

# 🎨 Styling
- **Stack:** Tailwind CSS (default) or CSS Modules. Avoid Styled-components and BEM in JS.
- **Layout:** CSS Grid & Flexbox.
- **DOM Selectors:** Mark elements grabbed in vanilla JS with a `js-` class (e.g., `.js-menu-trigger`).
- **Performance:** Prefer `backdrop-filter` (hardware accelerated) over a standard `blur`.
- **Global Reset:** Apply `box-sizing: border-box` and font smoothing in global CSS.