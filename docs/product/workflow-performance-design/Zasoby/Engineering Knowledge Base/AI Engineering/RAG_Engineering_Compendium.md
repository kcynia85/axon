# RAG Engineering Compendium

> **Status:** Deep Engineering Guide
> **Domain:** Data & Retrieval
> **Context:** Optymalizacja jakości wyszukiwania informacji dla Agentów AI.

---

## 1. Fizyka Embeddingów (Embeddings Physics)

Jakość retrievalu zależy od tego, jak model "rozumie" odległość między wektorami.

### Wymiary (Dimensions)
Więcej wymiarów = lepsza rozdzielczość semantyczna.

| Wymiar | Charakterystyka | Przykład (Romeo loves vs hates Juliet) |
| :--- | :--- | :--- |
| **512D** | Szybki, tani, "zlepia" podobne pojęcia | Dystans minimalny (mylenie love/hate) |
| **1536D** | Precyzyjny, kosztowny, rozróżnia niuanse | Wyraźny dystans semantyczny |

### Dobór Modelu (2025 Standard)
Opieramy się na rankingu MTEB (Massive Text Embedding Benchmark).

*   **`text-embedding-3-large` (1536D):** Domyślny wybór dla systemów produkcyjnych. Najlepsza semantyka.
*   **`text-embedding-3-small` (512D/1536D):** Tylko dla bardzo prostych systemów lub przy ekstremalnych ograniczeniach kosztowych.
*   **Legacy:** `ada-002` (NIE używać).

---

## 2. Chunking Strategy (Klucz do jakości)

Najczęstszy błąd: zbyt duże chunki lub cięcie w połowie myśli.

> **Implementation:** Pełny kod źródłowy splitterów znajduje się w pliku: [`src/ai_engine/rag/chunking.py`](../../../../src/ai_engine/rag/chunking.py)

### A. Recursive Character Splitting (Złoty Standard)
Najbardziej elastyczny. Próbuje ciąć po akapitach, potem zdaniach, potem słowach.
**Użycie:** Domyślnie dla większości dokumentów (artykuły, dokumentacja).

```python
from src.ai_engine.rag.chunking import ChunkingStrategy

# Użycie gotowej fabryki:
splitter = ChunkingStrategy.get_recursive_splitter()
docs = splitter.create_documents([raw_text])
```

### B. Sentence Transformers Splitting (Semantyczny)
Używa modelu do wykrywania granic zdań. Gwarantuje, że chunk nie utnie zdania w połowie.
**Użycie:** Dokumenty narracyjne, gdzie sens zdania jest kluczowy.

### C. Custom Splitter (Strukturalny)
Dla dokumentów o specyficznej strukturze (np. raporty prawne, logi).

### Chunk Size vs Dimensions
| Chunk Size | Dimensions | Efekt |
| :--- | :--- | :--- |
| 300-500 | 512 | Precyzja OK, tanio. |
| **800-1500** | **1536** | **Sweet Spot.** Najlepsza semantyka. |
| >1500 | Any | Spadek jakości (zbyt wiele wątków w chunku). |

---

## 3. Retrieval Engineering

Konfiguracja sposobu, w jaki retriever wybiera dokumenty z bazy wektorowej.

### A. Similarity Search (Top-K)
Najprostszy mechanizm. Zwraca dokumenty o najmniejszym kącie (cosine similarity).
*   **Problem:** Może zwrócić 3 prawie identyczne chunki.

### B. MMR (Max Marginal Relevance)
Balansuje między trafnością (relevance) a różnorodnością (diversity).

```python
retriever = db.as_retriever(
    search_type="mmr",
    search_kwargs={
        "k": 3,             # Ile dokumentów zwrócić
        "fetch_k": 20,      # Ile pobrać do wstępnej analizy
        "lambda_mult": 0.5  # 1 = max trafność, 0 = max różnorodność
    }
)
```
**Kiedy używać:** Gdy chcesz uniknąć duplikatów informacji (np. 3 wersje tego samego przepisu).

### C. Similarity Score Threshold (Filtr Jakości)
Odrzuca wyniki poniżej pewnego progu pewności.

