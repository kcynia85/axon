# Implementation Plan - Router Studio

## Background & Motivation
Create a new **Router Studio** in the `axon-app/frontend/src/modules/studio/features` directory to manage LLM routers. Router Studio will follow the existing 3-column architectural pattern used in Agent, Crew, and Provider Studios.

## Scope & Impact
- **Module**: `axon-app/frontend/src/modules/studio/features/router-studio`
- **UI**: 3-column layout (Sidebar Navigator, Canvas with Form, Right Sidebar with Preview/Live Poster).
- **Functionality**: Create/Edit router configurations including name, strategy (Fallback/Load Balancer), and a priority chain of models.

## Proposed Solution

### 1. Data Structure & Schema (`types/router-schema.ts`)
Define the Zod schema for router configuration:
- `name`: string (alias)
- `strategy`: "fallback" | "load_balancer"
- `priority_chain`: Array of objects:
    - `model_id`: string (reference to model/provider)
    - `override_params`: boolean
    - `error_timeout`: number (seconds)

### 2. Form Logic (`application/hooks/useRouterForm.ts`)
- Use `react-hook-form` with Zod resolver.
- Manage `useFieldArray` for `priority_chain`.
- Handle save and sync-to-draft logic.

### 3. UI Components (`ui/`)
- `RouterStudioView.tsx`: Main pure view component using `StudioLayout`.
- `sections/RouterGeneralSection.tsx`: Form section for Name and Strategy (using `FormTextField` and `FormRadio`).
- `sections/RouterPriorityChainSection.tsx`: Form section for the priority chain (using `useFieldArray` and model selection via `FormSelect`).
- `components/RouterLivePoster.tsx`: Visual preview of the router (e.g., flow diagram or status).

### 4. Navigation & Routes
- Register the new studio in the main routing system (under `/settings/llms/routers/new` and `/settings/llms/routers/[id]`).

## Implementation Plan

### Phase 1: Core Definitions
1.  Create `axon-app/frontend/src/modules/studio/features/router-studio` structure.
2.  Define `RouterFormSchema` in `types/router-schema.ts`.
3.  Define constants (strategies, section identifiers) in `types/router.constants.ts`.

### Phase 2: Form Logic & Hooks
1.  Implement `useRouterForm.ts` in `application/hooks/`.
2.  Implement `useRouterStudioSectionNav.ts` for sidebar navigation.

### Phase 3: UI Implementation
1.  Implement `RouterStudioView.tsx` as a pure view.
2.  Create `RouterGeneralSection.tsx`:
    - `Nazwa (Alias)` -> `FormTextField`.
    - `Strategia` -> `FormRadio` cards for "Fallback" and "Load Balancer".
3.  Create `RouterPriorityChainSection.tsx`:
    - Use `useFieldArray` to render the list.
    - Each item shows model name (e.g., "OpenAI / GPT-4o").
    - Action buttons: "Nadpisz Params", "On Error / Timeout > 30s", "Usuń".
    - "+ Dodaj Krok" button.
4.  Implement `RouterLivePoster.tsx` for visual feedback.

### Phase 4: Integration
1.  Create `RouterStudioContainer.tsx` to bridge logic and view.
2.  Create Next.js page components for the router studio.
3.  Update navigation links in settings.

## Verification & Testing
- **Unit Tests**: Test `RouterFormSchema` and `useRouterForm` logic.
- **UI Tests**: Verify that sections are rendered correctly and `useFieldArray` operations (add/remove) work as expected.
- **E2E Tests**: Mock a save operation and verify the payload sent to the backend.
