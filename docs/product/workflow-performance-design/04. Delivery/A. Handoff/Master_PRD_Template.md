---
template_type: crew
target_workspace: Delivery
---

<!-- 
🤖 AI AGENT INSTRUCTION: MASTER PRD GENERATOR
Rola: Lead Product Manager.
Cel: Stworzenie kompleksowego dokumentu wymagań, który łączy biznes, design i technologię.
Użycie: Wypełnij sekcje w nawiasach kwadratowych [ ].
-->

# Master PRD (Product Requirements Document)
**Produkt/Moduł:** [Nazwa]
**Status:** [Draft / Review / Ready to Build]
**Właściciel:** [Imię]

---

## 1. 🎯 Problem & Value (Why?)
> *Dlaczego to robimy? Jaki problem rozwiązujemy?*

*   **Problem:** [Opisz ból użytkownika lub braki w systemie]
*   **Value Proposition:** [Jak to rozwiązanie poprawi życie użytkownika?]
*   **Business Goal:** [Jaki jest cel biznesowy? np. Wzrost konwersji o 10%]
*   **Success Metrics (KPIs):**
    *   [ ] Metryka 1: ...
    *   [ ] Metryka 2: ...

## 2. 👤 User Stories & JTBD (Who?)
> *Dla kogo to jest?*

*   **Persona:** [Nazwa Persony]
*   **Jobs to be Done (JTBD):**
    *   "Kiedy [sytuacja], chcę [rozwiązanie], aby [efekt]."
*   **User Stories:**
    *   **US.01:** Jako [Rola], chcę [Akcja], aby [Rezultat].
    *   **US.02:** Jako [Rola], chcę [Akcja], aby [Rezultat].

## 3. 🧠 Logic & Flow (How?)
> *Jak to ma działać? (Bez rysowania UI)*

### 3.1 Diagram Przepływu (Tekstowy)
1. Użytkownik wchodzi na stronę X.
2. System sprawdza uprawnienia Y.
3. Jeśli OK -> Wyświetla Z.
4. Jeśli Błąd -> Wyświetla Komunikat Q.

### 3.2 Reguły Biznesowe (Business Rules)
*   [BR.01]: Hasło musi mieć 8 znaków.
*   [BR.02]: Użytkownik Free może dodać max 5 projektów.
*   [BR.03]: Usunięcie projektu archiwizuje go na 30 dni.

## 4. 🎨 UX & Interface Guidelines
> *Wskazówki dla designera/AI.*

*   **Kluczowe Ekrany:**
    *   Widok listy (Tabela z filtrami).
    *   Modal edycji.
*   **Stany Brzegowe (Edge Cases):**
    *   Pusty stan (Empty State).
    *   Błąd ładowania danych.
    *   Brak uprawnień.
*   **Copywriting:** Tone of voice: [Formalny/Luźny].

## 5. 🏗️ Technical Scope (For Devs)
> *Wskazówki dla developera (wstęp do Tech PRD).*

*   **API:** [Nowy endpoint / Modyfikacja istniejącego]
*   **Database:** [Nowa tabela / Nowa kolumna]
*   **Security:** [RLS / Walidacja]
*   **Performance:** [Wymagania dot. czasu ładowania]

## 6. 🤖 AI Prompts Injection (Action-First)
> *Gotowe prompty do wygenerowania składowych tego PRD.*

*   **Potrzebujesz User Stories?** -> Użyj: `Generuj 5 User Stories dla [Opis Funkcji] w formacie "As a... I want... So that...".`
*   **Potrzebujesz Logiki?** -> Użyj: `Napisz scenariusz testowy BDD (Given/When/Then) dla tej funkcji.`
*   **Potrzebujesz Modeli Danych?** -> Użyj: `Zaproponuj schemat tabeli SQL dla tych wymagań.`

---

## ✅ Acceptance Criteria (Definition of Done)
*   [ ] Funkcja działa zgodnie z User Stories.
*   [ ] Przechodzi Happy Path i Sad Path (błędy).
*   [ ] Design jest responsywny (Mobile/Desktop).
*   [ ] Kod przeszedł Code Review.
*   [ ] Analityka zdarzeń jest podpięta (Track events).
