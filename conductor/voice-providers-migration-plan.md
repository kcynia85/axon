# Implementation Plan: Meta-Agent Studio Voice Providers Migration

## Objective
Migrate and extend the Meta-Agent Studio "Voice" section to support multiple voice providers (ElevenLabs, Inworld AI, Cartesia, Google Cloud, Microsoft Azure, Amazon Polly) using a Domain-Driven Design (DDD) Modular Monolith architecture with the Ports & Adapters (Hexagonal) pattern.

## Architecture & Design Principles
- **DDD & Modular Monolith**: Strict separation of Domain, Application, Infrastructure, and UI layers.
- **Ports & Adapters**: Isolate external provider logic behind a unified interface (`VoiceProviderPort`).
- **Discriminated Unions**: Use strongly typed, provider-specific configuration schemas in both frontend (Zod) and backend (Pydantic).
- **Pure Views & Zero useEffect**: Frontend components must be pure, stateless representations of the domain models, relying on Server Actions for state mutation.

## Phased Implementation Steps

### Phase 1: Domain & Infrastructure Models (Backend)
1. **Update Enums**: Extend `VoiceProvider` enum in `app/modules/system/domain/enums.py` to include `INWORLD_AI`, `CARTESIA`, `GOOGLE_CLOUD`, `MICROSOFT_AZURE`, and `AMAZON_POLLY`.
2. **Define Provider Configurations**: Create Pydantic models for each provider's specific configuration requirements (e.g., `ElevenLabsConfig`, `InworldAIConfig`, `CartesiaConfig`, `HyperscalerConfig`).
3. **Update Aggregate Root**: Modify `VoiceMetaAgent` in `app/modules/system/domain/models.py` to replace `voice_id` with a polymorphic `provider_config` field (using a discriminated union based on `voice_provider`).
4. **Database Schema & Migration**:
   - Update `VoiceMetaAgentTable` in `app/modules/system/infrastructure/tables.py` to include a `provider_config` column (JSONB).
   - Generate and apply an Alembic migration to transform existing `voice_id` data into the new `provider_config` JSON structure.

### Phase 2: Ports, Adapters & Application Layer (Backend)
1. **Define Port**: Create the `VoiceProviderPort` interface in `app/modules/system/domain/ports/voice_port.py` defining standard methods (e.g., `generate_speech`, `transcribe_audio`).
2. **Implement Adapters**: Create specific adapter classes implementing the port in `app/modules/system/infrastructure/adapters/voice/` (e.g., `ElevenLabsAdapter`, `InworldAIAdapter`, `CartesiaAdapter`, `HyperscalerAdapter`).
3. **Adapter Factory**: Implement a `VoiceAdapterFactory` to instantiate the correct adapter based on the `voice_provider` enum at runtime.
4. **Update Use Cases/Schemas**: Ensure application-layer schemas (`UpdateVoiceMetaAgentRequest`) support the new polymorphic configuration structure.

### Phase 3: Domain & Schemas (Frontend)
1. **Update Zod Enums**: Update `VoiceProviderSchema` in `axon-app/frontend/src/shared/domain/system.ts`.
2. **Define Zod Provider Schemas**: Create specific Zod schemas for each provider's configuration.
3. **Discriminated Union**: Update `VoiceMetaAgentSchema` to use `z.discriminatedUnion` on the `voice_provider` field, ensuring strict type safety for the `provider_config` object.

### Phase 4: UI & Form Implementation (Frontend)
1. **Strategy Pattern in UI**: Refactor `MetaAgentVoiceSection` to use a strategy pattern for rendering provider-specific form sections (`VoiceProviderSettingsRenderer`).
2. **Create Pure Views**: Implement individual, pure functional components for each provider's settings:
   - `<ElevenLabsSettingsView />`
   - `<InworldAISettingsView />`
   - `<CartesiaSettingsView />`
   - `<HyperscalerSettingsView />`
3. **Form Integration**: Ensure the main Studio form handles provider switching cleanly without `useEffect`. When the provider dropdown changes, the `onChange` handler should reset the `provider_config` to the default shape for the newly selected provider before submitting the action.

## Verification & Testing
- **Backend Tests**: Unit test the `VoiceAdapterFactory` and serialization/deserialization of the polymorphic Pydantic models.
- **Database Migration**: Verify that existing `VoiceMetaAgent` records are correctly migrated to the new JSONB structure without data loss.
- **Frontend Validation**: Ensure Zod validation correctly catches missing required fields for specific providers (e.g., requiring `character_id` only when Inworld AI is selected).
- **UI/UX**: Verify smooth transitioning between provider forms in the Meta-Agent Studio without layout shifts or console errors related to React state/effects.

## Rollback Strategy
- Keep a backup of the database before applying the Alembic migration.
- If issues arise, revert the database migration and rollback the git commit to restore the previous flat `voice_id` structure.
