# ⚛️ TECH STACK: React & TypeScript
> **Role:** Standards for Frontend (Next.js/Vite).

---

# 🚀 Defaults
1.  **Framework:** Next.js (v16) or Vite.
2.  **Lang:** TypeScript (Strict).
3.  **Styling:** Tailwind CSS.
4.  **State:** Zustand (Global), TanStack Query (Server).

---

# 🧠 Standards (Libraries)
- **Fetch & Data fetching:** Prefer Next.js v16 server data fetching (RSC/server fetch) for initial loads; use `TanStack Query` in client components for interactivity and cache/mutations.
- **Forms:** React Hook Form + Zod.
- **Authentication:** Better Auth (default for new apps): https://www.better-auth.com/docs/introduction
 
---

# 🌐 Built-in Browser APIs (Recommended)
- **Popover API:** Use the native Popover API as the default for the following components to ensure performance and accessibility:
  - Context Menus
  - Dropdowns
  - Tooltips
  - User Menus
  - Dialogs
  - Toggles (for showing/hiding content)

# 🧩 TanStack Ecosystem (Recommended)
TanStack provides a set of well-designed, type-safe utilities that świetnie uzupełniają React + TypeScript stacks. Dodajemy następujące narzędzia jako rekomendowane:

- **TanStack Query** – zarządzanie fetchowaniem i cache’em danych asynchronicznych (`react-query` w nowej odsłonie). Używamy go jako warstwy cache/loop dla zapytań sieciowych i RSC.
- **TanStack Router** – router z pełnym wsparciem typów oraz mechanizmami ładowania danych na poziomie routingu; działa z React i Solid.
- **TanStack Pacer** – narzędzie pomocnicze do debouncingu, throttlingu i batchingu operacji (przydatne przy eventach wysokiej częstotliwości i przy coordynacji wielu requestów).
- **TanStack DB / Store / AI / Devtools / Table / Form / Virtual** – pozostałe elementy ekosystemu:
  - `DB` – lekka lokalna warstwa persistencji (client-side DB abstractions).
  - `Store` – dodatkowe, wydajne primitywy stanu kompatybilne z podejściem TanStack.
  - `AI` – eksperymentalne helpery do integracji z LLM (monitorować stabilność i wersje).
  - `Devtools` – narzędzia do debugowania Query/Store/Router podczas developmentu.
  - `Table` – headless, wydajna biblioteka tabel z rozbudowanymi opcjami (sort, filter, virtualization).
  - `Form` – ukierunkowane narzędzia do budowy formularzy (kompatybilność z RHF/Zod).
  - `Virtual` – utilities do virtualizacji list (wydajność przy dużych listach/siatkach).

Wdrożenie: traktuj te narzędzia jako rekomendowane dependency w `package.json`, stosując je tam, gdzie zmniejszają złożoność i poprawiają typowanie/wykonanie.


# 🎨 Styling
- **Stack 2025:** Tailwind CSS (domyślnie) lub CSS Modules / Vanilla Extract.
- **Unikaj:** Styled-components (chyba że wymuszone przez legacy), metodologii BEM w JS.
- **Layout:** CSS Grid & Flexbox.
- **Kolory:** Zmienne w `:root` (HSL) lub konfiguracja Tailwind.
- **Selektory DOM:** Elementy chwytane w JS oznaczaj klasą `js-` (np. `.js-menu-trigger`), oddzielając logikę od stylów.
- **Wydajność:** Preferuj `backdrop-filter` (obsługiwane sprzętowo) zamiast zwykłego `blur` na kontenerach, jeśli to możliwe, dla lepszej wydajności.
- **Global Reset:** Zawsze stosuj `box-sizing: border-box` oraz wygładzanie czcionek.
  ```css
  html {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
  }
  *, ::after, ::before {
    box-sizing: inherit;
  }
  ```

