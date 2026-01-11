---
template_type: crew
---

# AI Output Validation Protocol (Bullshit Detector)

> **Zasada nr 1:** Ufać, ale sprawdzać. Modele językowe (LLM) nie "liczą" – one "przewidują następny token". W analityce to recepta na katastrofę, jeśli nie masz procedury weryfikacji.

---

## 🛡️ The 5-Step QA Checklist

Zanim wyślesz raport wygenerowany przez AI do klienta lub podejmiesz decyzję biznesową, wykonaj te 5 kroków.

### 1. Test Sumy (The Total Check)
Czy liczby cząstkowe sumują się do całości? LLM często myli się w prostym dodawaniu wierszy.
*   *Check:* Zsumuj ręcznie (lub w Excelu) kolumny z tabeli wygenerowanej przez AI. Czy `Suma Segmentów` == `Całkowita Sprzedaż`?

### 2. Test Rzeczywistości (Sanity Check)
Czy wyniki są fizycznie możliwe?
*   *Check:* Czy `Conversion Rate` wynosi 80%? (Niemożliwe w e-commerce, błąd danych). Czy `Średnia Wartość Zamówienia` to 5 groszy lub 5 milionów?
*   *Action:* Poproś AI: "Czy te wyniki są typowe dla branży fashion? Jeśli nie, wskaż, gdzie może być błąd w danych."

### 3. Weryfikacja Halucynacji (Source Trace)
Czy AI wymyśliło dane, których nie było w pliku?
*   *Przykład:* AI opisuje segment "Młode Matki", ale w Twoim CSV nie ma wieku ani płci, tylko historia zakupów.
*   *Check:* Zapytaj: "Na podstawie której kolumny zidentyfikowałeś ten segment? Pokaż mi 5 przykładowych ID wierszy."

### 4. Test Logiki Biznesowej
Czy wniosek wynika z przesłanki?
*   *Błąd:* "Sprzedaż spadła, więc musimy obniżyć ceny." (A może skończył się towar? Może strona nie działała?).
*   *Action:* Zmuś AI do bycia adwokatem diabła. Prompt: "Podaj 3 alternatywne powody, dla których sprzedaż mogła spaść, niezwiązane z ceną."

### 5. Code Review (Dla analiz w Python/Colab)
Jeśli AI napisało kod do analizy – NIE URUCHAMIAJ GO W CIEMNO.
*   *Check:* Czy kod uwzględnia `NaN` (puste wartości)? Czy poprawnie łączy tabele (`merge` vs `join` – czy nie gubimy wierszy?).

---

## 🚩 Czerwone Flagi (Kiedy odrzucić wynik)

1.  **Idealnie okrągłe liczby:** Jeśli przychód wynosi dokładnie $10,000.00, to jest podejrzane.
2.  **Brak cytowań:** AI podaje fakt, ale nie potrafi wskazać wiersza w pliku źródłowym.
3.  **Zmiana formatu:** W połowie tabeli zmienia się waluta lub format daty.

---

## 🔄 Pętla Korekcyjna (Prompt)

Jeśli wykryjesz błąd, użyj tego schematu naprawczego:

> "Zauważyłem błąd w [Wskaż miejsce].
> Suma w kolumnie X wynosi [Twoja Liczba], a Ty podałeś [Liczba AI].
> Przeanalizuj krok po kroku, dlaczego doszło do błędu w obliczeniach.
> Nie przepraszaj – popraw obliczenia i wygeneruj tabelę ponownie, używając Python Code Interpreter, aby uniknąć błędów arytmetycznych LLMa."