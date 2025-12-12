# ♻️ REFACTORING PLAN
> **Goal:** Better code, same behavior.

---

## 🔍 Context
- **Scope:** [Module/Path]
- **Problem:** [Coupling / Legacy / Perf]
- **Target:** [New Pattern / Lib]

## 🛡️ Strategy (Strangler Fig)
1.  **Safety Net:** Ensure tests cover existing logic.
2.  **Implement:** New structure alongside old.
3.  **Switch:** Redirect calls.
4.  **Kill:** Remove old code.

## 🧪 Zombie Test Prevention (CRITICAL)
> **Rule:** You are FORBIDDEN from deleting/disabling failing tests to "make it pass".
- **Action:** Update tests to match new structure.
- **Coverage:** Must not decrease.

## ✅ Checklist
- [ ] Safety Net verified.
- [ ] Refactor executed.
- [ ] **Tests Updated (Not Deleted).**
- [ ] Manual verification.