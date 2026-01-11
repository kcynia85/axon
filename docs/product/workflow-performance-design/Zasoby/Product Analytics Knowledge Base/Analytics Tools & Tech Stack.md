---
template_type: crew
---

# Analytics Tools & Tech Stack

> **Cel:** Przegląd narzędzi do zbierania, analizy i aktywacji danych.
> **Źródło:** Product Analytics Knowledge Base.

---

## 1. Kolekcja Danych (CDP & Tag Managers)

Zanim przeanalizujesz dane, musisz je zebrać w jednym miejscu.

### Segment (Customer Data Platform)
*   **Rola:** "Router" danych. Wpinasz kod Segment raz, a on wysyła dane do GA4, Mixpanel, Facebook Ads, Email marketingu.
*   **Zaleta:** Czystość danych (Single Source of Truth), łatwa wymiana narzędzi bez angażowania programistów.
*   **Alternatywy:** RudderStack (Open Source).

### Google Tag Manager (GTM)
*   **Rola:** Zarządzanie skryptami na stronie (tags) bez dotykania kodu źródłowego.
*   **Użycie:** Wklejanie Pixela Facebooka, kodu Hotjar, konwersji Google Ads.
*   **Uwaga:** Nie służy do trwałego przechowywania danych, tylko do ich "wstrzykiwania".

---

## 2. Analityka Produktowa (Product Analytics)

Odpowiedź na pytanie: "Co użytkownicy robią w produkcie?".

### Amplitude / Mixpanel
*   **Rola:** Analiza behawioralna (Event-based).
*   **Kluczowe Funkcje:**
    *   **Lejki (Funnels):** Gdzie odpadają?
    *   **Kohorty (Cohorts):** Czy wracają?
    *   **Retencja:** Jak szybko odchodzą?
*   **Różnica vs GA4:** Skupiają się na *użytkowniku* i jego ścieżce, a nie na *sesjach* i źródłach ruchu.

### Google Analytics 4 (GA4)
*   **Rola:** Analityka Marketingowa (Web Analytics).
*   **Siła:** Śledzenie źródeł ruchu (skąd przyszli?), atrybucja, integracja z Google Ads.
*   **Słabość:** Słaba analiza szczegółowych zachowań wewnątrz aplikacji (SaaS).

---

## 3. Analityka Jakościowa (UX & Heatmaps)

Odpowiedź na pytanie: "Dlaczego to robią?".

### Hotjar / Microsoft Clarity
*   **Funkcje:** Mapy cieplne (Heatmaps), nagrania sesji (Session Recordings).
*   **Cel:** Zobaczyć "rage clicks" (klikanie ze złością), błędy w interfejsie, niezrozumiałe elementy.

---

## 4. Magazynowanie i Wizualizacja (Data Warehouse & BI)

Gdy potrzebujesz połączyć dane z różnych źródeł (CRM + Analityka + Finanse).

*   **Hurtownie (Warehouses):** Snowflake, BigQuery. (Tu lądują surowe dane).
*   **Wizualizacja (BI):** Looker Studio, Tableau, PowerBI. (Tu budujesz dashboardy dla zarządu).

---

## 5. Monitoring Techniczny

*   **Sentry / Datadog:** Wykrywanie błędów JS/API, które psują dane (np. event nie wyszedł, bo API padło).

---

### Rekomendowany Stack (Start)
1.  **Google Tag Manager** (do skryptów marketingowych).
2.  **Google Analytics 4** (do ogólnego ruchu i marketingu).
3.  **Mixpanel/Amplitude** (do głębokiej analizy produktu/SaaS) - wersje darmowe są bardzo potężne.
4.  **Hotjar** (do podglądu UX).
