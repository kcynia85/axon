# 🧠 Knowledge Migration Strategy (ETL Protocol)

> **Cel:** Przekształcenie statycznej struktury plików `workflow-performance-design` w dynamiczną Bazę Wiedzy (Vector DB) dla systemu Axon.
> **Rola:** To jest "Instrukcja Inżynieryjna" dla Agenta Budowniczego (Builder).

---

## 1. Źródło Danych (Source of Truth)
Agent analizuje strukturę katalogów, aby nadać kontekst semantyczny (Metadata).

| Ścieżka Źródłowa | Mapowanie na Domenę (JSONB `domain`) | Typ Wiedzy (JSONB `type`) |
| :--- | :--- | :--- |
| `00. Hubs/*.md` | `meta` | `hub_definition` |
| `01. Product Management/*.md` | `product_management` | `methodology` |
| `02. Discovery/*.md` | `discovery` | `methodology` |
| `03. Design/*.md` | `design` | `methodology` |
| `04. Delivery/*.md` | `delivery` | `methodology` |
| `05. Growth & Market/*.md` | `growth` | `methodology` |
| `Zasoby/Engineering Knowledge Base/**/*.md` | `delivery` | `pattern` |
| `Zasoby/Psychology/**/*.md` | `design` | `psychology` |

---

## 2. Strategia Transformacji (The ETL Pipeline)

Agent zaimplementuje skrypt `src/infrastructure/etl/ingest_knowledge.py`, który działa wg wzorca **Router Pattern**, dzieląc zasoby na "Wiedzę" i "Narzędzia".

### Krok A: Klasyfikacja (The Router)
Skrypt analizuje plik i decyduje o ścieżce przetwarzania:

*   **IF** nazwa/ścieżka zawiera: `Template`, `Szablon`, `Checklist`, `SOP`, `Protocol`
    *   -> **Ścieżka B: Assets (Narzędzia)**
*   **ELSE**
    *   -> **Ścieżka A: Wisdom (Wiedza)**

### Ścieżka A: Wisdom (Wiedza Miękka) -> Vector Store
*Dotyczy: Artykułów, Zasad, Teorii (np. "Psychologia koloru").*
1.  **Chunking:** Dzielenie treści na fragmenty semantyczne.
2.  **Embedding:** Zamiana fragmentów na wektory.
3.  **Storage:** Zapis do `knowledge_vectors`.
4.  **Cel:** Umożliwienie Agentowi *wyszukiwania odpowiedzi* i łączenia faktów (RAG).

### Ścieżka B: Assets (Szablony & SOP) -> Asset Registry
*Dotyczy: Plików, które muszą być zachowane w całości (np. "Master PRD Template").*
1.  **Full Content Preservation:** Treść pliku NIE jest dzielona. Zapisujemy ją w całości (jako `TEXT`) w tabeli `assets`.
2.  **Description Embedding:** Generujemy embedding TYLKO dla opisu/tytułu pliku (np. "Szablon do tworzenia PRD").
3.  **Cel:** Umożliwienie Agentowi *pobrania całego narzędzia* (`get_asset('PRD Template')`), aby pracować na jego strukturze bez zniekształceń.

### Krok C: Wzbogacanie Metadanymi (JSONB)
Niezależnie od ścieżki, dodajemy metadane strukturalne:
```json
{
  "source_path": "03. Design/C. Content & IA/IA_Audit_Protocol.md",
  "domain": "design",
  "type": "asset", // lub "knowledge"
  "title": "IA Audit & Design Protocol",
  "last_updated": "2025-12-12"
}
```

---

## 3. Wykorzystanie w RAG (Retrieval)

Kiedy użytkownik zapyta: *"Jak przeprowadzić audyt IA?"*:
1.  Agent szuka wektorowo (Semantic Search).
2.  Agent filtruje po metadanych JSONB (dzięki strukturze folderów): `WHERE metadata->>'domain' = 'design'`.
3.  Agent otrzymuje precyzyjny fragment z pliku `IA_Audit_Protocol.md`.

---

## 4. Zadania dla Agenta (Next Steps)

1.  [ ] **Setup DB:** Przygotować migrację SQL dla tabeli z kolumną JSONB i indeksem GIN (zgodnie z ARD).
2.  **Implementacja Skryptu:** Napisać `ingest.py` wykorzystując bibliotekę `langchain` lub natywne skrypty.
3.  **Uruchomienie "First Load":** Zasilenie bazy całą obecną wiedzą.

---

## 5. Asset Implementation Strategy (SQL + Tools)

Dla "Aktywów Sztywnych" (Ścieżka B) wdrażamy dedykowany mechanizm, aby Agenci mogli pobierać je w całości.

### 5.1. Database Schema (Supabase)
```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,          -- np. 'sop-discovery-lite'
  title TEXT NOT NULL,                -- np. 'Discovery Lite Checklist'
  content TEXT NOT NULL,              -- PEŁNA treść Markdown (bez chunkingu)
  type TEXT NOT NULL,                 -- 'template', 'checklist', 'sop'
  domain TEXT NOT NULL,               -- 'discovery', 'design'
  metadata JSONB DEFAULT '{}',        -- Dodatkowe atrybuty
  description_embedding VECTOR(768)   -- Wektor TYLKO z opisu/tytułu (do wyszukiwania intencji)
);

-- Indeks dla szybkiego pobierania po slug (użycie narzędzia get_asset)
CREATE INDEX idx_assets_slug ON assets(slug);
```

### 5.2. Agent Tools (Function Calling)

#### A. `find_asset(query: str)`
Umożliwia Agentowi znalezienie odpowiedniego narzędzia, gdy nie zna jego nazwy.
*   **Input:** "Szablon do PRD"
*   **Logic:** Vector Search na kolumnie `description_embedding`.
*   **Output:** Lista: `[{'slug': 'master-prd-template', 'title': 'Master PRD Template', 'type': 'template'}]`

#### B. `get_asset(slug: str)`
Umożliwia pobranie surowej treści do pracy.
*   **Input:** "master-prd-template"
*   **Logic:** `SELECT content FROM assets WHERE slug = 'master-prd-template'`
*   **Output:** Pełny string Markdown.

### 5.3. Workflow Przykład
1.  **User:** "Wypełnij PRD dla funkcji logowania."
2.  **Agent:** "Szukam szablonu PRD..." -> `find_asset("PRD template")`
3.  **System:** Zwraca `master-prd-template`.
4.  **Agent:** "Pobieram szablon..." -> `get_asset("master-prd-template")`
5.  **Agent:** Wypełnia treść i zwraca wynik.