# Plan: Removal of Model Selection Hardcode in Meta-Agent Studio

## Objective
Ensure that the model selected in Meta-Agent Studio (both for reasoning/LLM and voice/TTS) is correctly mapped and used by the system, eliminating all hardcoded defaults and UI-side model lists.

## Key Files & Context
- **Backend Service:** `axon-app/backend/app/modules/spaces/application/meta_agent_service.py` (Current "hidden" hardcode of reasoning model).
- **Backend Router:** `axon-app/backend/app/modules/spaces/interface/meta_agent_router.py` (Dependency injection).
- **Backend System Router:** `axon-app/backend/app/modules/system/interface/router.py` (New endpoint for voice models).
- **Frontend Component:** `axon-app/frontend/src/modules/studio/features/meta-agent-studio/ui/sections/providers/ElevenLabsSettingsView.tsx` (Current "visible" hardcode of ElevenLabs models).
- **Backend Settings Repo:** `axon-app/backend/app/modules/settings/infrastructure/repo.py` (Fetching LLM models).

## Implementation Steps

### Phase 1: Backend Reasoning Model Mapping
1. **Inject SettingsRepository:**
   - Update `MetaAgentService.__init__` to accept `settings_repo: SettingsRepository`.
   - Update `get_meta_agent_service` in `meta_agent_router.py` to provide this dependency.

2. **Fix `propose_draft` logic:**
   - In `propose_draft`, if `meta_agent_config.llm_model_id` is present:
     - Fetch the `LLMModel` using `settings_repo`.
     - Fetch the `LLMProvider` using `settings_repo`.
     - Pass `model_id` (technical name) and `provider_technical_id` to `self.llm_adapter.get_chat_model`.
   - Fallback to current defaults (gpt-4o / openai) if configuration is missing.

### Phase 2: Dynamic Voice Models
1. **Backend Endpoint:**
   - Add `@router.get("/voice/providers/{provider}/models")` to `system/interface/router.py`.
   - Implement logic in `VoiceInteractionService` to return supported models (initially for ElevenLabs).

2. **Frontend Dynamic Fetching:**
   - Create a hook `useVoiceModels(provider)` to fetch models from the new endpoint.
   - Update `ElevenLabsSettingsView.tsx` to use this hook instead of the hardcoded `ELEVEN_MODELS` constant.
   - Ensure the selection is correctly saved to `provider_config.model_id`.

### Phase 3: Verification & Cleanup
1. **Verification Script:**
   - Create a reproduction/verification script that sets a specific reasoning model in settings and triggers a Meta-Agent proposal, verifying the used model via logs.
2. **Cleanup:**
   - Remove the `ELEVEN_MODELS` constant from the frontend.

## Verification & Testing
- **Reasoning Model:** Use `debug_rag_search.py` or a similar tool to trigger `propose_draft` and check backend logs for the selected model name.
- **Voice Model:** Verify in Studio UI that ElevenLabs models are loaded and selectable.
- **Integration:** Confirm that `VoiceMetaAgent` config still works with the selected model.
