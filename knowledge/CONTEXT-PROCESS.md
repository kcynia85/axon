# ⚙️ CONTEXT-PROCESS: Workflow & Standards (Master)

> **Role:** CORE KERNEL. Rules for AI Behavior, Process, and Quality Assurance.
> **Philosophy:** Extreme Brevity. Zero Fluff. Action-First.

---

# 🤖 AI Behavior Protocols (The Law)

## 1. 🤐 Extreme Brevity (Token Economy)
- **Output:** Concise. No "I will now...", "Here is the code...". Just action or result.
- **Style:** Bullet points > Paragraphs. Code > Explanations.

## 2. 🛑 Speak Before You Act (Human-in-the-Loop)
- **Trigger:** Before any file modification or shell command.
- **Action:** Present a concise plan (bullet points) in the terminal.
- **Wait:** Proceed only after user confirmation (or if implicitly authorized).

## 3. 📉 Context Sandwich Protocol (Anti-Lost-in-the-Middle)
When processing large context, structure your internal attention:
1.  **HEAD:** Read Instructions & Role first.
2.  **BODY:** Process Data/Code (The "Meat").
3.  **TAIL:** Re-read Constraints & Output Format.

---

# ⚙️ Engineering Standards (Guardrails)

## 🏗️ Architecture
- **DDD:** Logic separated from Infra. Ubiquitous Language mandatory.
- **KISS:** Simple CRUD? No over-engineering.
- **Hexagonal:** Use Ports & Adapters for AI Providers & 3rd Party APIs.

## 🔄 Async & Queues (Decision Matrix)
- **User Waiting?** -> **Sync** (Request/Response).
- **Long Process (>5s)?** -> **Async** (Background Job/Queue).
- **Critical Data?** -> **Transactional Outbox**.

## 🛡️ Safety & Quality
- **Zero Hallucinations:** Check file existence before import.
- **File Headers:** Always add path comment (e.g., `// src/app/page.tsx`).
- **Data Lineage:** AI-generated data must have a source citation.

---

# 🚩 Feature Flags & Rollouts (Lifecycle)
1.  **Identify:** Risky feature? -> Flag it.
2.  **Implement:** `useFlag('domain.feature.variant')`.
3.  **Test:** Verify ON and OFF states.
4.  **Rollout:** Gradual release. Monitor metrics.

---

# 🔍 SEO & Accessibility (Quick Ref)
- **Schema.org:** Use JSON-LD for Products, Articles, Breadcrumbs.
- **Images:** Modern formats (AVIF/WebP) + `alt` text.
- **CWV:** Optimize LCP, INP, CLS.
- **A11y Modules:** Refer to `knowledge/accessibility/*.md` for specific rules (Forms, Semantics, Media).

---

# 🤖 MCP Tooling Priority
**Rule:** Use MCP tools over standard actions if available.

1.  **Serena:** Semantic code edits (JS/TS Refactor).
2.  **Git:** Version control & Context.
3.  **Playwright:** E2E Testing.
4.  **Notion:** Documentation sync.
5.  **Supabase:** DB Schema & Migrations.
6.  **Firecrawl/Perplexity:** External Research.