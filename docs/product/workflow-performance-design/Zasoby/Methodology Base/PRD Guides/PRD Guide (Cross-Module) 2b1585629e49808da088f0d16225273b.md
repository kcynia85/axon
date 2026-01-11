---
template_type: crew
description: "Z modułami: Marketing, UX Writing, UX/UI, Coding, Sale Enablement"
---

# PRD Guide (Cross-Module)

Z modułami: Marketing, UX Writing, UX/UI, Coding, Sale Enablement

---

## **1. Wizja produktu i cele biznesowe**

<aside>

### **Na tym fundamencie zbudujesz cały PRD.**

To sekcja odpowiadająca na pytania strategiczne:

- Dlaczego produkt powstaje?
- Jaki problem rozwiązuje?
- Jak ma wpływać na biznes?

### Najczęstsze realne przykłady

- **SaaS:** zwiększyć aktywację trialu → stworzenie inteligentnego onboardingu.
- **E-commerce:** zwiększyć konwersję koszyka → wdrożyć płatności jednoklikowe.
- **Marketplace:** skrócić czas reakcji sprzedawców → wprowadzić automatyczne odpowiedzi AI.
- **Aplikacja mobilna:** zwiększyć powracalność → stworzyć system rekomendacji.

### Przykład do PRD

„Chcemy zmniejszyć liczbę porzuconych koszyków o 15% w Q4 dzięki wdrożeniu płatności mobilnych Apple/Google Pay.”

</aside>

## **2. Badania użytkowników i insighty**

<aside>

### **PRD bez badań to opinie, a nie produkt.**

Tu umieszczasz wiedzę o użytkownikach:

- wyniki wywiadów,
- dane ilościowe (np. konwersja w lejku),
- potrzeby i motywacje,
- problemy, które występują najczęściej,
- obserwacje behavior analytics (Hotjar, Mixpanel),
- feedback supportu i działu sprzedaży.

### Najczęstsze realne przykłady

- Użytkownicy nie kończą onboardingu, bo nie rozumieją, po co podawać dane karty kredytowej.
- Klienci B2B zgłaszają, że raporty są za mało elastyczne.
- Użytkownicy nie wiedzą, gdzie znaleźć faktury, bo sekcja Billing jest ukryta.
- Klienci e-commerce chcą filtrować po czasie dostawy, a nie tylko po cenie.

### Przykład do PRD

„58% użytkowników mobilnych rezygnuje na kroku ‘Adres dostawy’, ponieważ formularz zawiera 7 pól i ładuje się z opóźnieniem.”

</aside>

## **3. Business logic + constraints**

To sekcja, która chroni przed tworzeniem rzeczy *niemożliwych* lub *bezsensownie drogich*.

<aside>

### Zawiera

- Ograniczenia technologiczne (np. stary backend, brak API),
- Ograniczenia prawne (RODO, branże regulowane),
- Ograniczenia budżetowe lub czasowe,
- Zależności z innymi zespołami,
- Wymagania bezpieczeństwa.

### Najczęstsze realne przykłady

- Integracja z bankami wymaga certyfikacji bezpieczeństwa → timeline +8 tygodni.
- Backend nie obsługuje paginacji → trzeba przebudować endpoint.
- Marketing wymaga zgodności z polityką trademarków.
- Zespół AI ma priorytet inny projekt → dostępność dopiero od następnego sprintu.

### Przykład do PRD

„Moduł rekomendacji nie może wykorzystywać identyfikatorów osobowych (PII), co oznacza personalizację wyłącznie na danych agregowanych.”

</aside>

## **4. UX: user flow, journey, scenariusze**

Opisujesz tu **dokładnie, krok po kroku**, jak użytkownik przechodzi przez funkcję.

<aside>

### Co obejmuje

- Główny user flow,
- Alternatywne ścieżki,
- Scenariusze błędów i edge cases,
- Logikę widoków,
- Podstawowe szkice.

### Najczęstsze realne przykłady

- Dodawanie karty płatniczej, ale użytkownik przerwie proces → system zapisuje stan i przypomina.
- Rejestracja przez Google, ale konto już istnieje → pokazujesz opcję połączenia kont.
- Użytkownik dodaje produkt bez zdjęcia → system generuje placeholder.

### Przykład do PRD

„Jeśli użytkownik kliknie ‘Generuj plan posiłków’, a nie uzupełnił profilu dietetycznego → wyświetlamy modal z 3 krokami konfiguracji.”