```python
retriever = db.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={
        "k": 3, 
        "score_threshold": 0.3 # Odrzuć słabe dopasowania
    }
)
```
**Kiedy używać:** Gdy wolisz, żeby agent powiedział "Nie wiem", niż halucynował na podstawie słabych danych.

### D. RAG Fusion (Multi-Query + RRF)
Technika dla zapytań nieprecyzyjnych ("błąd logowania"). Zwiększa Recall.
1.  **Query Generation:** LLM generuje 3 warianty pytania użytkownika.
2.  **Parallel Search:** System szuka dokumentów dla każdego wariantu.
3.  **Reciprocal Rank Fusion (RRF):** Wyniki są łączone i rangowane algorytmem RRF.

### E. Contextual Compression (Smart Filtering)
Rozwiązanie problemu "Lost in the Middle" i kosztów tokenów.
Zanim dokumenty trafią do LLM, przechodzą przez "Kompresor":
1.  **Base Retriever:** Pobiera np. 10 dokumentów.
2.  **Compressor (LLM Chain Extractor):** Mały model czyta dokumenty i pytanie, wycinając TYLKO relewantne zdania.
3.  **Final Prompt:** LLM dostaje tylko esencję, bez szumu.

---

## 4. Metadata Strategy

**Zasada:** Retriever nie "czyta" metadanych, ale może ich używać do **pre-filteringu**.

Przykład struktury metadanych:
```json
{
  "source": "manual_v2.pdf",
  "page": 12,
  "section": "Troubleshooting",
  "year": 2024
}
```

Użycie w LangChain (Self-Query Retriever):
*   Query: "Problemy z silnikiem w modelu 2024"
*   Filter (automatyczny): `year == 2024`
*   Search: "Problemy z silnikiem" (tylko w przefiltrowanym zbiorze)

---

## 5. Optymalizacja Pipeline (Checklist)

1.  **Ingest:** Usuń nagłówki, stopki, numery stron i artefakty PDF przed embeddingiem.
2.  **Model:** Użyj `text-embedding-3-large`.
3.  **Chunking:** Ustaw `chunk_size` na ~1000 znaków z `overlap` ~200.
4.  **Retriever:** Zacznij od `mmr` lub `similarity_score_threshold` (0.2).
5. **Top-K:** Ustaw `k=3` do 5. Powyżej 8 spada jakość odpowiedzi LLM (Lost in the Middle).

---

## 6. Decision Matrix: Common Use Cases (Best Practices)

Szybka ściąga doboru strategii pod konkretny problem biznesowy.

| Scenariusz (Use Case) | Splitter Strategy | Retriever Strategy | Dlaczego? |
| :--- | :--- | :--- | :--- |
| **Q&A po Dokumentacji** (Help Center, Manuale) | **Recursive Character** (1000/200) | **MMR** (`k=4`, `lambda=0.5`) | Potrzebujesz różnorodnych fragmentów, aby zbudować pełny kontekst odpowiedzi. Unikasz duplikatów. |
| **Analiza Prawna / Umowy** (Precyzja krytyczna) | **Custom / Paragraph** (zachowaj strukturę art.) | **Similarity Score Threshold** (`threshold=0.4`) | Musisz mieć pewność, że cytujesz właściwy paragraf. Lepiej nie zwrócić nic, niż błędny zapis. |
| **Chatbot Ogólny** (Small Talk + Wiedza) | **Recursive Character** (600/100) | **Similarity Search** (`k=3`) | Krótsze chunki dla szybkości. Precyzja mniej ważna niż płynność rozmowy. |
| **Asystent Kodowania** (Repozytorium) | **Language Splitter** (Python/JS) | **MMR** (`k=5`, `lambda=0.3`) | Kod wymaga szerokiego kontekstu (definicje, importy). MMR pomaga znaleźć różne wystąpienia funkcji. |
| **Narracja / Książki** (Long context) | **Sentence Transformers** (Semantic) | **Similarity Search** (duże `k`) | Nie wolno ucinać zdań w połowie. Ważna ciągłość narracyjna. |


```
```