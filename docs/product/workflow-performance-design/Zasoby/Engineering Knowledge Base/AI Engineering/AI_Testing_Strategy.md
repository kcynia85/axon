---
template_type: crew
---

# AI System Testing Strategy (The "How-To")

> **Context:** Testing AI systems is hard because LLMs are non-deterministic and expensive.
> **Target:** QA Engineer / AI Engineer

---

## 1. The Pyramid vs The Trophy (Reality Check)

Don't use the standard Testing Pyramid. Use the **Testing Trophy**.

*   🏆 **Integration Tests (Majority):** Test if your Agent talks to the DB and the LLM correctly (mocked).
*   🔼 **E2E Tests (Few):** Real calls to OpenAI to check if prompts actually work.
*   🔽 **Unit Tests (Some):** For pure logic (calculators, parsers).

---

## 2. Mocking Strategies (Don't Burn Money)

Never run your full CI/CD pipeline against live OpenAI API. It's slow, expensive, and flaky.

### 🎭 Strategy A: VCR / Replay (Recommended)
Record the interaction once, replay it forever.
*   **Tools:** `vcrpy` (Python), `polly.js` (Node).
*   **Flow:**
    1.  First run: Call OpenAI -> Save response to `cassettes/test_login.yaml`.
    2.  Next runs: Read from YAML. Zero cost.
    3.  **Prompt:** *"Configure vcrpy for my tests. Ignore headers like 'Authorization' so secrets don't leak."*

### 🎭 Strategy B: Semantic Mocking
If you change the prompt slightly, VCR breaks. Semantic Mocking returns a fake response if the prompt is *similar* (using embeddings).
*   **Tool:** Custom wrapper or advanced libraries.

---

## 3. Separation of Concerns: Logic vs Intelligence

Split your tests into two folders:

### 📂 `tests/deterministic/` (Run on every commit)
*   **What:** Parsers, DB logic, API routing, Guardrails (Regex).
*   **Mock:** ALL LLM calls are mocked (return hardcoded "Hello World").
*   **Speed:** < 1s.

### 📂 `tests/evals/` (Run nightly or on demand)
*   **What:** Prompt Quality, RAG Accuracy, hallucination checks.
*   **Mock:** NONE. Real calls to LLM.
*   **Frameworks:** RAGAS, DeepEval, Promptfoo.
*   **Metric:** "Answer Relevancy > 0.8".

---

## 4. Advanced QA Patterns (Beyond Assertions)

### ⚖️ Pattern: LLM-as-a-Judge
Unit testy nie działają na tekst ("Czy odpowiedź brzmi uprzejmie?").
**Rozwiązanie:** Użyj modelu AI jako Sędziego.

*   **Prompt Sędziego:** *"Jesteś ekspertem QA. Ocen odpowiedź systemu w skali 1-5 pod kątem uprzejmości. Wyjście: JSON { score: int, reason: string }."*
*   **Użycie:** W testach E2E (evals).
*   **Zasada:** Sędzia musi być silniejszy niż model testowany (np. GPT-4o ocenia GPT-3.5).

### 👥 Pattern: Shadow Mode (Safe Refactoring)
Jak bezpiecznie wdrożyć nowy prompt na produkcję?
1.  **Deploy:** Wdróż nowy model jako "Shadow" (nie widoczny dla usera).
2.  **Duplicate Traffic:** Każde zapytanie użytkownika idzie do modelu Live (A) i Shadow (B).
3.  **Log & Compare:** Zapisz obie odpowiedzi w bazie.
4.  **Offline Eval:** Uruchom "LLM-as-a-Judge" na zebranych logach, aby porównać, czy B jest lepsze od A.
5.  **Promote:** Jeśli B wygrywa > 55% przypadków, zamień je miejscami.

---

## 5. The "Golden Set" (Dataset)

You cannot test AI without data. Maintain a `golden_dataset.json`.
*   `Input`: "How do I reset my password?"
*   `Expected Output`: "Go to settings page..." (or semantic equivalent).

### 🤖 Prompt for Agent
*"Create a Pytest fixture that loads `golden_dataset.json`. Run the Agent against each input and assert that the output contains key phrases defined in the dataset."*

---

## 6. Frontend QA Strategy (Optimistic UI)

Testing "Optimistic UI" is tricky because the UI updates *before* the server responds. You must test the **Rollback** mechanism (what happens when the server fails).

### 🎭 Playwright E2E Pattern
Use Playwright's network interception to simulate a server failure.

**Scenario:** User clicks "Like". UI shows ❤️ immediately. Server returns 500. UI must revert to 🤍 and show a Toast Error.

```typescript
// tests/e2e/optimistic-ui.spec.ts
import { test, expect } from '@playwright/test';

test('should rollback optimistic update on server error', async ({ page }) => {
  // 1. Setup: Go to page
  await page.goto('/posts/1');

  // 2. Intercept: Force the API to fail
  await page.route('**/api/posts/1/like', route => {
    route.abort('failed'); // or route.fulfill({ status: 500 })
  });

  // 3. Action: Click Like
  const likeBtn = page.locator('[data-testid="like-btn"]');
  await expect(likeBtn).toContainText('0'); // Initial state
  await likeBtn.click();

  // 4. Assert Optimistic State (Immediate)
  await expect(likeBtn).toContainText('1'); // Should increment instantly

  // 5. Assert Rollback (After failure)
  // Wait for the simulated failure to propagate
  await expect(likeBtn).toContainText('0'); // Should revert
  await expect(page.locator('.toast-error')).toBeVisible();
});
```

**Key Principle:** Never trust the "Happy Path" alone in Optimistic UI. Always test the "Sad Path" to ensure data consistency.
