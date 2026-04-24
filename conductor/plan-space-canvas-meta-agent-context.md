# Meta-Agent Canvas Context Improvement Plan

## Objective
Improve the Meta-Agent's context awareness by providing it with the exact current state of the Space (Canvas) the user is working in. This will prevent the LLM from hallucinating or duplicating existing entities, allowing it to build upon the existing graph and propose connections to nodes already present on the canvas.

## Background & Motivation
Currently, the `MetaAgentService` relies entirely on RAG#2 (System Awareness) to provide system context. However, RAG#2 retrieves entities based on vector similarity and returns them as a flat list, without specifying if these entities are currently on the user's Canvas. The LLM lacks visibility into the immediate state of the active Project/Space, meaning it might suggest adding a "Research Agent" even if one is already present on the screen.

## Scope & Impact
- **Backend (`axon-app/backend`)**:
  - `app/modules/spaces/interface/meta_agent_router.py`: Inject `SpaceRepository`.
  - `app/modules/spaces/application/meta_agent_service.py`: Accept `SpaceRepository`, fetch the current space by ID, extract `canvas_data`, format it for the prompt, update RAG#2 output formatting, and adjust prompt instructions.
- **No changes to Frontend or DB Schema required.**

## Implementation Steps

1. **Inject `SpaceRepository` into Meta-Agent Router**
   - In `app/modules/spaces/interface/meta_agent_router.py`:
     - Import `get_space_repo` from `app.modules.spaces.application.service` and `SpaceRepository` from `app.modules.spaces.infrastructure.repo`.
     - Update the `get_meta_agent_service` dependency function to accept `space_repo: SpaceRepository = Depends(get_space_repo)`.
     - Pass `space_repo` to the `MetaAgentService` constructor.

2. **Update `MetaAgentService` Constructor**
   - In `app/modules/spaces/application/meta_agent_service.py`:
     - Update `__init__` to accept `space_repo: SpaceRepository` and assign it to `self.space_repo`.

3. **Format RAG#2 Output (System Awareness)**
   - In `MetaAgentService.propose_draft()`, update the `system_context_str` comprehension to include more details from the payload:
     ```python
     system_context_str = "\n".join([
         f"- [{r.entity_type.upper()}] {r.payload.get('name', 'Unknown')}\n"
         f"  Description: {r.payload.get('description', '')}\n"
         f"  Details: {json.dumps({k:v for k,v in r.payload.items() if k not in ('name', 'description')}, ensure_ascii=False)}"
         for r in system_context_results
     ])
     ```

4. **Fetch and Format Current Space (Canvas) State**
   - In `MetaAgentService.propose_draft()`, before building the prompt, fetch the space using `request.space_id`:
     ```python
     current_canvas_state_str = "No existing canvas state."
     try:
         space = await self.space_repo.get_by_id(request.space_id)
         if space:
             canvas_data = getattr(space, "canvas_data", {})
             nodes = canvas_data.get("nodes", [])
             zones = [n for n in nodes if n.get("type") == "zone"]
             entities = [n for n in nodes if n.get("type") in ["agent", "crew", "tool"]]
             
             canvas_lines = [f"Name: \"{getattr(space, 'name', 'Unknown')}\""]
             
             if zones:
                 canvas_lines.append("\nEXISTING ZONES:")
                 for z in zones:
                     canvas_lines.append(f"- {z.get('id')} ({z.get('data', {}).get('label', 'Unnamed')})")
             
             if entities:
                 canvas_lines.append("\nENTITIES CURRENTLY ON CANVAS:")
                 for e in entities:
                     ent_type = e.get('type', 'unknown').capitalize()
                     ent_label = e.get('data', {}).get('label', 'Unnamed')
                     zone_id = e.get('parentId', 'no zone')
                     canvas_lines.append(f"- [{ent_type}] \"{ent_label}\" (in zone: {zone_id})")
             
             current_canvas_state_str = "\n".join(canvas_lines)
     except Exception as e:
         logger.warning(f"Failed to fetch space canvas state: {e}")
     ```

5. **Update the LLM Prompt**
   - Inject `CURRENT CANVAS STATE` into the `Context Sources` section of the prompt.
   - Add instructions to the LLM to refer to the current canvas state:
     - *"If the user wants to add a new entity (like a Task) for an existing entity on the canvas, output the new draft and add a connection where 'source_draft_name' is the existing entity's name."*
     - *"Do not recreate agents or tools that are already listed in the CURRENT CANVAS STATE. Reuse them or reference them."*

## Verification & Testing
- Use the Studio / Space Canvas UI.
- Create an Agent named "Research Bot" in a zone.
- Ask the Meta-Agent: "Create a task for the Research Bot to find competitors".
- Verify that the Meta-Agent responds with a drafted task and proposes a connection pointing to the existing "Research Bot", instead of creating a new "Research Bot" draft.
- Check backend logs to ensure the `CURRENT CANVAS STATE` is correctly populated without errors.
