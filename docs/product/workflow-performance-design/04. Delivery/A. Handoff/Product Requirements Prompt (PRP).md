---
template_type: crew
target_workspace: Delivery
---

<!-- 
🤖 AI AGENT INSTRUCTION: PROMPT ENGINEER
Rola: Lead Developer Proxy.
Cel: Stwórz instrukcję dla innego AI (Kodera), która jest tak precyzyjna, że uniemożliwia błędy.

🧠 PROCES REFLEKSJI:
1. PREDICT: Jakie pytania zada koder? (np. "Jak obsługiwać błędy?", "Czy używamy Server Actions?").
2. PREEMPT: Odpowiedz na te pytania z góry w sekcji "Constraints".
3. CONTEXT: Upewnij się, że wskazujesz konkretne pliki do przeczytania (@Tech PRD, @ADR).
-->

# Product Requirements Prompt (PRP)

## 💡 Metodologia i Narzędzia
> *Materiały pomocnicze z biblioteki wiedzy:*
> *   [🤖 Context Engine (Jak pisać prompty)](../../Zasoby/AI-Native%20Architect/Context%20Engine/GEMINI.md)
> *   [🚀 Implementation Workflow](../../Zasoby/AI-Native%20Architect/Workflow/Implementation%20Workflow.md)

---

## 🎓 Strefa Nauki: Anatomia Idealnego Promptu

> **ZASADA:** Garbage In, Garbage Out. Im więcej kontekstu dasz, tym mniej będziesz musiał poprawiać.

### Przykład Wypełnienia (Sekcja 3. Core Requirements):
*   **Zamiast:** "Zrób formularz logowania."
*   **Napisz:** "Stwórz komponent `LoginForm` używając `react-hook-form` i `zod`. Po poprawnym submitcie wywołaj Server Action `loginUser`. W przypadku błędu wyświetl `Toast` (z biblioteki shadcn/ui). Nie używaj `useState` do walidacji."

---

> **Instrukcja:** Ten dokument służy do wygenerowania promptu dla AI (Cursor/Claude). Wypełnij go, a następnie wklej do czatu z AI.

## 1. Role & Context
**Act as:** Senior AI-Native Architect & Fullstack Developer.
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind, Supabase.

## 2. Task Description
Zaimplementuj moduł: **[Nazwa Modułu]**
Na podstawie: [Tech PRD] i [ADR-00X].

## 3. Core Requirements (Step-by-Step)
1.  Stwórz schemat bazy danych (Prisma/SQL).
2.  Zaimplementuj logikę domenową (Pure TS Functions).
3.  Stwórz Server Actions.
4.  Zbuduj UI (Tailwind + Shadcn).

## 4. UX Patterns Injection (Wybierz właściwy "Megaprompt")
> *Jeśli Twój moduł dotyczy jednego z poniższych obszarów, **skopiuj i wklej** odpowiedni prompt z folderu `Zasoby/AI-Native Architect/Workflow/Prompts/UX Patterns/` jako dodatkowy kontekst dla agenta.*

*   🔐 **Logowanie / Rejestracja / Reset Hasła** -> Użyj: `Auth_Flow_Generator.md`
*   🛒 **Koszyk / Kasa / Płatności** -> Użyj: `Checkout_Optimizer.md`
*   📊 **Dashboard / Wykresy / Raporty** -> Użyj: `Dashboard_Architect.md`
*   📝 **Formularze / Edycja Danych** -> Użyj: `Form_UX_Refiner.md`

## 5. Constraints & Patterns
*   Użyj wzorca **[Nazwa wzorca, np. Optimistic Locking]** (Link: `../../Zasoby/Engineering Knowledge Base/Architecture Pattern
s/Optimistic Locking.md`).
*   Walidacja danych: **Zod**.
*   Testy: **Vitest**.

## 5. Definition of Done
*   [ ] Kod jest otypowany (Strict Mode).
*   [ ] Brak `useEffect` do fetchowania danych (użyj React Query).
*   [ ] Testy jednostkowe przechodzą.
