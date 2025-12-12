# Churn Prevention Master Guide

> **Status:** Knowledge Base (Theory & Patterns)
> **Źródło:** Agregacja wiedzy z folderu Raw/Churn-busting (v1.0)
> **Powiązane Narzędzia Operacyjne:** 
> - [Churn Prevention Strategy](../../../05.%20Growth%20&%20Market/C.%20Conversion%20&%20Retention/Churn%20Prevention%20Strategy.md)
> - [Offboarding Flows](../../../05.%20Growth%20&%20Market/C.%20Conversion%20&%20Retention/Offboarding%20Flows.md)

---

## 1. Anatomia Odpływu (Dlaczego odchodzą?)

Odpływ (Churn) to nie tylko metryka, to objaw choroby w produkcie lub usłudze.

### Główne Przyczyny (The Churn Drivers)
1.  **Słaby Onboarding (Early Churn):** Użytkownik nie poczuł "Aha Moment" w pierwszej sesji. Skomplikowana konfiguracja, brak prowadzenia za rękę.
2.  **Niedopasowanie Produktu (Product-Market Fit Gap):** Obietnica marketingowa mija się z rzeczywistością. Funkcje nie rozwiązują realnego bólu.
3.  **Brak Zaangażowania (Engagement Decay):** Użytkownik przestaje wracać (stopniowy spadek). Brak "Hooks" (Modelu Haczyka).
4.  **Problemy Techniczne i Support:** Błędy, wolne działanie, brak odpowiedzi od obsługi (frustracja).
5.  **Cena vs Wartość:** Użytkownik znajduje tańszą alternatywę lub nie widzi ROI z obecnej ceny.
6.  **Involuntary Churn (Odpływ Mimowolny):** Wygasłe karty płatnicze, odrzucone płatności. (Często 20-40% całego churnu!).

---

## 2. Strategie Segmentacji w Retencji

Nie walcz o każdego. Walcz o tych, których możesz uratować.

| Typ Segmentacji | Zastosowanie w Retencji | Taktyka |
| :--- | :--- | :--- |
| **Demograficzna** | Dopasowanie komunikacji (wiek, kanał) | Młodsi: Push/In-app. Starsi: Email/Telefon. |
| **Behawioralna** | Wykrywanie spadku aktywności | Jeśli logowanie < 1/tydzień -> Wyślij trigger "Tęsknimy". |
| **Wartości (LTV)** | Priorytetyzacja VIP-ów | High LTV: Osobisty telefon od Account Managera. Low LTV: Automat z rabatem. |
| **Cykl Życia** | Dopasowanie do etapu | Nowy: Edukacja. Dojrzały: Power Features. Zagrożony: Win-back. |
| **NPS (Sentyment)** | Ratowanie krytyków | Detractors (0-6): Szybki kontakt supportu. Promoters (9-10): Program poleceń. |

---

## 3. Onboarding jako Pierwsza Linia Obrony

Dobra retencja zaczyna się w pierwszej minucie.

### Zasady "Sticky Onboarding":
1.  **Minimalizacja Tarcie:** Usuń zbędne pola formularzy. Czy email jest niezbędny *przed* pokazaniem wartości?
2.  **Action-Oriented:** Nie pokazuj slajdów "co można zrobić". Kaź użytkownikowi *zrobić* pierwszą akcję (np. "Dodaj pierwszy projekt").
3.  **Progress Bars & Checklists:** Wykorzystaj efekt Zeigarnik (potrzeba domknięcia). Pokaż pasek postępu "Jesteś w 80% gotowy".
4.  **Personalizacja:** Zapytaj "Do czego chcesz używać produktu?" i dostosuj interfejs (np. widok dla marketera vs widok dla deva).
5.  **Empty States:** Pusty ekran to śmierć. Pokaż przykładowe dane lub wielki przycisk "Stwórz X".

---

## 4. Win-Back: Reaktywacja Uśpionych

Jak odzyskać kogoś, kto przestał używać produktu?

### Typy Uśpionych Użytkowników:
*   **Sezonowi:** Wracają np. tylko w Black Friday. -> Nie spamuj, przypomnij się przed sezonem.
*   **Wypaleni:** Używali intensywnie, nagle przestali. -> Zaproponuj przerwę (Pause) zamiast anulowania.
*   **Rozczarowani:** Odeszli przez brak funkcji. -> Poinformuj ich *tylko* gdy dodasz tę funkcję (Changelog alert).

### Kanały Reaktywacji:
*   **Email:** "Twoje raporty czekają" (FOMO), "Daliśmy Ci 100 kredytów na start" (Reciprocity).
*   **Retargeting Ads:** Wyświetl reklamy nowej funkcji tym, którzy nie logowali się od 30 dni.
*   **Push:** "Twój znajomy właśnie dodał..." (Social Proof).

---

## 5. Taktyki Anty-Churnowe (Actionable Insights)

### A. Offboarding Flow (Moment Anulowania)
Nigdy nie pozwalaj odejść jednym kliknięciem bez walki.
1.  **Ankieta:** "Dlaczego odchodzisz?" (Za drogo / Brak funkcji / Błędy).
2.  **Oferta Ratunkowa:**
    *   *Za drogo?* -> "Zostań na 3 miesiące za 50% ceny".
    *   *Brak czasu?* -> "Zawieś subskrypcję (Pause) i zachowaj dane".
    *   *Nie wiem jak używać?* -> "Umów darmowe demo z ekspertem".

### B. Gamifikacja i Nawyki
Buduj nawyki, zanim użytkownik pomyśli o odejściu.
*   **Streaks (Serie):** "Uczysz się 5 dni z rzędu!".
*   **Variable Rewards:** Nieprzewidywalne nagrody za akcje.

### C. Predictive Churn (Dla zaawansowanych)
Użyj danych, by przewidzieć odejście.
*   *Sygnał:* Użytkownik eksportuje wszystkie dane.
*   *Reakcja:* Automat wysyła maila "Czy wszystko w porządku? Jak możemy pomóc?".

---

### Źródła i Literatura
*   *Marketing Science: Customer Retention*
*   *UXcel: Onboarding Best Practices*
*   *Nielsen Norman Group*
