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
/
├── alembic/               # Database Migrations
├── pyproject.toml         # Dependencies (poetry/uv) & Config (Ruff, Pytest)
├── src/
│   ├── main.py            # 🚀 App Entry Point (FastAPI app setup)
│   ├── config.py          # Environment Variables (Pydantic Settings)
│   │
│   ├── modules/           # 🧠 Bounded Contexts
│   │   ├── sales/
│   │   │   ├── domain/
│   │   │   │   ├── models.py    # Pydantic Schemas (Input/Output)
│   │   │   │   ├── logic.py     # Pure Business Logic functions
│   │   │   │   └── exceptions.py# Domain Specific Errors
│   │   │   │
│   │   │   ├── infrastructure/
│   │   │   │   ├── orm.py       # SQLAlchemy Tables
│   │   │   │   └── repo.py      # Data Access Layer (CRUD)
│   │   │   │
│   │   │   ├── application/
│   │   │   │   └── service.py   # Use Cases (Orchestration)
│   │   │   │
│   │   │   └── interface/
│   │   │       └── router.py    # API Endpoints (@router.post)
│   │   │
│   │   └── users/
│   │       └── ...
│   │
│   └── shared/            # 🧱 Kernel / Generic
│       ├── database.py    # DB Session Manager
│       ├── security.py    # Auth Utilities (JWT)
│       └── utils.py       # Date/String helpers
│
└── tests/
    ├── conftest.py        # Pytest Fixtures (AsyncClient, DB Session)
    ├── e2e/               # API Integration Tests
    └── unit/              # Logic Tests
```

## 🔑 Key Principles for AI

1.  **Pydantic Everything:** Use Pydantic models for ALL data transfer (DTOs) and Domain Objects. Avoid raw dictionaries.
2.  **Async/Await:** Use `async def` for all I/O bound operations (DB, API calls).
3.  **Type Hints:** Strict typing is mandatory (`def func(a: int) -> str:`). Use `mypy` or `pyright` to verify.
4.  **SQLAlchemy 2.0:** Use the new 2.0 style (select, execute) with AsyncSession. Avoid legacy ORM patterns.
