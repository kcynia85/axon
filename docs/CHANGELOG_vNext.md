# Changelog — vNext

Adds
- Workspaces-first Canvas (left sidebar) with #zone- anchors
- Settings baselines: LLMs and Knowledge Engine
- Resources/Knowledge baseline (ingest, list, detail)
- Agents SSE streaming baseline

Modifies
- crewAI/LangChain → Google ADK + Inngest orchestration
- Embeddings standardized to 768-d (text-embedding-004)
- Standardized tabs/modals via query params; anchors for Canvas

Removes
- Mandatory crewAI/LangChain orchestration path (kept optional)