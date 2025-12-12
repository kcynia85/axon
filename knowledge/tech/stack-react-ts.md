# ⚛️ TECH STACK: React & TypeScript
> **Role:** Standards for Frontend (Next.js/Vite).

---

# 🚀 Defaults
1.  **Framework:** Next.js (App Router) or Vite.
2.  **Lang:** TypeScript (Strict).
3.  **Styling:** Tailwind CSS.
4.  **State:** Zustand (Global), TanStack Query (Server).

---

# 🏗️ AI & Generative UI (New Standard)
- **Contract-First UI:**
    - AI returns JSON (not HTML).
    - React renders "AI-Ready Components" based on schema (Zod).
- **Streaming:**
    - Use `Suspense` for all async UI.
    - Use `Vercel AI SDK` (`useChat`, `streamUI`) for LLM streaming.

---

# 🏗️ Architecture
- **Next.js:** Modular Monolith (`src/modules/`).
- **Vite:** Simplified FSD (`src/features/`, `src/common/`).

---

# 🧠 Standards
- **Fetch:** `useQuery` (Client) or direct DB call (RSC). No `useEffect` fetch.
- **Forms:** React Hook Form + Zod.
- **Perf:** Server Components by default. `"use client"` at leaves.

# 🧪 Testing
- **Runner:** Vitest.
- **Focus:** User Interaction (Testing Library).