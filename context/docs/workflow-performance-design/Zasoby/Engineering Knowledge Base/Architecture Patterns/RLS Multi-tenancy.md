# Leak-Proof Multi-tenancy (RLS)

> **Problem:** Ryzyko wycieku danych między klientami w aplikacjach B2B (SaaS).
> **Rozwiązanie:** Row Level Security (RLS) w bazie danych.

## Implementation (Supabase/Postgres)
1.  **Enable RLS:**
    ```sql
    ALTER TABLE "Documents" ENABLE ROW LEVEL SECURITY;
    ```
2.  **Policy:**
    ```sql
    CREATE POLICY "Tenant Isolation" ON "Documents"
    USING (tenant_id = auth.jwt() ->> 'tenant_id');
    ```
3.  **App Logic:**
    Nie musisz dodawać `where: { tenantId }` w każdym zapytaniu. Baza filtruje to automatycznie na podstawie tokenu sesji.
