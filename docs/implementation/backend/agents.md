# 🤖 Agent System Strategy

> **Context:** This document outlines the architecture, roles, and orchestration logic for the AI Agents in the RAGAS system.
> **Source Code:** `backend/app/modules/agents/`

---

## 1. Architecture Overview
The Agent System is built on a **Functional Agent Architecture** (ADK), avoiding rigid classes in favor of composable functions and loops.

### Key Components
*   **Agent Definition (`adk_agents.py`):** Agents are defined as functional units with `instruction`, `tools`, and `state`.
*   **Orchestrator (`AgentOrchestrator`):** The central router that manages sessions, context injection, and agent execution.
*   **Context Composer:** Dynamically builds the `global_context` (Project details, Memories) injected into the System Prompt.
*   **Security Guard:** Intercepts and sanitizes inputs before they reach the LLM.

---

## 2. Agent Roles & Capabilities

The system defines specialized roles (in `AgentRole` enum):

### 🕵️ Researcher (`RESEARCHER`)
*   **Goal:** Analyze project context and find facts.
*   **Tools:** `search_knowledge_base` (RAG).
*   **Constraint:** Must provide inline citations `[Source ID]`.
*   **Output:** `research_output` used by other agents.

### 🏗️ Builder (`BUILDER`)
*   **Goal:** Generate production-ready code or artifacts.
*   **Context:** Receives `global_context` + `research_output`.
*   **Tools:** None (Pure generation).

### ✍️ Writer (Loop Pattern) (`WRITER`)
A composite agent implementing a **Refinement Loop**:
1.  **RefinerAgent:** Drafts/Rewrites the content.
2.  **CriticAgent:** Reviews the draft against quality standards.
    *   *Pass:* Returns `DOCUMENT_IS_PERFECT`.
    *   *Fail:* Returns critique.
3.  **Loop:** Repeats until "Pass" or Max Iterations (3).
4.  **Tool:** `exit_loop` (Break circuit).

### 👔 Manager (`MANAGER`)
*   **Goal:** High-level coordination (Default agent).
*   **Context:** Full Project Scope.

---

## 3. Orchestration Flow (`run_turn_stream`)

1.  **History Update:** User message appended to `ChatSession`.
2.  **Security Gate:** `SecurityGuard` validates input (Prompt Injection checks).
3.  **Context Injection:** `ContextComposer` fetches relevant Project/Memory data.
4.  **Agent Selection:** Logic to route to the correct specialized agent.
5.  **Execution:**
    *   **Simple Agents:** Stream tokens directly via SSE.
    *   **Loop Agents:** Execute full cycle, then stream final result.
6.  **Persistence:** Model response saved to DB.

---

## 4. Tool Definitions

### `search_knowledge_base(query)`
*   **Purpose:** RAG retrieval.
*   **Mechanism:** Vector search via `vecs` + Metadata filtering.
*   **Format:** Returns chunks with `SOURCE [ID]` headers.

### `exit_loop()`
*   **Purpose:** Control flow signal.
*   **Trigger:** Called by `RefinerAgent` when `CriticAgent` approves.

---

## 5. Future Roadmap
*   **Durable Execution:** Move long-running loops to Inngest.
*   **Multi-Agent Conversation:** Allow Agents to talk to each other directly (not just sequential loops).
*   **Tool Expansion:** Add `internet_search` and `github_integration`.
