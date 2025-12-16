# React SPA (Vite Standard 2025) — Simplified FSD

Stosuj **Uproszczony Feature-Sliced Design**. Jest to "Złoty Środek" dla aplikacji SaaS, Dashboardów i projektów MVP+.

## 📂 Structure Overview
- `src/features/` — (Bounded Contexts) Logika biznesowa, widoki i stan lokalny (np. `features/Auth/`, `features/Cart/`).
- `src/common/` — (Shared Kernel) Uniwersalne komponenty UI, helpery (np. `common/Button/`, `common/hooks/`).
- `src/assets/` — Zasoby statyczne.

### 🔑 Key Principle: Colocation (Współlokowanie)
Trzymaj style, testy i logikę wewnątrz folderu feature'a.
- **Dlaczego?** AI (LLM) działa najlepiej na kontekście lokalnym. Kiedy edytujesz `Dashboard.tsx`, model widzi obok `Dashboard.styles.ts` i `useDashboardData.ts`.
- *Przykład:* `features/Invoices/` zawiera komponenty tabeli, hooki do API i testy, zamiast rozrzucać je po `src/components` i `src/hooks`.

### 📊 Decision Matrix

| Typ Projektu | Werdykt: Uproszczony FSD? |
| :--- | :--- |
| **SaaS, Dashboard, E-commerce** | ✅ **TAK (Domyślne)** |
| **Skala:** Średnia (MVP+, 2-10 devów) | ✅ **TAK** |
| **Landing Page / Prosta wizytówka** | ❌ **NIE** (Zbyt duży narzut, stosuj płaską strukturę) |
| **Enterprise / Super App** | ❌ **NIE** (Zbyt proste, stosuj pełny FSD lub NX Monorepo) |

## 🧱 Role of `common/` folder (Shared Kernel)

W architekturze **Simplified FSD** (oraz w Modular Monolith), folder `common/` (często nazywany też `shared/` lub `ui/`) to Twój **Fundament**. To jest miejsce na klocki LEGO, z których budujesz całą resztę aplikacji.

### Gdzie on jest?
Znajduje się na **najwyższym poziomie** w folderze `src/`, równolegle do `features/`.

```text
src/
├── features/           # 🧠 Logika Biznesowa (Specyficzne)
├── common/             # 🧱 Klocki LEGO (Uniwersalne: components, hooks, utils)
├── pages/              # Składanie widoków
└── App.tsx
```

### Co wrzucamy do `common`?
Kod w `common` **nie może wiedzieć, o czym jest Twoja aplikacja**. Ma być "sterylny" i uniwersalny (jak biblioteka z npm).

1.  **Komponenty UI:** "Dumb Components" (`Button`, `Modal`, `Icon`). ❌ Nie: `AddToCartButton`.
2.  **Narzędzia (Utils):** Czysta matematyka/formatowanie (`formatDate`, `clsx`). ❌ Nie: `calculateCartTotal`.
3.  **Hooki:** Niezależne od biznesu (`useOnClickOutside`, `useLocalStorage`). ❌ Nie: `useCart`.

### ⚠️ Złota Zasada Zależności (The Golden Rule)
> **Ruch Jednokierunkowy:**
> *   `features/` **MOGĄ** importować z `common/`.
> *   `common/` **NIE MOŻE** importować z `features/`.

Unikaj cyklicznych zależności. `Button` (common) nie może zależeć od `Auth` (feature).

### 🟦 TypeScript / JavaScript
- **TypeScript:** Obowiązkowy dla nowych projektów (Strict Mode).
- **Immutability:** Obiekty i tablice traktuj jako niezmienne.
- **Składnia:** Arrow functions, optional chaining, destrukturyzacja.
- **Nazewnictwo:** PascalCase (Komponenty), camelCase (funkcje/zmienne).
- **Async:** `async/await` zamiast `.then()`.
- **Paradygmat:** Nie używaj klas (`class`), stosuj wyłącznie funkcje.


### 🎨 CSS / Styling
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