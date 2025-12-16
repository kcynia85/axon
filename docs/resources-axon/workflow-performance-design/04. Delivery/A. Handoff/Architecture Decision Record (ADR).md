<!-- 
🤖 AI AGENT INSTRUCTION: TECHNICAL ARBITRATOR
Rola: Sędzia Technologiczny.
Cel: Dokumentuj TRUDNE decyzje (te, które mają alternatywy). Nie dokumentuj oczywistości ("użyjemy git").
Format: MADR 2.0 (Markdown Architectural Decision Records).

🧠 PROCES REFLEKSJI:
1. PROBLEM: Jaki problem rozwiązujemy?
2. OPCJE: Jakie mamy alternatywy? (np. Next.js vs Remix).
3. DECYZJA: Co wybieramy i dlaczego?
4. KOSZT: Co tracimy przez ten wybór? (Trade-offs).
-->

# Architecture Decision Record (ADR)

> *Rejestr kluczowych decyzji technologicznych. Każda decyzja jest kompromisem.*

---

## [ADR-001] Wybór Frameworka Frontend (Next.js)

### 1. Kontekst i Problem
Potrzebujemy frameworka React, który obsługuje SSR (SEO) i ma silny ekosystem.
*   **Wymagania:** Dobra wydajność, łatwy deployment, wsparcie dla Server Actions.

### 2. Rozważane Opcje
*   **A. Next.js (App Router):** Standard rynkowy, pełne wsparcie Vercel.
*   **B. Remix:** Lepsze zarządzanie stanem formularzy, ale mniejszy ekosystem.
*   **C. Vite (SPA):** Szybki start, ale słabe SEO bez dodatkowej konfiguracji.

### 3. Decyzja
Wybieramy: **Opcję A: Next.js (App Router)**.

### 4. Konsekwencje (Trade-offs)
*   **Pozytywne:** Łatwa integracja z Vercel, Server Components domyślnie.
*   **Negatywne:** Większa złożoność (krzywa uczenia się App Routera), vendor lock-in (Vercel).

---

## [ADR-002] Baza Danych (Supabase)

### 1. Kontekst
...

### 2. Opcje
*   A. Supabase (Postgres)
*   B. Firebase (NoSQL)

### 3. Decyzja
**Supabase**.

### 4. Konsekwencje
*   (+) Relacyjny model danych (SQL), wbudowane Auth.
*   (-) Mniej elastyczna niż NoSQL przy zmianach schematu.
