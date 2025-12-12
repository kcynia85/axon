# Data Quality & Governance

> **Cel:** Zapewnienie wiarygodności danych analitycznych. Dane niskiej jakości prowadzą do błędnych decyzji biznesowych.
> **Źródło:** Product Analytics Knowledge Base.

---

## 1. Proces Zapewniania Jakości (QA Process)

Jakość danych mierzymy przez: **dokładność, kompletność, spójność i aktualność**.

### Typowe Problemy
*   **Zduplikowane ID:** Ten sam użytkownik liczony podwójnie.
*   **Impossible Values:** Wiek > 200 lat, Cena < 0 zł.
*   **Future Timestamps:** Zdarzenia z datą w przyszłości (błędy stref czasowych).
*   **Missing Fields:** Brak kluczowych atrybutów (np. `order_id` w `purchase_completed`).

### Narzędzia i Walidacja
*   **Automatyczna Walidacja:** Użyj JSON Schema w kodzie, aby blokować wysyłkę błędnych eventów.
*   **Monitoring:** Alerty w Amplitude/Mixpanel na nagłe spadki (drop to zero) lub skoki (spikes) ilości zdarzeń.
*   **SQL Checks:** Regularne zapytania sprawdzające spójność (np. `SELECT count(*) WHERE price < 0`).

---

## 2. Zasady Nazewnictwa (Taxonomy)

Spójne nazewnictwo to podstawa zrozumienia danych przez cały zespół (Dev, Design, Biznes).

### Złote Zasady
1.  **Format:** `object_action` (Rzeczownik + Czasownik przeszły).
    *   ✅ `button_clicked`, `video_played`, `form_submitted`
    *   ❌ `click`, `User Watched Video`, `Submit`
2.  **Styl:** `snake_case` (małe litery, podkreślniki).
3.  **Język:** Angielski.
4.  **Spójność:** Jeśli używasz `_clicked` dla przycisku, nie używaj `_tapped` dla innego.

---

## 3. Zarządzanie Zgodami (Privacy & Compliance)

Dane użytkowników są chronione prawem (GDPR, CCPA).

### Kluczowe Wymagania
*   **Consent Management:** Musisz uzyskać zgodę *przed* wysłaniem eventów analitycznych/marketingowych.
*   **Right to be Forgotten:** Musisz mieć procedurę usuwania wszystkich danych użytkownika na żądanie (w ciągu 30 dni).
*   **Data Retention:** Nie trzymaj danych w nieskończoność. Ustal okres retencji (np. 14 miesięcy w GA4, 2 lata w bazie).
*   **Minimization:** Zbieraj tylko to, co niezbędne. Nie wysyłaj haseł, PII (Personally Identifiable Information) w property eventów (chyba że zaszyfrowane/hashowane).

---

## 4. Dokumentacja (Tracking Plan)

Analityka bez dokumentacji jest bezużyteczna.

*   **Single Source of Truth:** Jeden dokument (np. [Tracking Plan Template](../../../04.%20Delivery/B.%20Build%20&%20QA/Tracking%20Plan%20Template.md)) opisujący wszystkie zdarzenia.
*   **Definicje:** Każdy event musi mieć opis *kiedy* jest wysyłany (trigger).
    *   *Źle:* `purchase` - "zakup".
    *   *Dobrze:* `purchase_completed` - "Wysłany, gdy użytkownik zobaczy ekran Success Page po udanej płatności".

---

## 5. Kontrola Dostępu (Access Control)

*   **Zasada Najmniejszych Uprawnień:** Junior Marketing nie potrzebuje dostępu do surowych danych SQL z PII.
*   **Role:**
    *   *Admin:* Pełna konfiguracja.
    *   *Analyst:* Tworzenie wykresów, dostęp do danych.
    *   *Viewer:* Tylko podgląd gotowych dashboardów.

---

### Powiązane Zasoby
*   [Analytics Tools & Tech Stack](Analytics%20Tools%20&%20Tech%20Stack.md)
*   [Tracking Plan Template](../../../04.%20Delivery/B.%20Build%20&%20QA/Tracking%20Plan%20Template.md)
