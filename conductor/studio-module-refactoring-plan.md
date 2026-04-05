# Studio Module Refactoring Plan

## 🎯 Objectives & Core Principles
Refactor the `studio` module to adhere to the "Pure View" principle, "Zero useEffect" paradigm, and React 19 standards as outlined in the [Module-by-Module Refactoring Plan](../module-refactoring-plan.md).

### 🛡️ General Quality Standards (Inherited from Parent Plan)
- **Naming & Readability:** Full descriptive names MUST be used everywhere. ABSOLUTELY NO ABBREVIATIONS (e.g., no `err`, `btn`, `cfg`, `ctx`, `usr`, `msg`, `s`, `val`, `opt`, `e`). Variables must describe their exact purpose.
- **Architecture & DDD:** Adhere to Ubiquitous Language. Inputs and forms must be validated using Zod.
- **Principles:** SRP, ISP, DRY, functional-first, immutability by default. Generic functions over specific.
- **Explicit > Implicit:** Zero magic. All dependencies and states must be explicitly passed.

## 🛠 Targeted Components

### 1. `Knowledge Studio` (Priority)
- **Problem:** `KnowledgeStudioView` contains business logic (`useForm`), data fetching (`useChunkingStrategies`), and manual DOM/Scroll management.
- **Solution:** 
    - Move `useForm` and `useChunkingStrategies` to `KnowledgeStudioContainer` or a new `useKnowledgeForm` hook.
    - Replace manual scrolling logic with `useStudioScrollSpy`.
    - Refactor `KnowledgeStudioView` to be a "Pure View" receiving all data and callbacks as props.

### 2. `Agent Studio`
- **Problem:** `AgentStudioView` and `AgentStudio.tsx` have overlapping responsibilities. `AgentStudioView` is not consistently used as the primary presenter.
- **Solution:** 
    - Ensure `AgentStudioView` is the absolute pure presenter.
    - Consolidate orchestration in `AgentStudio.tsx` (Feature Component) and `AgentStudioContainer.tsx` (Data Component).

### 3. `useStudioScrollSpy` Shared Hook
- **Problem:** `setCanvasContainerReference` returns a cleanup function (disconnect) that is currently ignored by React `ref` callbacks.
- **Solution:** Refactor to handle cleanup properly, possibly by storing the observer in a ref and disconnecting before creating a new one.

### 4. Other Studios (Audit & Refactor)
- Audit `automation-studio`, `template-studio`, `router-studio`, etc., for:
    - `useEffect` usage.
    - Inlined business logic in View components.
    - Manual performance optimizations (`useMemo`, `useCallback`, `React.memo`) - remove them to let the React Compiler handle it.

## 📋 Implementation Steps

### Phase 1: Shared Infrastructure
1. **Fix `useStudioScrollSpy`:** Ensure `IntersectionObserver` is properly cleaned up.
2. **Standardize `StudioDiscovery`:** Ensure it's a Pure View used consistently across all studios.

### Phase 2: Knowledge Studio Refactor
1. **Create/Update Hooks:** 
    - Move data fetching and form logic to `useKnowledgeStudio` or a specialized hook.
2. **Refactor `KnowledgeStudioView.tsx`:**
    - Remove all `useForm`, `useState`, `useRef`, `useChunkingStrategies`.
    - Define a strict `KnowledgeStudioViewProps` interface.
3. **Update `KnowledgeStudioContainer.tsx`:**
    - Orchestrate the data fetching and pass it down.
    - Implement the "Container -> Feature -> Pure View" hierarchy if appropriate.

### Phase 3: Global Studio Audit
1. **Identify and Remove manual optimizations:** Search for `useCallback`, `useMemo` across the `studio` module and remove them.
2. **Verify Server Actions:** Ensure all studio "Save" operations utilize React 19 Actions/Transitions where possible (already partially done in some studios).

## 🧪 Verification
- **Functional:** Verify all studios (Agent, Knowledge, Crew, etc.) still work correctly, especially scrolling navigation and saving.
- **Architectural:** 
    - 0 `useEffect` in View components.
    - 0 business logic in View components.
    - 0 manual optimizations (`useMemo`, `useCallback`).
    - Clear separation: `Container` (data) -> `Feature` (orchestration) -> `Pure View` (UI).
