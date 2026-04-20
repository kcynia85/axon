# Implementation Plan: CrewAI Integration

## Objective
Fully integrate the `crewai` framework into the Axon backend, replacing the current "Axon Orchestrator" stub with genuine CrewAI orchestration for both Sequential and Hierarchical processes. The implementation must adhere to Modular Monolith architecture, DDD principles, and strict Python/FastAPI standards.

## Key Principles & Guidelines (from .gemini skills)
- **Modular Monolith & DDD:** Strict separation of layers (`domain`, `application`, `infrastructure`). No external framework imports (like `crewai`) in the `domain` layer.
- **Ports & Adapters:** CrewAI is treated as an external library. It will be wrapped in an adapter within the `infrastructure` layer.
- **Strict Typing:** Use Pydantic V2 and explicit type hints.
- **Async/Await:** All I/O should be asynchronous. Since CrewAI execution might be synchronous/CPU-bound, it must be wrapped in `asyncio.to_thread` or leverage CrewAI's native async capabilities.

---

## Agent Studio -> CrewAI Mapping Strategy

The `CrewAIAdapter` must explicitly translate Axon's `AgentConfig` domain model into CrewAI objects.

### 1. Engine (LLM Configuration)
- **Axon Model:** `llm_model_id` (UUID pointing to a specific LLM Provider and Model, e.g., OpenAI, Anthropic, or local Ollama) + `temperature`.
- **CrewAI Target:** `llm` property of `crewai.Agent`.
- **Mapping:** The Adapter must fetch the LLM configuration from the DB using `llm_model_id` and construct a `crewai.LLM` object (e.g., `LLM(model="gpt-4o", temperature=agent.temperature, base_url=...)`).

### 2. Skills & Tools (Native & Custom)
- **Axon Model:** `native_skills` (e.g., `WEB_SEARCH`) and `custom_functions` (internal `@tool` decorated functions).
- **CrewAI Target:** `tools` property (List of `crewai.Tool`).
- **Mapping:** The Adapter will use the `tools_scanner.py` to retrieve the Python functions corresponding to the strings in `custom_functions` and wrap them in CrewAI's `@tool` or `Tool` object. Native skills will be mapped to pre-built CrewAI/LangChain tools.

### 3. Knowledge / Hubs (Agentic RAG)
- **Axon Model:** `knowledge_hub_ids` (UUIDs pointing to Vector DBs or specific Assets/Chunks).
- **CrewAI Target:** `knowledge_sources` property of `crewai.Crew` or `crewai.Agent`.
- **Mapping:** The Adapter will fetch the text or vector configuration for the given `knowledge_hub_ids`. It will construct CrewAI knowledge objects like `StringKnowledgeSource`, `TextFileKnowledgeSource`, or a custom `BaseKnowledgeSource` that queries Axon's internal vector database (Chroma/pgvector).

### 4. Base Identity & Guardrails
- **Axon Model:** `agent_role_text`, `agent_goal`, `agent_backstory`, `guardrails`.
- **CrewAI Target:** `role`, `goal`, `backstory`.
- **Mapping:** Direct 1:1 string mapping. `guardrails` (instructions and constraints) will be appended to the end of the `agent_backstory` to ensure the CrewAI prompt strictly follows them.

---

## Step-by-Step Implementation

### Step 1: Dependency Management
Add `crewai` to the backend dependencies using `uv`.
- **Action:** Run `uv add crewai langchain-openai` in `axon-app/backend/`.
- **Validation:** Verify `crewai` is present in `pyproject.toml` and `uv.lock`.

### Step 2: Infrastructure Layer - CrewAI Adapter
Create the adapter that implements the mapping strategy defined above.
- **File:** `axon-app/backend/app/modules/agents/infrastructure/crewai_adapter.py`
- **Implementation:**
  - `CrewAIAdapter` class.
  - `async _resolve_llm(llm_model_id: UUID, temp: float) -> crewai.LLM`
  - `async _resolve_tools(native_skills: list[str], custom_funcs: list[str]) -> list[crewai.Tool]`
  - `async _resolve_knowledge(hub_ids: list[UUID]) -> list[BaseKnowledgeSource]`
  - `async _map_agent(agent_config: AgentConfig) -> crewai.Agent`: Calls the resolvers and builds the Agent.
  - `async build_crew(agents: list[AgentConfig], tasks: list[dict], process_type: str, manager_agent_id: UUID) -> crewai.Crew`.
  - Handle `Process.sequential` and `Process.hierarchical` (assigning the `manager_llm` based on the manager agent's config).

### Step 3: Application Layer - Update CrewRunnerFacade
Refactor the facade to use the new adapter instead of the current manual loops.
- **File:** `axon-app/backend/app/modules/agents/application/crew_runner.py`
- **Implementation:**
  - Inject the `CrewAIAdapter`.
  - In `run_sequential_crew` and `run_hierarchical_crew`: 
    - Await adapter's `build_crew(...)` method.
    - Run execution via `result = await asyncio.to_thread(crew.kickoff, inputs={...})`.
  - Ensure output is returned cleanly to Inngest handlers.

### Step 4: Tools Module Sync
Bridge our internal `@tool` decorator with CrewAI.
- **Files:** `axon-app/backend/app/tools/__init__.py`, `axon-app/backend/app/modules/resources/application/tools_scanner.py`
- **Implementation:** Update `HAS_CREWAI` flag. Ensure `tools_scanner.py` yields objects compatible with CrewAI's `tools=[]` array.

### Step 5: Data Flow & State Management
Ensure that the results of the CrewAI execution are saved and synced back to the workspace.
- **Action:** Update Inngest handlers in `crew_runner.py` to persist `final_output` to the `Crew` metadata or `Artifact` records.
- **Action:** (Future/Iterative) Ensure stdout/logs from CrewAI can be streamed back via SSE to the Inspector UI.

### Step 6: Testing & Verification
- **Architecture Validation:** Ensure no `import crewai` exists in `domain/` or `interface/` directories.
- **Integration Tests:** Trigger the Inngest workflow in a test environment to verify full `kickoff()` with mapped tools, LLMs, and knowledge.