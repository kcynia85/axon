---
template_type: crew
---

# LLM-as-a-Judge Protocol

> **Cel:** Obiektywna, skalowalna ocena jakości odpowiedzi generowanych przez systemy AI (RAG, Agenci) bez udziału człowieka.
> **Kontekst:** Unit testy sprawdzają kod. Evals sprawdzają inteligencję.

---

## 🏛️ Zasady Sędziowania

1.  **Model Sędziowski > Model Testowany:** Sędzia musi być "mądrzejszy" lub równy modelowi testowanemu.
    *   *Testowany:* GPT-3.5-Turbo -> *Sędzia:* GPT-4o.
    *   *Testowany:* Llama 3 8B -> *Sędzia:* Llama 3 70B / GPT-4o.
2.  **Kryteria Atomowe:** Nie oceniaj "czy odpowiedź jest dobra". Oceniaj konkretne wymiary (patrz sekcja Metryki).
3.  **Chain of Thought:** Sędzia musi uzasadnić ocenę *zanim* wystawi notę liczbową. To zwiększa precyzję o ~20%.

---

## 📏 Metryki Ewaluacji (RAGAS Standard)

### 1. Faithfulness (Wierność)
*   **Pytanie:** "Czy odpowiedź nie zawiera halucynacji i wynika TYLKO z dostarczonego kontekstu?"
*   **Skala:** 0 (Halucynacja) - 1 (Fakt).

### 2. Answer Relevancy (Trafność)
*   **Pytanie:** "Czy odpowiedź faktycznie odpowiada na zadane pytanie użytkownika, czy leje wodę?"
*   **Skala:** 0 (Nie na temat) - 1 (W punkt).

### 3. Context Precision (Precyzja Retrievalu)
*   **Pytanie:** "Czy system znalazł właściwe fragmenty wiedzy potrzebne do odpowiedzi?"
*   **Skala:** 0 (Śmieci) - 1 (Idealny retrieval).

---

## 🤖 Judge Prompt Template (Kopiuj do kodu)

```markdown
# SYSTEM: AI QA Judge
You are an impartial expert evaluator. Your job is to score the AI's response based on the provided criteria.

### INPUT DATA
- **User Question:** {question}
- **Retrieved Context:** {context}
- **AI Answer:** {answer}
- **Ground Truth (Optional):** {ground_truth}

### CRITERIA: {metric_name}
{metric_definition}

### INSTRUCTIONS
1. Analyze the relationship between the Question, Context, and Answer.
2. Think step-by-step (Chain of Thought) about errors or hallucinations.
3. Assign a score between 1 and 5.
4. Output valid JSON only.

### OUTPUT FORMAT
{
  "reasoning": "Compact analysis of why the score was given...",
  "score": 4
}
```

---

## 🛠️ Workflow Wdrożeniowy

1.  **Golden Dataset:** Stwórz plik `eval_dataset.json` z 20-50 parami (Pytanie + Oczekiwana Odpowiedź).
2.  **Script:** Napisz prosty skrypt w Pythonie (używając LangChain/RAGAS lub czystego OpenAI API), który:
    *   Iteruje przez dataset.
    *   Wysyła zapytanie do Twojego systemu.
    *   Wysyła odpowiedź systemu + kontekst do Sędziego (z promptem powyżej).
    *   Loguje wyniki do CSV.
3.  **CI/CD Gate:** Jeśli średni wynik `Faithfulness` spadnie poniżej 0.8 -> Build Failed.

---

## ⚠️ Pułapki (Common Pitfalls)

*   **Self-Correction Bias:** Model często ocenia swoje własne odpowiedzi łagodniej. Używaj innego modelu jako sędziego jeśli to możliwe.
*   **Length Bias:** Modele preferują dłuższe odpowiedzi. W instrukcji sędziego zaznacz: "Verbosity is not a merit. Penalize fluff."
