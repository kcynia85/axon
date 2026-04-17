# Plan: Fix Crew Node Agent Mapping

## Objective
Ensure that Crew nodes on the Space Canvas correctly display their member agents (titles and avatars) by resolving agent details on the backend and passing them to the frontend.

## Key Files & Context
- **Backend Domain Model:** `axon-app/backend/app/modules/workspaces/domain/models.py`
- **Backend Repository:** `axon-app/backend/app/modules/workspaces/infrastructure/repo.py`
- **Frontend Types:** `axon-app/frontend/src/modules/spaces/domain/types.ts`
- **Frontend Mapper:** `axon-app/frontend/src/modules/spaces/ui/mappers/SpaceNodeViewModelMapper.ts`
- **Frontend Defaults:** `axon-app/frontend/src/modules/spaces/domain/defaults.ts`

## Implementation Steps

### 1. Backend: Update Domain Model
Update `Crew` model in `axon-app/backend/app/modules/workspaces/domain/models.py` to include:
- `_resolved_members`: Optional list of agent details (id, role, visual_url).
- `_resolved_manager`: Optional agent detail for the manager.

### 2. Backend: Update Repository Mapping
Modify `_crew_to_domain` in `axon-app/backend/app/modules/workspaces/infrastructure/repo.py` to:
- Populate `_resolved_members` from the `row.agents` relationship.
- Populate `_resolved_manager` if `row.manager_agent_id` is set (requires loading the agent).

### 3. Frontend: Update Domain Types
Update `SpaceCrewDomainData` in `axon-app/frontend/src/modules/spaces/domain/types.ts` to explicitly include `_resolved_members`.

### 4. Frontend: Update UI Mapper
Refine `mapCrewToViewModel` in `axon-app/frontend/src/modules/spaces/ui/mappers/SpaceNodeViewModelMapper.ts` to prioritize `_resolved_members` for rendering avatars and team lists.

## Verification & Testing
1. **API Verification:** Call the crews endpoint and verify the JSON structure contains `_resolved_members`.
2. **UI Verification:** Drag a Crew onto the Space Canvas and ensure agents are visible.
