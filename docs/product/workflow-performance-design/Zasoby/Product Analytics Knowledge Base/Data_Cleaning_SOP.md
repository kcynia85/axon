---
template_type: flow
---

# Data Preparation & Cleaning Kit (The "Janitor" Protocol)

> **Rzeczywistość:** 80% analityki to sprzątanie brudów w Excelu.
> **Cel:** Skrócić ten czas do 5 minut, wykorzystując LLM jako "Młodszego Specjalistę ds. Danych".

---

## 🧹 1. Procedura "Clean Sweep"

Zanim wrzucisz dane do analizy, musisz je wyczyścić. Surowe dane z systemów reklamowych i CRM są pełne błędów.

### Lista kontrolna (Co sprawdzić?):
*   [ ] **Daty:** Czy wszędzie jest ten sam format? (DD.MM.YYYY vs MM/DD/YYYY).
*   [ ] **Waluty:** Czy liczby są liczbami, czy tekstem? ("1 200 PLN" to tekst, "1200" to liczba).
*   [ ] **Puste pola (Nulls):** Czy brakuje danych? Co wstawić – 0, średnią, czy usunąć wiersz?
*   [ ] **Duplikaty:** Czy to samo zamówienie nie występuje dwa razy (np. po edycji statusu)?
*   [ ] **Wielkość liter:** "Warszawa" i "warszawa" to dla komputera dwa różne miasta.

---

## 🤖 2. Prompty Naprawcze (Gotowce)

Skopiuj te prompty do chatu, gdy masz brudny plik CSV/Excel.

### A. Ujednolicanie Dat i Walut
> "Mam załączony plik CSV. Kolumna 'Date' ma mieszane formaty (niektóre US, niektóre EU). Kolumna 'Revenue' zawiera symbole walut i spacje.
> 1. Ujednolić daty do formatu YYYY-MM-DD (ISO).
> 2. Wyczyść kolumnę 'Revenue' tak, aby była czystą liczbą (float), usuń 'PLN', '$' i spacje.
> 3. Zwróć wyczyszczony plik CSV gotowy do importu."

### B. Deduplikacja (Inteligentna)
> "W załączonym pliku są transakcje. Sprawdź duplikaty w kolumnie 'Order ID'.
> JEŚLI znajdziesz duplikat:
> - Sprawdź kolumnę 'Status'. Zostaw ten wiersz, gdzie status to 'Completed' lub 'Paid'. Usuń te ze statusem 'Pending' lub 'Failed', jeśli mają to samo ID.
> - Jeśli statusy są takie same, zostaw ten z późniejszą godziną (Timestamp).
> Zwróć raport: ile duplikatów usunięto i dlaczego."

### C. Kategoryzacja "Messy Text" (NLP)
> "W kolumnie 'Feedback' mam luźne opinie klientów.
> Stwórz nową kolumnę 'Category'. Przypisz każdą opinię do jednej z kategorii: [Dostawa, Jakość Produktu, Obsługa, Cena, Inne].
> Jeśli opinia jest niejasna, wpisz 'N/A'.
> Zwróć plik z dodaną kolumną."

---

## 🐍 3. Biblioteka Snippetów (Python/Pandas)

Jeśli pracujesz w Colab, użyj tych one-linerów.

```python
# 1. Wczytanie z ignorowaniem błędów w liniach
df = pd.read_csv('data.csv', on_bad_lines='skip')

# 2. Szybka konwersja daty (automatyczne wykrywanie formatu)
df['date'] = pd.to_datetime(df['date'], infer_datetime_format=True)

# 3. Czyszczenie waluty (Regex: zostaw tylko cyfry i kropkę)
df['price'] = df['price'].astype(str).str.replace(r'[^\d.]', '', regex=True).astype(float)

# 4. Usunięcie duplikatów (zostaw ostatni)
df = df.drop_duplicates(subset=['order_id'], keep='last')

# 5. Raport brakujących danych (gdzie są dziury?)
print(df.isnull().sum())
```