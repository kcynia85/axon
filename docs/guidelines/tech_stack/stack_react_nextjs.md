# ⚛️ TECH STACK: React & TypeScript
> **Role:** Standards for Frontend (Next.js/Vite).

---

# 🚀 Defaults
1.  **Framework:** Next.js (App Router) or Vite.
2.  **Lang:** TypeScript (Strict).
3.  **Styling:** Tailwind CSS.
4.  **State:** Zustand (Global), TanStack Query (Server).

---

# 🧠 Standards (Libraries)
- **Fetch:** `useQuery` (Client) or direct DB call (RSC). No `useEffect` fetch.
- **Forms:** React Hook Form + Zod.
- **Perf:** Server Components by default. `"use client"` at leaves.


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

---

