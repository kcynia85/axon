# 🛡️ BACKEND TS COMMON: Shared Standards
> **Role:** Shared rules for ANY TypeScript backend logic (Node.js, Next.js Server Actions, Serverless).
> **Scope:** Validation, Database, Error Handling, Logging.

---

# 🛡️ Input Validation & Type Safety
- **Zod First:** Validate ALL inputs (API requests, function arguments) using Zod schemas.
- **Inference:** Infer TypeScript types from Zod schemas. Don't write types manually if a schema exists.
  ```ts
  const UserSchema = z.object({ ... });
  type User = z.infer<typeof UserSchema>;
  ```

# 🗄️ Database & ORM
- **ORM:** Prisma (Default) or Drizzle.
- **Migrations:** Never edit DB schema manually. Always use migrations.
- **Secrets:** Database URL must be in `.env`.
- **Repository Pattern:** Don't call ORM directly in Controllers/Server Actions. Use a data access layer (`infrastructure/repo.ts`).

# 🚨 Error Handling & Flow Control
- **No Crashes:** Never let an unhandled exception crash the process.
- **Custom Errors:** Use typed Application Errors (e.g., `AppError`, `DomainError`).
- **Sanitization:** Never return raw database errors to the client.

### Stack Specific Implementation
- **Node.js (Express/Fastify):** Use Global Error Middleware to catch/log exceptions and format JSON response.
- **Next.js:**
    - **UI:** Use `error.tsx` boundaries.
    - **Server Actions:** Use `try/catch` and return `{ success: false, error: "Msg" }` (or `useActionState`). Do NOT rely on middleware for logic errors.

# 🪵 Logging
- **Structured Logs:** Use JSON format in production.
- **Levels:** `info` (business events), `error` (failures), `debug` (dev only).
- **No PII:** Scrub emails, passwords, and tokens from logs before writing.
