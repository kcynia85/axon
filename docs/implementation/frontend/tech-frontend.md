# Axon Frontend — Technical Documentation

> **Role:** Developer Guide & Component Reference
> **Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI

## 🏗 System Architecture (Modular Monolith + Vertical Slices)

The frontend mirrors the backend's DDD structure in `src/modules/`, utilizing **Vertical Slice Architecture** to organize code by feature rather than technical layer.

### 📂 Directory Structure (Standard)

```text
src/
├── app/                        # Next.js App Router (Routing & Layouts)
│   ├── dashboard/page.tsx      # Fetches data -> Renders <ProjectList /> from modules
│   ├── brain/page.tsx          # Brain / Knowledge Browser
│   └── ...
│
├── shared/                     # GLOBAL KERNEL
│   ├── domain/                 # Global Value Objects (UniqueId, Email)
│   ├── ui/                     # Shadcn/UI Design System
│   └── lib/                    # Infrastructure Abstractions (API Client, Utils)
│
└── modules/                    # BOUNDED CONTEXTS
    ├── projects/               # [MODULE]
    │   ├── index.ts            # Public API (Barrel file for app/*)
    │   ├── domain/             # CENTRAL DOMAIN (Entities, Types - Pure TS)
    │   │   └── index.ts        # export interface Project {...}
    │   │
    │   └── features/           # VERTICAL SLICES
    │       ├── browse-projects/# [SLICE: Feature A]
    │       │   ├── ui/         # Components (<ProjectList>)
    │       │   ├── application/# Hooks (useProjectList), State
    │       │   └── infrastructure/ # API calls (getProjects)
    │       │
    │       ├── create-project/ # [SLICE: Feature B]
    │       │   ├── ui/
    │       │   ├── application/
    │       │   └── infrastructure/
```

### 👨‍💻 Developer Guide: Rules of Engagement

#### 1. Import Rules (Clean Architecture)
*   **Public Module API (`modules/[name]/index.ts`):**
    *   **Rule:** When inside `app/` or *another* module, import ONLY from here.
    *   ✅ `import { ProjectList } from "@/modules/projects";`
    *   ❌ `import { ProjectList } from "@/modules/projects/features/browse/ui/list";` (Strict Encapsulation)
*   **Inside a Slice (`features/[slice]/`):**
    *   **Rule:** You have full access to your own `ui`, `application`, `infrastructure`.
    *   **Rule:** You can import from the **Module Domain** (`../../domain`).
    *   ✅ `import { Project } from "../../../domain";`
*   **Domain (`modules/[name]/domain`):**
    *   **Rule:** The Holy Grail. Pure TypeScript. NO imports from `ui` or `infrastructure`.

#### 2. Where to add code?
*   **New Feature (e.g., "Archive Project"):**
    1.  Create `src/modules/projects/features/archive-project/`.
    2.  Scaffold `ui/`, `application/`, `infrastructure/`.
    3.  Export public components in `modules/projects/index.ts`.
*   **Global UI Change:** `src/shared/ui/`.
*   **Business Logic Change:** `src/modules/[module]/domain/`.

### Core Modules
1.  **`projects`** (`src/modules/projects`)
    *   **Components:** `ProjectList`, `ProjectCard`.
    *   **Features:** `browse-projects`, `create-project`.
    *   **API:** `getProjects` (Fetch).

2.  **`agents`** (`src/modules/agents`)
    *   **Components:** `ChatSessionView`, `SessionMessageBubble`.
    *   **Hook:** `useAgentSession`.
    *   **Streaming:** Uses native `fetch` + `ReadableStream` (SSE).

### 🧪 Testing Strategy
- **Unit/Integration:** `Vitest` + `React Testing Library`.
- **E2E:** *Planned (Playwright)*.
- **Run Tests:** `npm run test` (mapped to `vitest run`).

### 🎨 UI Standards
- **Components:** Functional Components (Arrow Functions).
- **Styling:** Tailwind CSS.
- **State:** Server Components for initial fetch (RSC), Suspense for loading.