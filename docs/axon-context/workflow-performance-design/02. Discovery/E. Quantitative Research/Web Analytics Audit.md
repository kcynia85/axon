# Web Analytics Audit (Protocol: One-Man Army)

> **Cel:** Szybka diagnoza zdrowia produktu w 30 minut.
> **Output:** Lista 3-5 "Quick Wins" do wdrożenia natychmiast.
> **Narzędzia:** GA4, Hotjar/Clarity.

---

## 🧹 Faza 0: Higiena Danych (CRITICAL)

Zanim zaczniesz analizę, upewnij się, że nie analizujesz śmieci.

<details>
<summary>🔻 <b>Kliknij, aby pobrać Prompt Czyszczący (Janitor Protocol)</b></summary>

**Instrukcja:** Wklej ten prompt do AI wraz z surowym plikiem CSV z GA4/sklepu.

> "Mam załączony plik CSV. Wykonaj czyszczenie przed analizą:
> 1. **Daty:** Ujednolić do formatu YYYY-MM-DD (ISO).
> 2. **Waluty:** Usuń symbole walut i spacje, przekonwertuj na czysty float (liczby).
> 3. **Nulls:** Jeśli brakuje danych w kluczowych kolumnach (Przychód, Sesje), usuń te wiersze i zgłoś to.
> 4. **Duplikaty:** Usuń duplikaty po ID transakcji/sesji.
> Zwróć wyczyszczony plik CSV do pobrania."

</details>

---

## 📊 Faza 1: Liczby (Google Analytics 4)

### A. 🚦 Traffic Analysis (Gdzie przepalam budżet?)
*Cel: Wycięcie nierentownych źródeł i skalowanie tych dochodowych.*

- [ ] **Sprawdź Raport:** *Pozyskanie -> Pozyskiwanie ruchu*.
- [ ] **Filtr:** Wyklucz źródła z `< 50` sesji (szum statystyczny).
- [ ] **AI Analysis:** Wykonaj poniższy prompt na danych.

<details>
<summary>🤖 <b>Prompt: Analiza Źródeł Ruchu</b></summary>

> "Przeanalizuj załączone dane (Sesje, Konwersje, Przychody).
> 1. **Winners:** Które źródło ma najwyższe ROI/ROAS? (Zalecenie: Skaluj).
> 2. **Losers:** Które źródło ma dużo sesji, ale znikome konwersje? (Zalecenie: Tnij/Napraw).
> 3. **Engagement:** Gdzie jest najwyższy Bounce Rate/najniższy czas na stronie?
> Wynik przedstaw w tabeli: [Źródło | Problem/Szansa | Rekomendowana Akcja]."

</details>

*   **Znalezisko:** _______________________________________________________

### B. 📉 Funnel & Product (Gdzie uciekają pieniądze?)
*Cel: Znalezienie dziurawego wiadra.*

- [ ] **Sprawdź Raport:** *Monetyzacja -> Skuteczność produktu*.
- [ ] **Weryfikacja Lejka:** Sprawdź drop-off rate: `View` -> `Add to Cart` -> `Purchase`.
- [ ] **AI Analysis:** Wykonaj prompt produktowy.

<details>
<summary>🤖 <b>Prompt: Analiza Produktowa (Winners & Losers)</b></summary>

> "Jesteś Analitykiem E-commerce. Na podstawie pliku:
> 1. **Gwiazdy (Do Promocji):** Produkty z wysokim współczynnikiem 'View-to-Purchase' (>2%) i wysoką marżą.
> 2. **Zombi (Do Usunięcia):** Produkty z dużą liczbą wyświetleń, ale zerową sprzedażą (marnują ruch).
> 3. **Wnioski:** Dlaczego 'Zombi' nie sprzedają? (Cena? Opis?). Zaproponuj hipotezy."

</details>

*   **Znalezisko:** _______________________________________________________

---

## 👁️ Faza 2: Oczy (Hotjar / Clarity)

### A. 🔥 Heatmaps (Czy oni to widzą?)
- [ ] **Scroll Map:** Czy 50% użytkowników dociera do sekcji "Call to Action" / "Dlaczego my"?
    - *Jeśli NIE:* Przesuń kluczowe treści wyżej.
- [ ] **Click Map:** Czy są "Rage Clicks" (nerwowe klikanie) na elementach nieklikalnych?
    - *Jeśli TAK:* Zmień design elementu lub podlinkuj go.

### B. 🎥 Recordings (Dlaczego wychodzą?)
*Zadanie: Obejrzyj dokładnie 5 nagrań z "Porzuconego Koszyka".*

- [ ] **Sesja 1:** Przyczyna wyjścia? ___________________
- [ ] **Sesja 2:** Przyczyna wyjścia? ___________________
- [ ] **Sesja 3:** Przyczyna wyjścia? ___________________
- [ ] **Sesja 4:** Przyczyna wyjścia? ___________________
- [ ] **Sesja 5:** Przyczyna wyjścia? ___________________

---

## 📝 Faza 3: Raport (Action Plan)

Wypisz 3 najważniejsze wnioski i przypisz im właściciela.

| Priorytet | Problem (Co nie działa?) | Rozwiązanie (Co zrobimy?) | Kto? |
| :---: | --- | --- | :---: |
| 🔴 High | Np. Walidacja kodu pocztowego nie działa na iPhone | Fix w kodzie JS | Dev |
| 🟡 Med | Np. Nikt nie scrolluje do sekcji "Opinie" | Przeniesienie opinii pod przycisk "Kup" | Design |
| 🟢 Low | Np. Słaby opis produktu X | Rewrite opisu językiem korzyści | Copy |