# Churn Prediction & Predictive Analytics

> **Cel:** Wykorzystanie danych i AI do przewidywania odejścia klienta *zanim* to nastąpi.
> **Źródło:** Agregacja wiedzy z Raw/Churn-busting (Predykcja, ML, Early Warning).
> **Kontekst:** Część strategii [AI & Business Integration](../Strategia%20i%20Modele/Strategia%20i%20Poziomy%20Dojrzalosci.md).

---

## 1. Early Warning System (EWS) - Podejście bez AI

Zanim wdrożysz Machine Learning, zbuduj system oparty na regułach (Heurystyki). Działa szybciej i jest tańszy.

### Kluczowe Sygnały Ostrzegawcze (Red Flags)
Monitoruj te zdarzenia w czasie rzeczywistym:
1.  **Spadek Aktywności:** Użytkownik nie logował się przez X dni (gdzie X = średnia częstotliwość dla jego segmentu + 50%).
2.  **Support Spikes:** Nagły wzrost liczby zgłoszeń (frustracja) LUB brak zgłoszeń po długim okresie problemów (rezygnacja).
3.  **Payment Failures:** Odrzucona karta płatnicza (często pierwszy krok do involuntary churn).
4.  **Export Danych:** Użytkownik pobiera wszystkie swoje dane (często sygnał migracji do konkurencji).
5.  **Zmiana Decydenta:** (W B2B) Twój "Champion" opuszcza firmę klienta.

### Health Score (Model Punktowy)
Stwórz jeden wskaźnik zdrowia klienta (0-100).

**Wzór (Przykład):**
`Health Score = (Waga * Usage) + (Waga * Engagement) + (Waga * Sentiment)`

*   **Usage (40%):** Częstotliwość logowań, użycie kluczowych funkcji.
*   **Engagement (30%):** Udział w webinarach, otwieranie maili.
*   **Sentiment (30%):** Ostatni NPS, ton rozmów z supportem.

**Akcje na podstawie wyniku:**
*   🟢 **80-100 (Zdrowy):** Próba Upsellingu / Prośba o polecenie.
*   🟡 **50-79 (Zagrożony):** Zautomatyzowana kampania edukacyjna.
*   🔴 **0-49 (Krytyczny):** Alert do Customer Success Managera (telefon w 24h).

---

## 2. Machine Learning w Predykcji Churnu

Gdy masz dużo danych (>1000 klientów, >1 rok historii), ML wykryje wzorce niewidoczne dla człowieka.

### Proces Budowy Modelu
1.  **Przygotowanie Danych (Data Prep):**
    *   *Czyszczenie:* Usuń duplikaty, uzupełnij braki.
    *   *Balansowanie:* Jeśli churn to tylko 5% bazy, model może go ignorować. Użyj technik oversampling/undersampling.
2.  **Inżynieria Cech (Feature Engineering):**
    *   Co karmić model?
        *   `days_since_last_login`
        *   `avg_session_duration_change` (zmiana w % m/m)
        *   `tickets_opened_last_30_days`
        *   `invoice_amount_trend`
3.  **Wybór Algorytmu:**
    *   **Drzewa Decyzyjne (Decision Trees):** Dobre, bo łatwo wytłumaczyć wynik ("Odszedł, bo X").
    *   **Lasy Losowe (Random Forest):** Wyższa dokładność, trudniejsza interpretacja.
    *   **Regresja Logistyczna:** Prosta, podaje prawdopodobieństwo (0-1).

### Predykcja w Czasie Rzeczywistym (Real-Time)
*   Integruj model z CRM.
*   Gdy prawdopodobieństwo churnu skoczy > 70% -> Trigger: Wyślij kod rabatowy lub alert do handlowca.

---

## 3. Segmentacja Ryzyka (Risk Tiers)

Nie traktuj każdego "zagrożonego" tak samo.

| Poziom Ryzyka | Charakterystyka | Strategia Interwencji |
| :--- | :--- | :--- |
| **High Risk** | Krytyczne sygnały (np. rezygnacja z subskrypcji, hejt w social media). | **Interwencja ludzka:** Telefon, osobisty email od Head of CS. |
| **Medium Risk** | Spadek użycia, opóźnione płatności. | **Automatyzacja:** Kampania "Tęsknimy", oferta szkolenia. |
| **Low Risk** | Stabilne użycie, ale brak wzrostu (stagnacja). | **Edukacja:** Newsletter z nowościami, Case Studies. |

---

## 4. Etyka w Predykcji (AI Ethics)
*   **Transparentność:** Czy klient wie, że analizujesz jego zachowanie? (Polityka Prywatności).
*   **Fairness:** Czy model nie dyskryminuje np. klientów z określonych regionów?
*   **Interwencja:** Nie bądź "creepy". Nie pisz: "Widzimy, że nie logowałeś się wczoraj o 14:00". Pisz: "Zauważyliśmy, że ostatnio rzadziej nas odwiedzasz".
