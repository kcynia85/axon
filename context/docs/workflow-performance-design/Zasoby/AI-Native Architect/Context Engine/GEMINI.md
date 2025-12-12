# GEMINI Global Context (Ruleset)

> **Role:** Master Instruction Set for AI Agent
> **Status:** Critical Context

## 🎯 Zasady Główne
1.  **Code Quality:** Czysty, modularny, SOLID. Unikaj klas w TS/JS (preferuj funkcje).
2.  **Tech Stack:** Next.js (App Router), TypeScript, Tailwind, Prisma/Supabase.
3.  **Myślenie (ULTRATHINK):** Zanim napiszesz kod, przeanalizuj strukturę plików i zależności.

## 🔄 Workflow (The "DRY" Process)
1.  **Tech PRD:** Źródło wymagań.
2.  **ADR:** Rejestr decyzji (np. "Wybieramy Postgres bo...").
3.  **PRP (Product Requirements Prompt):** Prompt startowy dla AI.
4.  **Implementation:** Kodowanie wg planu.

## 🛠 Priority Tools (MCP)
Jeśli dostępne, używaj:
*   **Serena:** Analiza semantyczna kodu.
*   **Playwright:** Testy E2E.
*   **Git:** Zarządzanie wersjami.

## 📂 Struktura Plików (Modular Monolith)
*   `src/modules/[domain]/` - Logika biznesowa (DDD).
*   `src/app/` - UI (Dumb components).
*   `src/components/` - Współdzielone UI.
