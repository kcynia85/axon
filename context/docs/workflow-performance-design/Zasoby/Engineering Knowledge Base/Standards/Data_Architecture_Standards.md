# Data Architecture Standards (Integrity in AI Era)

> **Context:** Jak zarządzać danymi, którymi karmimy AI i które od AI otrzymujemy.
> **Target:** Data Architect / Backend Engineer

---

## 1. Hybrid Search (RAG Maturity)

**Problem:** Samo wyszukiwanie wektorowe (Vector Search) bywa nieprecyzyjne przy specyficznych nazwach własnych (np. kody produktów "X-200" vs "X-201").

### 🛡️ Standard: Hybrid Retrieval
Systemy RAG muszą łączyć trzy techniki:
1.  **Vector Search:** Zrozumienie semantyczne ("ciepła kurtka").
2.  **Keyword Search (BM25):** Precyzja słów kluczowych ("Model X-200").
3.  **Re-ranking:** Użycie modelu Cross-Encoder (np. Cohere Rerank) do ostatecznego posortowania wyników z obu źródeł.

**Wzór:** `Rerank(Vector_Results + Keyword_Results) -> Top K Chunks`

---

## 2. The "Tainted Data" Concept (Skażone Dane)

**Zasada:** Każde dane wygenerowane przez AI traktujemy jako **"Skażone" (Tainted)** i potencjalnie niebezpieczne.

### 🛡️ Pipeline Bezpieczeństwa (Rurociąg)
Dane od AI nigdy nie mogą trafić bezpośrednio do bazy SQL ani do przeglądarki.

`AI Output` -> **🛑 Kwarantanna** -> `Zod Parse` (Struktura) -> `HTML Sanitizer` (XSS) -> `Human Review` (Opcjonalnie) -> **✅ Baza Danych**

*   **Zod:** Wymusza schemat JSON (np. czy cena jest liczbą).
*   **Sanitizer:** Usuwa potencjalne skrypty JS (Prompt Injection -> XSS).

---

## 3. Data Lineage (Rodowód i Cytowania)

**Problem:** Halucynacje. Użytkownik musi wiedzieć, SKĄD AI wzięło informację.

### 🛡️ Standard: Source Tracking
W bazie wektorowej (Metadata) musimy przechowywać:
*   `Source ID`: Unikalny identyfikator dokumentu.
*   `Chunk ID`: Konkretny fragment.
*   `Page Number / URL`: Lokalizacja źródłowa.

**Wymóg:** Każda odpowiedź systemu RAG musi zwracać listę cytowań (Citations), które pozwalają użytkownikowi zweryfikować prawdę u źródła (Click-to-Source).
