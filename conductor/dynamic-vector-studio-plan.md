# Plan: Dynamiczne Formularze w Vector Studio

## Cel
Dostosowanie modułu **Vector Studio** tak, aby po wybraniu konkretnej technologii bazy wektorowej (pgvector, Supabase, Qdrant, ChromaDB) formularz "Parametry Połączenia" dynamicznie zmieniał zestaw pól na dedykowany danej technologii. Rozwiązanie ma być pozbawione "hardcode" pól w bazie danych (wykorzystanie pola `config` JSONB) i w pełni konfigurowalne z poziomu Studio.

## Obsługiwane Technologie
- **pgvector** (PostgreSQL + extension - Local)
- **Supabase Postgres** (Cloud)
- **Qdrant** (Local)
- **ChromaDB** (Cloud)
- **ChromaDB** (Local)

---

## Kroki Implementacyjne

### 1. Rozszerzenie Backend (Domain & Schema)
- **Plik:** `axon-app/backend/app/modules/settings/domain/enums.py`
  - Dodać nowe wartości do `VectorDBType`:
    - `POSTGRES_PGVECTOR_LOCAL`
    - `SUPABASE_PGVECTOR_CLOUD`
    - `QDRANT_LOCAL`
    - `CHROMADB_CLOUD`
    - `CHROMADB_LOCAL`
- **Plik:** `axon-app/backend/app/modules/settings/domain/models.py`
  - Dodać pole `vector_database_config: Dict[str, Any]` do klasy `VectorDatabase`.
- **Plik:** `axon-app/backend/app/modules/settings/infrastructure/tables.py`
  - Dodać kolumnę `vector_database_config` (JSON/JSONB) do `VectorDatabaseTable`.
- **Plik:** `axon-app/backend/app/modules/settings/application/schemas.py`
  - Zaktualizować `CreateVectorDatabaseRequest` i `UpdateVectorDatabaseRequest`, aby obsługiwały `vector_database_config`.
  - Zaktualizować `VectorDatabaseResponse`.

### 2. Rozszerzenie Frontend (Shared & API)
- **Plik:** `axon-app/frontend/src/shared/domain/settings.ts`
  - Zaktualizować `VectorDatabaseSchema`, dodając nowe typy baz oraz pole `vector_database_config`.
- **Plik:** `axon-app/frontend/src/modules/settings/infrastructure/api.ts`
  - Upewnić się, że mapowanie danych w API obsługuje nowe pola.

### 3. Dynamiczne Konfiguracje Formularza (Frontend)
- **Plik:** `axon-app/frontend/src/modules/studio/features/vector-studio/domain/vector-db-configs.ts` (Nowy plik)
  - Zdefiniować mapę `VECTOR_DB_FIELD_CONFIGS`, która dla każdego typu bazy zwraca listę pól formularza (label, name, type, hint, default).
- **Przykład konfiguracji dla Qdrant:**
  ```typescript
  {
    name: "qdrant_url",
    label: "URL",
    type: "text",
    placeholder: "http://localhost:6333",
    hint: "Adres instancji Qdrant"
  }
  ```

### 4. Refaktoryzacja Widoku Studio
- **Plik:** `axon-app/frontend/src/modules/studio/features/vector-studio/ui/VectorStudioView.tsx`
  - Usunięcie zhardkodowanych pól sekcji "Połączenie".
  - Implementacja mechanizmu `form.watch("vector_database_type")`.
  - Mapowanie pól z `VECTOR_DB_FIELD_CONFIGS` na komponenty `FormItemField` i `FormTextField`.
  - Obsługa pola `vector_database_config` wewnątrz `react-hook-form` (np. `vector_database_config.db_host`).

### 5. Inicjalizacja i Migracja Stanu
- **Plik:** `axon-app/frontend/src/modules/studio/features/vector-studio/application/hooks/useVectorStudio.ts`
  - Logika resetowania/inicjalizacji domyślnych wartości przy zmianie technologii.

---

## Weryfikacja
1.  **UI Switcher:** Sprawdzenie czy wybór "Supabase" pokazuje pola `host`, `port`, `ssl` itd.
2.  **UI Switcher:** Sprawdzenie czy wybór "Qdrant" pokazuje pola `url`, `api_key`.
3.  **Persystencja:** Zapisanie nowej bazy i sprawdzenie w DB czy dane trafiły do kolumny `vector_database_config`.
4.  **Edycja:** Otwarcie istniejącej bazy i sprawdzenie czy formularz poprawnie zrekonstruował się na podstawie typu i danych w configu.
