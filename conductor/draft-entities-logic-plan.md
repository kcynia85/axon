# Plan: Draft Logic for Service, Automation, and Archetype

## Objective
Implement draft domain entities and schemas for `Service`, `Automation`, and `Archetype` within the `template-studio` or a new shared domain module, following DDD and Modular Monolith principles.

## Key Files & Context
- `frontend/src/modules/studio/features/template-studio/types/template-studio.types.ts`: Existing schema reference.
- New domain directory: `frontend/src/modules/studio/domain/` (to be created or verified).

## Proposed Solution
1. **Define Domain Entities**: Create specialized Zod schemas for each entity.
   - **Service**: Technical or business service definition.
   - **Automation**: Workflow or trigger-based logic.
   - **Archetype**: Blueprints for objects/entities.
2. **Standardize Structure**: Ensure consistency in naming and validation (e.g., `id`, `name`, `description`, `version`).
3. **Draft Support**: Add `is_draft` or `status` fields to support draft states as requested.

## Implementation Steps
1. **Research**: Check if `frontend/src/modules/studio/domain` exists or where shared studio entities should live.
2. **Draft Service Schema**: Create `ServiceSchema` in `frontend/src/modules/studio/domain/entities/service.ts`.
3. **Draft Automation Schema**: Create `AutomationSchema` in `frontend/src/modules/studio/domain/entities/automation.ts`.
4. **Draft Archetype Schema**: Create `ArchetypeSchema` in `frontend/src/modules/studio/domain/entities/archetype.ts`.
5. **Export**: Update `frontend/src/modules/studio/domain/index.ts` to export new entities.

## Verification & Testing
- Validate schemas with sample data.
- Ensure TypeScript types are correctly inferred.
