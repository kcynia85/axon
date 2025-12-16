# Data Stack & Infrastructure (MVP to Scale)

> **Cel:** Dobrać narzędzia adekwatne do skali, budżetu i potrzeb. Nie strzelać z armaty (BigQuery) do wróbla (100 zamówień/mc), ale też nie utonąć w Excelu przy skali.

---

## 🏗️ 1. Poziom MVP / Solopreneur
**Budżet:** 0 - 50 USD / mc
**Cel:** Podstawowy wgląd w to, co się dzieje, bez inżynierii danych.

| Obszar | Narzędzie | Koszt | Komentarz |
| --- | --- | --- | --- |
| **Zbieranie (Tracking)** | **GA4** (Standard) | $0 | Standard rynkowy. Nie kombinuj z alternatywami chyba że musisz (RODO). |
| **Baza Danych** | **Google Sheets** | $0 | Do 5 mln komórek daje radę. Wystarczy do eksportów CSV i prostych tabel przestawnych. |
| **Integracja (ETL)** | **Manual / Make.com** | $0-10 | "Pobierz CSV z Meta Ads -> Wklej do Sheets". Ewentualnie prosty scenariusz w Make (darmowy tier). |
| **Wizualizacja** | **Looker Studio** | $0 | Natywna integracja z GA4 i Sheets. Brzydki, ale działa. |
| **Analiza jakościowa** | **Microsoft Clarity** | $0 | Darmowa alternatywa dla Hotjara. Nagrania sesji i mapy ciepła bez limitów. |

---

## 🚀 2. Poziom SMB / E-commerce Growth
**Budżet:** 200 - 1000 USD / mc
**Cel:** Automatyzacja raportowania, łączenie danych kosztowych (Ads) z przychodowymi (Sklep).

| Obszar | Narzędzie | Koszt | Komentarz |
| --- | --- | --- | --- |
| **Zbieranie** | **GA4 + GTM Server Side** | $0-50 | Lepsza jakość danych, omijanie AdBlocków (częściowe). |
| **Baza Danych** | **BigQuery** (Sandbox/Pay-as-you-go) | $10-50 | Jeśli przekraczasz limity Sheets. Płacisz za przetworzone dane (TB). Tanie przy mądrym query. |
| **Integracja (ETL)** | **Fivetran / Supermetrics** | $$$ | Tu boli. Supermetrics do Sheets/Lookera to standard, ale drogi. Alternatywa: Własne skrypty Python (AppScript). |
| **Wizualizacja** | **Looker Studio Pro / PowerBI** | $$ | Bardziej zaawansowane dashboardy. |

---

## 🧰 Decision Framework: Kiedy zmienić stack?

### Kiedy przejść z Excela na BigQuery?
1.  **Wolumen:** Twoje arkusze otwierają się dłużej niż 10 sekund lub mają >500k wierszy.
2.  **Źródła:** Musisz łączyć dane z 3+ źródeł (np. CRM + Facebook Ads + GA4 + Magazyn) po ID klienta.
3.  **Historia:** Potrzebujesz analizować trendy rok do roku na surowych danych (GA4 trzyma dane user-level krótko, BigQuery wiecznie).

### Kiedy kupić konektor (Supermetrics/Windsor)?
1.  **Czas:** Spędzasz >2h tygodniowo na ręcznym kopiowaniu CSV z Facebook Ads Managera.
2.  **Błędy:** Zdarzyło Ci się podjąć decyzję na podstawie danych z zeszłego tygodnia, bo "nie chciało się aktualizować raportu".

---

## 💡 Pro-Tip: "Bieda-Hurtownia" (Low Code)
Zamiast drogich ETL, użyj **ChatGPT + Python Code Interpreter** do czyszczenia danych ad-hoc.
*   **Input:** Zrzut CSV z Facebooka, Zrzut CSV ze Sklepu.
*   **Prompt:** "Połącz te dwa pliki po dacie. Wylicz ROAS (Przychód ze sklepu / Koszt z FB). Zwróć gotową tabelę do Excela."
*   **Koszt:** $20/mc (Subskrypcja LLM).