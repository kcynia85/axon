# Space Canvas GPU Optimization Plan

## 🎯 Objective
Achieve perfectly smooth 60 FPS interactions (zooming, panning, dragging) on the Space Canvas by eliminating expensive CSS properties, preventing unnecessary reflows/repaints, and optimizing GPU composition layers according to modern CSS rendering best practices.

## 📖 Background & Motivation
The Space Canvas renders many interactive nodes simultaneously. While previous optimizations removed basic transparency, the canvas still utilizes CSS patterns that can trigger layout recalculations (reflows) or excessive GPU memory usage (VRAM) due to over-layered composition. Applying strict CSS optimization rules will ensure the canvas scales to hundreds of nodes without lag.

## 📂 Scope & Impact
*   **Target Files:** 
    *   `axon-app/frontend/src/modules/spaces/ui/pure/SpaceCanvasPresentationView.tsx` (Global canvas styles and animations)
    *   `axon-app/frontend/src/modules/spaces/ui/nodes/pure/*` (Node container structures)
*   **Impact:** Significantly reduced CPU/GPU usage during canvas interactions. Minimal visual changes, profound performance improvements.

## 🛠️ Proposed Solution & Best Practices
We will apply the following optimization techniques:
1.  **Strict Layer Isolation (`contain` property):** Prevent node layout changes from affecting the rest of the canvas DOM.
2.  **Pseudo-element Animation:** Replace direct property animations (like `border-color` or `box-shadow` in the AI working state) with opacity animations on a dedicated pseudo-element layer.
3.  **Disciplined `will-change` Usage:** Remove static `will-change` declarations that force the browser to keep hundreds of idle nodes in active GPU memory (VRAM).
4.  **Hardware-Accelerated Properties:** Ensure *only* `transform` and `opacity` are animated.

## 🚀 Implementation Steps

### Phase 1: Layer Isolation & CSS Containment
1.  **Apply `contain` Property:** Add `contain: layout style paint;` (or `contain: strict;` if dimensions are fully explicit) to the `.node-container` base class. This tells the browser that changes inside a node will never affect the layout outside of it, drastically speeding up rendering.

### Phase 2: Refactoring Heavy Animations
1.  **AI Working State (`.ai-working-node`):**
    *   Currently, the `@keyframes ai-glow-pulse-safe` animates `border-color` and `box-shadow`. This triggers expensive repaints.
    *   **Fix:** Refactor `.ai-working-node` to utilize a pseudo-element (`::before` or `::after`). We will set the static shadow and border on the pseudo-element and animate *only* its `opacity` (from 0 to 1).
2.  **Shimmer Effects:** Verify that `.ai-shimmer-layer` and `.text-shimmer` animations are as cheap as possible (e.g., using `transform: translate()` instead of `background-position` if feasible, though `background-position` is acceptable if isolated).

### Phase 3: Managing GPU Memory (VRAM)
1.  **Remove Static `will-change`:** In `SpaceCanvasPresentationView.tsx`, the `.node-container` currently has `will-change: transform, opacity;` applied globally. If there are 100 nodes, the browser creates 100 active GPU layers, choking VRAM.
2.  **Dynamic VRAM Allocation:** Remove `will-change` from static node classes. Rely on React Flow's native dragging optimizations or only apply `will-change` dynamically when a node is actively being dragged or animated.

## ✅ Verification
*   **DevTools Rendering Tab:** Enable **Paint flashing** and **Layer borders**. Ensure that panning the canvas does not trigger massive green paint flashes across all nodes. Ensure we don't have thousands of unnecessary orange GPU layer borders.
*   **Performance Profiling:** Record a trace while adding a Meta-Agent. Verify that long frames (>16ms) caused by "Update Layer Tree" or "Paint" are eliminated.
