# Implementation Plan - Automation Providers

## Objective
Introduce a centralized "Automation Providers" management system within the `settings` module. This will allow users to configure authentication (n8n, Make, Custom) once and reuse it across multiple webhook automations, eliminating redundancy and improving security.

## Architectural Standards
- **Modular Monolith**: All changes encapsulated within `app/modules/settings` (Backend) and `src/modules/settings` (Frontend).
- **Ports & Adapters**: Define clear domain ports for data access and provide infrastructure adapters.
- **DDD**: Use Ubiquitous Language (`AutomationProvider`, `AutomationPlatform`).
- **Semantic Naming**: No abbreviations (e.g., `AutomationProviderResponse` instead of `AuthProvResp`).
- **Frontend**: Pure View/Container pattern, React 19 standards, **0% useEffect**.

---

## Phase 1: Backend Infrastructure (`app/modules/settings`)

### 1.1 Domain Layer
- **Enums (`domain/enums.py`)**:
    - Add `AutomationPlatform` (n8n, Make, Custom).
    - Add `AutomationAuthType` (Header, Bearer, None).
- **Models (`domain/models.py`)**:
    - Define `AutomationProvider` (immutable Pydantic model).
    - Fields: `id`, `name`, `platform`, `base_url`, `auth_type`, `auth_header_name`, `auth_secret`, `created_at`, `updated_at`.

### 1.2 Infrastructure Layer
- **Tables (`infrastructure/tables.py`)**:
    - Define `AutomationProviderTable` (SQLAlchemy 2.0).
- **Repository (`infrastructure/repo.py`)**:
    - Add `create_automation_provider`, `list_automation_providers`, `get_automation_provider`, `update_automation_provider`, `delete_automation_provider`.

### 1.3 Application Layer
- **Schemas (`application/schemas.py`)**:
    - Define `CreateAutomationProviderRequest`, `UpdateAutomationProviderRequest`, `AutomationProviderResponse`.
- **Service (`application/service.py`)**:
    - Orchestrate CRUD operations for Automation Providers.

### 1.4 Interface Layer
- **Router (`interface/router.py`)**:
    - Add endpoints:
        - `GET /automation-providers`
        - `GET /automation-providers/{id}`
        - `POST /automation-providers`
        - `PATCH /automation-providers/{id}`
        - `DELETE /automation-providers/{id}`

---

## Phase 2: Frontend Infrastructure (`src/modules/settings`)

### 2.1 Domain Layer
- **Schema (`shared/domain/settings.ts`)**:
    - Define `AutomationProviderSchema` (Zod).
    - Export `AutomationProvider` type.

### 2.2 Infrastructure Layer
- **API (`infrastructure/api.ts`)**:
    - Add `getAutomationProviders`, `getAutomationProvider`, `createAutomationProvider`, `updateAutomationProvider`, `deleteAutomationProvider`.

### 2.3 Application Layer
- **Hooks (`application/useAutomationProviders.ts`)**:
    - `useAutomationProviders()`
    - `useAutomationProvider(id)`
    - `useCreateAutomationProvider()`
    - `useUpdateAutomationProvider()`
    - `useDeleteAutomationProvider()`

---

## Phase 3: Frontend UI (`src/modules/settings/ui`)

### 3.1 Components
- **`AutomationProvidersBrowser`**: Container handling data fetching and state.
- **`AutomationProvidersBrowserView`**: Pure View for grid/list rendering.
- **`AutomationProviderSidePeek`**: Container for detail view/edit actions.
- **`AutomationProviderSidePeekView`**: Pure View for the side panel.

### 3.2 Navigation & Pages
- **Navigation (`SettingsNavIsland.tsx`)**:
    - Add "Automation" group with "Providers" item.
- **Pages (`app/(main)/settings/automation/providers/`)**:
    - Create `page.tsx` to host the `AutomationProvidersBrowser`.

---

## Phase 4: Verification & Review
- **Code Review**: Systematic check against `.gemini` skills.
- **Functionality**:
    - Verify CRUD operations for Automation Providers.
    - Ensure secrets are handled correctly (masked in UI).
    - Verify zero regression in existing LLM Providers.
- **Schema**: Run `alembic revision --autogenerate` and `alembic upgrade head`.

---

## Migration Plan
1. Run backend migrations.
2. Seed default providers (optional).
3. Deploy frontend updates.
