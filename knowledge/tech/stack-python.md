# 🐍 TECH STACK: Python (FastAPI)
> **Role:** Standards for Python Backend/Data (FastAPI).

---

# 🚀 Defaults
1.  **Runtime:** Python 3.12+.
2.  **Framework:** **FastAPI**.
3.  **Manager:** **uv** (Priority) > poetry > pip.
4.  **Linter:** **Ruff**.

## 📦 Dependency Protocol (Strict)
Check file existence first:
1.  `uv.lock` exists? -> **CMD:** `uv add <pkg>`
2.  `poetry.lock` exists? -> **CMD:** `poetry add <pkg>`
3.  `requirements.txt` only? -> **CMD:** `pip install <pkg> && pip freeze > requirements.txt`

---

# 🏗️ Architecture

## 1. Modular Monolith (Standard)
**Layers:**
- `interface/` (Routers)
- `application/` (Services)
- `domain/` (Pydantic Models)
- `infrastructure/` (SQLAlchemy)

## 2. Hexagonal Architecture (AI Requirement)
**Rule:** Isolate LLM SDKs (OpenAI/Anthropic) using **Ports & Adapters**.
- **Port:** `domain/ports/ai_provider.py` (Protocol)
- **Adapter:** `infrastructure/adapters/openai_adapter.py`
- **Injection:** Inject adapter into Service via `FastAPI.Depends`.

---

# 🧠 Standards
- **Pydantic V2:** For everything (DTOs, Config). No raw dicts.
- **SQLAlchemy 2.0:** Async only (`select`, `execute`).
- **Async/Await:** All I/O.

# 🧪 Testing
- **Runner:** `pytest` + `pytest-asyncio`.
- **Strategy:** Unit (Logic) + Integration (Testcontainers).