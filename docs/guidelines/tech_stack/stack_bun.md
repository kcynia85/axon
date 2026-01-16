# 🟢 TECH STACK: Bun Backend
> **Role:** Standards for Backend-only JS/TS projects using the Bun toolkit.

---

# 📚 Shared Foundation
**REQUIRED:** [Load Backend TS Common Standards](backend-ts-common.md) (Validation, DB, Error Handling).

---

# 🚀 Defaults
1.  **Runtime:** Bun 1.0+.
2.  **Framework:** Bun.serve (Native) for performance. Express/Fastify are compatible but not the default.
3.  **Lang:** TypeScript (Strict).

---

# 🧠 Standards
- **Package Manager:** Use built-in `bun install`.
- **Async/Await:** Everywhere.
- **Logging:** `pino` (JSON struct).
- **Testing:** Bun Test.