</aside>

## **5. Moduł marketingu, contentu i UX writingu**

PRD musi uwzględniać elementy komunikacji i contentu, które wpływają na konwersję.

<aside>

### Co powinno się tu znaleźć

- Kluczowy przekaz (messaging),
- Korzyści, które trzeba wyeksponować,
- Microcopy interfejsu (CTA, tooltipy),
- Sekcje do landing page'a,
- Content niezbędny do funkcjonalności (np. e-maile, push notyfikacje).

### Najczęstsze realne przykłady

- Copy CTA ma ogromny wpływ na aktywację:
    
    „Zacznij za darmo” →  „Wygeneruj swój pierwszy plan”
    
- Strona feature’a wymaga storytellingu wartości.
- Push notyfikacja musi aktywować w odpowiednim momencie.

### Przykład do PRD

„CTA: ‘Zbuduj plan w 30 sekund’ → 12% wyższa konwersja w testach A/B niż ‘Rozpocznij’.”

</aside>

## **6. Moduł sprzedaży (Sales Enablement)**

Ta sekcja jest kluczowa w projektach B2B, SaaS i produktach z długim lejkiem sprzedażowym.

<aside>

### Co obejmuje:

- materiały dla zespołu sprzedaży,
- przewodniki dla demo calli,
- argumenty wartości (value drivers),
- pricing logic,
- wymagania integracyjne dla klientów biznesowych,
- proces trial → paid.

### Najczęstsze realne przykłady:

- Sales potrzebuje **PDF porównania planów** (Basic vs Pro vs Enterprise).
- Klienci Enterprise wymagają **SSO + SLA**.
- Pitch deck musi uwzględniać **ROI w czasie 90 dni**.
- Potrzebne jest **API do integracji z CRM klienta**.

### Przykład do PRD:

„Sales Enablement: konieczne stworzenie 3 materiałów – FAQ dla klientów, arkusz ROI, demo script dla cold inboundów.”

</aside>

## **7. Dane i metryki sukcesu**

To sekcja definiująca, *kiedy projekt jest naprawdę udany*.

<aside>

### Co obejmuje:

- metryki ilościowe (KPI),
- metryki jakościowe,
- definicję „done right”.

### Najczęstsze realne KPI:

- aktywacja konta wzrasta z 40% do 60%,
- liczba błędów onboardingowych spada o 30%,
- konwersja trial → płatne staje się > 12%,
- średnia wartość koszyka rośnie o 7%,
- czas wykonania zadania spada z 8 min do 3 min.

### Przykład do PRD:

„Funkcja uznana za skuteczną, jeśli 25% użytkowników wykona pierwszy przepis w ciągu 48 h od instalacji.”

</aside>

## **8. Backlog wysokopoziomowy**

Tu definiujesz *z czego składa się funkcja* oraz *dlaczego jest potrzebna*.

<aside>

### Co obejmuje:

- listę funkcji,
- priorytety,
- zależności,
- wartość każdej funkcji.

### Najczęstsze realne przykłady:

- F1: Formularz profilu dietetycznego
- F2: Generator posiłków
- F3: Lista zakupów
- F4: Integracja z Google Fit
- F5: Email onboarding

### Przykład do PRD:

„F2 – Generator posiłków (wartość: wysoka) – kluczowa funkcja USP, 70% powodu instalacji.”

</aside>

## **9. Benchmarki i inspiracje**

<aside>

### Pokazujesz przykłady z rynku

- jak robią to inni,
- jakie rozwiązania są już standardem,
- jakich błędów unikać.

### Najczęstsze realne inspiracje:

- Duolingo – onboarding gamification,
- Revolut – instant feedback i trust cues,
- Notion – prostota architektury contentu,
- Uber Eats – czytelna lista zakupów i ETA,
- Spotify – personalizacja i rekomendacje.

### Przykład do PRD:

„Inspiracja: Struktura rekomendacji jak w Spotify Home – 3 główne karuzele oparte o preferencje.”

</aside>

# ✔️ **Podsumowanie w jednym zdaniu**

<aside>

PRD powstaje na bazie: wizji, badań, ograniczeń, user flow, contentu, wymagań sprzedaży, KPI i wysokopoziomowego backlogu – i dopiero wtedy staje się realnym przewodnikiem dla całego zespołu produktowego.

</aside>