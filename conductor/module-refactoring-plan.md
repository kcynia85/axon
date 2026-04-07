# Comprehensive Frontend Module Refactoring Plan

## 🎯 Objectives & Core Principles
This plan outlines a systematic refactoring strategy focused strictly on the Frontend (Next.js & React) for the Axon workspace. It is based entirely on the updated `code-review` skill, which now incorporates the core principles of `react-architecture-refactor`.

### Universal Coding Standards
- **Readability:** Full, descriptive names (no `err`, `btn`, `cfg`, `ctx`, `usr`, `msg`).
- **Principles:** Explicit over implicit, KISS, DRY, SRP (one function = one logic task), ISP, and functional-first.
- **Safety & Quality:** Immutability by default. Strict type safety (no `any`, prefer `type`). Inputs validated with Zod.
- **DDD & Architecture:** Layer integrity (no logic leaks). Cross-module imports via `index.ts` barrel files.

### React-Specific Architecture (Pure View & Containers)
- **Pure View (`[Name]View.tsx`):** UI components must be pure presentation with 0% logic, 0% `useEffect`, and 0% business state.
- **Containers & Application Hooks:** All business logic, state management, and orchestration must live here, not in the View.
- **Zero `useEffect`:** Only used as an absolute escape hatch. Favor derived state and event handlers.
- **React 19 Actions:** Use `useActionState` and `useFormStatus` for all mutations and button states.
- **Zero Manual Optimization:** Do NOT use `useCallback`, `useMemo`, or `React.memo`. Let React Compiler handle it. Remove them if encountered.
- **Colocated Types:** Types live next to the component (`[Feature].types.ts`).

---

## 🔄 Operational Pipeline (Research -> Strategy -> Execution)
To guarantee determinism and recoverability across sessions, the refactoring of **every single module** must strictly follow this pipeline. This ensures that the AI agent has grounded, empirical knowledge of the module's current state before applying any architectural changes.

### 1. Research (Re-Contextualization)
*Before writing any code or proposing a solution for the module:*
- **Scan Structure:** Use `list_directory` or `find_file` to map the specific files inside the module.
- **Analyze Symbols:** Use `get_symbols_overview` or `find_symbol` to understand the existing components, hooks, and types.
- **Verify Dependencies:** Read the critical files to understand what needs to be decoupled (e.g., finding `useEffect` hooks, spotting business logic inside UI components).

### 2. Strategy (Tactical Planning)
*After research, but before execution:*
- **Draft Module Plan:** State exactly which files will be renamed to `[Name]View.tsx`, which logic will move to a Container/Hook, and how state/mutations will be handled via Actions.
- **Speak Before You Act:** Present this tactical plan to the user in extreme brevity (bullet points) and wait for confirmation if the change is structurally significant.

### 3. Execution (Plan -> Act -> Validate)
*Applying the changes safely:*
- **Act:** Perform targeted file edits using the appropriate symbolic or file replacement tools. Ensure idiomatic correctness (e.g., no `any`, Zod validations).
- **Validate:** Verify the structural integrity. Run type-checking (`tsc`), linting, and tests to confirm the module is green before moving to the next one.

---

## 🔍 Module-by-Module Execution Strategy

### 1. `agents`
- **Focus:** Extract business logic (creation/updates) from views into custom application hooks or Containers.
- **Actions:** 
  - Restructure into `AgentCardView.tsx` and `AgentDetailsView.tsx` as Pure Views. 
  - Migrate mutations to `useActionState`.
  - Remove any manual memoization and replace `useEffect` data fetching with Server Components / Hooks.

### 2. `auth`
- **Focus:** Eliminate `useEffect` on mount for session checking.
- **Actions:** 
  - Ensure authentication state aligns with Next.js middleware and Server Components.
  - Create `LoginView.tsx` avoiding side effects on mount. Rely strictly on server actions.

### 3. `dashboard` (includes `home`)
- **Focus:** Performance and Pure View adherence.
- **Actions:** 
  - Convert widgets into Pure Views (`HomeView.tsx`) receiving typed props.
  - Remove all manual performance optimizations (`React.memo`, `useMemo`).

### 4. `inbox`
- **Focus:** Real-time updates and polling without `useEffect`.
- **Actions:** 
  - Isolate message rendering into `MessageItemView.tsx` and `InboxListView.tsx`.
  - Move selection and read/unread logic into a Container using Server Actions. Remove chaotic `useEffect` chains.

### 5. `projects`
- **Focus:** DRY principle and Zod validation.
- **Actions:** 
  - Centralize duplicated logic shared with workspaces into custom application hooks.
  - Implement `[Name]View.tsx` patterns. Validate forms using Zod before submission via Server Actions.

### 6. `prompts`
- **Focus:** Decoupling UI from complex wrappers.
- **Actions:** 
  - Create Pure Views for display forms.
  - Ensure prompt saves use `useActionState` and colocated types (`prompts.types.ts`).

### 7. `resources`
- **Focus:** File upload state management.
- **Actions:** 
  - Implement Pure Views for display.
  - Ensure file uploads are managed strictly through Server Actions and standard form patterns, eliminating `useEffect`.

### 8. `settings` & `system`
- **Focus:** Layer integrity and clean configuration tabs.
- **Actions:** 
  - Clean up configuration tabs to follow strict "Pure View" patterns.
  - Implement Zod validation on configuration forms, handled purely by actions.
  - Enforce consistent folder structure and remove `any` types.

### 9. `spaces`
- **Focus:** Deterministic state extraction.
- **Actions:** 
  - Extract interactive state to deterministic Containers. 
  - Present spaces via pure stateless components reliant on well-defined prop contracts.

### 10. `studio`
- **Focus:** Complex interactivity and drag-and-drop.
- **Actions:** 
  - Isolate client-side interactivity. 
  - Refactor `StudioCanvasView.tsx` as a pure presenter. Handle state logic in a dedicated container.
  - Remove `useCallback` and `useMemo` hooks entirely.

### 11. `tools`
- **Focus:** Local state syncing and client-side rendering.
- **Actions:** 
  - Extract state to containers. 
  - Ensure `ToolConfigView.tsx` relies only on props. Apply strict Zod validation on form submission via Actions.

### 12. `workspaces`
- **Focus:** DRY and Pure View.
- **Actions:** 
  - Refactor to reuse logic with `projects`.
  - Enforce Pure View components for workspace lists and settings.

---

## 🛠 Next Steps
1. **Approval:** Review this frontend-focused module-by-module plan based on the updated `code-review` principles.
2. **Transition:** Upon exiting Plan Mode, I will immediately merge the `react-architecture-refactor` rules into `.gemini/skills/code-review/SKILL.md` (including the **Zero Manual Optimization** rule) and delete the redundant `react-architecture-refactor` skill.
3. **Execution:** Proceed with refactoring one module at a time following the "Speak Before You Act" and "Extreme Brevity" rules.