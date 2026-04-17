---
workspace: Design
---

# Inclusive Design Checklist (WCAG 2.1 AA)

> **Dla kogo:** UI/UX Designerzy.
> **Kiedy:** Przed przekazaniem projektu do Developmentu (Handoff).
> **Cel:** Uniknięcie "długu dostępności" i pozwów prawnych (European Accessibility Act 2025).

---

## 1. Kolor i Kontrast
*Nie polegaj wyłącznie na kolorze.*

- [ ] **Tekst podstawowy:** Kontrast min. **4.5:1** względem tła.
- [ ] **Duży tekst (>18pt / 24px):** Kontrast min. **3:1**.
- [ ] **Elementy interfejsu (Ikony, Inputy):** Kontrast min. **3:1** (dotyczy też obramowania pól formularzy!).
- [ ] **Błędy i Sukcesy:** Nie używaj *tylko* koloru (Czerwony/Zielony). Dodaj **ikonę** lub **tekst** pomocniczy.
- [ ] **Daltonizm:** Sprawdź projekt w symulatorze (np. plugin Stark w Figmie) dla Protanopii i Deuteranopii.
- [ ] **Tryb Ciemny:** Unikaj czystej czerni (`#000000`) na czystej bieli (`#FFFFFF`). Zbyt duży kontrast ("Stark Contrast") męczy wzrok i utrudnia czytanie dyslektykom.

## 2. Typografia i Czytelność
*Tekst musi być skalowalny i czytelny.*

- [ ] **Rozmiar:** Body text min. **16px** (dla mobile i desktop).
- [ ] **Interlinia (Line Height):** Min. **1.5** (150% rozmiaru czcionki) dla bloków tekstu.
- [ ] **Akapity:** Odstęp między akapitami min. **2x** wielkość czcionki.
- [ ] **Wyrównanie:** Tekst wyrównany do lewej (Left Aligned). **Nigdy nie justuj** (Justified), bo tworzy "rzeki bieli", które są nieczytelne dla dyslektyków.
- [ ] **Długość linii:** Max 80 znaków w linii (dla komfortu czytania).

## 3. Formularze i Interakcja
*Każda akcja musi być przewidywalna.*

- [ ] **Focus States:** Zaprojektuj stan `:focus` dla każdego elementu klikalnego (button, input, link). Musi być widoczny (np. gruby obrys). Nie usuwaj domyślnego obrysu przeglądarki bez dodania własnego!
- [ ] **Etykiety (Labels):** Każde pole formularza musi mieć widoczną etykietę (nie tylko placeholder, który znika po kliknięciu).
- [ ] **Touch Targets:** Strefa kliknięcia min. **44x44px** (Mobile) / **24x24px** (Desktop). Jeśli ikona jest mała, dodaj wokół niej padding.
- [ ] **Błędy:** Komunikat błędu musi mówić, *jak* go naprawić (np. "Wpisz poprawny email: jan@example.com" zamiast "Błąd").

## 4. Nawigacja i Struktura
*Logiczna kolejność dla czytników ekranu.*

- [ ] **Hierarchia Nagłówków:** H1 -> H2 -> H3. Nie przeskakuj poziomów (np. z H1 od razu do H4) tylko dla efektu wizualnego.
- [ ] **Linki:** Linki w tekście muszą się wyróżniać nie tylko kolorem (dodaj **podkreślenie**). Treść linku musi mieć sens bez kontekstu (Unikaj "Kliknij tutaj". Użyj "Pobierz raport PDF").
- [ ] **Skip Links:** Zaplanuj mechanizm "Przejdź do treści" dla nawigacji klawiaturą (pierwszy element focusowalny na stronie).

## 5. Media i Obrazy
- [ ] **Alt Text:** Czy każdy obraz ma zdefiniowany tekst alternatywny? (Jeśli dekoracyjny -> `alt=""`).
- [ ] **Wideo:** Czy są napisy (Captions) i transkrypcja?
- [ ] **Ruch:** Czy animacje trwają krócej niż 5 sekund lub mają przycisk "Pauza"? (Ważne dla osób z epilepsją i zaburzeniami błędnika).

---

### Narzędzia dla Designera
*   **Figma Plugins:** Stark, Contrast, A11y - Color Contrast Checker.
*   **Web:** [Color Safe](http://colorsafe.co/), [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).
