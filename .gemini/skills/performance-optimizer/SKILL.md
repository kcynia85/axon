---
name: performance-optimizer
description: Use this skill when analyzing and optimizing application performance, focusing on Core Web Vitals and perceived performance.
---

# Performance Optimizer Skill

This skill identifies and resolves performance bottlenecks to ensure a smooth user experience.

## Goals
- Optimize Core Web Vitals (LCP, INP, CLS).
- Improve perceived performance with optimistic UI and skeletons.
- Minimize main-thread blocking and unnecessary computations.

## Optimization Areas

### 1. Perceived Performance
- **Optimistic UI:** Update UI state immediately before API confirmation.
- **Skeleton Screens:** Show content structure during loading states.
- **Immediate Feedback:** Respond to user input within 100ms.

### 2. Rendering & Runtime
- **Minimize Re-renders:** Use `useMemo`, `useCallback`, and atomic state updates.
- **Derived State:** Compute values during render instead of in `useEffect`.
- **Hardware Acceleration:** Prefer `backdrop-filter` over standard `blur` for better performance.

### 3. Loading & Resources
- **Lazy Loading:** Defer non-critical components and images.
- **PPR (Partial Prerendering):** Enable PPR in Next.js to stream dynamic content.
- **Suspense:** Wrap async boundaries in `<Suspense>`.

## Workflow
1. Identify expensive operations and rendering bottlenecks.
2. Implement perceived performance patterns (Skeletons/Optimistic updates).
3. Analyze and reduce JS bundle size.
4. Optimize data fetching and caching strategies (TanStack Query).

## Rules
- **Feedback First:** Never let the user wait without visual feedback.
- **Avoid Copied Props:** Never copy props to state; always derive them.
- **Efficient Styling:** Prefer Tailwind CSS or standard CSS over runtime CSS-in-JS.
