---
template_type: crew
target_workspace: Discovery
---

# Analiza RFM (Standard Operacyjny)

> **Cel:** Segmentacja bazy klientów, aby nie wysyłać tego samego spamu do wszystkich.
> **Wynik:** Plik CSV z przypisanymi segmentami (Champions, Lost, etc.) gotowy do importu do Email Marketingu.

---

## 🛠️ Krok 1: Przygotowanie Danych

Potrzebujesz surowego pliku CSV z historią zamówień.
**Wymagane kolumny:** `Order ID`, `Customer Email/ID`, `Date`, `Total Amount`.

<details>
<summary>🤖 <b>Prompt: Generowanie Skryptu Python (Google Colab)</b></summary>

> "Działasz jako Senior Data Scientist.
> Mam plik CSV z historią transakcji e-commerce.
> Napisz kompletny, odporny na błędy skrypt w Pythonie (dla Google Colab), który:
>
> 1. **Wczyta dane:** Obsłuży różne formaty daty automatycznie.
> 2. **Agregacja RFM:** Dla każdego unikalnego klienta (email/id) obliczy:
>    - **R (Recency):** Dni od ostatniego zakupu.
>    - **F (Frequency):** Liczba unikalnych zamówień.
>    - **M (Monetary):** Suma wydatków (Total Amount).
> 3. **Scoring (Kwantyle):**
>    - Podzieli R, F, M na kwintyle (skala 1-5).
>    - R=5 to najnowszy zakup, F=5 to najczęstsze, M=5 to największe wydatki.
>    - Stworzy kolumnę `RFM_Score` (np. '555').
> 4. **Segmentacja (Precyzyjna):** Przypisz nazwy segmentów wg dokładnych reguł:
>    - **Champions:** R>=4, F>=4, M>=4
>    - **Loyal Customers:** R>=4, F>=4, M=3-4
>    - **Potential Loyalists:** R>=4, F=3-4, M=3-4
>    - **New Customers:** R=5, F=1, M<=2
>    - **Promising:** R=4, F=2-3, M=2-3
>    - **Needs Attention:** R=3, F=2-3, M=2-3
>    - **At Risk:** R<=2, F>=4, M>=4
>    - **VIP (Big Spenders):** R>=3, F>=3, M=5
>    - **Hibernating:** R<=2, F=2-3, M=2-3
>    - **Lost:** R=1, F<=2, M<=2
> 5. **Export:** Zapisze wynik do `rfm_segments.csv`.
> 6. **Wizualizacja:** Wygeneruje prosty wykres słupkowy liczebności segmentów.
>
> Kod ma być gotowy do wklejenia ("Copy & Paste"), zawierać komentarze i obsługę błędów (np. puste wiersze)."

</details>

<details>
<summary>📊 <b>Alternatywa: Excel / Google Sheets (Dla małych danych)</b></summary>

Jeśli nie możesz użyć Pythona, użyj tego promptu, aby wygenerować formuły:

> "Mam dane sprzedażowe w Google Sheets w kolumnach: A (Data), B (Email), C (Kwota).
> Napisz mi instrukcję krok po kroku i formuły, jak stworzyć Tabelę Przestawną (Pivot Table), która:
> 1. Zgrupuje dane po Emailu.
> 2. Obliczy 'Ostatnia Data' (MAX z daty).
> 3. Obliczy 'Liczba Zamówień' (COUNTA).
> 4. Obliczy 'Suma Wydatków' (SUM).
> Następnie podaj formuły IF/IFS, które przypiszą punkty 1-5 dla R, F, M na podstawie kwartyli."

</details>

