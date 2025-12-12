# Churn Prevention Strategy & Framework

> **Cel:** Zmniejszenie odpływu klientów (Logo Churn & Revenue Churn).
> **Właściciel:** Head of Growth / Product Owner.
> **Powiązana Wiedza:** [Churn Prevention Master Guide](../../../Zasoby/Marketing%20Knowledge%20Base/Retention%20&%20Churn/Churn%20Prevention%20Master%20Guide.md)

---

## 1. Hierarchy of Retention Metrics (Co mierzymy?)

Zanim zaczniesz naprawiać, musisz wiedzieć, gdzie cieknie.

### North Star Retention Metric
*   **Net Revenue Retention (NRR):** Ile przychodu zostaje z kohorty po 12 miesiącach (cel: >100% dla SaaS).

### L1 Metrics (Wskaźniki Operacyjne)
*   **Logo Churn Rate:** % klientów odchodzących miesięcznie.
*   **User Churn:** % użytkowników przestających się logować.
*   **Time-to-First-Value (TTFV):** Czas od rejestracji do "Aha Moment".

### L2 Metrics (Sygnały Ostrzegawcze - Leading Indicators)
*   📉 Spadek liczby logowań w ostatnich 14 dniach.
*   📉 Spadek użycia kluczowej funkcji (Core Feature).
*   📉 Wizyta na stronie "Cennik" lub "Anulowanie subskrypcji".
*   📉 Export danych (często zwiastuje migrację).

---

## 2. Strategia Przeciwdziałania (The Defense Grid)

### Faza 1: Prewencja (Zanim pomyślą o odejściu)
*   **Sticky Features:** Czy produkt wchodzi w nawyk? (Model Haczyka).
*   **Annual Plans:** Przesuwaj klientów na plany roczne (zwykle 50-70% niższy churn).
*   **Dunning Management (Involuntary Churn):**
    *   [ ] Czy wysyłamy maila *przed* wygaśnięciem karty?
    *   [ ] Czy ponawiamy próby płatności (Smart Retries) w dni wypłaty (1-szy, 10-ty)?

### Faza 2: Interwencja (Gdy system wykryje ryzyko)
*   **Trigger:** Spadek aktywności o 50% m/m.
*   **Akcja:** Automatyczny mail "Czy utknąłeś? Oto 3 szablony na start".
*   **Trigger:** Negatywny NPS (0-6).
*   **Akcja:** Alert do Supportu "High Priority Ticket".

### Faza 3: Ratunek (Moment kliknięcia "Anuluj")
*   Patrz: [Offboarding Flows](Offboarding%20Flows.md)

---

## 3. The "Churn Audit" Checklist (Audyt Kwartalny)

Wykonaj ten audyt raz na kwartał, by uszczelnić wiadro.

**Analiza Danych:**
- [ ] Zidentyfikowano główny powód odejść w tym kwartale (np. "Za drogo" czy "Błędy"?).
- [ ] Jaka jest retencja kohorty z [Miesiąca X]? Czy rośnie czy spada?

**Produkt & UX:**
- [ ] Czy onboarding nadal pasuje do aktualnego produktu? (Kiedy był aktualizowany?).
- [ ] Czy puste stany (Empty States) są pomocne czy martwe?

**Komunikacja:**
- [ ] Czy maile reaktywacyjne mają Open Rate > 20%? Jeśli nie - zmień tematy.
- [ ] Czy Dunning Emails (o płatnościach) wyglądają jak spam czy pomocna dłoń?

---

## 4. Eksperymenty Wzrostu (Growth Hacks)
*   **The "Pause" Button:** Dodaj opcję zawieszenia konta na 1-3 miesiące zamiast kasowania.
*   **Concierge Onboarding:** Dla planów PRO - osobiste wdrożenie wideo (Loom).
*   **Usage Reports:** Wysyłaj tygodniowe podsumowania "Ile zyskałeś dzięki nam" (Reinforcement of Value).
