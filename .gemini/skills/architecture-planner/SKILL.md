---
name: architecture-planner
description: Use this skill when designing system architecture or planning large features, incorporating DDD, Hexagonal, and Modular Monolith principles.
---

# Architecture Planner Skill

This skill helps design scalable, domain-driven system architecture.

## Goals
- Design maintainable and testable architecture.
- Define clear module and layer boundaries.
- Ensure loose coupling and high cohesion.

## Core Principles
- **DDD:** Domain logic separated from Infrastructure. Mandatory Ubiquitous Language.
- **Hexagonal:** Use Ports & Adapters for AI Providers and 3rd party APIs.
- **KISS:** Avoid over-engineering for simple CRUD features.
- **Immutability:** Functional core with immutable data structures.

## Workflow
1. **Understand Goals:** Identify the core domain and business requirements.
2. **Identify Modules:** Define Bounded Contexts and modular boundaries.
3. **Define Layers:**
    - `domain`: Pure logic and types.
    - `application`: Orchestration and use cases.
    - `infrastructure`: External systems and database.
4. **Design Data Flow:** Define how data moves between layers using schemas (Zod/Pydantic).
5. **Propose Architecture:** Draft the modular structure and public APIs.

## Rules
- **Dependency Rule:** Source code dependencies can only point inward.
- **Ports & Adapters:** Isolate I/O at the edges of the system.
- **Modular-First:** Organize by domain feature, not technical role.

## Output
Provide:
- Conceptual architecture diagram.
- Module and layer definitions.
- Step-by-step implementation plan.
