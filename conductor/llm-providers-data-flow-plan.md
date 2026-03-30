# Plan: LLM Providers Data Flow & Real Data Integration

## Objective
Replace mock data in `/settings/llms/providers` with real data from the backend, update the provider schema to support different types (including Meta-Providers like OpenRouter), and implement the full data flow from Provider Studio to Model Studio.

## Key Files & Context
- **Backend Infrastructure**: 
    - `axon-app/backend/app/modules/settings/infrastructure/tables.py`
    - `axon-app/backend/app/modules/settings/infrastructure/repo.py`
- **Backend Domain**: 
    - `axon-app/backend/app/modules/settings/domain/models.py`
    - `axon-app/backend/app/modules/settings/domain/enums.py`
- **Backend Application**: 
    - `axon-app/backend/app/modules/settings/application/service.py`
    - `axon-app/backend/app/modules/settings/application/schemas.py`
- **Frontend Domain**: 
    - `axon-app/frontend/src/shared/domain/settings.ts`
- **Frontend UI**: 
    - `axon-app/frontend/src/modules/settings/ui/LLMProvidersBrowser.tsx`
    - `axon-app/frontend/src/modules/settings/ui/LLMProviderSidePeek.tsx`
- **Provider Studio**: 
    - `axon-app/frontend/src/modules/studio/features/provider-studio/ui/ProviderStudioContainer.tsx`
    - `axon-app/frontend/src/modules/studio/features/provider-studio/types/provider-schema.ts`

## Implementation Steps

### Phase 1: Backend Schema Update
1.  **Modify `enums.py`**: Update `ProviderType` to match frontend values: `cloud`, `meta`, `local`.
2.  **Modify `tables.py`**: Update `LLMProviderTable` to include:
    - `provider_technical_id` (String, unique)
    - `provider_type` (Enum)
    - `provider_api_key` (String, optional)
    - `provider_custom_config` (JSONB, optional)
3.  **Modify `models.py`**: Update `LLMProvider` domain model to match the table.
4.  **Modify `schemas.py`**: 
    - Update `CreateLLMProviderRequest` to include the new fields.
    - Update `LLMProviderResponse`.
5.  **Modify `repo.py`**: Update mapping logic in `create_llm_provider`, `list_llm_providers`, and `_to_domain_provider`.
6.  **Modify `service.py`**: Update `create_llm_provider` to handle the new fields.
7.  **Migration**: Generate and run Alembic migration (`uv run alembic revision --autogenerate -m "update_llm_provider_schema" && uv run alembic upgrade head`).

### Phase 2: Frontend Schema & API Update
1.  **Modify `shared/domain/settings.ts`**: Update `LLMProviderSchema` and `LLMProvider` type to include new fields.
2.  **Verify `modules/settings/infrastructure/api.ts`**: Ensure it handles the updated schema correctly.

### Phase 3: UI Integration (Providers Browser)
1.  **Modify `LLMProvidersBrowser.tsx`**:
    - Remove `MOCK_PROVIDERS`.
    - Use real data from `useLLMProviders()`.
    - Update `filteredProviders` logic to work with real data.
2.  **Modify `LLMProviderSidePeek.tsx`**:
    - Update `Provider` type to match `LLMProvider`.
    - Display real API Key (masked), URL, and correctly mapped type.

### Phase 4: Provider Studio Implementation
1.  **Modify `ProviderStudioContainer.tsx`**:
    - Implement `handleSave` using `useCreateLLMProvider` and `useUpdateLLMProvider` hooks.
    - Map `ProviderFormData` to the backend request structure.

## Verification & Testing
- **Manual Test**: Create a new OpenRouter provider in Provider Studio.
- **Manual Test**: Verify it appears in LLM Providers Browser with correct labels.
- **Manual Test**: Go to Model Studio, select the new OpenRouter provider, and verify models are fetched from API.
- **Manual Test**: Verify deletion of providers works correctly.
