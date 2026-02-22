# Modular Monolith (Next.js)


## 📂 Folder Structure Rules
1. **Modules First:** All business logic resides in `src/modules/[context]/`.
2. **Layer Isolation:**
   - `domain/`: Pure TS, Zod schemas, Business Rules. NO imports from `infra` or `app`.
   - `infrastructure/`: Database access (Repositories) & 3rd party APIs.
   - `application/`: Server Actions & Background Jobs. Orchestrates Domain + Infra.
3. **Public API:** Cross-module communication MUST go through the `index.ts` barrel file. Never import deeply from another module (e.g. `../sales/domain/logic`).
4. **UI:** `src/app` should contain "Dumb Components" only. Logic is imported from `modules`.

## 🧩 Component Architecture (Strict)
1. **Pure Presentation:** Components must be pure functions of props. Move ALL state, effects, and data fetching to Custom Hooks (`useFeatureLogic.ts`).
2. **Primitive Abstraction:** Separate "Structure" from "Semantics". Do not mix complex logic with long Tailwind class strings.
   - ❌ **Bad:** Deeply nested `div` soup with inline styles.
   - ✅ **Good:** Extract styled primitives (e.g., `<SidebarHeader>`, `<CardWrapper>`) to separate local components or files.
3. **Logic Separation (VSA):**
   - **Page (`page.tsx`):** Composition Root (Orchestration only).
   - **View (`ui/view.tsx`):** Pure UI (receives props, emits events).
   - **Logic (`application/use-logic.ts`):** State, Effects, API calls.

## 📁 Project Structure

```text
/frontend
   .env.local
   next.config.ts
   next-env.d.ts
   package.json
   postcss.config.mjs
   tsconfig.json
   /public                # Static assets (icons, images)
   /src
      /app                 # Next.js App Router (pages & layouts)
         globals.css
         layout.tsx
         providers.tsx
         /(auth)
            layout.tsx
            login/
         /(canvas)
            layout.tsx
            spaces/
         /(main)
            layout.tsx
            page.tsx
            dashboard/
            docs/
            inbox/
            profile/
            projects/
            resources/
            settings/
            spaces/
            workspaces/
         api/
            agents/
      /modules             # Feature modules (Modular Monolith)
         agents/
            application/
            domain/
            features/
            infrastructure/
            tests/
            ui/
         auth/
         common-uses/
            domain/
            features/
         dashboard/
            domain/
            features/
         inbox/
            application/
            domain/
            features/
            infrastructure/
            ui/
         knowledge/
            domain/
            features/
         projects/
            index.ts
            domain/
            features/
            tests/
         prompts/
            index.ts
            domain/
            features/
         resources/
            application/
            infrastructure/
            ui/
         settings/
            application/
            domain/
            features/
            infrastructure/
            ui/
         spaces/
            application/
            ...
         system/
         tools/
         workflows/
         workspaces/
      /shared
         config/
         domain/
         infrastructure/
         lib/
         ui/
```

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