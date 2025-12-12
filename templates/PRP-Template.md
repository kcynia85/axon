---

# 2️⃣ PRP Template (Structure)

```markdown
# PRP Template (Universal for Any Feature)

## 1. Feature Metadata
Feature Name: [Wpisz nazwę ficzera]
Context Module: [Wpisz kontekst / bounded context]
Priority: [High / Medium / Low]
Status: [Draft / Ready / In Dev]

## 2. Entities & Domain Vocabulary
- Entity: [EntityName]
  - Definition: [Krótki opis funkcji / roli w systemie]
  - CodeName: [Nazwa w kodzie]
- Action: [ActionName]
  - Definition: [Opis akcji w systemie]
  - CodeName: [Nazwa w kodzie]

## 3. Invariants (System Rules)
1. [Invariant 1 – warunek logiczny]
2. [Invariant 2 – warunek logiczny]
3. ...

## 4. System Architecture & Constraints
- Architecture: [Modular Monolith / Microservice / etc.]
- DataModel: [SQL, JSONB, NoSQL – szczegóły tabel i relacji]
- Validation: [Zod / custom validators]
- State: [Functional, Immutable / other]
- Async: [Queue / Server Action / etc.]
- **Memory Check:** [Verified against `knowledge/memory.md`? Yes/No]

## 5. Data Tier / DB Requirements
SQL Tables:
- [TableName]: { field1, field2, field3 }

JSONB / NoSQL:
- [Collection / Config]

Performance Constraints:
- [Np. avoid N+1, indexing requirements]

## 6. Sync vs Async Operations
Synchronous:
- [Operation1]
- [Operation2]

Asynchronous:
- [Operation1]
- [Operation2]

## 7. Caching Rules
- no-store: [data]
- force-cache: [data]
- ISR: [data]

## 8. Domain Modeling (Aggregates & Behaviors)
- Aggregate Structure:
```json
Aggregate {
  id: string
  status: "DRAFT" | "ACTIVE"
  items: ValueObject[]
}
```

## 9. Implementation Notes for AI
- [Specific instruction for implementation phase]
- [Edge case to handle in code]