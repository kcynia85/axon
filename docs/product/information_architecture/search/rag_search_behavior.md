# RAG Search Behavior & Citations

> **Context:** Defines the interaction patterns for Semantic Search (Retrieval-Augmented Generation) within the "Brain" and Agent responses.
> **Relation:** Extends `search_behavior.md` (Lexical Search).

## 1. Search Logic Overview

### **L.1) Hybrid Search Strategy**
*   **Trigger:** User types query in "Brain" or Agent executes `search_knowledge_base` tool.
*   **Mechanism:**
    1.  **Semantic Search (Dense Retrieval):** Embedding lookup (Cosine Similarity). Finds *conceptual* matches.
    2.  **Lexical Search (BM25):** Keyword matching. Finds *exact* matches (IDs, specific terms).
    3.  **Re-ranking:** Cross-Encoder (if available) re-ranks top 20 results for relevance.
*   **Result:** Top `K` chunks (usually 5-10) passed to LLM context.

### **L.2) Filters (Pre-filtering)**
*   **Crucial for RAG:** Users *must* be able to scope the search to reduce hallucinations.
*   **Available Filters:**
    *   **Hub:** [Design, Tech, Marketing]
    *   **Date Range:** [Last Week, Last Month, Custom]
    *   **Source Type:** [PDF, MD, Notion, URL]
    *   **Author:** [Agent Name, User Name]

---

## 2. Result Presentation (Brain View)

### **UI.1) Chunk Cards (Passage View)**
Instead of just file names, show the *relevant passage* (chunk).

```markdown
┌──────────────────────────────────────────────┐
│ 📄 Tech PRD Axon.md (Lines 240-255)          │  <-- Source Link
│ ...The system uses **Hybrid Search** with    │  <-- Highlighted match
│ Supabase Vector and Gemini Embeddings...     │
│                                              │
│ [Relevance: 0.89] [Date: 2026-02-15]         │
└──────────────────────────────────────────────┘
```

### **UI.2) Source Preview (Side Peek)**
*   **Trigger:** Click on a Chunk Card.
*   **UI:** 
    *   Full document view (Markdown/PDF renderer).
    *   **Highlight:** The specific chunk is highlighted in yellow background.
    *   **Scroll:** Automatically scrolls to the chunk position.

---

## 3. Citation UX (Agent Response)

### **C.1) Inline Markers**
*   **Format:** `[1]`, `[2]`, `[Memory]`
*   **Placement:** Immediately after the claim in the text.
*   **Behavior:**
    *   **Hover:** Shows a tooltip with the source title and a 2-line snippet.
    *   **Click:** Opens the **Source Preview** (Side Peek) focused on the citation.

### **C.2) Sources Footer**
*   **Location:** Bottom of the Agent response bubble.
*   **Display:** Collapsible list "Used 3 Sources".
*   **Content:**
    1.  `[1]` **Tech PRD Axon.md** (Hub: Tech)
    2.  `[2]` **Meeting Notes 2025.pdf** (Hub: Discovery)
    3.  `[Memory]` **User Preference: Dark Mode** (System Memory)

---

## 4. RAG Debugger (Advanced View)

### **D.1) Purpose**
For developers/admins to diagnose why an Agent retrieved specific information (or missed it).

### **D.2) Interface**
*   **Input:** Query text.
*   **Settings:** Top K (slider 1-20), Threshold (slider 0.0-1.0).
*   **Output Visualization:**
    *   **Retrieved Chunks:** List with similarity scores (e.g., 0.92).
    *   **Distance Metric:** Show cosine distance.
    *   **Payload:** Raw JSON metadata.
