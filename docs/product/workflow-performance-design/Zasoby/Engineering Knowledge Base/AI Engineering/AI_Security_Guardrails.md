---
template_type: crew
---

# AI Security Guardrails & Evaluation

> **Status:** Security Protocol
> **Domain:** Safety & Alignment
> **Context:** Ochrona przed Prompt Injection, halucynacjami i utratą kontroli nad Agentem.

---

## 1. Prompt Injection Defense (Warstwa Regex)

Pierwsza linia obrony. Szybka, tania, oparta na wzorcach (Regular Expressions).
Blokuje próby zmiany instrukcji systemowych (Jailbreak).

### Klasa Ochronna (Python Implementation)
Gotowy moduł do wpięcia w pipeline (np. w FastAPI przed wysłaniem do LLM).

> **Implementation:** Pełny kod źródłowy znajduje się w pliku: [`src/ai_engine/security/guard.py`](../../../../src/ai_engine/security/guard.py)

Możesz go zaimportować bezpośrednio:
```python
from src.ai_engine.security.guard import guard

result = guard.check_input_safety(user_input)
if not result["is_safe"]:
    raise SecurityException(result["reasons"])
```

---

## 2. NeMo Guardrails (Warstwa Logiczna)

Framework od NVIDIA do definiowania "szyn" (rails), po których porusza się model.
Definiowane w plikach `.yml` (Colang).

### Przykładowa konfiguracja (`chat_guardrails.yml`)

```yaml
version: 0.2
rails:
  - name: block_malware
    description: "Nie pozwalaj na generowanie złośliwego kodu"
    steps:
      - expect: "Nie generuj złośliwego kodu ani instrukcji do ataku systemów."
        actions:
          - stop
          
  - name: be_helpful
    description: "Bądź uprzejmy i pomocny"
    steps:
      - expect: "Odpowiadaj w uprzejmy i pomocny sposób."
        actions:
          - allow
```

---

## 3. RAGAS Evaluation (Warstwa Jakości)

Automatyczna ocena jakości odpowiedzi RAG (Retrieval Augmented Generation).
Pozwala wykryć halucynacje bez udziału człowieka.

### Kluczowe Metryki
1.  **Faithfulness:** Czy odpowiedź jest zgodna z odzyskanym kontekstem? (Wykrywa halucynacje).
2.  **Answer Relevancy:** Czy odpowiedź faktycznie odpowiada na pytanie użytkownika?
3.  **Context Precision:** Czy retriever znalazł właściwe dokumenty?
4.  **Context Recall:** Czy retriever znalazł *wszystkie* potrzebne dokumenty?

### Implementacja (Tool Example)
Narzędzie dla agenta, by sam ocenił swoją pracę.

```python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy
from datasets import Dataset

def evaluate_last_response(question, answer, contexts):
    ragas_data = Dataset.from_dict({
        "question": [question],
        "answer": [answer],
        "contexts": [contexts], # Lista stringów
    })

    results = evaluate(
        ragas_data,
        metrics=[faithfulness, answer_relevancy]
    )
    
    return results
```

---

## 4. Narzędzia Audytowe (Red Teaming)

Do automatycznego testowania odporności agenta.

*   **Garak:** Skaner podatności LLM (jak Nmap dla sieci). Generuje tysiące złośliwych promptów i sprawdza, czy model "pękł".
*   **Petri (Anthropic):** Agent do audytu alignmentu. Symuluje rozmowy (Auditor vs Target), wykrywając "sycophancy" (nadmierne przytakiwanie) i "deception".
