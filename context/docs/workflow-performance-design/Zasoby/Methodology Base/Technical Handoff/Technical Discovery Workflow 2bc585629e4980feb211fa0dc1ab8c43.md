# Technical Discovery Workflow

<aside>

```markdown

# 📄 Technical Discovery Workflow

> **Cel:** Przetłumaczenie wymagań biznesowych (Business PRD) i wizualnych (Figma) na język techniczny (Tech PRD) przy użyciu DDD i AI.
> **Kiedy:** Zanim zaczniesz pisać kod.
> **Kto:** Tech Lead / Product Engineer.

---

## Krok 1: Zbieranie Wsadu (Gathering Inputs)
Nie zaczynaj analizy bez kompletu informacji. Upewnij się, że masz:
1.  **Business PRD** (Co robimy i po co?).
2.  **Makiety/Figma** (Jak to wygląda?).
3.  **Transkrypcja/Notatki** z rozmowy z PM-em lub Klientem.

---

## Krok 2: Synteza Domenowa z AI (AI Distillation)
Zamiast ręcznie analizować tekst, użyj AI do wyciągnięcia struktury DDD.

**1. Skopiuj swoje notatki/transkrypcję.**
**2. Wklej do Claude/GPT z tym promptem:**

```markdown
Role: Senior DDD Architect.
Task: Perform a "Domain Distillation" on the provided input (transcript/notes).

Input:
[WKLEJ TUTAJ SWOJE NOTATKI]

Output Requirement (Markdown):
1. Ubiquitous Language Table (Business Term -> Code Term (English) -> Definition).
2. Invariants List (Strict validation rules, "Fail Fast" conditions).
3. Domain Events List (What happened in the past tense, e.g., OrderPlaced).
4. Questions/Gaps (What is missing or ambiguous?).
```

---

## Krok 3: Weryfikacja i "Human Review"
AI zrobi 80% pracy, ale Ty musisz zrobić pozostałe 20%.

1.  **Sprawdź Słownik:** Czy nazwy angielskie (`Code Term`) są naturalne? (np. czy `submit` jest lepsze niż `send`?).
2.  **Sprawdź Luki:** Czy AI znalazło dziury w logice? (np. "Co się dzieje po anulowaniu subskrypcji?").
    *   *Jeśli są luki -> Wróć do PM-a/Klienta i dopytaj.*
3.  **Zdefiniuj Agregat:** Na podstawie danych zdecyduj, co jest głównym obiektem (Root), a co tylko elementem składowym.

---

## Krok 4: Utworzenie Tech PRD
To jest moment sformalizowania wiedzy.

1.  Idź do bazy **Features & Specs DB**.
2.  Kliknij `New` i wybierz szablon **🛠️ Tech PRD Template**.
3.  Wklej wyniki analizy (z Kroku 2 i 3) w odpowiednie sekcje:
    *   Tabela Słownika -> Sekcja 1.
    *   Reguły/Invariants -> Sekcja 1.
    *   Agregaty/Zachowania -> Sekcja 4.
4.  Zmień status na `Ready`.

---

## 5. Przekazanie do Developmentu
Gdy Tech PRD jest gotowe (`Ready`), staje się wsadem do procesu **PRP Creation** (tworzenia promptu dla Cursora).

👉 **Next Step:** Otwórz [PRP Creation Guidelines] (jeśli takowe posiadasz w Knowledge).
```

</aside>