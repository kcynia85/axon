# 🧠 MEMORY: Lessons Learned & Preferences
> **Role:** Critical corrections and user preferences derived from past mistakes.
> **Priority:** HIGHEST. Overwrites conflicting rules in CONTEXT-TECH.

---

## 🚫 Anti-Patterns (To Avoid)
- **uv dependency management**: `uv` does not support `python = "3.10"` (or similar) in the `[tool.uv]` section of `pyproject.toml`. This field should be omitted or configured differently if a specific Python version needs to be enforced by `uv`'s settings.

## ⭐ User Preferences
*   *(Tu wpisuj swoje specyficzne preferencje, np. "wolę pętle for zamiast reduce")*

## 🐛 Known Issues & Fixes
*   *(Tu wpisuj rozwiązania specyficznych problemów technicznych napotkanych w projekcie)*