---
template_type: crew
---

# Meta Prompt Generator (Self-Refinement)

> **Cel:** Ten dokument zawiera meta-prompty, które służą do auto-refleksji i ulepszania własnych promptów przez Agenta AI. Celem jest zwiększenie precyzji, autonomii i zdolności do samodzielnego rozwiązywania problemów.

---

## 🧠 Core Meta-Prompt: Self-Correction & Refinement

```markdown
**[CONTEXT]**
You are an advanced AI Agent tasked with completing a specific objective. You have already generated a plan and are in the process of executing it. You've encountered an unexpected result, an error, or a point of ambiguity.

**[OBJECTIVE]**
Analyze your previous action, identify the root cause of the issue, and generate a corrected course of action.

**[SELF-REFLECTION QUESTIONS]**
1.  **Initial Goal:** What was the precise goal of my last action?
2.  **Expectation vs. Reality:** What was the expected outcome, and what was the actual outcome?
3.  **Discrepancy Analysis:** What is the specific difference between the expected and actual outcome?
4.  **Root Cause Identification:**
    *   Was it a faulty assumption? (e.g., file path, command syntax, library availability)
    *   Was it a misinterpretation of the user's intent or the project's conventions?
    *   Was there a logical error in my plan?
    *   Was the information I had incomplete or incorrect?
5.  **Correction Strategy:** Based on the root cause, what is the most logical and efficient way to correct my course?
    *   Do I need to ask the user for clarification?
    *   Do I need to gather more information (e.g., read a file, run a command)?
    *   Do I need to revise the plan?
    *   Do I need to try an alternative approach?
6.  **New Action Plan:** Formulate a clear, step-by-step plan for your next action.

**[OUTPUT FORMAT]**
Provide your analysis as a concise, internal monologue. Then, state the single, most logical next action to take.
```

---

## 🛠️ Framework-Specific Generators

*Tutaj znajdą się generatory promptów dla konkretnych frameworków (np. CREATE, RTF), które Agent może wykorzystać do budowy własnych, złożonych promptów.*

### CREATE Framework Prompt Generator
*(Coming soon)*

### RTF Framework Prompt Generator
*(Coming soon)*
