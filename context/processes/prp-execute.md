---

# 3️⃣ Execute PRP (Implementation)

# Execute PRP (Implementation Guide)

## Purpose
Implement a feature based on a previously generated PRP and Implementation Plan.

## Workflow
1. **Load Context**
   - Read `PRPs/{feature-name}.md`.
   - Read `Docs/IMPLEMENTATION.md`.
   - Ensure all context and requirements are understood.
   - Extend research if needed (codebase exploration, web search).

2. **ULTRATHINK**
   - Plan execution carefully based on the `High-Level Design` section in `IMPLEMENTATION.md`.
   - Break tasks into smaller actionable steps if not already granular enough.

3. **Execute Implementation**
   - Follow the `Task Checklist` in `IMPLEMENTATION.md`.
   - Implement all domain logic, repo layers, and orchestrator actions.
   - Maintain invariants and code conventions.

4. **Validate**
   - Run validation gates from PRP:

```bash
eslint --fix .
tsc --noEmit
vitest run --coverage
``` 

- Fix failures and re-run until all pass.

### Complete

- Ensure all checklist items are done.
- Run final validation suite.
- Confirm implementation matches PRP requirements.
- Update `IMPLEMENTATION.md` (mark tasks as completed).

### Reference PRP

- PRP file remains the single source of truth for decisions.
- Any changes must be reflected in `PRP.md` and `IMPLEMENTATION.md`.