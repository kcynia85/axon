# Plan: Model Studio Implementation

This plan details the implementation of a new "Model Studio" for adding/editing LLM Models in the Axon frontend, aligning with the provided mockups and existing architecture.

## 1. Objectives & Scope
-   **Path:** `src/app/(studio)/settings/llms/models/new` (and `[id]` for editing).
-   **Layout:** Standard `StudioLayout` (3-column: Navigation, Editor, Canvas/Preview).
-   **Data Model:** Adhere to `LLMModelSchema` (Zod) and interact with existing Settings API.
-   **UI Requirements:** Based on the provided `axon_studio_llms.jpg` mockup.

## 2. Directory Structure
Create a new feature module under `src/modules/studio/features/model-studio`:
```
model-studio/
├── application/
│   └── hooks/
│       └── useModelForm.ts     # Form initialization and validation
├── types/
│   └── model-schema.ts         # Zod schemas for the form
└── ui/
    ├── ModelStudio.tsx         # Main component wiring layout and form
    ├── ModelStudioContainer.tsx# Data fetching, mutations, and routing wrapper
    ├── ModelStudioView.tsx     # The 3-column layout implementation
    └── sections/               # Form sections (center column)
        ├── ModelIdentitySection.tsx   # Step 1: Tożsamość
        ├── ModelParametersSection.tsx # Step 2: Parametry Dostawcy
        ├── ModelCustomParamsSection.tsx# Step 3: Parametry Niestandardowe
        ├── ModelSystemPromptSection.tsx# Step 4: Globalne Instrukcje
        └── ModelPricingSection.tsx    # Step 5: Ekonomia
```

## 3. UI Implementation Details (Based on Mockup)

### Layout (`ModelStudioView.tsx`)
-   **Left Column (Navigation):** Steps 1-5 listed vertically.
-   **Center Column (Editor):** The main `FormProvider` housing the sections.
-   **Right Column (Canvas):** Display a JSON preview of the final model configuration payload or a sample API request block.

### Sections & Form Controls
*All sections will use components from `src/shared/ui/form/`.*

-   **Step 1: Tożsamość (Identity)**
    -   `FormSelect`: "Wybierz Dostawcę" (Fetch from `useLLMProviders()`).
    -   `FormSelect` / Autocomplete: "Search Bar + Select" (Allows custom input if not in list, mimicking `CreatableSelect` behavior).
    -   `FormTextField`: "Alias Name" (Optional friendly name).

-   **Step 2: Parametry Dostawcy (Provider Parameters)**
    -   `FormRadio` / Button Group: "Reasoning Effort" (Low, Medium, High).
    -   `FormTextField` (Number): "Max Completion Tokens".

-   **Step 3: Parametry Niestandardowe (Custom Parameters / Passthrough)**
    -   `FormDynamicList` or custom key-value table: Key (string), Value, Type (String, Int, Boolean).
    -   Button: "+ Dodaj Parametr".

-   **Step 4: Globalne Instrukcje (System Prompt)**
    -   `FormTextarea`: "Zawsze używaj formatowania Markdown..."

-   **Step 5: Ekonomia (Pricing)**
    -   Button: "Importuj z URL" (Placeholder/Mock for now).
    -   `FormTextField` (Number): "Input ($ per 1M)".
    -   `FormTextField` (Number): "Output ($ per 1M)".

### Action Buttons
-   "Zapisz Model" (Save) - Top left and bottom left of the navigation column.
-   "Anuluj" (Cancel) - Back to `/settings/llms/models`.

## 4. State & Data Flow (`ModelStudioContainer.tsx`)
1.  Use `useLLMProviders()` to populate the provider dropdown.
2.  Map form state (`RouterFormData`-equivalent) to backend `CreateLLMModelRequest` schema.
3.  Use existing `settingsApi.createLLMModel` (need to ensure this exists in `api.ts` and `useSettings.ts`).
4.  Handle loading states, transitions, and toast notifications (Success/Error).

## 5. Next.js Routing
-   Create `src/app/(studio)/settings/llms/models/new/page.tsx` importing `ModelStudioContainer`.
-   Update the "Dodaj Model" button in `LLMModelsList.tsx` to `router.push("/settings/llms/models/new")`.

## 6. Execution Steps
1.  Define Zod schema for the form (`model-schema.ts`).
2.  Create the form hook (`useModelForm.ts`).
3.  Build the 5 individual UI sections.
4.  Assemble the `ModelStudioView` (Layout) and `ModelStudio` (Form context provider).
5.  Implement the `ModelStudioContainer` (API connections).
6.  Wire up the Next.js pages and update the button in the settings browser.