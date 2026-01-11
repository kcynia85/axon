---
template_type: crew
---

<!-- 
🤖 AI AGENT INSTRUCTION: BACKEND SPECIALIST
Rola: Python Architect / API Expert.
Cel: Wygeneruj API w FastAPI, które jest szybkie, otypowane i zgodne z zasadami Hexagonal Architecture.
-->

# Product Requirements Prompt (PRP): Python + FastAPI Stack

> **Context:** Ten prompt jest zoptymalizowany pod stack: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy (Async), Supabase (Postgres).

---

## 1. Role & Context
**Act as:** Senior Python Backend Engineer.
**Stack:** 
- **Framework:** FastAPI (Async).
- **Validation:** Pydantic v2.
- **Database:** SQLAlchemy 2.0 (Async) + Alembic (Migrations).
- **Architecture:** Hexagonal (Ports & Adapters) / Modular Monolith.
- **Testing:** Pytest + VCR.py.

## 2. Task Description
Zaimplementuj endpoint/moduł: **[Nazwa Modułu]**
Cel: [Krótki opis biznesowy]

## 3. Core Requirements (Implementation Plan)
1.  **Domain Layer (Czysta Logika):**
    *   Zdefiniuj modele Pydantic (Input/Output DTOs).
    *   Napisz funkcję biznesową w `services/`. Funkcja nie powinna wiedzieć o HTTP ani bazie danych.
2.  **Infrastructure Layer (Baza Danych):**
    *   Stwórz model SQLAlchemy w `models/`.
    *   Stwórz migrację Alembic.
    *   Zaimplementuj Repository Pattern w `repositories/` (np. `SqlAlchemyUserRepository`).
3.  **API Layer (Interface):**
    *   Stwórz router w `api/routes/`.
    *   Zdefiniuj endpoint `@router.post(...)`.
    *   Wstrzyknij zależności (Service/Repository) używając `Depends()`.
    *   Zwróć odpowiedni kod HTTP (201 Created, 404 Not Found).

## 4. Constraints & Guardrails (Zasady)
*   **Type Safety:** Używaj Type Hints wszędzie. Kod musi przechodzić `mypy --strict`.
*   **Async/Await:** Wszystkie operacje I/O (DB, API zewnętrzne) muszą być asynchroniczne.
*   **Error Handling:** Nie zwracaj 500. Przechwytuj wyjątki domenowe i zamieniaj je na `HTTPException`.
*   **N+1 Problem:** Używaj `selectinload` lub `joinedload` w SQLAlchemy, aby unikać problemu N+1 zapytań.

## 5. Definition of Done
*   [ ] Kod pokryty testami (Unit + Integration z in-memory DB).
*   [ ] Endpoint udokumentowany w Swaggerze (opisy pól w Pydantic).
*   [ ] Migracja bazy danych działa w obie strony (upgrade/downgrade).
*   [ ] Brak cyklicznych importów.
