# Space Canvas & Application Performance Optimization Plan

## 🎯 Objective
Resolve critical performance bottlenecks in the Space Canvas and overall application, focusing on reducing CPU load during Meta-Agent interactions and improving Core Web Vitals (specifically LCP and FCP).

## 📖 Background & Motivation
Performance profiling using Chrome DevTools revealed several issues:
1.  **LCP Delay:** The Largest Contentful Paint (agent avatars) is delayed by ~7.4s due to missing fetch priorities.
2.  **Render Blocking:** External fonts (`fonts.googleapis.com`) block initial rendering for ~3.2s.
3.  **Main Thread Overload:** Interacting with the Space Canvas (especially adding Meta-Agents) causes significant main thread blocking due to unnecessary re-renders, layout thrashing, and expensive token counting operations (partially mitigated).

## 📂 Key Files & Context
*   **Images/Avatars:** Files using Next.js `<Image>` component for agents (e.g., `agent-3.webp`).
*   **Fonts:** `src/app/layout.tsx` or similar root layout where external fonts are loaded.
*   **Space Canvas Nodes:** `src/modules/spaces/ui/SpaceCanvasPresentationView.tsx` and custom node components (e.g., `SpaceAgentCanvasNode`).
*   **Data Fetching:** Views loading `knowledge/resources` or workspaces (e.g., `SpacesBrowser`).

## 🛠️ Implementation Steps

### Phase 1: Core Web Vitals (LCP & Rendering)
1.  **Optimize LCP Images:** Identify the main hero images/avatars (e.g., `agent-3.webp` used in LCP) and add `priority={true}` and `loading="eager"` to the Next.js `<Image>` components to force early fetching.
2.  **Localize Fonts:** Replace external `fonts.googleapis.com` imports with `next/font/google` to eliminate the 3.2s render-blocking request and bundle fonts locally.

### Phase 2: Space Canvas Performance (CPU & Rendering)
1.  **Memoize Canvas Nodes:** Wrap heavy custom nodes (like `SpaceAgentCanvasNode`) in `React.memo` with proper comparison functions to prevent unnecessary re-renders when the canvas pans or zooms.
2.  **Hardware Acceleration:** Ensure animations and heavy visual effects (like the "AI working" state) use hardware-accelerated CSS properties (e.g., `will-change: transform`, `transform: translateZ(0)`, `backdrop-filter` instead of standard `blur`).
3.  **Review Derived State:** Audit hooks used in the canvas (like `useSpaceCanvasState`) to ensure they rely on derived state during render rather than syncing via `useEffect`, aligning with the "Zero useEffect" Axon standard.

### Phase 3: Perceived Performance (Suspense & Skeletons)
1.  **Implement Suspense:** Wrap critical asynchronous data boundaries (like the knowledge resources list or spaces browser) in React `<Suspense>`.
2.  **Add Skeletons:** Create and provide fallback skeleton components (e.g., `<SpaceListSkeleton />`) to provide immediate visual feedback during network requests.

## ✅ Verification & Testing
*   **LCP Check:** Verify via Lighthouse or Chrome DevTools Performance panel that the LCP time has significantly decreased (target < 2.5s).
*   **CPU Profiling:** Record a performance trace while adding and interacting with a Meta-Agent on the Space Canvas to ensure the main thread is not blocked and FPS remains stable (target 60 FPS).
*   **Visual Regression:** Ensure skeletons appear correctly during loading states and transitions are smooth.
