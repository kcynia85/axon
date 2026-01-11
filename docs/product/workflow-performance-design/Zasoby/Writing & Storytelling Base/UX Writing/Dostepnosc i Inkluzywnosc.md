---
template_type: flow
---

# Dostępność i Inkluzywność w UX Writing

## 1. Dostępność (Accessibility / WCAG)
Tekst musi być dostępny dla każdego, niezależnie od sprawności czy sposobu konsumpcji (czytniki ekranu).

### Zasady WCAG dla Pisarzy
*   **Tekst alternatywny (Alt Text):** Opisuj sens obrazka, nie tylko wygląd. Jeśli obrazek jest dekoracyjny -> alt="".
*   **Linki:** Unikaj "Kliknij tutaj". Link musi mówić, dokąd prowadzi.
    *   ❌ "Kliknij tutaj, aby pobrać raport."
    *   ✅ "Pobierz raport roczny (PDF)."
*   **Nagłówki:** Zachowaj hierarchię (H1 -> H2 -> H3). Nie skacz z H1 do H3.
*   **Kontrast i Kolor:** Nie polegaj tylko na kolorze.
    *   ❌ "Kliknij zielony przycisk."
    *   ✅ "Kliknij przycisk 'Zatwierdź'."

### Czytelność (Readability)
*   Używaj prostych słów.
*   Rozwijaj skrótowce przy pierwszym użyciu.
*   Wyrównuj tekst do lewej (nie justuj - justowanie utrudnia czytanie osobom z dysleksją).

---

## 2. Język Inkluzywny
Pisanie tak, by nikogo nie wykluczać i nie obrażać.

### Płeć i Formy Osobowe
*   **Formy bezosobowe:** Często najbezpieczniejsze i najbardziej naturalne w interfejsie.
    *   "Wysłano wiadomość" zamiast "Wysłałeś/Wysłałaś".
    *   "Zapisz zmiany" zamiast "Zapisz swoje zmiany".
*   **Osobatywy:** "Osoba kupująca" zamiast "Kupujący".
*   **Bezpośredni zwrot (Ty):** "Twoje konto", "Witaj". Unika problemu końcówek (zrobiłeś/zrobiłaś).

### Unikanie Protekcjonalizmu (Ableizm, Ageizm)
*   Unikaj słów: "Po prostu", "Tylko", "Oczywiście". Dla użytkownika to może nie być proste.
    *   ❌ "To proste, wystarczy kliknąć..."
    *   ✅ "Kliknij, aby..."
*   Nie używaj metafor związanych z niepełnosprawnością w negatywnym kontekście ("Ślepy zaułek", "Głuchy telefon" - w kontekstach biznesowych).

### Wiek
*   Traktuj starszych użytkowników z szacunkiem, ale bez infantylizacji ("Seniorzy", a nie "Staruszkowie").
*   Unikaj żargonu młodzieżowego, jeśli Twoja grupa jest szeroka.

---

## 3. Etyka i Dark Patterns (Ciemne Wzorce)
Jako UX Writer masz wpływ. Nie używaj go do manipulacji.

### Czego NIE robić:
*   **Confirmshaming:** Wzbudzanie winy przy rezygnacji.
    *   ❌ Przycisk: "Nie, wolę płacić więcej."
    *   ✅ Przycisk: "Nie, dziękuję."
*   **Ukryte koszty:** Jasno komunikuj cenę i warunki przed kliknięciem.
*   **Mylące etykiety:** Nie zamieniaj znaczeń "Anuluj" i "Dalej".
*   **Wymuszona ciągłość:** Utrudnianie anulowania subskrypcji. (Pisz jasno: "Możesz anulować w każdej chwili w Ustawieniach").
