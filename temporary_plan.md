# Frontend Refactoring Plan - Axon Project

## 1. Analysis Summary (COMPLETED)
The analysis identified significant duplication in UI patterns and infrastructure logic. A new set of shared components and hooks has been created and implemented across core modules.

---

## 2. Refactoring Strategy (Sprints)

### Sprint 1: Shared Core (COMPLETED)
* [x] `ResourceList.tsx` - Universal list/grid handler.
* [x] `BrowserLayout.tsx` - Standardized page structure for browsers.
* [x] `FilterPill.tsx` - Reusable filter dropdowns.
* [x] `StatusBadge.tsx` - Consistent status indicators.

### Sprint 2: Infrastructure & Hooks (COMPLETED)
* [x] `authenticatedClient` - Auto-auth API client.
* [x] `useResourceFilters` - Shared logic for search/filter/sort.
* [x] `useViewMode` - Persistence for layout preferences.

### Sprint 3: Module Migration (COMPLETED)
* [x] **Refactor `projects` module:**
    * [x] `ProjectList` uses `ResourceList`.
    * [x] `ProjectsBrowser` uses `BrowserLayout`, `useResourceFilters`, and `SidePeek`.
    * [x] `ProjectCard` uses `StatusBadge`.
* [x] **Refactor `workspaces` module:**
    * [x] `WorkspacesList` uses `ResourceList`.
    * [x] `WorkspacesPage` uses `BrowserLayout` and `useResourceFilters`.
    * [x] Updated infrastructure to use `authenticatedClient`.
* [x] **Refactor `inbox` module:**
    * [x] `InboxBrowser` uses `BrowserLayout` and `useResourceFilters`.
    * [x] Integrated `StatusBadge` for inbox statuses.
* [x] **Consolidate Components:**
    * [x] Standardized `SidePeek` in `shared/ui/layout` using Radix Sheet.
    * [x] Removed duplicated `SidePeek` from workspaces module.

---

## 3. Definition of Done
* [x] No code duplication for standard list views.
* [x] Consistent loading and error states across the app.
* [x] New modules can be scaffolded by composing shared layouts and components.
* [x] API calls use a centralized, authenticated client.
