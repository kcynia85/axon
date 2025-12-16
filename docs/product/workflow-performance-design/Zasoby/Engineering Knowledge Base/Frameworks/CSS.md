# CSS & Styling (Tailwind)

## Stack
*   **Tailwind CSS:** Domyślny wybór. Szybkość i spójność.
*   **Shadcn UI:** Gotowe komponenty oparte na Tailwind i Radix.
*   **CSS Modules:** Tylko gdy Tailwind nie wystarcza (np. skomplikowane animacje).

## Best Practices
*   **Mobile First:** `w-full md:w-1/2` (Domyślnie mobil, `md:` to desktop).
*   **Variables:** Kolory i spacingi definiuj w `tailwind.config.js` lub zmiennych CSS.
*   **Clsx / Tailwind Merge:** Do łączenia klas warunkowych.

## Reset
```css
html {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}
*, ::after, ::before {
  box-sizing: inherit;
}
```
