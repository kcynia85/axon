---
template_type: crew
target_workspace: Discovery
---

# Assumption Testing Framework

> **Cel:** Szybka weryfikacja pomysłów *zanim* napiszemy linijkę kodu.
> **Źródło:** Agregacja wiedzy z Raw/Product-discovery (Teresa Torres, Lean UX).
> **Zasada:** "Największym marnotrawstwem jest budowanie czegoś, czego nikt nie chce."

---

## 1. Filozofia: Testuj Założenia, nie Pomysły

Każdy "świetny pomysł" to tak naprawdę zbiór ryzykownych założeń. Zanim zbudujesz MVP (co zajmuje tygodnie), rozbij pomysł na części pierwsze i przetestuj najsłabsze ogniwo (co zajmuje dni).

### 5 Typów Ryzyka (The 5 Lenses)
1.  **Desirability (Pożądalność):** Czy oni tego chcą? (Najczęstsza przyczyna porażek).
2.  **Viability (Opłacalność):** Czy to nam się opłaca? (Model biznesowy).
3.  **Feasibility (Wykonalność):** Czy umiemy to zbudować? (Technologia).
4.  **Usability (Użyteczność):** Czy umieją z tego korzystać? (UX/UI).
5.  **Ethics (Etyka):** Czy powinniśmy to robić? (Szkoda społeczna).

---

## 2. Assumption Mapping (Co testować?)

Nie testuj wszystkiego. Testuj to, co może zabić Twój projekt.

Użyj macierzy 2x2:
*   **Oś X:** Dowody (Mam twarde dane vs Zgaduję).
*   **Oś Y:** Ważność (Krytyczne dla sukcesu vs Miłe by mieć).

| Kategoria | Akcja |
| :--- | :--- |
| **High Importance + Low Evidence** | 🚨 **TESTUJ NATYCHMIAST!** (To jest Twoje "Leap of Faith"). |
| **High Importance + High Evidence** | Buduj / Planuj (Masz pewność). |
| **Low Importance** | Ignoruj / Odłóż na później. |

---

## 3. Biblioteka Metod (Jak testować?)

Dobierz metodę do typu ryzyka.

### A. Testy Pożądalności (Desirability)
*   **Fake Door (Painted Door):** Dodaj przycisk "Nowa Funkcja" w produkcie. Po kliknięciu pokaż komunikat "Już nad tym pracujemy! Zapisz się na listę".
    *   *Metryka:* % kliknięć (CTR).
*   **Smoke Test (Landing Page):** Postaw prostą stronę z ofertą (zanim masz produkt). Zbieraj maile.
    *   *Metryka:* Konwersja na zapis (>10% = dobrze).
*   **Concierge MVP:** Wykonaj usługę ręcznie dla 5 klientów (zamiast pisać algorytm AI).

### B. Testy Użyteczności (Usability)
*   **Prototyp Figma:** Klikalna makieta. Daj użytkownikowi zadanie: "Znajdź fakturę".
*   **5-Second Test:** Pokaż ekran na 5 sekund. Zapytaj: "Do czego to służy?".

### C. Testy Opłacalności (Viability)
*   **Pre-order / Dry Wallet:** Poproś o podanie karty kredytowej *przed* zbudowaniem (nawet jeśli nie obciążysz). To ostateczny dowód.

---

## 4. Karta Eksperymentu (Experiment Card)

Wypełnij przed każdym testem, żeby uniknąć "naginania wyników" (Confirmation Bias).

1.  **Założenie (We believe that...):**
    *   *Np.* "Wierzymy, że użytkownicy chcą importować dane z Excela, zamiast wpisywać ręcznie."
2.  **Weryfikacja (To verify that, we will...):**
    *   *Np.* "Dodamy fałszywy przycisk 'Import CSV' w panelu."
3.  **Metryka (And measure...):**
    *   *Np.* "% użytkowników, którzy klikną w przycisk w ciągu 3 dni."
4.  **Kryterium Sukcesu (We are right if...):**
    *   *Np.* "Jeśli kliknie > 15% aktywnych użytkowników."

---

### Powiązane Narzędzia
*   [Opportunities Solutions Tree](../../../03.%20Design/A.%20Ideation/Opportunities%20Solutions%20Tree.md) (Gdzie mapujemy wyniki)
*   [Continuous Discovery Protocol](../D.%20Qualitative%20Research/Continuous%20Discovery%20Protocol.md) (Kiedy to robić)
