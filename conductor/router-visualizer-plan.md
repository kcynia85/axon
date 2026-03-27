# Router Visualizer Plan

## Objective
Update the `RouterLivePoster` component to include a live visualizer of the router priority chain using `framer-motion` and `react-hook-form`, creating a visually twin component to the `CrewLiveGraph` found in Crew Studio.

## Changes

1. **`useRouterGraph.ts` (New Hook)**
   - **Path:** `axon-app/frontend/src/modules/studio/features/router-studio/application/useRouterGraph.ts`
   - **Logic:** Parse `RouterFormData` using `useWatch` (`name`, `strategy`, `priority_chain`).
   - **Graph Calculation:** Determine `nodes` and `edges` based on the strategy.
     - `fallback`: Arrange models sequentially, linked one after another.
     - `load_balancer`: Arrange models in parallel, fanning out from the main router node.

2. **Graph Components (New Files)**
   - **Path:** `axon-app/frontend/src/modules/studio/features/router-studio/ui/components/graph/`
   - **Files:** `RouterLiveGraph.tsx`, `GraphNode.tsx`, `GraphEdge.tsx`
   - **Implementation:** Port logic from Crew Studio's graph components, maintaining the pan and zoom (`framer-motion`) behaviors. Adjust node visuals to use appropriate icons (e.g., `Network` for the router, `Cpu` for models) instead of Avatars, and resolve model names from `ALL_MODELS` constant.

3. **`RouterLivePoster.tsx` (Update)**
   - **Path:** `axon-app/frontend/src/modules/studio/features/router-studio/ui/components/RouterLivePoster.tsx`
   - **Implementation:** Replace the current static placeholder with the new `RouterLiveGraph` component.

## Verification
- Test that the graph re-renders dynamically when priority chain items are added, removed, or their models change.
- Test that pan and zoom behaviors work.
- Validate the "Pure View" and architecture constraints against `.gemini` skills and rules.