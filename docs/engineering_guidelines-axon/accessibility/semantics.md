# 🏗️ Structure & Semantics

## HTML Semantics
- **Landmarks:** Używaj `<header>`, `<nav>`, `<main>`, `<section>`, `<aside>`, `<footer>` do tworzenia przejrzystej struktury dokumentu. Pozwala to użytkownikom czytników ekranu na szybką nawigację między sekcjami.
- **Hierarchia nagłówków:** Zachowuj logiczną strukturę nagłówków (`h1` -> `h6`). Nie pomijaj poziomów (np. nie skacz z `h1` do `h3`).

## SEO & Metadata
- **Metadata API (Next.js):** Wykorzystuj Metadata API do definiowania tytułów stron (`title`) i opisów (`meta description`). Każda podstrona musi mieć unikalny tytuł opisujący jej zawartość.
- **Język strony:** Pamiętaj o ustawieniu atrybutu `lang` w tagu `html` (np. `<html lang="pl">`), co jest kluczowe dla syntezatorów mowy.

## ARIA & Labels
- **Role ARIA:** Stosuj role ARIA (np. `role="alert"`, `role="tablist"`) tylko tam, gdzie natywny HTML nie wystarcza.
- **Etykiety:** Używaj `aria-label` lub `aria-labelledby`, aby opisać elementy interaktywne, które nie mają widocznej etykiety tekstowej (np. przycisk z samą ikoną).
- **Stany:** Informuj o zmianie stanu za pomocą atrybutów takich jak `aria-expanded="true/false"` lub `aria-selected`.
