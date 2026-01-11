---
template_type: crew
---

# Instant Analytics (Materialized Views)

> **Problem:** Dashboardy ładują się wolno, bo liczą agregacje (SUM, COUNT) na żywo.
> **Rozwiązanie:** Materialized Views (Widoki zmaterializowane).

## Implementation
1.  **SQL Migration:**
    ```sql
    CREATE MATERIALIZED VIEW "Stats" AS
    SELECT count(*) as total, sum(amount) as revenue FROM "Orders";
    ```
2.  **Refresh:**
    Ustaw CRON (np. co 10 min), który woła:
    `REFRESH MATERIALIZED VIEW CONCURRENTLY "Stats";`
3.  **Query:** Odpytujesz widok jak zwykłą tabelę (czas < 10ms).
