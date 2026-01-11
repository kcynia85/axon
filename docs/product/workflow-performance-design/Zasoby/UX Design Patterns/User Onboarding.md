---
template_type: crew
---

# User Onboarding Patterns

> **Cel:** Płynne wprowadzenie użytkownika do produktu, minimalizacja barier wejścia i budowanie nawyku.

---

## 1. Landing Pages (Strony lądowania)
*   **Cel:** Konwersja (Jeden cel na stronę!).
*   **Zasada 5 sekund:** Użytkownik musi zrozumieć ofertę w 5 sekund.
*   **Elementy:**
    *   Nagłówek (Value Prop).
    *   CTA (Call to Action) - widoczne bez przewijania (Above the fold).
    *   Social Proof (Logotypy, Opinie).
    *   Wizualizacje produktu.
*   **Prędkość:** Każda sekunda ładowania obniża konwersję o ~20%.

## 2. Login & Signup Flows (Rejestracja i Logowanie)
*   **Rozróżnienie:** Wyraźnie oddziel "Zaloguj się" od "Zarejestruj się".
*   **Social Login:** "Kontynuuj z Google/Apple" zwiększa konwersję (mniej haseł do zapamiętania).
*   **Hasła:**
    *   Pokaż wymagania *przed* wysłaniem formularza.
    *   Pozwól podejrzeć hasło (ikona oka).
*   **Magiczny Link:** Logowanie bez hasła (link na email) dla rzadko używanych usług.

## 3. User Onboarding (Wdrożenie)
*   **Progresywne ujawnianie (Progressive Disclosure):** Nie ucz wszystkiego naraz. Pokaż funkcję, gdy jest potrzebna.
*   **Puste stany (Empty States):** Zamiast pustej tabeli, pokaż przykładowe dane i przycisk "Dodaj pierwszy element".
*   **Checklisty:** "Ukończono 2 z 5 kroków" (Efekt Zeigarnik motywuje do domknięcia).
*   **Personalizacja:** Zapytaj o rolę/cel na początku ("Jesteś studentem czy nauczycielem?"), aby dostosować interfejs.
*   **Możliwość pominięcia:** Zawsze dodaj przycisk "Pomiń tutorial".

### 3.1 Scaffolding & Engagement Best Practices

**Etap wdrożenia (Onboarding)**
*   **Wykorzystaj efekt świeżego startu:** Początek korzystania z aplikacji to moment, w którym użytkownicy są najbardziej zmotywowani. Zachęć ich do natychmiastowego działania.
*   **Zastosuj efekt IKEA:** Pozwól użytkownikom na personalizację doświadczenia. Dzięki temu poczują, że zawartość jest specjalnie dla nich przygotowana, co zwiększa ich zaangażowanie.
*   **Ogranicz liczbę opcji (Prawo Hicka):** Nie przytłaczaj użytkownika zbyt wieloma wyborami na raz. Skupienie na jednej, mocno rekomendowanej opcji ułatwia podjęcie decyzji.
*   **Zadbaj o hierarchię wizualną:** Główna, rekomendowana opcja powinna być wyraźnie wyróżniona, aby użytkownik od razu wiedział, co ma zrobić.

**Pierwsze kroki w aplikacji (Scaffolding/Exploring Stage)**
*   **Wyraźne wezwanie do działania (CTA):** Użyj dużego, wyraźnego przycisku (np. "Start"), aby użytkownik wiedział, jaką akcję ma podjąć.
*   **Zachęcaj do przewijania:** Stosuj "ucięte" elementy graficzne, aby zasygnalizować, że poniżej znajduje się więcej treści do odkrycia.
*   **Stopniuj prezentację treści:** Uporządkuj treści od najważniejszych i największych do mniejszych i mniej istotnych, aby nie przytłoczyć użytkownika.
*   **Wykorzystaj ciekawe nagłówki:** Angażujące tytuły i pytania (np. "Pomyśl jeszcze raz", "Dlaczego trzymamy się przekonań?") wzbudzają ciekawość i zachęcają do dalszej interakcji.
*   **Używaj ikon zamiast tekstu:** Ikony mogą wizualnie i szybko przekazać znaczenie, ułatwiając zrozumienie treści.
*   **Stosuj krótkie kursy i deklaracje:** Krótkie, kilkudniowe wyzwania (np. 7-dniowy kurs) są łatwiejsze do podjęcia i ukończenia, co daje użytkownikowi poczucie osiągnięcia celu.

**Pierwsze użycie i zaangażowanie (First Use/Article)**
*   **Proste i jasne instrukcje:** Na początku korzystania z nowej funkcji, w jasny i minimalistyczny sposób wyjaśnij zasady jej działania (np. "dotknij tutaj, aby przejść dalej").
*   **Wzmocnienie (Reinforcement):** Po zakończeniu rozdziału zastosuj prosty quiz z jednym pytaniem, aby zmusić użytkownika do przypomnienia sobie informacji, co ułatwia zapamiętywanie.
*   **Podsumowania i powtórzenia:** Po każdej części materiału przedstawiaj proste podsumowanie, aby utrwalić wiedzę.
*   **Wykorzystaj element "osiągnięcia" (Accomplishment):** Pokazuj postęp (np. "1/1 rozdziału") i aktualną serię (streak), aby motywować do dalszego działania. Im dłuższa seria, tym trudniej ją przerwać.
*   **System opinii (Feedback System):** Daj użytkownikowi możliwość oceny treści, co pozwala na optymalizację aplikacji i daje użytkownikowi poczucie wpływu.
*   **Zapewnij "drogę ucieczki" (Way Out System):** Zawsze dawaj możliwość pominięcia lub zamknięcia danego etapu (np. przycisk "Pomiń podsumowanie" lub "X"), nawet jeśli jest ona mniej widoczna. Dzięki temu użytkownik nie czuje się zmuszony do wykonywania niechcianych czynności.
*   **Kolor jako wyróżnik:** Użyj koloru na ekranie podsumowującym lub końcowym, aby wizualnie zasygnalizować, że jest to ważny moment (np. ukończenie zadania).

## 4. Requesting Permissions (Uprawnienia)
*   **Kontekst:** Nie pytaj o wszystko na starcie.
    *   ❌ Start aplikacji -> "Daj dostęp do lokalizacji".
    *   ✅ Użytkownik klika mapę -> "Aby pokazać trasę, potrzebujemy lokalizacji".
*   **Wyjaśnienie:** Powiedz *dlaczego* tego potrzebujesz (Systemowe okna dialogowe tego nie robią, dodaj własny ekran "Pre-permission").
*   **Jeden po drugim:** Nie bombarduj serią próśb.

---
## Źródła (Grounding)
*   [Landing pages](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Landing%20pages%2066e059eaacca4e0f8b8d076f4ed6e4b2.md)
*   [Login & Signup Flows](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Login%20&%20Signup%20Flows%209e8b1fc19a72449fba6d5e7cbb761d55.md)
*   [User Onboarding](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/User%20Onboarding%2075483002bcee434dae3aa9f70cfde586.md)
*   [Requesting Permissions From Users](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Requesting%20Permissions%20From%20Users%20b07e65c7e6c34435abb184c8b3640d35.md)
