---
template_type: crew
---

<!-- 
🤖 AI AGENT INSTRUCTION: FRONTEND SPECIALIST
Rola: Senior React Developer / Vercel Expert.
Cel: Wygeneruj kod Next.js/Supabase, który jest bezpieczny (RLS) i wydajny (Server Actions, Suspense).
-->

# Product Requirements Prompt (PRP): Next.js + Supabase Stack

> **Context:** Ten prompt jest zoptymalizowany pod stack: Next.js 14+ (App Router), Supabase (Auth/DB), Tailwind, Shadcn/UI.

---

## 1. Role & Context
**Act as:** Senior Frontend Architect & Supabase Expert.
**Stack:** 
- **Framework:** Next.js 14+ (App Router, Server Components).
- **Database/Auth:** Supabase (Postgres, RLS enabled).
- **Styling:** Tailwind CSS + Shadcn/UI + Lucide Icons.
- **State:** React Query (Client) / Server Actions (Mutations).
- **Validation:** Zod + React Hook Form.

## 2. Task Description
Zaimplementuj: **[Nazwa Funkcjonalności]**
Cel: [Krótki opis biznesowy - po co to robimy?]

## 3. Core Requirements (Implementation Plan)
1.  **Database (Supabase):**
    *   Stwórz tabelę `[table_name]` w SQL.
    *   **CRITICAL:** Zdefiniuj polityki RLS (Row Level Security). Np. `auth.uid() = user_id`.
    *   Wygeneruj typy TypeScript (`supabase gen types`).
2.  **Server Actions (Backend Logic):**
    *   Stwórz plik `actions.ts`.
    *   Zaimplementuj funkcję `[actionName]`.
    *   Użyj `zod` do walidacji inputu po stronie serwera.
    *   Obsłuż błędy i zwróć `{ success: boolean, error?: string }`.
3.  **UI Components (Frontend):**
    *   Stwórz formularz/widok używając komponentów Shadcn.
    *   Podepnij `useForm` (React Hook Form).
    *   Użyj `useMutation` (jeśli React Query) lub `useFormState` (jeśli native actions) do obsługi stanu ładowania.
    *   Zastosuj **Optimistic UI** tam gdzie to możliwe (natychmiastowy feedback).

## 4. Constraints & Guardrails (Zasady)
*   **Security:** Nigdy nie wyłączaj RLS (`service_role` tylko w ostateczności).
*   **Performance:** Użyj `<Suspense>` i `loading.tsx` dla danych pobieranych z serwera.
*   **Architektura:** Logika biznesowa w Server Actions, logika UI w Client Components.
*   **Styl:** Mobile-first. Sprawdź czy działa na szerokości 320px.

## 5. Definition of Done
*   [ ] Migracja SQL działa i ma włączone RLS.
*   [ ] Formularz ma walidację po stronie klienta (UX) i serwera (Security).
*   [ ] Błędy (np. brak sieci) są wyświetlane w `Toast`.
*   [ ] Komponent jest responsywny.
