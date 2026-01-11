---
template_type: crew
target_workspace: Discovery
---

# Operational Reality Check (Brief Techniczny / Audyt)

> **Cel:** Szybka weryfikacja zasobów klienta, aby dobrać technologię, której nie trzeba "ratować" po wdrożeniu.
> **Format:** Ankieta dla klienta (Typeform/Email) LUB Checklista do odhaczenia przez Ciebie podczas rozmowy sprzedażowej/analizy wstępnej.
> **Czas:** 15 min (Asynchronicznie lub podczas calla zapoznawczego).

---

## 1. WWW & Tech Stack (Weryfikacja TCO)
*Sprawdź, czy stać ich na utrzymanie tego, co chcesz zbudować.*

- [ ] **Developer:** Czy mają kogoś technicznego in-house?
    - *NIE:* Celuj w **Webflow / Framer / Shopify** (No-code/Low-code).
    - *TAK:* Możesz proponować **Next.js / Headless**.
- [ ] **Hosting:** Kto opłaca domeny/serwery?
    - *Zalecenie:* Wymuś na kliencie założenie konta (bądź "Adminem", nie "Właścicielem").
- [ ] **Dostęp do DNS:** Czy mają do tego hasła? (Kluczowe pytanie przed startem, by uniknąć blokady przy wdrożeniu).

---

## 2. Content Operations (Kto to obsłuży?)
*Sprawdź, czy strona nie będzie pusta po 3 miesiącach.*

- [ ] **Operator strony:** Kto będzie edytował treści?
    - *Osoba nietechniczna:* Musisz wdrożyć CMS z blokadą psucia layoutu (sztywne szablony).
    - *Marketingowiec:* Potrzebuje Buildera / elastyczności.
- [ ] **Zasoby foto/wideo:** Skąd wezmą materiały?
    - *Mają swoje:* OK, sprawdź jakość.
    - *Nie mają:* Czy akceptują stocki lub AI? Jeśli AI – czy masz to w zakresie, czy oni to robią?

---

## 3. Design Ops & Narzędzia
*W czym pracuje ich marketing? Dostarcz im to, czego używają.*

- [ ] **Narzędzia graficzne:** Czego używają na co dzień?
    - *Canva:* Dostarcz "Brand Kit" w Canvie.
    - *Figma/Adobe:* Dostarcz pliki źródłowe.
- [ ] **Decyzyjność:** Kto akceptuje wygląd? (Unikaj "komitetów sterujących", ustal jednego decydenta).

---

## 4. Administracja
- [ ] **Karty płatnicze:** Czy klient jest gotowy podpiąć kartę pod narzędzia SaaS (OpenAI, Vercel, Hosting)?
- [ ] **Dostępy:** Czy masz dostęp do GA4 / GSC / Hotjar na start?