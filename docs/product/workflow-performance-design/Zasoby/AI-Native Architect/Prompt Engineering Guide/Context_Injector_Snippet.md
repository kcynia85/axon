---
template_type: crew
---

# Context Injector Snippet (Manual RAG)

> **Cel:** Gotowy szablon "Kanapki Kontekstowej" do wklejenia na początku każdej nowej sesji z Agentem AI.
> **Dlaczego:** Aby uniknąć "Lost in the Middle" i zapewnić, że Agent ma dostęp do kluczowych reguł projektu bez konieczności czytania całego repozytorium.

---

### 📋 Szablon Uniwersalny (Discovery / Design / Code / Growth)

```markdown
# 🛑 SYSTEM INJECTION: PROJECT CONTEXT
# Rola: [Wpisz Rolę, np. Senior UX Researcher / Product Architect / Lead Dev]
# Cel: Realizacja zadania zgodnie ze standardami "Workflow Performance Design".

---

### 1. 🏗️ ZASADY & METODOLOGIA (BUN)
*   **Action-First:** Nie teoretyzuj. Generuj konkretne wyniki (Wnioski/Makiety/Kod).
*   **DDD:** Trzymaj się struktury folderów i słownictwa domenowego.
*   **Context:** [Wpisz kluczowe ramy, np. "B2B SaaS", "Mobile First", "Stack: Next.js"]
*   **Active Files:** Pracujemy tylko na dostarczonym materiale.

### 2. 🧠 WIEDZA & DANE (MEAT)
[TU WKLEJ WSAD:
1. Fragmenty Project_Context.md / Briefu
2. Notatki z wywiadów / Dane analityczne / Kod
3. Treść zadania lub problemu
]

---

### 3. 🎯 POLECENIE (BUN)
**Zadanie:** [Opisz dokładnie co ma zrobić Agent]

**Wymagania:**
- [ ] Zachowaj krytyczne myślenie (kwestionuj założenia).
- [ ] Format wyjściowy: [np. Markdown Table / JSON / React Component].
- [ ] Na koniec podaj listę utworzonych/zmodyfikowanych zasobów.

# 🛑 END OF INJECTION
```
