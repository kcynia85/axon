# Metric Hierarchy Framework

> **Cel:** Uporządkowanie chaosu danych. Od wizji (North Star) do codziennych metryk operacyjnych.
> **Źródło:** Agregacja wiedzy z Raw/Product-analytics (Strategy, Revenue, UX Metrics).

---

## 1. Piramida Metryk (The Hierarchy)

Nie mierz wszystkiego. Mierz to, co wpływa na górę piramidy.

### Poziom 1: North Star Metric (NSM)
Jedna metryka, która najlepiej odzwierciedla wartość dostarczaną klientowi.
*   *Przykłady:*
    *   Airbnb: Liczba zarezerwowanych nocy.
    *   Spotify: Czas spędzony na słuchaniu.
    *   E-commerce: GMV (Gross Merchandise Value) lub Liczba dostarczonych zamówień.

### Poziom 2: Business KPIs (Lagging Indicators)
Wyniki finansowe. Mówią "co się stało", ale trudno na nie wpłynąć bezpośrednio tu i teraz.
*   **Revenue:** MRR (Monthly Recurring Revenue), ARR.
*   **Retention:** NRR (Net Revenue Retention), Churn Rate.
*   **Unit Economics:** LTV (Lifetime Value), CAC (Cost of Acquisition).

### Poziom 3: Product Metrics (Leading Indicators)
Wskaźniki, na które masz wpływ *dzisiaj*, a które przewidują przyszły sukces.
*   **Activation:** % użytkowników kończących onboarding.
*   **Engagement:** DAU/MAU, Czas sesji, Liczba wykonanych akcji kluczowych.
*   **Feature Adoption:** % użytkowników używających nowej funkcji X.

### Poziom 4: Input Metrics (Operational)
To, co robisz Ty i Twój zespół.
*   Liczba wysłanych maili.
*   Liczba naprawionych błędów.
*   Czas ładowania strony (Performance).

---

## 2. Frameworki Doboru Metryk (Kiedy co?)

Wybierz model pasujący do Twojego celu.

### A. AARRR (Pirate Metrics)
*Dla kogo:* SaaS, Startupy nastawione na wzrost.
1.  **Acquisition:** Skąd przychodzą? (Traffic, CPC).
2.  **Activation:** Czy poczuli "Aha!"? (Signups, First Action).
3.  **Retention:** Czy wracają? (Churn, DAU).
4.  **Revenue:** Czy płacą? (ARPU, LTV).
5.  **Referral:** Czy polecają? (Viral Coefficient).

### B. HEART (Google)
*Dla kogo:* Produkty skupione na jakości UX i satysfakcji.
1.  **Happiness:** Satysfakcja (NPS, CSAT).
2.  **Engagement:** Zaangażowanie (Liczba wizyt/tydzień).
3.  **Adoption:** Nowi użytkownicy w funkcji.
4.  **Retention:** Powracalność.
5.  **Task Success:** Efektywność (Czas na zadanie, Error Rate).

---

## 3. Słownik Metryk Biznesowych (Revenue Logic)

Kluczowe definicje z Twojej bazy wiedzy.

### SaaS & Subskrypcje
*   **MRR (Monthly Recurring Revenue):** Przychód powtarzalny. Święty Graal SaaS.
*   **NRR (Net Revenue Retention):** % przychodu z tej samej grupy klientów po roku. >100% oznacza, że rośniesz nawet bez nowych klientów (dzięki upsellom).
*   **ARPU (Average Revenue Per User):** Całkowity przychód / Liczba użytkowników.

### E-commerce
*   **AOV (Average Order Value):** Średnia wartość koszyka.
*   **Cart Abandonment Rate:** % koszyków, które nie stały się zamówieniami.
*   **Purchase Frequency:** Jak często ten sam klient kupuje.

---

## 4. Zasady Strategiczne (Rules of Thumb)

1.  **Actionable vs Vanity:**
    *   *Vanity:* Liczba wyświetleń strony, Liczba lajków. (Połechtają ego, nic nie mówią).
    *   *Actionable:* Konwersja z koszyka na płatność. (Mówi Ci: "Masz problem z płatnościami").
2.  **Leading vs Lagging:**
    *   Skup się na *Leading Indicators* (np. liczba logowań w tym tygodniu), bo na *Lagging* (przychód na koniec miesiąca) jest już za późno, by wpłynąć.
3.  **Segmentacja to klucz:**
    *   Średnia kłamie. Zawsze analizuj metryki w segmentach (np. Mobile vs Desktop, Nowi vs Powracający).

---

### Powiązane Narzędzia
*   [Tracking Plan Template](../../../04.%20Delivery/B.%20Build%20&%20QA/Tracking%20Plan%20Template.md) (Wkrótce)
*   [Product Analysis Playbook](../../../Zasoby/Product%20Analytics%20Knowledge%20Base/Product%20Analysis%20Playbook.md) (Wkrótce)
