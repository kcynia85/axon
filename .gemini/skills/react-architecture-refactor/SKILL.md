---
name: react-architecture-refactor
description: Use this skill when refactoring React components to follow the "Pure View" principle, "Zero useEffect" paradigm, and React 19+ standards.
---

# React Architecture Refactor Skill

This skill restructures React components into a maintainable, high-performance architecture.

## Goals
- Separate UI (View) from business logic (Hooks).
- Implement the "Zero useEffect" paradigm.
- Standardize on React 19+ paradigms (Actions, useActionState).

## Target Architecture (Pure View)

**1. Container (Logic & Orchestration)**
- Manages state, API calls, and business logic.
- Uses `useActionState` for mutations.
- Renders the View.

**2. View (Pure Presentation)**
- **Naming Convention:** `[Name]View.tsx` (e.g., `ProjectDashboardView.tsx`).
- Receives typed props (data, callbacks).
- **0% Logic, 0% useEffect, 0% Business state.**
- Uses `useFormStatus` internally for button states.
- Views are pure presentation layers. Business logic, state transformations, and side effects must live outside the view. Views receive typed data via props and only render UI.

**3. Application Hook (Domain Logic)**
- Custom hooks containing feature-specific logic.
- Returns derived state instead of using `useEffect`.

**4. Types**
- Located next to the component (`[Feature].types.ts`).

## Workflow
1. Analyze the monolithic component.
2. Identify and extract side effects and mutations into Server Actions or specialized hooks.
3. Replace manual loading/error states with `useActionState`.
4. Create a "Pure View" component that only handles JSX and styling.
5. Move state-to-prop mapping into the Container.
6. Remove all unnecessary `useEffect` calls in favor of derived state.

## Rules
- **Derived State:** Calculate values during render.
- **Pure View:** Views should be deterministic and easy to test.
- **Naming:** Follow `[Name]View.tsx` strictly for UI components.
- **No classes:** Functions only.
- **Zero Manual Optimization:** Do not use `useCallback`, `useMemo`, or `React.memo`. React Compiler handles these optimizations automatically. Remove them if encountered.

## Output
- Refactored Container-Presenter pair.
- Clean application hooks.
- Standardized types file.
