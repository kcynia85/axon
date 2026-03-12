---
name: python-fastapi-expert
description: Use this skill when working on the Python backend using FastAPI, ensuring adherence to DDD and modular monolith patterns.
---

# Python FastAPI Expert Skill

This skill provides expert guidance for developing Python backends with FastAPI.

## Goals
- Maintain a clean, modular monolith architecture.
- Ensure strict type safety using Pydantic and type hints.
- Implement robust business logic using Functional DDD.

## Standards & Patterns

### 1. Architecture (Modular Monolith)
- Organize by domain context (`app/modules/context/`).
- **Layer Isolation:**
    - `domain/`: Pydantic Models (Schemas), Pure Functions. No Infrastructure/DB imports.
    - `infrastructure/`: SQLAlchemy models, External API clients, Repositories.
    - `application/`: Services/Use Cases. Orchestrates Domain + Infra.
    - `interface/`: FastAPI Routers (Endpoints).

### 2. Implementation Rules
- **Pydantic Everything:** Use Pydantic V2 for all data transfer (DTOs) and Domain Objects.
- **Async/Await:** Use `async def` for all I/O bound operations (DB, API calls).
- **Static Typing:** Strict typing is mandatory. Use `mypy` or `pyright` for verification.
- **SQLAlchemy 2.0:** Use the 2.0 style (`select`, `execute`) with `AsyncSession`. No legacy ORM patterns.

### 3. Dependency Injection
- Use `FastAPI.Depends` to inject services into routers. Never import services globally.

### 4. Dependency Management
- **Manager:** Prefer `uv`. Check for `uv.lock` first.
- **CMD:** `uv add <pkg>` or `uv run <cmd>`.
- **Anti-Pattern:** Do not use `python = "3.10"` in `[tool.uv]` section of `pyproject.toml`; it's not supported by `uv`. Use standard `project.requires-python`.

## Workflow
1. Identify the domain module for the change.
2. Define domain schemas (Pydantic) and logic.
3. Implement infrastructure adapters (SQLAlchemy models/repos).
4. Orchestrate the use case in the application layer.
5. Expose the functionality via FastAPI routes.

## Rules
- **No raw dicts:** Always use Pydantic models for data structures.
- **Functional Core:** Keep business logic pure and side-effect free in the domain layer.
- **Explicit Returns:** Always define return types for functions.
