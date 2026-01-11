---
template_type: crew
---

# Concurrent Editing (Optimistic Locking)

> **Problem:** Użytkownik A nadpisuje zmiany Użytkownika B (Lost Update).
> **Rozwiązanie:** Optimistic Locking (Wersjonowanie rekordu).

## Implementation
1.  **Schema:** Dodaj pole `version Int`.
2.  **Update:**
    ```typescript
    prisma.post.updateMany({
      where: { id: 1, version: 5 }, // Sprawdź czy wersja się nie zmieniła
      data: {
        title: "New Title",
        version: { increment: 1 }   // Podbij wersję
      }
    });
    ```
3.  **Frontend:** Jeśli `count === 0`, pokaż błąd: "Ktoś edytował ten rekord. Odśwież stronę."
