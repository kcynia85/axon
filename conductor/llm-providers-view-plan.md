# Implementation Plan: LLM Providers View (/settings/llms/providers)

## Objective
Implement the `/settings/llms/providers` view using the `PageLayout` and `BrowserLayout` patterns to ensure layout consistency with the `resources/knowledge` module. The view will represent the "Model Registry" as shown in the provided screenshot (`axon_model-registry.jpg`), integrating provider and model management into a unified browser interface.

## Key Files & Context
- **Page Entry Point**: `axon-app/frontend/src/app/(main)/settings/llms/providers/page.tsx`
- **Feature Component**: `axon-app/frontend/src/modules/settings/ui/LLMProvidersBrowser.tsx` (New)
- **Shared Layouts**: 
    - `PageLayout`: Base layout with title, breadcrumbs, and actions.
    - `BrowserLayout`: Standardized search and filter structure.
    - `ActionBar`: Unified filtering and sorting controls.
- **UI Components**: `ResourceCard`, `ResourceList`, `ActionButton`.

## Implementation Steps

### 1. Create LLMProvidersBrowser Component
- **Location**: `axon-app/frontend/src/modules/settings/ui/LLMProvidersBrowser.tsx`
- **Logic**:
    - Implement state for `searchQuery`, `viewMode`, and `activeFilters`.
    - Define `FILTER_GROUPS` for providers: `OpenAI`, `Anthropic`, `OpenRouter`.
    - Define `MOCK_MODELS` containing the data from the screenshot:
        - **Production Safe**: Alias `gpt-smart`, Router Fallback, 128k context, Cost $2.50/$10.00.
        - **GPT-4o**: `openai/gpt-4o`, Standard OpenAI, 128k context, Cost $1.50/$5.00.
        - **bielik**: `speakleash`, 32k context, Free.
        - **Hermes 3 405B**: `nous/hermes-3`, Llama OpenRouter, 32k context, Cost $15.0/$60.00.
    - Use `ResourceList` to render models as `ResourceCard` components.
    - **Custom Footer**: Implement a specialized footer in `ResourceCard` to display technical specs (Context, Cost) in the exact style shown in the reference image.

### 2. Update Providers Page Structure
- **Location**: `axon-app/frontend/src/app/(main)/settings/llms/providers/page.tsx`
- **Refactoring**:
    - Replace the current manual `PageContainer`/`PageHeader` with the high-level `PageLayout`.
    - **Title**: "Rejestr Modeli".
    - **Description**: "Zarządzaj połączeniami API oraz konfiguracją modeli językowych od dostawców chmurowych i lokalnych."
    - **Actions**: Add an `ActionButton` for "Dodaj Model".
    - **Content**: Render the `LLMProvidersBrowser`.

### 3. Visual & Technical Alignment
- **Consistency**: Match the "Vertical Slice" and "Pure View" principles from the project's coding standards.
- **Typography**: Use established `text-[11px] font-black uppercase tracking-widest` for labels to match the system's aesthetic.
- **Responsiveness**: Ensure the `BrowserLayout` handles transitions between grid and list modes smoothly.

## Verification & Testing
- **UI Consistency**: Compare the rendered `/settings/llms/providers` with `/resources/knowledge` to ensure identical layout behavior.
- **Filter Logic**: Verify that selecting "OpenAI" in the filters correctly narrows down the mock model list.
- **Search**: Test the search bar functionality against model names and aliases.
- **Accessibility**: Run a basic audit to ensure the new view complies with WCAG 2.1 AA standards (focus states, ARIA labels).
