---
name: modular-monolith-architect
description: Use this skill when designing or refactoring the Next.js frontend or Node.js backend to follow the Modular Monolith and DDD principles.
---

# Modular Monolith Architect Skill

This skill ensures the system is structured as a collection of cohesive, domain-driven modules.

## Goals
- Enforce strict layer isolation.
- Maintain a clean Public API for each module.
- Reduce coupling between independent domain features.

## Architecture Standards

### 1. Folder Structure (Modules First)
- All business logic must reside in `src/modules/[context]/`.
- **Layer Isolation:**
    - `domain/`: Pure TypeScript, Zod schemas, Business Rules. **NO** imports from `infrastructure`, `application`, or `app`.
    - `infrastructure/`: Database access (Repositories), 3rd party API clients (Adapters).
    - `application/`: Server Actions, Use Cases, Orchestration. Depends on `domain` and `infrastructure`.
    - `ui/`: Module-specific components. Follows the "Pure View" principle.

### 2. Public API (Public Interface)
- Cross-module communication **MUST** go through the `index.ts` barrel file of each module.
- **Strict Rule:** Never import deeply from another module's internal folders.
- Correct: `import { UserService } from "@/modules/users"`
- Incorrect: `import { UserSchema } from "@/modules/users/domain/schemas"`

### 3. Component Architecture (Next.js)
- **Composition Root:** `page.tsx` and `layout.tsx` should only orchestrate and compose components.
- **Pure Presentation:** Move state, effects, and data fetching to Custom Hooks.
- **Primitive Abstraction:** Extract styled primitives (e.g., `<CardWrapper>`) to separate files.

## Workflow
1. Identify the domain context for the feature.
2. Define the core domain entities and validation schemas (Zod).
3. Implement necessary infrastructure adapters.
4. Create application use cases (Services/Server Actions).
5. Build the UI components following the "Pure View" pattern.
6. Export the necessary symbols through the module's `index.ts`.

## Rules
- **Dependency Rule:** Dependencies must only point inward (Application -> Domain, Infrastructure -> Domain).
- **No Circular Deps:** Modules must not have circular dependencies. Use shared kernels or events if needed.
- **SRP:** Every module should have one clear responsibility.
