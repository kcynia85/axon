---
template_type: flow
target_workspace: Delivery
---

<!-- 
🤖 AI AGENT INSTRUCTION: ARCHITECTURAL DECISION MAKER
Rola: Technical Lead.
Cel: Zapisz decyzję w sposób, który uratuje nas przed pytaniem "dlaczego tak zrobiliśmy?" za rok.
-->

# ADR-[NUMER]: [Tytuł Decyzji, np. Użycie PostgreSQL jako Message Broker]

**Data:** YYYY-MM-DD
**Status:** [Proposed / Accepted / Deprecated / Rejected]
**Autorzy:** [Imiona]

## 1. Kontekst i Problem (Context)
> *Opisz sytuację. Jaki problem próbujemy rozwiązać? Jakie są ograniczenia?*
> np. "Potrzebujemy kolejki zadań do wysyłania maili. Musi być tania i łatwa w utrzymaniu przy małej skali."

## 2. Rozważane Opcje (Decision Drivers)
> *Jakie mamy alternatywy?*

*   **Opcja A:** [Nazwa, np. Redis + Celery]
    *   *Zalety:* Standard przemysłowy, wysoka wydajność.
    *   *Wady:* Dodatkowy komponent infrastruktury (koszt Redis), overkill dla 100 maili dziennie.
*   **Opcja B:** [Nazwa, np. PostgreSQL + SKIP LOCKED]
    *   *Zalety:* Brak nowej infrastruktury (mamy już Postgres), transakcyjność (Outbox Pattern).
    *   *Wady:* Większe obciążenie głównej bazy.
*   **Opcja C:** [Nazwa, np. AWS SQS]
    *   *Zalety:* Serverless.
    *   *Wady:* Vendor lock-in, trudniejsze testowanie lokalnie.

## 3. Decyzja (Decision)
> *Co wybieramy?*

Wybieramy **Opcję B: PostgreSQL + SKIP LOCKED**.

## 4. Uzasadnienie (Justification)
> *Dlaczego ta opcja wygrała?*

Dla obecnej skali projektu (MVP) utrzymywanie Redisa generuje niepotrzebne koszty DevOps. Postgres obsłuży ten ruch bez problemu. W przyszłości, jeśli skala wzrośnie, zmigrujemy się na SQS (zgodnie ze wzorcem Hexagonal Architecture, wymiana adaptera będzie łatwa).

## 5. Konsekwencje (Consequences)
> *Co zyskujemy, a co tracimy? (Trade-offs)*

*   ✅ **Positive:** Prostszy stack (tylko jedna baza), spójność transakcyjna (brak problemu "dual write").
*   ❌ **Negative:** Konieczność monitorowania obciążenia bazy danych. Worker musi być napisany ostrożnie, aby nie blokować tabel.

## 6. Powiązane Dokumenty (Links)
*   [Link do Tech PRD]
*   [Link do PR/Commit]
