# Behavioral Design Checklist (Psychology Audit)

> **Cel:** "Utwardzenie" projektu psychologią behawioralną. Sprawienie, by użytkownik *chciał* kliknąć.
> **Kiedy używać:** Podczas tworzenia makiet (Wireframes) lub audytu gotowego designu.
> **Teoria:** [Behavioral Motivation Toolkit](../../Zasoby/Psychology%20&%20Behavioral%20Science/Behavioral_Motivation_Toolkit.md)

---

## 1. Zmniejszanie Oporu (Friction)
*Czy nie każesz użytkownikowi za dużo myśleć?*

- [ ] **Hick’s Law Audit:** Policz akcje (guziki/linki) na głównym ekranie.
    - [ ] Czy jest jeden wyraźny Primary Action?
    - [ ] Czy usunąłeś/ukryłeś wszystko, co nie jest niezbędne w tym kroku?
- [ ] **Smart Defaults:** Czy formularze pomagają użytkownikowi?
    - [ ] Czy najpopularniejsze opcje są wstępnie zaznaczone?
    - [ ] Czy pola (np. kraj, waluta) są wykryte automatycznie?
- [ ] **Cognitive Load Chunking:** Spójrz na proces (np. checkout).
    - [ ] Czy jest podzielony na logiczne, małe kroki (max 3-5 pól na ekran)?
    - [ ] Czy jest pasek postępu, który mówi "już prawie koniec"?

## 2. Motywacja i Zachęta (Nudge)
*Dlaczego użytkownik ma to zrobić teraz?*

- [ ] **Curiosity Gap:** Sprawdź nagłówki i CTA.
    - [ ] Czy obiecują wartość "za klikiem"? (np. "Zobacz swój wynik" vs "Wyślij").
- [ ] **Social Proof (Contextual):**
    - [ ] Czy w momencie decyzji (np. dodanie do koszyka) widać, że inni też to robią? ("Kupione 50 razy w tej godzinie").
- [ ] **Scarcity (Rzadkość):**
    - [ ] Czy (jeśli to prawda) informujesz o kończących się zasobach/czasie?
    - [ ] *Warning:* Czy na pewno nie jest to Fake Scarcity?

## 3. Immersja i Relacja
*Czy system "widzi" użytkownika?*

- [ ] **Personalizacja (Welcome Back):**
    - [ ] Czy powracający użytkownik widzi swoje imię / ostatnie wybory?
    - [ ] Czy dashboard dostosowuje się do jego roli/potrzeb?
- [ ] **Peak-End Rule:** Sprawdź moment "końcowy" (np. Success Page).
    - [ ] Czy po wykonaniu zadania użytkownik dostaje dopaminowy strzał (konfetti, gratulacje, podsumowanie sukcesu)?

---

## 🤖 AI Auditor Prompt
*Skopiuj ten prompt do Agenta, aby zrobił audyt za Ciebie.*

<details>
<summary><b>Kliknij, aby rozwinąć prompt</b></summary>

```markdown
Jesteś Ekspertem Psychologii Behawioralnej w UX (Behavioral Designer).
Przeprowadź audyt załączonego widoku/makiet [SCREENSHOT/OPIS].

Twoim zadaniem jest ocena projektu w 3 filarach motywacji wg metodologii 9K.
Dla każdego filaru przyznaj ocenę **1-5** (gdzie 1 = Krytyczne błędy, 5 = Wzorzec) i uzasadnij.

1. **Friction (Opór):** Czy nie każesz użytkownikowi za dużo myśleć? (Hick's Law, Defaults).
2. **Incentive (Zachęta):** Czy dajesz powód do działania tu i teraz? (Social Proof, Scarcity).
3. **Immersion (Relacja):** Czy system jest personalny i nagradzający? (Gamification, Peak-End).

### Output Format (Markdown Table):

| Filar | Ocena (1-5) | Znaleziony Problem | Sugerowana Poprawka (Action Item) |
| :--- | :---: | :--- | :--- |
| **Friction** | [X]/5 | ... | ... |
| **Incentive** | [X]/5 | ... | ... |
| **Immersion** | [X]/5 | ... | ... |

**Podsumowanie:** Jedno zdanie podsumowujące największą szansę na wzrost konwersji.
```

</details>
