export type FieldType = "text" | "number" | "password" | "select";

export interface DynamicField {
  readonly name: string;
  readonly label: string;
  readonly type: FieldType;
  readonly placeholder?: string;
  readonly hint?: string;
  readonly defaultValue?: any;
  readonly options?: { id: string; name: string }[];
}

const POSTGRES_FIELDS: DynamicField[] = [
  {
    name: "vector_database_host",
    label: "Host",
    type: "text",
    placeholder: "localhost",
    hint: "Adres lokalnej bazy PostgreSQL (np. localhost lub IP kontenera).",
  },
  {
    name: "vector_database_port",
    label: "Port",
    type: "number",
    defaultValue: 5432,
    hint: "Standardowy port PostgreSQL to 5432.",
  },
  {
    name: "vector_database_user",
    label: "Użytkownik",
    type: "text",
    placeholder: "postgres",
  },
  {
    name: "vector_database_password",
    label: "Hasło",
    type: "password",
    placeholder: "••••••••",
  },
  {
    name: "vector_database_db_name",
    label: "Nazwa Bazy",
    type: "text",
    defaultValue: "postgres",
  },
  {
    name: "vector_database_ssl_mode",
    label: "SSL Mode",
    type: "select",
    defaultValue: "disable",
    options: [
      { id: "disable", name: "disable (Zalecane lokalnie)" },
      { id: "require", name: "require" },
    ],
  },
];

const CHROMADB_FIELDS: DynamicField[] = [
  {
    name: "vector_database_config.chroma_host",
    label: "Chroma Host",
    type: "text",
    placeholder: "localhost",
  },
  {
    name: "vector_database_config.chroma_port",
    label: "Chroma Port",
    type: "number",
    defaultValue: 8000,
  },
];

const SUPABASE_FIELDS: DynamicField[] = [
  {
    name: "vector_database_host",
    label: "Supabase Host",
    type: "text",
    placeholder: "db.ref.supabase.co lub pooler.supabase.com",
    hint: "Adres hosta z panelu Supabase (Settings -> Database).",
  },
  {
    name: "vector_database_port",
    label: "Port",
    type: "number",
    defaultValue: 5432,
    hint: "Direct: 5432. Pooler (Transaction): 6543 lub 5432.",
  },
  {
    name: "vector_database_user",
    label: "Użytkownik",
    type: "text",
    defaultValue: "postgres",
    placeholder: "postgres.[twój-ref]",
    hint: "Dla Poolera użyj formatu: postgres.[project-ref]",
  },
  {
    name: "vector_database_password",
    label: "Hasło (Database Password)",
    type: "password",
    placeholder: "••••••••",
  },
  {
    name: "vector_database_db_name",
    label: "Nazwa Bazy",
    type: "text",
    defaultValue: "postgres",
  },
  {
    name: "vector_database_ssl_mode",
    label: "SSL Mode",
    type: "select",
    defaultValue: "require",
    options: [
      { id: "require", name: "require (Zalecane)" },
      { id: "verify-full", name: "verify-full" },
    ],
  },
];

export const VECTOR_DB_FIELD_CONFIGS: Record<string, DynamicField[]> = {
  POSTGRES_PGVECTOR_LOCAL: POSTGRES_FIELDS,
  POSTGRES_PGVECTOR: POSTGRES_FIELDS,
  Postgres_pgvector: POSTGRES_FIELDS,
  SUPABASE_PGVECTOR_CLOUD: SUPABASE_FIELDS,
  Supabase_pgvector_Cloud: SUPABASE_FIELDS,
  QDRANT_LOCAL: [
    {
      name: "vector_database_config.qdrant_url",
      label: "Qdrant URL",
      type: "text",
      placeholder: "http://localhost:6333",
      hint: "Adres API Twojej instancji Qdrant.",
    },
    {
      name: "vector_database_config.qdrant_api_key",
      label: "API Key (Opcjonalnie)",
      type: "password",
      placeholder: "Twoje API Key",
      hint: "Wymagane jeśli Qdrant ma włączoną autoryzację.",
    },
  ],
  Qdrant_Local: [
    {
      name: "vector_database_config.qdrant_url",
      label: "Qdrant URL",
      type: "text",
      placeholder: "http://localhost:6333",
      hint: "Adres API Twojej instancji Qdrant.",
    },
    {
      name: "vector_database_config.qdrant_api_key",
      label: "API Key (Opcjonalnie)",
      type: "password",
      placeholder: "Twoje API Key",
      hint: "Wymagane jeśli Qdrant ma włączoną autoryzację.",
    },
  ],
  CHROMADB_LOCAL: CHROMADB_FIELDS,
  CHROMADB: CHROMADB_FIELDS,
  ChromaDB: CHROMADB_FIELDS,
  ChromaDB_Local: CHROMADB_FIELDS,
  CHROMADB_CLOUD: [
    {
      name: "vector_database_config.chroma_url",
      label: "Chroma Cloud URL",
      type: "text",
      placeholder: "https://api.trychroma.com",
    },
    {
      name: "vector_database_config.chroma_api_key",
      label: "API Key",
      type: "password",
      placeholder: "••••••••",
    },
  ],
  ChromaDB_Cloud: [
    {
      name: "vector_database_config.chroma_url",
      label: "Chroma Cloud URL",
      type: "text",
      placeholder: "https://api.trychroma.com",
    },
    {
      name: "vector_database_config.chroma_api_key",
      label: "API Key",
      type: "password",
      placeholder: "••••••••",
    },
  ],
};
