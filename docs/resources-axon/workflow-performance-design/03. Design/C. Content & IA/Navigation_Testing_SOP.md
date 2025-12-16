# Navigation Testing SOP (Validation)

> **Cel:** Weryfikacja, czy użytkownicy potrafią znaleźć to, czego szukają, ZANIM napiszemy kod.
> **Metody:** Card Sorting (Generowanie) + Tree Testing (Weryfikacja).

---

## 🃏 Krok 1: Card Sorting (Gdy nie wiesz, jak poukładać)
*Stosuj, gdy masz "wór produktów" i nie wiesz, jak je nazwać/pogrupować.*

1.  **Przygotowanie:** Wypisz 30-50 reprezentatywnych produktów/treści na "karteczkach" (Miro / OptimalWorkshop / Fizyczne kartki).
2.  **Zadanie dla Usera:** "Pogrupuj te elementy tak, jak to dla Ciebie logiczne. Nazwij grupy." (Open Card Sort).
3.  **Analiza:**
    *   Jakie nazwy grup się powtarzają?
    *   Czy "Pomidor" trafił do "Warzywa" czy "Owoce"? (Model mentalny użytkownika).

---

## 🌳 Krok 2: Tree Testing (Gdy masz już strukturę)
*Stosuj, by sprawdzić Twoje zaprojektowane drzewo kategorii.*

**Narzędzie:** [OptimalWorkshop (Treejack)](https://www.optimalworkshop.com/treejack/) lub proste linki w [Figma Prototype].

### Scenariusz Testowy (Szablon)
Nie pytaj: *"Gdzie jest kategoria Zwroty?"* (To sugeruje odpowiedź).
Pytaj: *"Kupiłeś buty, ale są za małe. Chcesz je oddać. Gdzie szukasz informacji?"*

**Lista Zadań (Przykłady):**
1.  **Findability:** "Znajdź blender kielichowy do smoothie."
2.  **Troubleshooting:** "Twoja przesyłka się spóźnia. Sprawdź status."
3.  **Comparison:** "Chcesz sprawdzić, czym różni się wersja PRO od Basic."

### Analiza Wyników (Kluczowe Metryki)

| Metryka | Co oznacza? | Cel |
| --- | --- | --- |
| **Success Rate** | Czy znaleźli dobrą kategorię? | > 80% (Krytyczne > 90%) |
| **Directness** | Czy poszli prosto do celu, czy błądzili? | > 60% |
| **Time on Task** | Jak długo myśleli? | Im mniej, tym lepiej. |
| **First Click** | Gdzie kliknęli pierwszy raz? | To najważniejszy wskaźnik intuicji. |

---

## 🛠️ Krok 3: Optymalizacja (Loop)

Jeśli **First Click** jest błędny w >30% przypadków -> **Zmień Etykietę Głównej Kategorii**.
*   *Sytuacja:* Użytkownicy szukają "Kawy" w "Akcesoria Kuchenne" zamiast "Spożywcze".
*   *Akcja:* Zmień nazwę kategorii na "Kuchnia i Spiżarnia" LUB dodaj "Kawę" jako skrót w "Kuchnia".

<details>
<summary>🤖 <b>Prompt: Analiza Wyników Testu</b></summary>

> "Mam wyniki Tree Testingu.
> Zadanie: 'Znajdź zasady zwrotu towaru'.
> Wynik: 40% weszło w 'Moje Konto', 30% w 'Obsługa Klienta', 30% w 'Stopka > Regulamin'.
> Docelowe miejsce to 'Obsługa Klienta'.
>
> Wnioski? Jak poprawić nawigację, aby więcej osób trafiało do 'Obsługa Klienta'?
> Czy warto dodać skrót w 'Moje Konto'?"
</details>
