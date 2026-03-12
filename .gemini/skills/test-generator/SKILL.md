---
name: test-generator
description: Use this skill when generating unit, integration, or E2E tests, following the project's testing pyramid and using Vitest/Playwright.
---

# Test Generator Skill

This skill generates robust, deterministic automated tests to ensure application correctness.

## Goals
- Increase coverage across all architectural layers.
- Implement the Testing Pyramid strategy.
- Ensure 100% deterministic test results.

## Testing Pyramid

### 1. Unit Tests (Base)
- **Tool:** Vitest.
- **Focus:** Pure logic, domain services, utility functions.
- **Rules:** Fast, isolated, no real I/O.

### 2. Integration Tests (Middle)
- **Tool:** Vitest + Testing Library.
- **Focus:** Component interaction, hook logic, module communication.
- **Mocking:** Mock external services (e.g., Stripe, Email).

### 3. E2E Tests (Top)
- **Tool:** Playwright.
- **Focus:** Critical user paths, full system integration.
- **Verification:** Run against a real or simulated browser.

## Workflow
1. Analyze the target file and its dependencies.
2. Identify core behavior, edge cases, and error paths.
3. Choose the appropriate test level (Unit/Integration/E2E).
4. Generate structured test cases with readable names.
5. Use standardized mocks for infrastructure and external APIs.

## Rules
- **Behavioral Testing:** Test what the code *does*, not how it works internally.
- **Mocking Strategy:** Only mock what you don't control (external APIs, DB).
- **CI/CD Ready:** Tests must be able to pass in a headless CI environment.