👉 **[Otwórz Google Colab](https://colab.research.google.com/)** i wklej wygenerowany kod.

---

## 🛡️ Krok 2: Walidacja (Bullshit Detector)

Zanim użyjesz wyników, sprawdź czy algorytm nie zwariował.

- [ ] **Test Sumy:** Czy suma przychodów w pliku wynikowym = suma w pliku źródłowym? (Margines błędu < 1%).
- [ ] **Test Logiki:** Spójrz na segment "Champions". Czy ich `Recency` faktycznie jest niskie (np. < 30 dni)?
- [ ] **Test Ilości:** Czy segment "Lost" nie stanowi 99% bazy? (Jeśli tak, zmień kryteria punktacji).

<details>
<summary>🚑 <b>Co robić, gdy wyniki są dziwne?</b></summary>

Użyj Promptu Naprawczego w oknie chatu z AI:
> "Wyniki wydają się błędne. Segment 'Champions' jest pusty.
> Prawdopodobnie progi kwintyli są zbyt wysokie.
> Zmodyfikuj skrypt tak, aby używał metody 'pd.qcut' z opcją 'duplicates=drop' lub ręcznie zdefiniowanych przedziałów.
> Przeanalizuj rozkład danych przed podziałem."

</details>

---

## 🚀 Krok 3: Egzekucja (Action Plan)

Co robimy z każdym segmentem?

| Segment | Taktyka | Kanał |
| --- | --- | --- |
| **🏆 Champions** | "Dzięki, że jesteś". Dostęp do nowości przed innymi. Program ambasadorski. | Email VIP / SMS |
| **💎 Loyal** | Upselling. "Do Twojego ostatniego zakupu pasuje X". Zwiększanie wartości koszyka. | Email / Remarketing |
| **💤 At Risk** | "Tęsknimy". Mocny rabat (-20%) ważny tylko 48h. | SMS / Push |
| **🌱 New** | Onboarding. Edukacja o marce. Nie sprzedawaj, buduj relację. | Sekwencja Welcome |
| **💀 Lost** | Ignoruj w płatnych reklamach (wyklucz grupę). Ostatnia próba reaktywacji po 6 msc. | Email (Low Cost) |

---

### 📥 Wyniki
*   Podlinkuj plik CSV: __________________________
*   Data analizy: __________________________

---

## 🔬 Advanced: Analiza Etapowa (Granular Control)

Użyj tej sekcji, jeśli potrzebujesz **pełnej kontroli** nad każdym wymiarem z osobna lub wyniki z automatu są niewiarygodne. To podejście "krok po kroku" pozwala zrozumieć strukturę danych przed ich połączeniem.

### Krok 1: Analiza Recency (Świeżość)
> *Kto kupił niedawno?*

<details>
<summary>🤖 <b>Prompt: Recency Analysis</b></summary>

```markdown
**Role:** Data Analyst
**Goal:** Oblicz Recency dla każdego klienta i podziel na 5 segmentów.

**Instrukcja:**
1. Wczytaj plik CSV z transakcjami.
2. Połącz transakcje po `Customer ID`, zachowując datę **najnowszej** transakcji.
3. Oblicz `Recency` (liczba dni od ostatniego zakupu do dzisiaj).
4. Podziel klientów na 5 grup (kwantyle):
   - 5: Najnowsze zakupy (Top 20%)
   - 1: Najstarsze zakupy (Bottom 20%)
5. Wygeneruj wykres histogramu dla rozkładu Recency.
6. Zapisz wynik do `recency_analysis.csv` (Kolumny: Customer ID, Last Date, Recency, R_Score).
```
</details>

### Krok 2: Analiza Frequency (Częstotliwość)
> *Kto wraca najczęściej?*

<details>
<summary>🤖 <b>Prompt: Frequency Analysis</b></summary>

```markdown
**Role:** Data Analyst
**Goal:** Oblicz Frequency i zidentyfikuj lojalnych klientów.

**Instrukcja:**
1. Wczytaj plik CSV.
2. Policz liczbę **unikalnych** transakcji dla każdego `Customer ID`.
3. Uwaga: Jeśli klient ma tylko 1 zakup, automatycznie przypisz F_Score = 1.
4. Pozostałych podziel na kwantyle (2-5).
   - 5: Największa liczba zamówień.
5. Wygeneruj raport: Ilu jest klientów jednorazowych vs powracających?
6. Zapisz wynik do `frequency_analysis.csv`.
```
</details>

### Krok 3: Analiza Monetary (Wartość)
> *Kto zostawia najwięcej pieniędzy?*

<details>
<summary>🤖 <b>Prompt: Monetary Analysis</b></summary>

```markdown
**Role:** Data Analyst
**Goal:** Oblicz Monetary (LTV w danym okresie).

**Instrukcja:**
1. Wczytaj plik CSV.
2. Zsumuj `Total Amount` dla każdego `Customer ID`.
3. Podziel na 5 segmentów wg kwantyli (M_Score 1-5).
   - 5: Najwięksi wydający (Whales).
4. Sprawdź i usuń wartości ujemne (zwroty), chyba że analiza ma je uwzględniać.
5. Zapisz wynik do `monetary_analysis.csv`.
```
</details>

### Krok 4: Synteza RFM (Final Merge)
> *Połączenie wymiarów w jeden wynik.*

<details>
<summary>🤖 <b>Prompt: Merge & Final Segmentation</b></summary>

```markdown
**Role:** Data Architect
**Input:** Trzy pliki CSV (`recency`, `frequency`, `monetary`) ze wspólną kolumną `Customer ID`.

**Instrukcja:**
1. Połącz (merge) trzy pliki w jeden DataFrame.
2. Stwórz kolumnę `RFM_Score` (konkatenacja R, F, M, np. "543").
3. Przypisz segmenty marketingowe wg logiki:
   - **Champions:** R >= 4, F >= 4, M >= 4
   - **Loyal:** R >= 3, F >= 4
   - **New:** R >= 4, F = 1
   - **At Risk:** R <= 2, F >= 3
   - **Lost:** R = 1, F = 1
4. Zapisz finalny plik `RFM_Master_Analysis.csv`.
```
</details>
