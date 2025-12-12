# Basic Interaction Patterns

> **Cel:** Standardy projektowania podstawowych interakcji użytkownika, minimalizujące tarcie i błędy.

---

## 1. Submitting a Form (Przesyłanie formularza)
*   **Przycisk wysyłania:** Musi być widoczny i jasno opisany.
*   **Stan ładowania:** Po kliknięciu pokaż spinner/loader, aby zapobiec wielokrotnym kliknięciom (Rage Clicks).
*   **Feedback:**
    *   *Sukces:* Wyświetl komunikat lub przekieruj.
    *   *Błąd:* Pokaż jasny komunikat przy błędnym polu (inline validation), nie tylko na górze strony.

## 2. Making a Payment (Płatności)
*   **Walidacja:** Sprawdzaj format karty (Luhn algorithm) w czasie rzeczywistym.
*   **Bezpieczeństwo:** Pokaż ikony kłódek/SSL.
*   **Zapisane metody:** Pozwól łatwo wybrać/usunąć zapamiętaną kartę.
*   **Potwierdzenie:** Jasno pokaż podsumowanie sukcesu i kolejne kroki (np. "E-mail z biletem jest w drodze").

## 3. Contact Support (Kontakt z pomocą)
*   **Metody:** Pokaż hierarchię (FAQ -> Chat -> Telefon -> Email).
*   **Dostępność:** Przycisk pomocy powinien być łatwo dostępny (np. w stopce lub menu).
*   **Oczekiwania:** Podaj szacowany czas odpowiedzi ("Odpisujemy w 5 minut").
*   **Kontekst:** Oferuj pomoc w miejscu błędu (np. przy odrzuconej płatności).

## 4. Deleting Account (Usuwanie konta)
*   **Dostępność:** Link w ustawieniach (nie ukrywaj go - Dark Pattern).
*   **Tarcie (Friction):** Wymagaj potwierdzenia (np. wpisanie hasła lub słowa "USUŃ"), aby uniknąć przypadków.
*   **Alternatywy:** Zaproponuj "Zamrożenie konta" lub "Tylko wyłączenie powiadomień" zamiast usunięcia.
*   **Feedback:** Zapytaj o powód (opcjonalnie), aby ulepszyć produkt.

## 5. Showing Progress (Wskaźniki postępu)
*   **Typy:** Pasek (proste zadania) vs Kroki (złożone, np. Checkout).
*   **Stany:** Ukończone, Aktywne, Oczekujące.
*   **Zapisywanie:** Przy długich procesach informuj o autozapisie ("Twój postęp został zapisany").

## 6. Resetting Password (Reset hasła)
*   **Lokalizacja:** Link "Zapomniałem hasła" zawsze blisko pola hasła przy logowaniu.
*   **Proces:**
    1. Podaj email.
    2. Potwierdzenie wysłania (bez zdradzania, czy konto istnieje - security).
    3. Link w mailu -> Nowe hasło (z widocznymi wymaganiami).
    4. Sukces -> Przekierowanie do logowania.

## 7. Showing Input Error (Błędy w formularzach)
*   **Zapobieganie:** Maski wprowadzania (np. format daty, telefonu), odpowiednia klawiatura na mobile (numeryczna).
*   **Moment walidacji:** Po opuszczeniu pola (onBlur), a nie w trakcie pisania (chyba że to hasło).
*   **Treść błędu:**
    *   ❌ "Błąd danych."
    *   ✅ "Wpisz poprawny adres e-mail (np. jan@domena.pl)."
*   **Naprawa:** Po ponownym kliknięciu w pole, błąd powinien zniknąć (lub zniknąć po poprawieniu).

## 8. Entering a Promo Code (Kody promocyjne)
*   **Widoczność:** Nie eksponuj zbyt mocno pustego pola (powoduje FOMO i szukanie kodów w Google). Użyj linku "Masz kod?", który rozwija pole.
*   **Aplikacja:** Pozwól wkleić kod. Potwierdź sukces (zielony tekst + nowa cena).
*   **Błędy:** Jasno wyjaśnij, dlaczego nie działa ("Kod wygasł", "Tylko dla nowych klientów").

## 9. Saving Changes (Zapisywanie zmian)
*   **Przycisk:** Aktywny dopiero po wprowadzeniu zmiany (aby pokazać, że system wykrył edycję).
*   **Feedback:** Toast/Banner "Zmiany zapisane".
*   **Autosave:** Jeśli stosujesz, informuj o tym ("Zapisano...").
*   **Wyjście:** Ostrzegaj przed wyjściem bez zapisu ("Masz niezapisane zmiany").

## 10. Canceling Subscription (Anulowanie subskrypcji)
*   **Przycisk:** Łatwo dostępny. Ukrywanie go to Dark Pattern ("Roach Motel").
*   **Retencja:** Zaproponuj zniżkę, pauzę lub zmianę planu przed ostatecznym potwierdzeniem.
*   **Potwierdzenie:** Poinformuj, do kiedy usługa będzie aktywna po anulowaniu.

---
## Źródła (Grounding)
*   [Submitting a Form](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Submitting%20a%20Form%20141585629e498091944af64ec80c5af8.md)
*   [Making a Payment](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Making%20a%20Payment%20141585629e4980279655dabbaf534308.md)
*   [Contact Support](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Contact%20Support%20141585629e4980039a25c1764b4578e6.md)
*   [Deleting Account](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Deleting%20Account%20141585629e49805ca507e66b6dd2416c.md)
*   [Showing Progress](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Showing%20Progress%20149585629e498054a314efde55957d98.md)
*   [Resetting Password](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Resetting%20Password%2014a585629e49809887f9f4100910b273.md)
*   [Showing Input Error](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Showing%20Input%20Error%2014b585629e49801fbb34e1fd1dd60ba5.md)
*   [Entering a Promo Code](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Entering%20a%20Promo%20Code%20152585629e49807f817bd64bd38d0364.md)
*   [Saving Changes](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Saving%20Changes%20153585629e4980dfacbcc7252c64e043.md)
*   [Canceling Subscription](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Canceling%20Subscription%20153585629e49807aa470e83a18a5188e.md)
