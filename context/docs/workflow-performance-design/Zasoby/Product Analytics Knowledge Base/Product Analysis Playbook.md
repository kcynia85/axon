# Product Analysis Playbook

> **Cel:** Przewodnik taktyczny dla PM-ów i Analityków. Jak wyciągać wnioski z danych, a nie tylko patrzeć na wykresy.
> **Źródło:** Agregacja wiedzy z Raw/Product-analytics (Funnel, Cohort, Storytelling).

---

## 1. Analiza Lejka (Finding the Leak)

Lejek to nie tylko wykres słupkowy. To mapa frustracji użytkownika.

### Krok 1: Zmapuj Ścieżkę (Happy Path)
Zdefiniuj 4-7 kroków, które *powinien* przejść użytkownik.
*   *Przykład E-commerce:* Product View -> Add to Cart -> Checkout Start -> Payment Info -> Purchase.

### Krok 2: Znajdź "Drop-off Points"
Gdzie tracisz najwięcej ludzi?
*   **Nagły Spadek (>50%):** Problem UX (błąd techniczny, niezrozumiałe copy, wymuszenie logowania).
*   **Powolny Spadek:** Problem motywacji (cena, brak wartości).

### Krok 3: Analiza Czasu (Time to Convert)
Spójrz na medianę czasu między krokami.
*   *Sygnał:* Jeśli przejście z "Checkout Start" do "Payment" trwa 10 minut, a powinno 2 minuty -> Masz skomplikowany formularz lub użytkownik szuka karty/kodu rabatowego.

### Krok 4: Segmentacja (Klucz do sukcesu)
Średnia kłamie. Rozbij lejek na:
*   **Urządzenie:** Mobile vs Desktop (często mobile ma gorszą konwersję przez UX).
*   **Źródło:** Google Ads vs Direct (ruch płatny często gorzej konwertuje).
*   **Typ Użytkownika:** Nowy vs Powracający.

---

## 2. Analiza Kohortowa (The Retention Engine)

Jedyny sposób, by sprawdzić, czy produkt jest "zdrowy".

### Jak czytać Krzywą Retencji?
1.  **The Drop (Dzień 0-1):** Ostra "zjeżdżalnia" w dół. To normalne (40-60% odpada od razu). Jeśli tracisz 90% -> Masz problem z Onboardingiem lub Marketingiem (złe obietnice).
2.  **The Flattening (Stabilizacja):** Czy krzywa staje się płaska (równoległa do osi X)?
    *   ✅ **TAK:** Masz Product-Market Fit. Znalazłeś grupę lojalnych użytkowników.
    *   ❌ **NIE (ciągle spada do zera):** Dziurawe wiadro. Nie skaluj marketingu, napraw produkt.
3.  **The Smile (Uśmiech):** Krzywa zaczyna rosnąć pod koniec (rzadkie). Oznacza powracających "zmartwychwstałych" użytkowników (reaktywacja).

### Kohorty Behawioralne (Magia)
Nie grupuj tylko po czasie (Styczeń vs Luty). Grupuj po zachowaniu.
*   *Pytanie:* "Czy dodanie znajomego zwiększa retencję?"
*   *Analiza:* Porównaj retencję dwóch grup:
    *   Grupa A: Użytkownicy, którzy dodali znajomego w 1. tygodniu.
    *   Grupa B: Użytkownicy, którzy tego nie zrobili.
*   *Wniosek:* Jeśli Grupa A ma 2x wyższą retencję -> "Dodanie znajomego" to Twój "Aha Moment". Skup onboarding na tej akcji.

---

## 3. Analytics Storytelling (Sprzedawanie Wniosków)

Nikt nie lubi tabel w Excelu. Ludzie kupują historie.

### Framework Narracyjny: "What? So What? Now What?"

1.  **What? (Fakty):**
    *   "Współczynnik odrzuceń na stronie koszyka wzrósł z 40% do 60% w ostatnim tygodniu."
2.  **So What? (Kontekst i Wpływ):**
    *   "Stało się to po wdrożeniu nowej bramki płatności w czwartek. Oznacza to stratę ok. 10 tys. PLN dziennie."
3.  **Now What? (Rekomendacja):**
    *   "Rekomenduję natychmiastowy rollback (cofnięcie zmian) i testy nowej bramki na 5% ruchu."

### Zasady Wizualizacji
*   **Zasada 5 Sekund:** Jeśli wykres wymaga legendy i 3 minut tłumaczenia, jest zły.
*   **Jeden wniosek na slajd:** Nie wrzucaj 4 wykresów obok siebie.
*   **Adnotacje:** Strzałka na wykresie z napisem "Start kampanii Black Friday" jest warta więcej niż 1000 słów.

---

## 4. Słownik Pojęć (Cheat Sheet)

*   **Sesja:** Czas od wejścia do wyjścia (zwykle wygasa po 30 min braku aktywności).
*   **Atrybucja:** Komu przypisać zasługę za konwersję? (First Touch = ten co przyprowadził, Last Touch = ten co domknął).
*   **Stickiness (Lepkość):** Stosunek DAU/MAU. Jeśli 50% miesięcznych użytkowników wraca codziennie, produkt jest bardzo "lepki" (jak Facebook).
*   **Churn:** % utraconych klientów/przychodów.
*   **ARPU:** Średni przychód na użytkownika.
