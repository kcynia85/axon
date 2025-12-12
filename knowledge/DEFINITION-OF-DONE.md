# ✅ DEFINITION OF DONE (DoD)
> **When:** Before marking task as "Completed".

---

## 🛡️ Quality Gates
- [ ] **Lint/Type:** No errors (eslint, ruff, tsc, mypy). No `any`.
- [ ] **Clean:** No `console.log`, dead code, or TODOs.
- [ ] **Paths:** File headers present (`// src/file.ts`).

## 🧪 Testing & Safety
- [ ] **Regression:** Did I accidentally delete/disable tests? (Must be NO).
- [ ] **Coverage:** Critical logic tested?
- [ ] **AI Safety:** If RAG involved -> Is Data Lineage (citations) preserved?

## 🧠 Final Check
- [ ] **Build:** Passing?
- [ ] **Memory:** `knowledge/memory.md` updated with lessons?