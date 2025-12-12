# 📝 Forms

Formularze są kluczowym elementem interakcji, ale często stanowią barierę dostępności. Muszą być czytelne, przewidywalne i łatwe w obsłudze zarówno myszką, jak i klawiaturą.

## Layout & Structure

### Układ Jednokolumnowy (Single-Column)
- **Zasada:** Stosuj układ jednokolumnowy dla pól formularza. Ułatwia to skanowanie wzrokiem i nawigację (naturalny przepływ w dół).
- **Wyjątki:** Krótkie, powiązane pola (np. Miasto + Kod pocztowy) mogą znajdować się w jednym wierszu.
- **Dlaczego:** Układy wielokolumnowe często prowadzą do pomijania pól lub błędnego wypełniania, zwłaszcza u osób z niepełnosprawnościami poznawczymi.

### Granice Pól (Input Boundaries)
- **Widoczność:** Pola muszą mieć wyraźnie zdefiniowane granice (obramowanie).
- **Zasada:** Nie usuwaj obrysów (border) dla "czystszego designu". Użytkownicy słabowidzący muszą wiedzieć, gdzie kliknąć i jak duży jest obszar aktywny.

## Labels & Placeholders

### Etykiety (Labels)
- **Wymóg:** Każde pole `<input>`, `<select>`, `<textarea>` musi mieć powiązaną etykietę `<label>`.
- **Powiązanie:** Używaj atrybutu `for` w `label` zgodnego z `id` inputa, lub zagnieżdżaj input wewnątrz labela.
- **Widoczność:** Etykiety muszą być zawsze widoczne. **Nigdy** nie ukrywaj ich, polegając tylko na placeholderze.
- **Pozycja:** Umieszczaj etykiety poza polem (zwykle nad). Zapobiega to ich znikaniu podczas pisania.
- **Wygląd:** Rozmiar czcionki min. 16px, kontrast min. 4.5:1.

### Placeholdery
- **Rola:** Placeholder to wskazówka, nie etykieta. Znika po wpisaniu tekstu, co utrudnia weryfikację wprowadzonych danych.
- **Kontrast:** Często mają zbyt niski kontrast domyślny.

## Interaction & Keyboard

### Dostępność z Klawiatury
- **Nawigacja:** Wszystkie elementy (pola, przyciski, helpy) muszą być dostępne klawiszem `Tab`.
- **Focus:** Stosuj wyraźne, wysokokontrastowe wskaźniki fokusa. Domyślny styl przeglądarki może być niewystarczający.
- **Autouzupełnianie (Autocomplete):** Włącz atrybut `autocomplete` dla typowych danych (imię, email, tel). Ułatwia to wypełnianie osobom z problemami motorycznymi i poznawczymi.

## Validation & Errors

### Sygnalizacja Błędów
- **Wiele wskazówek:** Nie polegaj tylko na kolorze (np. czerwonym). Używaj jednocześnie:
  - Koloru (czerwony obrys/tekst).
  - Ikony (np. wykrzyknik).
  - Tekstu (wyjaśnienie błędu).
  - Pogrubienia czcionki.

### Powiązanie Błędu z Polem
- **ARIA:** Użyj atrybutu `aria-describedby` w polu input, wskazując na `id` elementu z komunikatem błędu. Dzięki temu czytnik ekranu odczyta błąd wraz z etykietą pola.

### Podsumowanie Błędów (Error Summary)
- **Lokalizacja:** Po nieudanej walidacji wyświetl listę wszystkich błędów na górze formularza (lub w widocznym miejscu).
- **Funkcja:** Lista powinna zawierać linki kotwiczne do odpowiednich pól, co pozwala szybko przejść do poprawy błędów. Jest to krytyczne dla długich formularzy.

## Kodowanie (Przykłady)

### Poprawne powiązanie etykiety i błędu
```html
<label for="email">Adres Email</label>
<input 
  type="email" 
  id="email" 
  name="email" 
  autocomplete="email"
  aria-describedby="email-error"
  aria-invalid="true"
>
<!-- Komunikat błędu -->
<span id="email-error" class="error-message">
  <icon aria-hidden="true">⚠️</icon>
  Wprowadź poprawny adres email (np. jan@example.com).
</span>
```