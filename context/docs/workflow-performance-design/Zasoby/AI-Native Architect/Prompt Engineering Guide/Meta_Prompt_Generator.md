# Meta-Prompt Generator (Self-Refinement)

> **Cel:** Narzędzie dla Agenta AI do samodzielnego ulepszania własnych promptów.
> **Zasada:** "Refine before Execution."

---

## 📋 Quick Copy Templates

### 🧠 1. The Reasoning Architect (Complex Logic)
*Użyj do: Analizy, Planowania, Architektury.*
```text
Act as a [Role, e.g., Senior Systems Architect].
Your goal is to: [Objective].
Context: [Project Context / Constraints].

Let's think step by step (Chain of Thought):
1. Analyze the input and identify hidden assumptions.
2. Break down the problem into atomic components.
3. Evaluate 3 potential approaches (Pros/Cons).
4. Select the best approach and justify why.

Output Format: Markdown with clear headers.
```

### ✍️ 2. The Creative Director (Content & Copy)
*Użyj do: Pisania, Marketingu, UX Writing.*
```text
Act as a [Role, e.g., World-Class Copywriter].
Topic: [Topic].
Target Audience: [Audience].
Goal: [Goal, e.g., Increase Conversion].

Constraints:
- Tone of Voice: [Tone, e.g., Witty, Professional].
- Avoid: [Forbidden words/cliches].
- Format: [Format, e.g., 3 headlines + body text].

Before writing, ask yourself: "Is this boring?" If yes, rewrite.
```

### 👨‍💻 3. The Code Craftsman (Engineering)
*Użyj do: Pisania kodu, Refaktoryzacji, Debuggowania.*
```text
Act as a [Role, e.g., Senior Python Developer].
Task: [Task].
Stack: [Stack, e.g., FastAPI, React].

Requirements:
- Adhere to SOLID principles.
- Include error handling (Try/Except).
- Add docstrings for complex logic only.
- Do NOT explain basic concepts; focus on the solution.

Output: [Code Block only / Code + Explanation].
```

---

<details>
<summary>📚 Theory & Logic (How it works)</summary>

### 🛠️ The Refiner Protocol
Kiedy Agent generuje prompt (dla siebie lub podsystemu), powinien przepuścić go przez ten filtr:

#### 1. Analiza Celu (Intent Analysis)
*   **Pytanie:** Co dokładnie chcę osiągnąć?
*   **Sprawdzenie:** Czy cel jest mierzalny? Czy zdefiniowałem format wyjściowy (np. JSON, Markdown, lista)?

#### 2. Kontekstualizacja (Context Injection)
*   **Pytanie:** Czy podałem wystarczająco dużo tła?
*   **Sprawdzenie:** Czy dodałem role (Persona)? Czy dodałem ograniczenia (Constraints)?
*   **Wzorzec:** `Act as [Role]. Context: [Project Context]. Goal: [Objective].`

#### 3. Technika Myślenia (Reasoning Path)
*   **Pytanie:** Czy zadanie wymaga złożonego myślenia?
*   **Sprawdzenie:** Jeśli tak, dodaj instrukcję `Let's think step by step` (Chain of Thought) lub rozbij zadanie na podkroki.

</details>