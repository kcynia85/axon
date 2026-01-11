---
template_type: crew
---

# Implementation Workflow & Claude Code

## Workflow 2025 (DRY Edition)

1.  **Tech PRD:** Zdefiniuj wymagania funkcjonalne i niefunkcjonalne.
2.  **ADR:** Zapisz kluczowe decyzje (Stack, DB).
3.  **Create PRP:** Wygeneruj `PRP.md` (Single Source of Truth).
4.  **Execute:**
    *   Load PRP & ADR.
    *   ULTRATHINK (Planowanie).
    *   Implementacja.
    *   Walidacja (Lint, Testy).

## Claude Code / Agentic Loop

### UI Agentic Loop
Pętla zwrotna dla generowania UI:
1.  **Figma MCP:** Pobierz design / wygeneruj kod.
2.  **Playwright MCP:** Zrób screenshot / test.
3.  **UI Validator:** Porównaj z oczekiwaniami.
4.  **Fix/Repeat:** Poprawiaj aż będzie "pixel perfect".

### Subagents
*   **Security Auditor:** Sprawdza luki.
*   **Doc Manager:** Aktualizuje dokumentację.
*   **Test Runner:** Uruchamia walidację.
