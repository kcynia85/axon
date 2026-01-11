---
template_type: crew
---

# Lightweight Audit Log (JSONB Backpack)

> **Problem:** Potrzeba historii zmian rekordu (kto, co, kiedy), ale Event Sourcing to overkill.
> **Rozwiązanie:** Kolumna `history` (JSONB) w tej samej tabeli.

## Implementation
1.  **Schema:**
    ```prisma
    model Order {
      status  String
      history Json[] // Tablica zdarzeń
    }
    ```
2.  **Update:**
    Przy każdej zmianie statusu, dopisz obiekt do tablicy `history`:
    ```typescript
    const newEntry = { status: 'PAID', date: new Date(), user: 'admin' };
    prisma.order.update({
      data: {
        status: 'PAID',
        history: [...currentHistory, newEntry]
      }
    });
    ```
