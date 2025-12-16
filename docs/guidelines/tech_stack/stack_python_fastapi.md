# 🐍 TECH STACK: Python (FastAPI)
> **Role:** Standards for Python Backend/Data (FastAPI).

---

# 🚀 Defaults
1.  **Runtime:** Python 3.12+.
2.  **Framework:** **FastAPI**.
3.  **Manager:** **uv** (Priority) > poetry > pip.
4.  **Linter:** **Ruff**.

---

# 🧠 Standards
- **Pydantic V2:** For everything (DTOs, Config). No raw dicts.
- **SQLAlchemy 2.0:** Async only (`select`, `execute`).
- **Async/Await:** All I/O.

# 📦 Dependency Protocol (Strict)
Check file existence first:
1.  `uv.lock` exists? -> **CMD:** `uv add <pkg>`
2.  `poetry.lock` exists? -> **CMD:** `poetry add <pkg>`
3.  `requirements.txt` only? -> **CMD:** `pip install <pkg> && pip freeze > requirements.txt`

# 🧪 Testing
- **Runner:** `pytest` + `pytest-asyncio`.
- **Strategy:** Unit (Logic) + Integration (Testcontainers).