# Plan: Frontend Standardization and UI Cleanup

This plan covers the creation of a specialized `AGENTS.md` for Next.js development and a specific UI fix requested for the LLM Router Card.

## Objectives
1. **Create `AGENTS.md`**: A comprehensive guide for AI agents working on the Next.js frontend, incorporating project standards (Modular Monolith, DDD, React 19+, Pure View).
2. **UI Cleanup**: Remove the "Szczegóły Konfiguracji" (Configuration Details) link from the `LLMRouterCard` component.

## Proposed Changes

### 1. Frontend AGENTS.md (`axon-app/frontend/AGENTS.md`)
Create a new file that defines:
- **Architecture**: Vertical Slices (`src/modules`) vs Shared components (`src/shared`).
- **Core Principles**: "Pure View" (logic in hooks/services, components are just view), "Zero useEffect" (prefer loaders/mutations), React 19 standards (Server Actions vs Client Components).
- **Tech Stack**: Next.js 16, Tailwind 4, Shadcn/UI, React Query, Zustand.
- **Data Flow**: BFF (Backend-for-Frontend) patterns via Next.js Route Handlers or Server Actions.
- **Component Patterns**: Colocation of types, skeletons, and sub-components.

### 2. UI Fix in `LLMRouterCard.tsx`
- **File**: `axon-app/frontend/src/modules/settings/ui/LLMRouterCard.tsx`
- **Action**: Remove the `<Link>` component at the bottom of the card (lines 103-111).
- **Verification**: Ensure the card still looks visually appealing without the bottom border and link.

## Verification Plan

### Automated Tests
- Run `npm run lint` in `axon-app/frontend` to ensure no unused imports/variables were introduced.
- Run `npm run build` (optional, if time permits) to verify type safety.

### Manual Verification
- Verify the `LLMRouterCard` UI in the browser (if possible via screenshot/snapshot).
- Review the `AGENTS.md` content for alignment with `GEMINI.md` and existing docs.
