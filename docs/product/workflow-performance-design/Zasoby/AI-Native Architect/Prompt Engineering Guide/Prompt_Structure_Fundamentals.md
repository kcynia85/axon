---
template_type: crew
---

# Prompt Structure Fundamentals

> **Cel:** Fundamenty skutecznej komunikacji z modelem LLM.
> **Zasada:** Jasność > Złożoność.

---

## ⚡ Quick Wins (Zasady Podstawowe)

1.  **Bądź precyzyjny:** Używaj czasowników akcji (`Generate`, `Analyze`, `Summarize`).
2.  **Kontekst to Król:** Im więcej tła (Persona, Format, Ograniczenia), tym lepszy wynik.
3.  **One-Shot / Few-Shot:** Daj przykład oczekiwanego wyniku. To działa lepiej niż 1000 słów instrukcji.
4.  **Weryfikuj:** Jeśli prosisz o fakty, zawsze żądaj źródeł lub weryfikuj samodzielnie.

---

## 🎭 1. Adopt Persona (Nadawanie Roli)

**Wzorzec:** `[Action] as [Role]. [Persona details]. [Instruction].`

```markdown
✅ Act as a Senior UX Copywriter.
I am a Product Manager working on a new Fintech App.
Explain "Tokenization" to me like I am 5 years old.
```

---

## 🧱 2. Formatting & Structure (Formatowanie)

Używaj separatorów (`###`, `---`) do oddzielania instrukcji od danych.

### Wzorzec: "Instruction + Context"
```markdown
### INSTRUCTION
Act like a MERN Stack Developer.
Answer the question using the context provided below.

### CONTEXT
User: Kamil
Project: E-commerce MVP
Stack: React, Node.js, MongoDB

### QUESTION
What database should I use for my project?
```

### Wzorzec: "Specified Output"
```markdown
- Format this answer as 'JSON'.
- Return ONLY the JSON object.
- Schema: { "title": string, "steps": array }
```

---

## 🎯 3. Clear Instruction (Jasność Poleceń)

Unikaj dwuznaczności. Precyzuj intencje.

| ❌ Źle (Niejasne) | ✅ Dobrze (Precyzyjne) |
| :--- | :--- |
| "Answer clearly" | "Answer in plain English, avoiding technical jargon." |
| "Write copy for website" | "Draft engaging microcopy for the 'Sign Up' button to increase conversion." |
| "Fix the code" | "Refactor this function to improve readability and time complexity." |

---

## 🔧 4. Modifiers (Modyfikatory Stylu)

Używaj tych słów, aby dostroić wynik.

### Kwalifikatory (Zakres)
*   ❌ "Popraw UX" -> ✅ "Zaproponuj **3 drobne usprawnienia** (Quick Wins) dla formularza."

### Przymiotniki (Ton)
*   ❌ "Napisz e-mail" -> ✅ "Napisz **empatyczny** i **profesjonalny** e-mail z przeprosinami."

### Format (Struktura)
*   ❌ "Podsumuj to" -> ✅ "Podsumuj to w **liście punktowanej (Bullet Points)**."

### Negacje (Ograniczenia)
*   ❌ "Opisz produkt" -> ✅ "Opisz produkt, **nie używając** słów 'innowacyjny' i 'przełomowy'."

---

## 🧩 5. Scope Limiting (Ograniczanie Zakresu)

Jeśli model gubi wątek, użyj twardego resetu.

```markdown
Ignore all previous instructions before this one.
Your new task is: [Task].
```