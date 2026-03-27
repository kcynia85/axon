# Performance Optimization Plan: /settings View

## Objective
Identify and resolve performance bottlenecks in the `/settings` view to achieve "Good" Core Web Vitals scores (LCP < 2.5s, CLS < 0.1, INP < 200ms) and improve perceived performance using optimistic UI and advanced data fetching patterns.

## Key Files & Context
- **Layout:** `axon-app/frontend/src/app/(main)/settings/layout.tsx`
- **Navigation:** `axon-app/frontend/src/modules/settings/ui/SettingsNavIsland.tsx`
- **Data Fetching:** `axon-app/frontend/src/modules/settings/application/useLLMProviders.ts`, `api.ts`
- **Views:** `axon-app/frontend/src/modules/settings/ui/LLMProvidersList.tsx`, `LLMModelsList.tsx`, etc.

## Proposed Strategy

### Phase 1: Discovery & Baseline (Chrome DevTools MCP)
1. **Lighthouse Audit:**
   - Run `mcp_chrome-devtools_lighthouse_audit` on `http://localhost:3000/settings/llms/providers`.
   - Record scores for Performance, Accessibility, and Best Practices.
2. **Performance Trace:**
   - Capture a trace during initial load and tab switching.
   - Use `performance_analyze_insight` to drill into:
     - **LCPBreakdown:** Identify if the bottleneck is TTFB, Load Delay, or Render Delay.
     - **RenderBlocking:** Check for heavy JS/CSS blocking the main thread.
3. **Network Waterfall Analysis:**
   - Use `mcp_chrome-devtools_list_network_requests` to identify redundant API calls or large assets.

### Phase 2: Perceived Performance & UX
1. **Granular Skeletons:**
   - Move from full-page loading states to component-level skeletons in `LLMProvidersList`, `LLMModelsList`, etc.
   - Ensure `SettingsNavIsland` remains interactive during data loading.
2. **Optimistic Updates:**
   - Implement optimistic UI for toggling provider status or adding new models using TanStack Query's `onMutate`.

### Phase 3: Technical Optimizations
1. **Data Prefetching:**
   - Add `onMouseEnter` prefetching to `TabsTrigger` in `SettingsNavIsland` to load subpage data before the user clicks.
   - Use `queryClient.prefetchQuery` for adjacent settings pages.
2. **Render Optimization:**
   - Memoize navigation items in `SettingsNavIsland`.
   - Use `motion.div` with `layout` prop carefully to avoid expensive layout recalculations on every render.
   - Optimize icons: Ensure Lucide icons are imported surgically to reduce bundle size.
3. **Next.js Paradigms:**
   - Verify if any settings components can be rendered as Server Components to reduce client-side JS.
   - Enable PPR (Partial Prerendering) for the settings layout if supported by the environment.

### Phase 4: LCP & CLS Specific Fixes
1. **Layout Stability:**
   - Fix potential CLS in `SettingsNavIsland` animations by providing explicit heights for tabs.
   - Ensure the `pt-[140px]` in layout is stable and doesn't cause shifting.
2. **LCP Optimization:**
   - If LCP is a text block, ensure fonts are loaded with `font-display: swap`.
   - If LCP is an icon/card, ensure it's prioritized in the render waterfall.

## Verification & Testing
1. **Post-Optimization Audit:**
   - Re-run Lighthouse and compare results.
   - Capture a new Performance Trace to verify reduced main-thread blocking.
2. **User Interaction Testing:**
   - Measure INP (Interaction to Next Paint) using `chrome-devtools` console during tab switching.

## Migration & Rollback
- Changes will be applied iteratively via small PRs.
- Features like prefetching can be toggled via local state if they cause unexpected server load.
