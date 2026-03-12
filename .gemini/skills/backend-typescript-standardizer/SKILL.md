---
name: backend-typescript-standardizer
description: Use this skill when working on the Node.js backend (Express/Fastify) or Next.js Server Actions to ensure type safety, validation, and clean architecture.
---

# Backend TypeScript Standardizer Skill

This skill enforces high-quality engineering standards for TypeScript backend logic.

## Goals
- Achieve 100% type safety using Zod and TypeScript.
- Ensure robust error handling and flow control.
- Implement clean data access patterns.

## Standards & Practices

### 1. Input Validation (Zod First)
- Validate ALL inputs (API requests, function arguments) using Zod schemas.
- **Inference:** Always infer TypeScript types from Zod schemas.
- `const UserSchema = z.object({ ... }); type User = z.infer<typeof UserSchema>;`

### 2. Database & Data Access
- **ORM:** Use Prisma or Drizzle as the standard.
- **Migrations:** Never edit the database schema manually. Always use migration files.
- **Repository Pattern:** Do not call the ORM directly in controllers or services. Use a data access layer (`infrastructure/repo.ts`).

### 3. Error Handling
- **No Crashes:** Ensure no unhandled exceptions crash the process.
- **Custom Errors:** Use typed application errors (e.g., `AppError`, `DomainError`).
- **Sanitization:** Never return raw database or system errors to the client.
- **Server Actions:** Use `try/catch` and return `{ success: false, error: "message" }`.

### 4. Logic Isolation (Functional DDD)
- **Interface Layer:** Receives requests, validates DTOs, and calls the application layer. No business logic here.
- **Application Layer:** Orchestrates use cases. Does not know about HTTP (`req`, `res`).
- **Domain Layer:** Pure TypeScript, agnostics of framework and infrastructure.

### 5. Logging
- **PII Scrubbing:** Always scrub emails, passwords, and tokens from logs.
- **Structured Logs:** Use JSON format for production-ready logging.

## Workflow
1. Define Zod schemas for the domain and request/response.
2. Implement the repository for data access.
3. Write pure business logic in the domain layer.
4. Orchestrate the use case in the application layer.
5. Implement the interface (Router/Controller/Server Action).

## Rules
- **No Implicit Any:** Always use strict typing.
- **Immutability:** Treat data as immutable throughout the pipeline.
- **Explicit Returns:** Public functions must have explicit return types.
