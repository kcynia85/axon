# WCAG 2.1 Implementation Guide (Level AA)

> **Dla kogo:** Frontend Developerzy / QA Engineers.
> **Cel:** Techniczna implementacja standardów dostępności (EAA Compliant).
> **Zasada:** "Built-in Accessibility" (koduj poprawnie od początku, zamiast naprawiać na końcu).

---

## 1. Semantyka i Struktura HTML (POUR)
*Czytniki ekranu nawigują po strukturze (Landmarks).*

- [ ] **Landmarks:** Używaj tagów semantycznych zamiast `div`.
    -   `<header>` (Banner)
    -   `<nav>` (Navigation)
    -   `<main>` (Main content)
    -   `<footer>` (Contentinfo)
    -   `<aside>` (Complementary)
- [ ] **Nagłówki (Headings):** H1-H6 muszą tworzyć logiczne drzewo. Nie używaj H3 po H1 bez H2.
- [ ] **Skip Links:** Zaimplementuj mechanizm "Skip to Content" jako pierwszy element w `<body>`.
    ```html
    <a href="#main-content" class="skip-link">Przejdź do treści</a>
    ```

## 2. Obsługa Klawiatury (Focus Management)
*Wszystko co klikalne, musi być dostępne z klawiatury.*

- [ ] **Focus Visible:** NIGDY nie używaj `outline: none` w CSS bez zdefiniowania alternatywnego stylu `:focus`.
- [ ] **Kolejność Tabulacji:** Elementy muszą otrzymywać focus w logicznej kolejności (zgodnie z układem wizualnym).
- [ ] **Interaktywne Elementy:**
    -   Używaj `<button>` do akcji (otwórz modal, wyślij).
    -   Używaj `<a>` do nawigacji (zmiana URL).
    -   Jeśli musisz użyć `div` jako przycisku (niezalecane), dodaj `role="button"` i `tabindex="0"` oraz obsłuż zdarzenie `onKeyDown` (Enter/Space).

## 3. Formularze i Etykiety
*Najczęstsze miejsce błędów.*

- [ ] **Labels:** Każdy `<input>` musi mieć powiązany `<label>` (przez `for="id"` lub zagnieżdżenie).
- [ ] **Autocomplete:** Używaj atrybutów `autocomplete` dla typowych pól (email, name, tel).
    ```html
    <input type="email" autocomplete="email" ...>
    ```
- [ ] **Błędy Walidacji:**
    -   Błąd musi być połączony z polem przez `aria-describedby`.
    -   ```html
        <input aria-describedby="email-error" ...>
        <span id="email-error">Wpisz poprawny email.</span>
        ```

## 4. ARIA (Accessible Rich Internet Applications)
*Zasada: Używaj ARIA tylko wtedy, gdy HTML nie wystarcza.*

- [ ] **Stany:** Używaj `aria-expanded="true/false"` dla rozwijanych menu/akordeonów.
- [ ] **Ukrywanie:** Używaj `aria-hidden="true"` dla elementów dekoracyjnych (ikony), których czytnik ma nie czytać.
- [ ] **Modale:** Zarządzaj fokusem (pułapka fokusa wewnątrz modala, powrót fokusa po zamknięciu).

## 5. QA Testing Tools
Nie polegaj tylko na wzroku.

1.  **Automatyzacja:**
    -   **Lighthouse:** (DevTools -> Lighthouse -> Accessibility). Cel: 90+.
    -   **axe DevTools:** Wtyczka do Chrome (wyłapuje więcej błędów niż Lighthouse).
2.  **Test Manualny:**
    -   Odłącz myszkę. Spróbuj przejść cały proces (np. kupno produktu) używając tylko `Tab`, `Shift+Tab`, `Enter`, `Space`.
    -   Włącz czytnik ekranu (VoiceOver na Mac / NVDA na Windows) i zamknij oczy. Czy wiesz, gdzie jesteś?
