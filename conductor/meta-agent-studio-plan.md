# Meta-Agent Studio Implementation Plan

## Objective
Migrate the existing Meta-Agent configuration to a new dedicated "Meta-Agent Studio" within the `/studio` module to maintain UI consistency across the app. Integrate the entry point for this Studio into the `/settings/system/awareness` view, and add a placeholder "Logs" tab to the awareness settings. Finally, dynamically map only "reasoning" models in the Meta-Agent Studio's model selection.

## Key Files & Context
- **Routing**: `axon-app/frontend/src/app/(studio)/settings/system/meta-agent/studio/page.tsx` (new route for the Studio)
- **UI Updates**: `axon-app/frontend/src/app/(main)/settings/system/awareness/page.tsx`
- **Studio Components**: `axon-app/frontend/src/modules/studio/features/meta-agent-studio/ui/MetaAgentStudio.tsx` (new)
- **Cleanup**: `axon-app/frontend/src/app/(main)/settings/system/meta-agent/page.tsx` and `axon-app/frontend/src/modules/system/ui/MetaAgentSettingsForm.tsx`
- **Nav**: `axon-app/frontend/src/modules/settings/ui/SettingsNavIsland.tsx`

## Implementation Steps

### 1. Update Navigation
- Remove the old `Meta Agent` link from `SettingsNavIsland.tsx` so that only `System` (which maps to Awareness) remains under the System group.

### 2. Update System Awareness View
- Modify `app/(main)/settings/system/awareness/page.tsx`.
- Add a new tab `Meta-Agent` with a descriptive card and a primary button labeled "Configure Meta-Agent" that navigates to `/settings/system/meta-agent/studio`.
- Add a new tab `Logs` with a placeholder "Coming Soon" card consistent with the existing UI.

### 3. Create Meta-Agent Studio
- Create the new route `app/(studio)/settings/system/meta-agent/studio/page.tsx`.
- Create `modules/studio/features/meta-agent-studio/ui/MetaAgentStudio.tsx`.
- Move the configuration form from `MetaAgentSettingsForm.tsx` to the new Studio component.
- Apply the standard Studio layout (e.g., using `useStudioScrollSpy` or a similar consistent structure).

### 4. Dynamic Reasoning Model Mapping
- In the new Meta-Agent Studio, update the "Primary Reasoning Model" `Select` component.
- Filter the fetched `llmModels` array to only display models where `model_supports_thinking === true` (based on the `LLMModel` schema).

### 5. Cleanup
- Delete the old Meta-Agent settings route and form component.

## Verification
- Verify the "Configure Meta-Agent" button successfully navigates to the new Studio.
- Verify the "Primary Reasoning Model" dropdown only shows models supporting thinking.
- Verify the "Logs" tab appears correctly in the Awareness view.