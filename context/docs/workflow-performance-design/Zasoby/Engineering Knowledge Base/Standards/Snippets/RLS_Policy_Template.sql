-- RLS Policy Template for Multi-Tenancy (Supabase/Postgres)
-- Cel: Izolacja danych klientów (Tenants) na poziomie bazy danych.
-- Zasada: Każde zapytanie jest automatycznie filtrowane przez 'tenant_id' z tokenu JWT.

-- 1. Enable RLS on Table
ALTER TABLE "your_table_name" ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy for SELECT (Read)
-- Pozwala czytać tylko rekordy należące do organizacji użytkownika.
CREATE POLICY "Tenant Isolation Select" ON "your_table_name"
FOR SELECT
USING (
  tenant_id = (auth.jwt() ->> 'app_metadata')::jsonb ->> 'tenant_id'
);

-- 3. Create Policy for INSERT (Write)
-- Wymusza, aby nowo tworzony rekord miał przypisane tenant_id użytkownika.
CREATE POLICY "Tenant Isolation Insert" ON "your_table_name"
FOR INSERT
WITH CHECK (
  tenant_id = (auth.jwt() ->> 'app_metadata')::jsonb ->> 'tenant_id'
);

-- 4. Create Policy for UPDATE
CREATE POLICY "Tenant Isolation Update" ON "your_table_name"
FOR UPDATE
USING (
  tenant_id = (auth.jwt() ->> 'app_metadata')::jsonb ->> 'tenant_id'
);

-- 5. Create Policy for DELETE
CREATE POLICY "Tenant Isolation Delete" ON "your_table_name"
FOR DELETE
USING (
  tenant_id = (auth.jwt() ->> 'app_metadata')::jsonb ->> 'tenant_id'
);

-- ⚠️ WAŻNE: Bypass RLS for Service Role
-- Upewnij się, że rola 'service_role' (używana przez backendowe skrypty) ma bypass, jeśli to konieczne.
-- Domyślnie w Supabase 'service_role' omija RLS, ale warto o tym pamiętać przy customowych rolach.
