## 1. 🎯 Co i dlaczego?
*Krótko: Co zmieniamy i po co.*
*   **Cel:** (np. Dodać filtrowanie po dacie na liście zamówień).
*   **User Story:** Jako Admin, chcę filtrować zamówienia, aby szybciej znajdować te z wczoraj.

## 2. ⚙️ Szczegóły Techniczne
*Co konkretnie trzeba zakodować?

*   **Frontend:**
    *   Dodać `DateRangePicker` (Shadcn UI) nad tabelą.
    *   Zaktualizować URL params (`?from=...&to=...`).
*   **Backend:**
    *   Zaktualizować zapytanie Prisma w `getOrders`.
    *   Dodać warunek `where: { createdAt: { gte: from, lte: to } }`.