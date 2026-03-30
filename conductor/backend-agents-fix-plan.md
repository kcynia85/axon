# Plan: Backend Standardization (FastAPI AGENTS.md)

This plan covers the creation of a specialized `AGENTS.md` for Python/FastAPI development in the Axon backend.

## Objectives
1. **Create `AGENTS.md`**: A comprehensive guide for AI agents working on the FastAPI backend, incorporating project standards (Modular Monolith, DDD, Async-First, Pydantic v2).

## Proposed Changes

### 1. Backend AGENTS.md (`axon-app/backend/AGENTS.md`)
Create a new file that defines:
- **Architecture**: Vertical Slices (`app/modules/`) vs Shared infrastructure (`app/shared/`).
- **Layering**: interface (routers/schemas), application (use cases), domain (logic/entities), infrastructure (repos/clients).
- **Core Principles**: Dependency Injection (`Depends()`), Async-First IO, Pydantic v2 validation.
- **Hard Rules**: No cross-module imports, soft deletes (`deleted_at`), ubiquitous language.
- **Tech Stack**: FastAPI, SQLAlchemy 2.0 (Async), crewAI, LangChain, Inngest.
- **Testing**: Unit tests for domain/application, integration tests for infrastructure/interface.

## Verification Plan

### Automated Tests
- Run `ruff check .` in `axon-app/backend` to ensure no linting issues in the project (though `AGENTS.md` itself isn't code).
- (Optional) Run `pytest` to ensure existing tests pass.

### Manual Verification
- Review the `AGENTS.md` content for alignment with `GEMINI.md`, `copilot-instructions.md`, and existing codebase patterns.
