---
name: code-review
description: Use this skill to perform a structured code review based on project standards, including naming conventions, DDD, and SOLID principles.
---

# Code Review Skill

This skill performs a rigorous, systematic code review focused on readability, architecture, and standards.

## Core Principles (Mandatory)
- **Readability over cleverness** — code must read like a book. Use full, descriptive names for variables, functions, types, and components. Do not use abbreviations or shortened forms (e.g., ctx, cfg, btn, usr, msg, err). Names should clearly express domain meaning and intent.
- **Explicit over implicit** — no magic, no hidden behavior.
- **KISS (Keep It Simple, Stupid)** — avoid unnecessary complexity.
- **DRY (Don't Repeat Yourself)** — abstract common patterns into reusable units.
- **SRP (Single Responsibility Principle)** — every function, module, or component should have one, and only one, reason to change. One function = one logic task.
- **ISP (Interface Segregation Principle)** — clients should not depend on properties or methods they do not use. Prefer many small, specific types/interfaces over one large, general-purpose one.
- **First generic functions** — aim for generic, reusable functions before specific ones.
- **Immutability by default** — objects and arrays are treated as immutable.
- **Functional-first** — functions before classes.
- **DDD mindset** — Ubiquitous Language everywhere.

## Review Areas

### 1. Readability & Naming
- **No Abbreviations:** Do not use `err`, `btn`, `cfg`, `ctx`, `usr`, `msg`. Use full, descriptive names.
- **Naming Conventions:** `PascalCase` for Components/Types, `camelCase` for functions/variables, `snake_case` for Python variables.

### 2. React Standards (Zero useEffect)
- **Zero useEffect:** Ensure `useEffect` is only used as an escape hatch. Check for derived state and event-based logic.
- **Pure View:** UI components should be pure presentation. Business logic must be in hooks or services.
- **React 19 Actions:** Verify usage of `useActionState` and `useFormStatus` for mutations.

### 3. Architecture & DDD
- **Layer Integrity:** Ensure logic doesn't leak between `domain`, `application`, and `infrastructure`.
- **Public API:** Cross-module imports must go through `index.ts` barrel files.

### 4. Safety & Quality
- **Type Safety:** No `any`. Prefer `type` over `interface`.
- **Validation:** Inputs must be validated with Zod/Pydantic.

## Workflow
1. Analyze the changes and their context.
2. Present a concise plan of review findings (bullet points).
3. Evaluate against "The Law" (Extreme Brevity, Speak Before You Act).
4. Suggest surgical, idiomatic improvements.

## Rules
- **Speak Before You Act:** Explain intended changes before applying them.
- **Extreme Brevity:** Be concise in feedback.
- **Surgical Updates:** Only request changes related to standards and the task.
