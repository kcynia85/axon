# Modular Monolith (Next.js)


## 📂 Folder Structure Rules
1. **Modules First:** All business logic resides in `src/modules/[context]/`.
2. **Layer Isolation:**
   - `domain/`: Pure TS, Zod schemas, Business Rules. NO imports from `infra` or `app`.
   - `infrastructure/`: Database access (Repositories) & 3rd party APIs.
   - `application/`: Server Actions & Background Jobs. Orchestrates Domain + Infra.
3. **Public API:** Cross-module communication MUST go through the `index.ts` barrel file. Never import deeply from another module (e.g. `../sales/domain/logic`).
4. **UI:** `src/app` should contain "Dumb Components" only. Logic is imported from `modules`.

## 📁 Project Structure

```text
/frontend
  next.config.ts         # Konfiguracja Next.js
  package.json           # Zależności (npm)
  tsconfig.json          # Konfiguracja TypeScript
  /src
    /app                 # NEXT.JS APP ROUTER
       /(main)           # Layout główny aplikacji (Sidebar + Header)
          /brain         # Knowledge Base
          /common-uses   # Szablony zadań
          /dashboard     # Dashboard główny
          /docs          # Dokumentacja
          /inbox         # Artifact Review Inbox
          /profile       # Profil użytkownika
          /projects      # Zarządzanie projektami
          /settings      # Ustawienia (Agents, Tools, Prompts)
          /workflows     # Builder procesów
          /workspace     # Chat & Artifact Split-View
          layout.tsx     # Główny layout
          page.tsx       # Redirect do dashboard
       /(auth)           # Strony logowania/rejestracji
    /modules             # MODULAR MONOLITH (Features)
       /agents           # Chat logic, Workspace UI
       /common-uses      # Logika szablonów
       /dashboard        # Widgety dashboardu
       /inbox            # Review flow logic
       /knowledge        # RAG logic, Assets browser, Docs viewer
       /projects         # Project CRUD
       /prompts          # Prompt management
       /settings         # Settings logic
       /tools            # Tool catalog & MCP integration
       /workflows        # Workflow builder logic
    /shared              # SHARED KERNEL
       /domain           # Shared types
       /lib              # Utils, API Client (Axios/Fetch), Hooks
       /ui               # Design System (Shadcn), Layout components
  /public                # Zasoby statyczne (SVG, obrazy)
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