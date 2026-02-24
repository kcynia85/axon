# Axon Backend — Dokumentacja Techniczna

> **Rola:** Przewodnik Developera & Architektura
> **Stack:** Python 3.10+, FastAPI, SQLAlchemy (Async), Google GenAI, Alembic
> **Ostatnia aktualizacja:** 2026-02-24

---

## 🏗 Architektura: Modularny Monolit (DDD)

Backend jest zorganizowany jako **Modularny Monolit** z Domain-Driven Design. Każdy moduł (`backend/app/modules/`) ma identyczną strukturę wewnętrzną:

```text
modules/<nazwa>/
├── domain/          # Modele domenowe (Pydantic BaseModel), enumy
├── application/     # Schematy request/response, serwisy (use cases)
├── infrastructure/  # Tabele SQLAlchemy, repozytoria (DB access)
├── interface/       # Routery FastAPI (HTTP endpoints)
├── dependencies.py  # FastAPI dependency injection
└── tests/           # Testy jednostkowe modułu
```

### Moduły Systemu

| # | Moduł | Ścieżka | Odpowiedzialność |
|---|-------|---------|-----------------|
| 1 | **agents** | `/modules/agents` | Agenci AI (role, orkiestracja, narzędzia, streaming LLM) |
| 2 | **knowledge** | `/modules/knowledge` | RAG pipeline: ETL ingestion, chunking, search, assets |
| 3 | **projects** | `/modules/projects` | Projekty, zasoby kluczowe, artefakty |
| 4 | **workspaces** | `/modules/workspaces` | Konfiguracja reusable komponentów: Templates, Patterns, Crews |
| 5 | **spaces** | `/modules/spaces` | Space canvas: persystencja grafów (nodes, edges, zones) |
| 6 | **inbox** | `/modules/inbox` | System powiadomień i wiadomości przychodzących |
| 7 | **resources** | `/modules/resources` | Zarządzanie zasobami: Prompts/Archetypes, Services, Automations, Tools |
| 8 | **settings** | `/modules/settings` | Konfiguracja LLM providers, modeli, embedding, chunking strategies |
| 9 | **workflows** | `/modules/workflows` | Workflowy i scenariusze zadań |
| 10 | **system** | `/modules/system` | Operacje systemowe (health, seeding, konfiguracja) |
| 11 | **shared** | `/app/shared` | Fundamenty: baza danych, utils, middleware, base classes |

---

## 📦 Moduł `workspaces` — szczegóły

Zarządza konfiguracją reusable komponentów, które trafiają na Space Canvas.

### Encje domenowe (`domain/models.py`)

| Encja | Kluczowe pola | Opis |
|-------|--------------|------|
| `Template` | `template_name`, `template_markdown_content`, `template_checklist_items`, **`template_inputs`**, **`template_outputs`**, `template_keywords` | SOP Template z deterministycznym I/O |
| `Pattern` | `pattern_name`, `pattern_type`, `pattern_graph_structure` | Reusable graf (nodes+edges) |
| `Crew` | `crew_name`, `crew_process_type`, `agent_member_ids` | Zespół agentów z typem procesu |

### Template I/O (nowe — 2026-02-24)

Każdy Template ma zdefiniowane wymagane wejścia i wyjścia:

```python
# domain/models.py
template_inputs: List[Dict[str, Any]]   # [{"id": "...", "label": "brand_guidelines", "expectedType": "any"}]
template_outputs: List[Dict[str, Any]]  # [{"id": "...", "label": "competitors_report"}]
```

**Tabela DB:** `templates` (kolumny JSONB: `template_inputs`, `template_outputs`, `server_default='[]'`)
**Migracja:** `a1b2c3d4e5f6_add_template_inputs_outputs.py`

### API Endpoints (`interface/router.py`)

| Method | Path | Schema | Opis |
|--------|------|--------|------|
| `GET` | `/workspaces/:id/templates` | `TemplateResponse[]` | Lista template'ów workspace'u |
| `POST` | `/workspaces/:id/templates` | `CreateTemplateRequest` → `TemplateResponse` | Tworzenie template z inputs/outputs |
| `PUT` | `/workspaces/:id/templates/:tid` | `UpdateTemplateRequest` → `TemplateResponse` | Aktualizacja |
| `DELETE` | `/workspaces/:id/templates/:tid` | — | Soft delete |

---

## 📦 Moduł `spaces` — szczegóły

Persystencja i zarządzanie grafami canvas (Space → nodes, edges, zones).

### Encje domenowe

| Encja | Opis |
|-------|------|
| `Space` | Kontener na graf: projekt, nazwa, opis |
| `SpaceNode` | Node na canvasie: Zone, Agent, Template, Crew, Service, Automation |
| `SpaceEdge` | Krawędź łącząca dwa node'y |

---

## 🛠 Stack Technologiczny

| Warstwa | Technologia | Rola |
|---------|------------|------|
| HTTP | **FastAPI** | Routing, validation, DI, async handlers |
| ORM | **SQLAlchemy 2.0 (Async)** | Modele tabel, queries, session management |
| DB | **PostgreSQL (Supabase)** | Persistence + RLS policies |
| Migracje | **Alembic** | Schema migrations (autogenerate) |
| LLM | **Google GenAI** | Generowanie odpowiedzi, tool calling |
| Validation | **Pydantic v2** | Request/response schemas, domain models |
| Package Mgr | **uv** | Fast Python package management |

### Komendy developerskie

```bash
# Serwer dev
cd backend && uv run uvicorn app.main:app --reload

# Migracja
cd backend && uv run alembic upgrade head

# Nowa migracja
cd backend && uv run alembic revision --autogenerate -m "nazwa_migracji"

# Testy
cd backend && uv run pytest
```

---

## 🧱 Wzorce architektoniczne

### Dependency Injection (FastAPI)
```python
# dependencies.py
async def get_workspaces_service(db: AsyncSession = Depends(get_db)) -> WorkspacesService:
    repo = WorkspacesRepository(db)
    return WorkspacesService(repo)
```

### Repository Pattern
```python
# infrastructure/repo.py
class WorkspacesRepository:
    async def list_templates(self, workspace: Optional[str] = None) -> List[Template]:
        stmt = select(TemplateTable).where(TemplateTable.deleted_at == None)
        ...
```

### Soft Delete
Wszystkie encje vNext mają kolumnę `deleted_at`. Nigdy nie usuwamy fizycznie — filtrujemy po `WHERE deleted_at IS NULL`.

---

## 🚧 Backlog Techniczny

1.  **Durable Execution (Inngest):** Odporność na restarty przy długich zadaniach agentów
2.  **Multi-Agent Orchestration:** Agenci komunikujący się między sobą
3.  **Integracja GitHub:** Agent robiący `git commit` w repozytoriach
4.  **Testy E2E:** Automatyczne testy end-to-end całego API
5.  **Real-time WebSockets:** Notyfikacje push zamiast pollingu
