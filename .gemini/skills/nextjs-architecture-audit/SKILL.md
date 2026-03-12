---
name: nextjs-architecture-audit
description: Use this skill when auditing the architecture, performance, and structure of a Next.js project.
---

# Next.js Architecture Audit Skill

This skill analyzes the structure and architecture of a Next.js application.

## Goals

- improve maintainability
- detect architectural issues
- optimize server/client boundaries
- improve performance

## Analysis Areas

Review:

- routing structure
- server vs client components
- data fetching patterns
- component composition
- project folder structure
- performance risks

## Workflow

1. Scan project directories.
2. Identify routing structure.
3. Detect server/client component usage.
4. Analyze data fetching patterns.
5. Identify architectural issues.
6. Suggest improvements.

## Rules

- prefer server components when possible
- avoid unnecessary client rendering
- ensure consistent project structure
- detect duplicated logic

## Output

Produce an architecture report with:

- detected issues
- severity level
- recommended improvements