# AI & Human-Centric Quality Assurance Checklist

## 💡 Metodologia i Narzędzia
> *Materiały pomocnicze z biblioteki wiedzy:*
> *   [🛑 Natura Błędów Użytkownika](../../Psychology/Psychologia%20w%20Projektowaniu%20UX%20UI/Pami%C4%99%C4%87%20i%20Modele%20Mentalne/Natura%20B%C5%82%C4%99d%C3%B3w%20U%C5%BCytkownika%201ac585629e4980bcace2e5fe81eeb0d9.md)
> *   [🧠 Obciążenie Poznawcze](../../Psychology/Psychologia%20w%20Projektowaniu%20UX%20UI/Pami%C4%99%C4%87%20i%20Modele%20Mentalne/Minimalizacja%20Obci%C4%85%C5%BCenia%20Poznawczego%201ac585629e49809398e9c29b6eeb8efa.md)
> *   [⏳ Psychologia czasu (Doherty)](../../Psychology/Psychologia%20w%20Projektowaniu%20UX%20UI/Design%20Laws%20in%20Psychology/Pr%C3%B3g%20Doherty%E2%80%99ego%20140585629e49806487d4dbf2417f0b9c.md)

---

## 1. Obsługa Błędów (Psychologia Porażki)
*Kiedy system zawiedzie, jak czuje się użytkownik?*

*   [ ] **Brak obwiniania:** Komunikaty błędów nie mówią "Błędne dane", lecz "Nie rozpoznano formatu daty, spróbuj DD/MM/RRRR" (Maksyma Grzeczności).
*   [ ] **Zachowanie danych:** Po odświeżeniu/błędzie formularz pamięta wpisane dane (Redukcja frustracji/Repetition blindness).
*   [ ] **Ślepe zaułki:** Każda strona błędu (404, 500) ma przycisk powrotu do bezpiecznego miejsca (np. Home).
*   [ ] **Undo/Cofnij:** Czy krytyczne akcje (usuń, wyślij) można cofnąć? (Poczucie bezpieczeństwa).

## 2. Wydajność Percepcyjna (Perceived Performance)
*Nie liczy się tylko szybkość kodu, ale odczucie szybkości.*

*   [ ] **Skeleton Screens:** Czy używamy szkieletów zamiast spinnerów przy ładowaniu treści? (Poczucie postępu).
*   [ ] **Labor Illusion:** Jeśli AI coś generuje, czy pokazujemy "Myślę...", "Piszę...", aby zbudować wartość wyniku?
*   [ ] **Responsywność:** Czy interfejs reaguje na kliknięcie w <100ms (zmiana stanu), nawet jeśli proces w tle trwa dłużej?

## 3. Spójność i Modele Mentalne (Cognitive Ease)
*Czy aplikacja działa tak, jak użytkownik się spodziewa?*

*   [ ] **Prawo Jakoba:** Czy ikony i nawigacja działają tak jak w popularnych aplikacjach (np. Google, Facebook)?
*   [ ] **Spójność językowa:** Czy przycisk zawsze nazywa się tak samo (np. nie mieszamy "Wyślij" i "Prześlij")?
*   [ ] **Afodancje:** Czy to co klikalne, wygląda na klikalne?

## 4. Testy AI & Edge Cases (Psychologia Niepewności)
*Jak system radzi sobie z niejednoznacznością?*

*   [ ] **Halucynacje:** Czy system informuje o możliwych błędach AI? ("Sprawdź ważne informacje").
*   [ ] **Brak odpowiedzi:** Co się dzieje, gdy AI nie zna odpowiedzi? (Fail graceful).
*   [ ] **Zaufanie:** Czy podajemy źródła lub wyjaśnienie, dlaczego AI podjęło taką decyzję? (Explainability).

## 5. Dostępność (Inkluzywność)
*   [ ] **Kontrast:** Czy tekst jest czytelny dla osób ze słabszym wzrokiem? (WCAG).
*   [ ] **Język:** Czy komunikaty są w prostym języku (Plain Language), zrozumiałym dla laika?