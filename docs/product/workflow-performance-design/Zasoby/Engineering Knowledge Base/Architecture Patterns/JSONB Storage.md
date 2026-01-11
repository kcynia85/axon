---
template_type: crew
---

# Hybrid Data Storage (JSONB + GIN)

> **Problem:** Potrzeba przechowywania danych o zmiennej strukturze (np. atrybuty produktów) w relacyjnej bazie bez migracji.
> **Rozwiązanie:** Kolumna `JSONB` z indeksem `GIN` w PostgreSQL.

## Implementation (Prisma)
1.  **Schema:**
    ```prisma
    model Product {
      id        String @id
      metadata  Json   // Kolumna JSONB
    }
    ```
2.  **Migration (SQL):**
    ```sql
    CREATE INDEX product_metadata_gin_idx ON "Product" USING gin (metadata);
    ```
3.  **Query:**
    ```typescript
    prisma.product.findMany({
      where: {
        metadata: { path: ['color'], equals: 'red' }
      }
    });
    ```
