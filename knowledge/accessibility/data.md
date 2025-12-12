# 📊 Data & Tables

Tabele i listy to podstawowe narzędzia do porządkowania informacji. Ich dostępność jest kluczowa dla użytkowników korzystających z czytników ekranu, którzy polegają na programowej strukturze tych elementów, aby zrozumieć relacje między danymi.

## Tables (Tabele)

Tabele służą wyłącznie do prezentacji danych tabelarycznych (z nagłówkami wierszy/kolumn). **Nigdy** nie używaj tabel do celów layoutowych (układu strony) – do tego służy CSS (Grid/Flexbox).

### Struktura i Semantyka
- **Element `<table>`:** Używaj tylko do danych. Umożliwia to czytnikom ekranu nawigację po komórkach (skróty klawiszowe).
- **Nagłówek tabeli (`<caption>`):** Każda tabela danych powinna mieć tytuł zdefiniowany znacznikiem `<caption>` (umieszczonym zaraz po `<table>`). Pomaga to użytkownikom szybko zidentyfikować zawartość tabeli bez konieczności jej czytania. Dla bardzo złożonych tabel warto dodać tekstowe podsumowanie struktury.
- **Nagłówki kolumn/wierszy (`<th>`):**
  - Używaj `<th>` dla nagłówków, a `<td>` dla danych.
  - **Scope:** Zawsze określaj kierunek nagłówka atrybutem `scope="col"` (dla kolumn) lub `scope="row"` (dla wierszy). Pozwala to czytnikowi przypomnieć nagłówek podczas czytania komórki (np. "Cena: 100 zł").
  - **Brak pustych nagłówków:** Wszystkie nagłówki muszą być wypełnione (nawet lewy górny róg). Jeśli komórka nie ma danych, wpisz "0", "NA", "Brak" lub "puste", aby użytkownik wiedział, że to nie błąd.

### Prostota i Wygląd
- **Proste Tabele:** Unikaj złożonych struktur, zagnieżdżania tabel oraz scalania komórek (`rowspan`, `colspan`), jeśli to możliwe. Złożone tabele są trudne do interpretacji dla technologii asystujących. Jeśli musisz scalić komórki, upewnij się, że dane pozostają czytelne logicznie.
- **Szerokość:** Używaj wartości procentowych (%) dla szerokości kolumn zamiast sztywnych pikseli. Pozwala to przeglądarce dostosować tabelę do ekranu i uniknąć poziomego przewijania.
- **Wysokość:** Nie ustawiaj sztywnej wysokości komórek. Pozwól im rosnąć, aby pomieścić tekst (ważne przy powiększaniu czcionki).

## Lists (Listy)

Listy oferują lepszą semantykę i łatwiejszą nawigację niż tabele dla prostych zbiorów danych. Czytniki ekranu informują o typie listy i liczbie elementów (np. "Lista, 5 elementów").

### Wybór Typu Listy
Dobierz odpowiedni znacznik HTML do rodzaju danych:

1.  **Listy nieuporządkowane (`<ul>` + `<li>`):**
    *   Używaj, gdy kolejność elementów nie ma znaczenia (np. lista zakupów, cechy produktu, menu nawigacyjne).
    *   Elementy są oznaczane punktorami.

2.  **Listy uporządkowane (`<ol>` + `<li>`):**
    *   Używaj, gdy sekwencja jest istotna (np. instrukcje krok po kroku, rankingi, przepisy).
    *   Przeglądarka automatycznie numeruje elementy. Możesz sterować numeracją atrybutami `type` (rodzaj licznika) czy `reversed` (odliczanie w dół), zachowując semantykę.

3.  **Listy opisowe (`<dl>` + `<dt>` + `<dd>`):**
    *   Służą do prezentacji par klucz-wartość (termin i definicja).
    *   `dt` (Definition Term): Termin definiowany.
    *   `dd` (Definition Description): Opis/definicja terminu.
    *   Idealne do słowników, sekcji FAQ lub list parametrów technicznych.