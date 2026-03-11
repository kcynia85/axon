# 🧩 Coding Standards (Mandatory)

This document defines **mandatory rules** for writing code in this repository.
These standards apply to **humans and AI agents (LLMs)** equally.

---

## 🎯 Core Principles

- **Readability over cleverness** — code must read like a book. Use full, descriptive names for variables, functions, types, and components. Do not use abbreviations or shortened forms (e.g., ctx, cfg, btn, usr, msg, err). Names should clearly express domain meaning and intent.
- **Explicit over implicit** — no magic, no hidden behavior
- **KISS (Keep It Simple, Stupid)** — avoid unnecessary complexity
- **DRY (Don't Repeat Yourself)** — abstract common patterns into reusable units
- **SRP (Single Responsibility Principle)** — every function, module, or component should have one, and only one, reason to change. One function = one logic task.
- **ISP (Interface Segregation Principle)** — clients should not depend on properties or methods they do not use. Prefer many small, specific types/interfaces over one large, general-purpose one.
- **First generic functions** — aim for generic, reusable functions before specific ones
- **Modular-first** — organize code into self-contained, independent modules
- **Component-first** — build UI as a collection of isolated, reusable components
- **Functional-first** — functions before classes
- **Immutability by default**
- **DDD mindset** — Ubiquitous Language everywhere
- **Pure View principle** — UI components should be pure presentation layers. Business logic, state transformations, and side effects must live outside the view. Views receive typed data via props and only render UI.

---

# 🟦 TypeScript / JavaScript

### Language
- **TypeScript only** for new projects
- **Strict Mode** enabled (`strict: true`)
- JavaScript allowed only for legacy code

---

### Typing
- Avoid `any`
- Prefer `type` over `interface`
- Use explicit return types for public functions

```ts
type ProjectId = string

type Project = {
  readonly id: ProjectId
  readonly name: string
}
```

---

### Immutability
- Objects and arrays are treated as **immutable**
- No in-place mutation

```ts
const updatedProject = {
  ...project,
  name: "New name",
}
```

---

### Syntax & Style
- Arrow functions only
- Destructuring preferred
- Optional chaining required where applicable

```ts
const getProjectName = (project?: Project) => project?.name ?? ""
```

---

### Naming
- **PascalCase** → Components, Types
- **camelCase** → functions, variables
- **DDD Naming:** Use Ubiquitous Language
- Names must be **descriptive**, not technical

```ts
const calculateProjectBudget = (project: Project): Money => {
  ...
}
```

---

### Async
- **`async / await` only**
- `.then()` / `.catch()` forbidden

```ts
const fetchProjects = async (): Promise<Project[]> => {
  return await api.getProjects()
}
```

---

### Paradigm
- ❌ No classes (`class`)
- ✅ Functions only
- Exceptions: framework internals only

---

### 🧪 Testing
- **Runner:** Vitest.
- **Focus:** User Interaction (Testing Library).


# 🟩 Python

### Language
- **Python 3.11+** (minimum 3.10)
- **Static typing mandatory** (`mypy` / `pyright`)

```py
from dataclasses import dataclass

@dataclass(frozen=True)
class Project:
    id: ProjectId
    name: str
```

---

### Typing
- No `Any`
- Explicit return types
- Prefer `typing.Annotated` and domain types

```py
def get_project_name(project: Project) -> str:
    return project.name
```

---

### Immutability
- Immutable by default
- Use:
  - `@dataclass(frozen=True)`
  - `tuple` instead of `list`

---

### Syntax & Style
- Functions over classes
- Early returns
- List comprehensions preferred

```py
active_projects = [p for p in projects if p.is_active]
```

---

### Naming
- **snake_case** → functions, variables
- **PascalCase** → types, Value Objects, DTOs
- **DDD Naming:** Ubiquitous Language

```py
def calculate_project_budget(project: Project) -> Money:
    ...
```

---

### Async
- **`async / await` required**
- No blocking I/O in async code
- Allowed libraries:
  - `httpx`
  - `asyncpg`
  - `sqlalchemy.ext.asyncio`

```py
async def fetch_projects() -> list[Project]:
    return await repository.list_projects()
```

---

### Paradigm
- **Functional-first**
- ❌ No service classes (`UserService`, `Manager`, etc.)
- Classes allowed only for:
  - Entities
  - Value Objects
  - Aggregates

```py
def assign_user_to_project(user: User, project: Project) -> Project:
    ...
```

---

## 🚫 Forbidden Patterns (All Languages)

- God objects
- Hidden side effects
- Mutating function arguments
- Global state
- Silent error handling

---

## 🤖 AI Agent Instructions

- Treat this document as **source of truth**
- All rules are **mandatory**
- When in doubt, choose **clarity and explicitness**
- Generated code must fully comply with these standards

---

✅ Compliance with this document is required for all contributions.
