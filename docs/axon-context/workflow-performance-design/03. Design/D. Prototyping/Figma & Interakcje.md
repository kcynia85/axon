# Figma & Interakcje

## 💡 Metodologia i Narzędzia
> *Materiały pomocnicze z biblioteki wiedzy:*
> *   [⚡ Próg Doherty’ego (Czas reakcji)](../../Psychology/Psychologia%20w%20Projektowaniu%20UX%20UI/Design%20Laws%20in%20Psychology/Pr%C3%B3g%20Doherty%E2%80%99ego%20140585629e49806487d4dbf2417f0b9c.md)
> *   [🎯 Prawo Fittsa (Dotyk)](../../Psychology/Psychologia%20w%20Projektowaniu%20UX%20UI/Design%20Laws%20in%20Psychology/Fitts's%20Law%203eb1a6d938444cbda5e053cc609a6ef6.md)
> *   [✨ Projektowanie dla zachwytu](../../Psychology/Psychologia%20w%20Projektowaniu%20UX%20UI/Percepcja%20i%20Zaufanie%20Cz%C5%82owieka/Projektowanie%20dla%20Zachwytu%20U%C5%BCytkownika%201ac585629e4980169fa2d67bafbc4e17.md)

---

## 1. Fizyka Interakcji (System Responsywności)
*Jak system odpowiada na działania użytkownika?*

### Czas Reakcji (Doherty Threshold)
*System musi reagować w <400ms, aby utrzymać stan "flow".*
*   **Natychmiastowe (0-100ms):** Zmiana stanu przycisku (Hover/Active).
*   **Krótkie (100-300ms):** Przejścia ekranów, modale.
*   **Długie (>400ms):** Wymaga wskaźnika ładowania (Skeleton/Spinner), aby zarządzać *oczekiwaniem* (Labor Illusion).

### Ergonomia (Fitts's Law)
*   [ ] **Touch Targets:** Minimum 44x44px (Mobile) / 32x32px (Desktop).
*   **Dystans:** Najważniejsze akcje (np. "Kup") blisko kciuka (strefa komfortu).
*   **Rozmiar:** Im ważniejsza akcja, tym większy przycisk.

---

## 2. Mikrointerakcje i Feedback
*Budowanie relacji i redukcja lęku.*

| Typ Akcji | Psychologia | Rozwiązanie w Figma (Prototyp) |
| :--- | :--- | :--- |
| **Błąd (Error)** | *Lęk/Frustracja* | Delikatne potrząśnięcie (Shake), Czerwony obrys, Tekst pomocniczy. |
| **Sukces (Success)** | *Dopamina/Ulga* | Konfetti, "Tick" animation, Płynne przejście. |
| **Oczekiwanie** | *Niepewność* | Skeleton screens (poczucie postępu), Labor Illusion (pokazanie, że system "pracuje"). |

---

## 3. Stany Komponentów (Interactive States)
*Każdy element interaktywny musi komunikować swój stan (Affordances & Signifiers).*

*   **Default:** Jak wygląda w spoczynku? (Musi wyglądać na klikalne).
*   **Hover:** "Widzę Cię" (Feedback).
*   **Pressed:** "Przyjąłem komendę" (Sprawczość).
*   **Disabled:** "Nie możesz teraz tego użyć" (Wyjaśnij dlaczego, np. tooltipem).
*   **Focus:** Dla nawigacji klawiaturą (Dostępność).

---

## 4. Checklist Prototypu (Przed testami)
*   [ ] Czy nawigacja jest spójna na każdym ekranie? (Prawo Jakoba).
*   [ ] Czy użytkownik zawsze wie, gdzie jest i jak wrócić? (Breadcrumbs/Back button).
*   [ ] Czy animacje nie powodują choroby symulatorowej? (Zbyt szybkie/duże ruchy).
*   [ ] Czy prototyp obsługuje "Unhappy paths" (błędy, puste stany)?