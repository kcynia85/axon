# Meta-Agent State Machine (LangGraph) Implementation Plan

## Objective
Refactor the current Single-Shot `MetaAgentService` into a deterministic, multi-step **State Machine (Agentic Workflow)** using `langgraph`. This will improve reasoning, reduce hallucinations, enable self-correction (Reflexion) for complex architectures, and adhere strictly to Axon's Modular Monolith and DDD principles.

## Background & Motivation
The current implementation relies on a "Mega-Prompt" that forces the LLM to simultaneously retrieve context, plan the architecture, connect nodes, and output a massive, perfectly formatted JSON string. As Canvas complexity grows, this leads to context degradation ("Lost in the Middle") and JSON formatting errors. A state machine separates these concerns into testable, independent nodes (Planner, Retriever, Drafter, Validator) while respecting the LLM agnosticism built into Axon.

## Architecture (Modular Monolith & DDD)
- **Domain Layer (`domain/meta_agent_graph_models.py`)**: Define the `MetaAgentState` (TypedDict) and Pydantic schemas for intermediate outputs (e.g., `PlannerOutput`).
- **Application Layer (`application/meta_agent_workflow.py`)**: Define the graph nodes (pure functions) and the graph orchestration logic.
- **Application Layer (`application/meta_agent_service.py`)**: Wrap the compiled LangGraph application to maintain the existing interface for the Router.
- **Infrastructure Layer (`infrastructure/adapters/`)**: Continue using the agnostic `LangchainAdapter`.

## Token Optimization & Guardrails
1. **Tiered Models**: Use a fast/cheap model (e.g., GPT-4o-mini equivalent) for the **Planner**, and a highly capable model (e.g., GPT-4o equivalent) for the **Drafter**. (Configurable via Studio settings).
2. **Zero-Token Validation**: The **Validator** node must be a pure Python function. It checks structural integrity (e.g., matching edge IDs, cross-zone rules) without invoking an LLM.
3. **Max Retries**: Hard limit the correction loop (`Drafter -> Validator -> Drafter`) to a maximum of **2 retries** to prevent infinite billing loops.

---

## Implementation Steps

### Step 1: Define Domain Models (State)
**File:** `app/modules/spaces/domain/meta_agent_graph_models.py` (New File)
- Create `MetaAgentState` extending `TypedDict`:
  - `messages`: List of LangChain BaseMessages (for tracking correction loops).
  - `request`: `MetaAgentProposalRequest` (input data).
  - `canvas_state`: Dict (the current space topology).
  - `plan`: String (output from Planner).
  - `search_queries`: List of strings (output from Planner for targeted RAG).
  - `rag_context`: String (output from Retriever).
  - `draft_response`: `MetaAgentProposalResponse` (output from Drafter).
  - `validation_errors`: List of strings (output from Validator).
  - `iteration_count`: Integer (loop breaker).
- Create a simple Pydantic model `PlannerOutput` containing `reasoning`, `search_queries`, and `execution_plan`.

### Step 2: Implement the Workflow Graph
**File:** `app/modules/spaces/application/meta_agent_workflow.py` (New File)
- Define a class `MetaAgentGraphBuilder` that takes injected repositories (`system_retriever`, `rag_service`, `llm_adapter`, `meta_agent_config`).
- **Node 1: Planner (`planner_node`)**
  - Input: User query, canvas_state.
  - Action: Invoke a lightweight LLM using `.with_structured_output(PlannerOutput)`.
  - Output: Updates `plan` and `search_queries` in state.
- **Node 2: Targeted Retriever (`retriever_node`)**
  - Input: `search_queries` from state.
  - Action: Call `system_retriever` and `rag_service` using the specific queries instead of the raw user prompt. Format the results cleanly.
  - Output: Updates `rag_context` in state.
- **Node 3: Drafter (`drafter_node`)**
  - Input: `plan`, `rag_context`, `canvas_state`, `validation_errors` (if any).
  - Action: Construct a strict prompt focusing *only* on JSON generation. Use `.with_structured_output(MetaAgentProposalResponse)` to guarantee JSON schema adherence (removes regex parsing). Increment `iteration_count`.
  - Output: Updates `draft_response` in state.
- **Node 4: Validator (`validator_node`)**
  - Input: `draft_response`, `canvas_state`.
  - Action: Pure Python logic. 
    - Check if `target_workspace` values are valid.
    - Check if `source_draft_name` and `target_draft_name` in connections exist either in the new draft or in the existing `canvas_state`.
  - Output: Updates `validation_errors` in state.
- **Edges & Routing (`check_validation`)**
  - If `validation_errors` is not empty AND `iteration_count` < 3: route back to `drafter`.
  - Else: route to `END`.
- Compile the graph (`StateGraph(MetaAgentState).compile()`).

### Step 3: Refactor the Service
**File:** `app/modules/spaces/application/meta_agent_service.py`
- Keep the existing `__init__` signature (dependency injection remains the same).
- In `propose_draft`:
  - Fetch `canvas_state` and `meta_agent_config` (as currently done).
  - Instantiate `MetaAgentGraphBuilder` with the dependencies.
  - Build and compile the graph.
  - Initialize `MetaAgentState`.
  - Call `await graph.ainvoke(initial_state)`.
  - Return the `draft_response` from the final state.
  - Remove all old Mega-Prompt and Regex parsing logic.

### Step 4: Unit Testing
**File:** `app/modules/spaces/tests/test_meta_agent_workflow.py`
- Write tests for the `validator_node` in isolation (ensure it correctly identifies broken edges and cross-zone violations without mocking LLMs).
- Write a test for the routing function `check_validation` to ensure the loop breaks after 3 iterations.

## Expected Outcomes
- **Modular:** The orchestration (Graph) is decoupled from the business rules (Validator) and the API layer (Service).
- **Reliable:** Pydantic's `with_structured_output` guarantees schema compliance, eliminating JSON parsing errors.
- **Self-Correcting:** The LLM can fix its own architectural mistakes before the user ever sees them.