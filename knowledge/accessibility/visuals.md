# 🎨 Visuals & Clarity

## UI Clarity & Icons
- **Ikony i Etykiety:** Stosuj ikony jako wizualne reprezentacje akcji, aby ułatwić nawigację.
- **Unikanie Niejednoznaczności:** Zawsze łącz ikony z etykietami tekstowymi. Zapobiega to pomyłkom i wspiera użytkowników z trudnościami w uczeniu się lub niepełnosprawnościami wzroku.

## Motion & Flashing Content
- **Unikaj Migotania:** Treści migające lub błyskające mogą wywoływać ataki padaczki. Unikaj migotania przekraczającego 3 błyski na sekundę (3 Hz) oraz intensywnych czerwonych błysków.
- **Wzory:** Unikaj wzorów z więcej niż 5 parami kontrastowych (jasno-ciemnych) pasków.
- **Ostrzeżenie i Kontrola:** Jeśli musisz użyć migających treści, dodaj ostrzeżenie i pozwól użytkownikom świadomie zdecydować o ich wyświetleniu.
- **Narzędzia:** Weryfikuj bezpieczeństwo animacji narzędziami takimi jak [PEAT](https://trace.umd.edu/peat/) lub [Harding Test](https://www.hardingtest.com/).

## Color & Contrast (WCAG 2.1 AA)

### Wymagania Kontrastu
- **Tekst normalny (< 18pt/24px):** Stosunek kontrastu minimum **4.5:1** względem tła.
- **Tekst duży (>= 18pt/24px lub bold >= 14pt/18.5px):** Stosunek kontrastu minimum **3:1**.
- **Elementy UI i Ikony:** Obramowania inputów, ikony i inne istotne elementy graficzne muszą mieć kontrast minimum **3:1**.
- **Zaznaczenie tekstu:** Tekst w stanie zaznaczenia (selection) również musi spełniać powyższe wymogi.
- **Tekst na obrazach:** Musi zachować kontrast **4.5:1**. Stosuj przyciemniające nakładki (overlay) na zdjęcia, aby to zapewnić.

### Wyjątki
- **Elementy nieaktywne (Disabled):** Nie podlegają wymogom kontrastu, ale muszą być wizualnie odróżnialne od elementów aktywnych.
- **Logotypy:** Tekst będący częścią logo lub marki nie podlega restrykcjom kontrastu (choć zaleca się dbanie o czytelność).

### Dobre Praktyki
- **Unikaj Skrajnego Kontrastu:** Nie używaj czystej czerni (`#000000`) na czystej bieli (`#FFFFFF`). Może to powodować zmęczenie oczu i problemy u osób z dysleksją lub spektrum autyzmu (ASD). Stosuj ciemne szarości (np. `#333`).
- **Nie polegaj tylko na kolorze:** Nigdy nie używaj samego koloru do przekazywania informacji (np. błędy oznaczaj kolorem czerwonym ORAZ ikoną/tekstem).
- **Narzędzia:**
  - [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
  - [Contrast Grid](https://contrast-grid.eightshapes.com/)
  - [Accessible Color Palette Builder](https://toolness.github.io/accessible-color-matrix/)
  - [Colorable](https://colorable.jxnblk.com/)

## Język i Zrozumiałość (Language & Readability)

Tekst jest kluczowym narzędziem dostarczającym informacji. Jego dostępność ma zasadnicze znaczenie dla użytkownika. Nieczytelna lub niezrozumiała treść zniechęca.

### Prosty język (Plain Language)
- **Dla kogo:** Pisz w sposób zrozumiały dla osób z wykształceniem średnim. Tekst musi być dostępny niezależnie od niepełnosprawności czy poziomu edukacji.
- **Zasady:**
  - Stosuj zasadę "jedno zdanie, jedna myśl".
  - Wybieraj prostsze słowa (np. "bogaty" zamiast "zamożny").
  - Jeśli tekst musi być skomplikowany, dodaj wyjaśnienie.

### Unikanie idiomów i przenośni
- **Problem:** Wyrażenia o podwójnym znaczeniu, gry słowne i idiomy (np. "leżeć do góry brzuchem") mogą być niezrozumiałe dla osób ze spektrum autyzmu lub niebędących native speakerami.
- **Rozwiązanie:** Stosuj dosłowne znaczenia. Unikaj niejasnych odniesień kulturowych.

## Typografia (Typography & Layout)

### Krój pisma (Typeface)
- **Wybór:** Stosuj czytelne czcionki, które zachowują czytelność w każdym rozmiarze.
- **Cechy:** Odpowiednia wysokość x, wyraźnie różne kształty podobnych znaków (0/O, 1/I/l), wsparcie dla wszystkich potrzebnych znaków.
- **Rekomendacje:** Sprawdź [U.S. Web Design System](https://designsystem.digital.gov/components/typography/).

### Rozmiar i Jednostki
- **Minimum:** Minimalna zalecana wielkość dla tekstu podstawowego to **16px**. Z wiekiem wzrok słabnie (w wieku 60 lat do siatkówki dociera 1/3 światła w porównaniu do wieku 20 lat).
- **Skalowanie:** Używaj jednostek relatywnych (`rem`, `em`), aby respektować ustawienia użytkownika w przeglądarce. Unikaj sztywnych jednostek `px`.

### Długość wiersza (Line Length)
- **Optimum:** 45-75 znaków (ze spacjami). Umożliwia to naturalne czytanie w skokach.
- **Zastosowanie:** Krótsze wiersze sprawdzają się w podpisach i formularzach. Zbyt długie wiersze męczą wzrok.

### Wyrównanie (Alignment)
- **Kierunek:** Dostosuj wyrównanie do kierunku tekstu.
  - LTR (Left-to-Right): Wyrównaj do lewej (większość języków).
  - RTL (Right-to-Left): Wyrównaj do prawej (arabski, hebrajski).

## Nagłówki i Hierarchia (Headings)

Nagłówki wprowadzają treść i pokazują jej hierarchię. Są kluczowe dla nawigacji, zwłaszcza dla użytkowników czytników ekranu (screen readers).

### Wyróżnienie i Semantyka
- **Tagi HTML:** Używaj znaczników `<h1>` do `<h6>`. Nie stylizuj zwykłego tekstu, aby wyglądał jak nagłówek, bez użycia odpowiedniego taga.
- **Wygląd:** Duże i pogrubione czcionki ułatwiają skanowanie, ale semantyka jest najważniejsza dla technologii asystujących.

### Tytuł strony (H1)
- **Zasada:** Każda strona powinna mieć **dokładnie jeden** nagłówek `<h1>`.
- **Rola:** H1 odpowiada tytułowi strony i informuje o jej głównej zawartości.

### Kolejność logiczna (Rank)
- **Struktura:** Zachowaj logiczną kolejność.
  - `<h1>`: Główna treść/tytuł.
  - `<h2>`: Główne sekcje.
  - `<h3>` - `<h6>`: Podsekcje.
- **Ciągłość:** Nie pomijaj poziomów (np. nie skacz z `<h1>` od razu do `<h3>`). Może to dezorientować użytkowników nawigujących po nagłówkach.
- **Ukryte nagłówki:** Jeśli sekcja wizualnie nie wymaga nagłówka, ale logicznie go potrzebuje dla zachowania ciągłości, można dodać nagłówek widoczny tylko dla czytników ekranu (sr-only).