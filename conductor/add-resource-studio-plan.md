# Add Resource Studio Plan

## 1. Goal
Add a new Studio view for creating RAG resources, accessible from the `resources/knowledge` view. Ensure consistent styling with other studios (Agent, Crew, Template) and follow architectural guidelines (`react-architecture-refactor` and `modular-monolith-architect`).

## 2. Architecture & File Structure
Module location: `src/modules/studio/features/knowledge-studio`
- `ui/KnowledgeStudioContainer.tsx`: Container component managing state and actions.
- `ui/KnowledgeStudioView.tsx`: Pure presentation component (0% logic).
- `application/useKnowledgeStudio.ts`: Hook for managing local state (selected file, metadata, chunking strategy, hub assignment).
- `types/knowledge-studio.types.ts`: Local types for the studio state and form.

Routing:
- `src/app/(studio)/resources/knowledge/studio/page.tsx`: Server component entry point.

## 3. UI Layout & Components
Use standard Studio components (`StudioLayout`, `StudioActionBar`, `FormSection`, etc.).

### Sections based on the provided design:
**Title:** "Nowy Zasób Studio"
1. **Wybierz Zasób**
   - Display selected file name and size (e.g., "Wybrano: Roadmap_2025.md (128kb)").
   - Button: "+ Dodaj" for file selection.
2. **Metadane (JSONB)**
   - Button: "+ Auto-Taguj (AI)".
   - Dynamic Key-Value input list.
   - Button: "+ Dodaj Pole".
3. **Strategia Przetwarzania**
   - Hint text.
   - Read-only or select field for Model: "text-embedding-3-small (domyślny)".
   - Radio group for Chunk Types: "General Text", "Codebase", "Precise / Legal".
4. **Przypisanie do Hubów**
   - Hint text.
   - Select/Search input for Hubs.
   - Display selected Hubs (e.g., "Delivery").

### Action Bar (Bottom)
- Buttons: "Zapisz i Indeksuj" (primary), "Anuluj" (secondary).

## 4. Implementation Steps
1. **Routing:** Add `app/(studio)/resources/knowledge/studio/page.tsx` rendering `KnowledgeStudioContainer`.
2. **Navigation:** Update `app/(main)/resources/knowledge/page.tsx` to link the "+ Dodaj Zasób" button to the new route.
3. **Studio Module Types:** Create types in `modules/studio/features/knowledge-studio/types/knowledge-studio.types.ts`.
4. **Studio Application Hook:** Create `useKnowledgeStudio` hook for form state.
5. **Studio View Component:** Build `KnowledgeStudioView.tsx` with all 4 sections matching the provided image.
6. **Studio Container:** Build `KnowledgeStudioContainer.tsx` to connect the hook and the view.
