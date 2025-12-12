# 🏃‍♂️ Sprint Dashboard (Axon)

> **Sprint:** #1 "Genesis"
> **Cel:** Uruchomienie "Hello World" Agenta RAG na docelowym stacku.
> **Czas:** Tydzień 1

---

## Kanban

| To Do (Do zrobienia) | In Progress (W toku) | Review (Do sprawdzenia) | Done (Gotowe) |
| :--- | :--- | :--- | :--- |
| **[Backend]** Setup FastAPI + Docker | | | |
| **[DB]** Konfiguracja Supabase + pgvector | | | |
| **[AI]** Skrypt `ingest.py` (MD -> Vectors) | | | |
| **[Frontend]** Init Next.js + Shadcn UI | | | |
| **[Auth]** Supabase Auth (GitHub/Email) | | | |

---

## 🚧 Blokery i Ryzyka
*   [ ] **Dostęp do API Gemini:** Sprawdzić limity i klucze (Tier 1 vs Free).
*   **Ryzyko:** Komplikacja `langchain` / `llamaindex`.
    *   *Mitygacja:* Użycie czystego `google-generativeai` SDK (ADK) zgodnie z ARD.

---

## 📝 Definition of Done (Sprint 1)
1.  Można uruchomić aplikację lokalnie (`docker compose up`).
2.  Można zalogować się do Dashboardu.
3.  Można zadać pytanie na czacie i otrzymać odpowiedź z bazy wiedzy (RAG).
