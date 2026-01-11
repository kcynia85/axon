---
template_type: crew
target_workspace: Growth & Market
---

# Retention Experiments Kit

> **Cel:** Zestaw narzędzi i hipotez do testowania strategii utrzymania klienta.
> **Źródło:** Agregacja wiedzy z Raw/Churn-busting (A/B Testing, Mapowanie Ścieżki).
> **Zastosowanie:** Użyj tego przy planowaniu [Sprintu Wzrostu](../../../01.%20Product%20Management/Sprint%20Dashboard.md).

---

## 1. Churn Journey Mapping (Gdzie uciekają?)

Zanim zaczniesz testować, musisz wiedzieć GDZIE testować. Zmapuj "Ścieżkę Śmierci".

### Fazy Ryzyka (The Danger Zones)
1.  **The "Cliff" (Dzień 0-7):**
    *   *Objaw:* Użytkownik rejestruje się, ale nie kończy konfiguracji.
    *   *Hipoteza:* Zbyt trudny onboarding / Brak natychmiastowej wartości.
2.  **The "Dip" (Dzień 30-90):**
    *   *Objaw:* Entuzjazm opada, kończy się "Miesiąc Miodowy".
    *   *Hipoteza:* Brak nawyku / Produkt nie stał się częścią rutyny.
3.  **The "Wall" (Rok 1+):**
    *   *Objaw:* Klient wyrasta z narzędzia lub szuka tańszej opcji.
    *   *Hipoteza:* Brak funkcji "Enterprise" / Zmęczenie materiału.

---

## 2. Biblioteka Hipotez (Co testować?)

Gotowe pomysły na testy A/B w obszarze retencji.

### Obszar: Ceny i Płatności (Pricing)
*   **Hipoteza:** "Zaoferowanie rocznego planu z 20% zniżką w 1. miesiącu zwiększy LTV o 30%."
*   **Test:** Wyświetl modal z ofertą roczną po 3. udanym logowaniu vs Brak modala.
*   **Ryzyko:** Kanibalizacja przychodów miesięcznych.

### Obszar: Komunikacja (Messaging)
*   **Hipoteza:** "Personalizowane maile z podsumowaniem aktywności ('Twój raport') zwiększą DAU (Daily Active Users)."
*   **Test:** Wersja A (Generyczny newsletter) vs Wersja B (Raport "Tyle zaoszczędziłeś").

### Obszar: Onboarding
*   **Hipoteza:** "Dodanie paska postępu (Progress Bar) podczas konfiguracji zwiększy wskaźnik ukończenia o 15%."
*   **Test:** Pasek postępu vs Brak paska.

### Obszar: Offboarding (Save Flow)
*   **Hipoteza:** "Zaoferowanie opcji 'Pauza' zamiast 'Anuluj' uratuje 10% odchodzących."
*   **Test:** Ekran z opcją Pauzy vs Standardowy ekran anulowania.

---

## 3. Zasady Testowania w Retencji

Testowanie na istniejących klientach jest ryzykowne. Możesz ich wkurzyć.

### Checklist Bezpieczeństwa:
*   [ ] **Grupy Kontrolne:** Zawsze trzymaj "Holdout Group" (5-10%), której NIE dotykasz zmianami, by mieć punkt odniesienia.
*   [ ] **Spójność:** Jeśli użytkownik zobaczył niższą cenę w teście A, nie możesz mu jej nagle zabrać w teście B.
*   [ ] **Komunikacja:** Bądź gotów wytłumaczyć supportowi, dlaczego klient X widzi co innego niż klient Y.

---

## 4. Szablon Eksperymentu (Karta Testu)

**Nazwa:** [Np. Test Pauzy w Subskrypcji]
**Cel:** Zmniejszenie Churn Rate o [X]%
**Segment:** Użytkownicy klikający "Anuluj"
**Wariant A (Control):** Standardowy przycisk "Potwierdź anulowanie".
**Wariant B (Variant):** Ekran "Czy chcesz tylko zrobić przerwę? Zachowamy Twoje dane".
**Metryka Sukcesu:** % użytkowników, którzy zostali (nie anulowali finalnie).
**Czas trwania:** [Np. 2 tygodnie]
