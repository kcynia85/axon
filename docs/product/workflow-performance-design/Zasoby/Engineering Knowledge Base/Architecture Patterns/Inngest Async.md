---
template_type: crew
---

# Inngest Flows (Durable Execution)

> **Problem:** Długie zadania (AI, PDF) są ucinane przez timeouty Vercel (Serverless).
> **Rozwiązanie:** Kolejka asynchroniczna i Durable Execution (Inngest).

## Implementation
1.  **Event:** `inngest.send({ name: "ai.generate", data: { ... } })`
2.  **Function:**
    ```typescript
    inngest.createFunction(
      { id: "generate-ai" },
      { event: "ai.generate" },
      async ({ step }) => {
        const result = await step.run("call-openai", () => callGPT());
        await step.run("save-db", () => db.save(result));
      }
    );
    ```
3.  **Zaleta:** Każdy krok (`step.run`) resetuje timeout i ma wbudowane retry.
