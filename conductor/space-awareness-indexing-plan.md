# 📋 Plan: Full Space Awareness & Real-time Events (RAG#2)

## 🎯 Objective
Enable deep indexing of Space Canvas structures (nodes, zones, relationships) into System Awareness (RAG#2) and implement real-time synchronization using WebSockets.

## 🏗️ Architecture

### 1. Backend: Deep Space Indexing
- **Service**: `SystemIndexingService`
- **Logic**: Expand `_generate_text_representation` for the `space` entity type.
- **Data to Capture**: 
    - Names and descriptions of all Zones.
    - Entities (Agents, Crews, Tools) contained within each Zone.
    - All logic connections (Edges) and cross-zone context links.
- **Trigger**: Emit `system.entity.upserted` in `SpaceService.update_canvas_data`.

### 2. Backend: Real-time Pipe
- **Technology**: FastAPI WebSockets.
- **Endpoint**: `/ws/awareness`.
- **Workflow**: 
    1. Entity change occurs.
    2. Inngest worker completes vector indexing.
    3. Broadcast `awareness_synchronized` to all connected clients.

### 3. Frontend: Awareness Listener
- **Hook**: `useSystemAwarenessSocket`.
- **UX**: Pulse animation on `MagicSphere` orb in `MetaAgentPanel` when sync completes.
- **Status**: Show "System Synchronized" indicator.

---

## 🛠️ Implementation Steps

### Phase 1: Deep Indexing (BE)
- [ ] [BE] Update `SystemIndexingService` to parse `canvas_data` JSONB.
- [ ] [BE] Implement structured text generation for Space topology.
- [ ] [BE] Add Inngest trigger to `SpaceService` save logic.
- [ ] [BE] Update `seed_system_embeddings_all.py` and re-index existing spaces.

### Phase 2: Real-time Infrastructure
- [ ] [BE] Implement WebSocket manager in `app.shared.infrastructure`.
- [ ] [BE] Create `/ws/awareness` endpoint in `system_router`.
- [ ] [BE] Add broadcast step to Inngest indexing workflow.

### Phase 3: UX & Feedback (FE)
- [ ] [FE] Implement `SystemAwarenessProvider` with WebSocket connection.
- [ ] [FE] Add visual sync feedback to `MagicSphere`.
- [ ] [FE] Update Meta-Agent panel to show last sync time.

## ✅ Definition of Done
- Meta-Agent can answer questions about the specific layout and connections of any Space Canvas.
- Adding a node to the canvas triggers a background re-index and a UI notification within seconds.
- No direct direct edges allowed between zones (already enforced, but must be represented in RAG).
