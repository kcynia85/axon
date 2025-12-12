# 🛠️ PATTERNS CHEATSHEET (High Density)
> **Role:** Quick reference for implementation details.
> **Full Catalogs:** `Zasoby/Engineering Knowledge Base/Patterns/`

---

## 🤖 AI Ops & Engineering (Top 5)

### 1. Model Router (AI Gateway)
*   **Impl:** Use `LiteLLM` / `Helicone`.
*   **Logic:** Simple -> Haiku ($0.25), Complex -> Opus ($15).
*   **Fallback:** If Haiku fails JSON parse -> Retry with GPT-4o.

### 2. Generative UI (JSON-to-React)
*   **Impl:** `streamUI` from Vercel AI SDK.
*   **Safety:** Validate props with Zod before rendering.
*   **Pattern:** Server emits JSON -> Client maps to `<Chart />`, `<Table />`.

### 3. RAG Fusion
*   **Impl:** Generate 3 queries -> `Promise.all` retrieval.
*   **Sort:** Reciprocal Rank Fusion (`1 / (k + rank)`).
*   **Limit:** Top 5 merged chunks.

### 4. Semantic Caching
*   **Impl:** Redis VSS / GPTCache.
*   **Key:** `hash(prompt_embedding) + tenant_id`.
*   **TTL:** 24h for FAQ, 5m for volatile data.

### 5. Data Lineage (Citations)
*   **Ingest:** Store `source_url` + `chunk_index` in vector metadata.
*   **Prompt:** "Always cite sources as [1], [2]".
*   **UI:** Render citations as tooltips.

---

## 🏗️ Architecture & Data (Top 5)

### 1. Vertical Slice (Backend)
*   **Structure:** `src/features/login/` contains Controller + Service + DTO + Tests.
*   **Shared:** Only `db_client` and `utils` in `src/shared/`.

### 2. Transactional Outbox (Resilience)
*   **Write:** `INSERT INTO users ...; INSERT INTO outbox ...;` (One transaction).
*   **Send:** Worker polls `outbox` table -> sends Email.
*   **Clean:** Delete processed rows.

### 3. JSONB + GIN (Hybrid Data)
*   **Use:** For AI metadata, flexible configs.
*   **Index:** GIN index on specific keys only.
*   **Schema:** Validate JSON content with Zod in app layer.

### 4. Streaming SSR (React)
*   **Impl:** `<Suspense fallback={<Skeleton />}>` around async components.
*   **UX:** Show Shell immediately, stream content.

### 5. Hexagonal (Ports & Adapters)
*   **Domain:** Defines `interface AIProvider { generate(): string }`.
*   **Infra:** Implements `class OpenAIAdapter implements AIProvider`.
*   **Main:** Injects Adapter into Service.
