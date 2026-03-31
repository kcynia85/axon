# Plan - Truly Agnostic Provider Gateway

Make the LLM Provider configuration fully data-driven by moving protocol-specific hardcoding (URL suffixes, request bodies) into the database (SSoT).

## Backend Changes

### 1. Update Domain Models
- **File:** `axon-app/backend/app/modules/settings/domain/models.py`
- **Changes:** Add `inference_path` (string) and `inference_json_template` (string) to `LLMProvider`.
- **Defaults:**
    - `inference_path`: `/chat/completions`
    - `inference_json_template`: OpenAI style JSON.

### 2. Update CRUD Schemas
- **File:** `axon-app/backend/app/modules/settings/application/schemas.py`
- **Changes:** Add `inference_path` and `inference_json_template` to `CreateLLMProviderRequest`, `UpdateLLMProviderRequest`, and `LLMProviderResponse`.

### 3. Update Database Tables
- **File:** `axon-app/backend/app/modules/settings/infrastructure/tables.py`
- **Changes:** Add columns `inference_path` and `inference_json_template` to `LLMProviderTable`.

### 4. Database Migration
- Create a new Alembic migration to add these columns to the `llm_providers` table.

### 5. Refactor Agnostic Gateway
- **File:** `axon-app/backend/app/shared/infrastructure/adapters/agnostic_gateway.py`
- **Changes:**
    - Refactor `_prepare_request` to remove hardcoded `protocol == "openai"`, `protocol == "anthropic"`, etc.
    - Final URL = `endpoint.rstrip("/") + provider.inference_path`.
    - Body = Render `provider.inference_json_template` by replacing `{{model}}` and `{{prompt}}`.
    - Automatically handle `tools` if placeholder exists or append if not.

## Frontend Changes

### 1. Update Schema
- **File:** `axon-app/frontend/src/modules/studio/features/provider-studio/types/provider-schema.ts`
- **Changes:**
    - Add `inference_path` to `BaseProviderSchema`.
    - Ensure `json_schema_mapping` (which will map to `inference_json_template`) is properly typed.

### 2. Update Form Defaults (Presets)
- **File:** `axon-app/frontend/src/modules/studio/features/provider-studio/application/hooks/useProviderForm.ts`
- **Changes:** Add logic to auto-populate `inference_path` and `json_schema_mapping` when the protocol changes (e.g. switching to Anthropic sets `/messages` and the Anthropic JSON template).

### 3. Update UI
- **File:** `axon-app/frontend/src/modules/studio/features/provider-studio/ui/sections/ProviderAuthSection.tsx`
    - Add field for `inference_path` (Generation Path).
- **File:** `axon-app/frontend/src/modules/studio/features/provider-studio/ui/sections/ProviderJsonSchemaSection.tsx`
    - Ensure it uses the correct field name and provides helpful placeholder templates.

## Verification
- Test connection in Model Studio with a custom provider.
- Verify that OpenAI, Anthropic, and Google Gemini REST work without code changes by just changing their DB-stored configuration.
