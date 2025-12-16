# 🐍 Python (FastAPI) — Modular Monolith / Functional DDD

Modern, type-safe Python backend architecture using FastAPI. Focuses on modularity, dependency injection, and Pydantic validation.

## 📂 Folder Structure Rules
1.  **Modules First:** Logic is organized by domain context (`src/modules/sales`), not by technical layers (`src/controllers`).
2.  **Layer Isolation:**
    - `domain/`: Pydantic Models (Schemas), Pure Functions. No DB imports.
    - `infrastructure/`: SQLAlchemy/Tortoise models, External API clients.
    - `application/`: Services/Use Cases. Orchestrates Domain + Infra.
    - `interface/`: FastAPI Routers (Endpoints).
3.  **Dependency Injection:** Use `FastAPI.Depends` or a DI library (like `fastapi-injector`) to inject services into routers. Never import services globally.

## 📁 Project Structure

```text
/backend
  Dockerfile             # Konfiguracja obrazu Docker (uv + python)
  uv.lock                # Zależności (uv)
  pyproject.toml         # Konfiguracja projektu
  alembic.ini            # Konfiguracja migracji DB
  main.py                # Entry point (FastAPI app)
  start.sh               # Skrypt startowy
  verify_storage.py      # Skrypt weryfikacji połączenia z bazą
  /app
    config.py            # Zmienne środowiskowe, API Keys
    /api                 # Kontrolery FastAPI (Endpoints)
      /routes            # Routing
      deps.py            # Dependency Injection
    /modules             # MODULAR MONOLITH (Bounded Contexts)
       /agents           # Logika Agentów (Manager, Researcher, Builder)
       /knowledge        # RAG, ETL, Assets, Vector Store
       /projects         # Zarządzanie projektami
       /workflows        # Silnik workflowów (Inngest)
    /shared              # SHARED KERNEL
       /domain           # Współdzielone modele i typy
       /infrastructure   # Klient Supabase, Google ADK, Vector DB
       /security         # Auth & Permissions
       /utils            # Helpery
  /migrations            # Pliki migracyjne Alembic
```

## 🔑 Key Principles for AI

1.  **Pydantic Everything:** Use Pydantic models for ALL data transfer (DTOs) and Domain Objects. Avoid raw dictionaries.
2.  **Async/Await:** Use `async def` for all I/O bound operations (DB, API calls).
3.  **Type Hints:** Strict typing is mandatory (`def func(a: int) -> str:`). Use `mypy` or `pyright` to verify.
4.  **SQLAlchemy 2.0:** Use the new 2.0 style (select, execute) with AsyncSession. Avoid legacy ORM patterns.
