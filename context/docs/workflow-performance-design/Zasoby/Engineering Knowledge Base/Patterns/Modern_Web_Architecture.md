# Modern Web Architecture Standards (Frontend)

> **Context:** Stack Next.js + React. Wzorce dla wysokiej wydajności (Performance) i UX.
> **Target:** Frontend Architect / Fullstack Engineer

---

## 1. Rendering Patterns (How Data Reaches User)

### A. Incremental Static Regeneration (ISR)
*   **🔴 Problem:** SSR jest wolny (DB query przy każdym request). SSG jest szybki, ale dane są stare.
*   **🟢 Rozwiązanie:** Hybryda. Serwer buduje statyczne HTML, ale odświeża je w tle co X sekund.
*   **🧠 Architect's Nuance:** Stale Data. Użytkownik może zobaczyć starą cenę przez kilka sekund.
*   **🤖 AI Architect:** Idealne dla stron SEO (blogi), które AI czyta (scrapuje). Szybki HTML = lepszy ranking.

**🛠️ Praktyki Implementacyjne:**
*   Ustaw `revalidate` na rozsądną wartość (np. 60s dla bloga, 5s dla cennika).
*   Użyj "On-Demand Revalidation" (webhook) po edycji w CMS, aby odświeżyć natychmiast.
*   Monitoruj "Build Duration" – jeśli generowanie strony trwa zbyt długo, ISR może się dławić.

### B. Streaming SSR (React Server Components)
*   **🔴 Problem:** Waterfall. Użytkownik widzi biały ekran, aż *cała* strona się wyrenderuje.
*   **🟢 Rozwiązanie:** Strumieniowanie HTML. Najpierw szkielet, potem krytyczne dane, na końcu reszta.
*   **🧠 Architect's Nuance:** Wymaga obsłużenia błędów w strumieniu (Error Boundaries).
*   **🤖 AI Architect:** Streaming tekstu z LLM to dokładnie ten sam wzorzec. UX jest spójny.

**🛠️ Praktyki Implementacyjne:**
*   Otocz każdy asynchroniczny komponent `<Suspense fallback={<Skeleton />}>`.
*   Unikaj blokowania strumienia przez jeden powolny request na samej górze drzewa.
*   Użyj `loading.tsx` w Next.js dla natychmiastowego feedbacku przy nawigacji.

### C. Islands Architecture (Selective Hydration)
*   **🔴 Problem:** Pobieranie 500KB JS, żeby wyświetlić statyczny tekst.
*   **🟢 Rozwiązanie:** Strona jest statycznym HTML-em. JavaScript ładuje się TYLKO dla interaktywnych "wysp".
*   **🧠 Architect's Nuance:** Architektura Astro/Qwik. W Next.js (App Router) to standard (Server Components vs Client Components).

**🛠️ Praktyki Implementacyjne:**
*   Domyślnie twórz Server Components. Dodawaj `"use client"` tylko gdy niezbędne (np. `useState`, `onClick`).
*   Przekazuj Server Components jako `children` do Client Components, aby uniknąć "wodospadu klient-serwer".
*   Minimalizuj rozmiar paczki JS dla wysp (code splitting).

### D. Jamstack (SSG)
*   **🔴 Problem:** Hosting dynamicznych stron jest drogi i podatny na ataki.
*   **🟢 Rozwiązanie:** Pre-renderuj wszystko do plików HTML w czasie budowania. Wystaw na CDN.
*   **🧠 Architect's Nuance:** Długi czas budowania (Build Time) przy tysiącach podstron.

**🛠️ Praktyki Implementacyjne:**
*   Używaj headless CMS jako źródła danych.
*   Zautomatyzuj deployment przy każdym commicie (Vercel/Netlify).
*   Dynamiczne funkcje (szukanie, komentarze) obsługuj przez Client-Side JS i API (Serverless).

---

## 2. UX Patterns (Perceived Performance)

### A. Optimistic UI (Zero-Latency Feel)
*   **🔴 Problem:** Użytkownik czeka na spinner po kliknięciu "Lubię to".
*   **🟢 Rozwiązanie:** Zakładaj sukces. Zmień UI natychmiast. Wyślij request w tle. W razie błędu cofnij (Rollback).
*   **🧠 Architect's Nuance:** Skomplikowana obsługa błędów. Użytkownik może nie zauważyć, że "lajk" zniknął.

**🛠️ Praktyki Implementacyjne:**
*   Użyj `useOptimistic` (React 19) lub `onMutate` w TanStack Query.
*   Zawsze miej plan B (Rollback) na wypadek błędu serwera.
*   Poinformuj użytkownika dyskretnie (Toast), jeśli operacja się nie udała.

### B. Skeleton Loading (Anti-CLS)
*   **🔴 Problem:** Treść skacze podczas ładowania (CLS). Użytkownik klika nie w to, co chciał.
*   **🟢 Rozwiązanie:** Szare prostokąty o wymiarach docelowej treści.
*   **🧠 Architect's Nuance:** Nie rób "Skeleton Screen", który wygląda lepiej niż gotowa strona. To rodzi frustrację (False Expectation).

**🛠️ Praktyki Implementacyjne:**
*   Skeleton musi mieć te same wymiary (width/height) co ładowany element, aby uniknąć CLS.
*   Użyj prostej animacji "pulse" lub "shimmer", aby pokazać aktywność.
*   Nie nadużywaj Skeletonów – jeśli coś ładuje się < 200ms, nie pokazuj nic.

### C. Progressive Hydration
*   **🔴 Problem:** TTI (Time to Interactive) jest wysokie, bo przeglądarka mieli cały JS naraz.
*   **🟢 Rozwiązanie:** Hydratuj (ożywiaj) komponenty w kolejności priorytetu (Viewport -> Header -> Footer).
*   **🧠 Architect's Nuance:** Skomplikowana orkiestracja. React 18+ robi to automatycznie (Suspense).

**🛠️ Praktyki Implementacyjne:**
*   Używaj `Suspense` do dzielenia aplikacji na niezależne kawałki hydratacji.
*   Priorytetyzuj interaktywne elementy widoczne w viewport (Above the Fold).
*   Opóźniaj ładowanie ciężkich skryptów (np. mapy, czaty) do momentu interakcji lub scrolla.

---

## 3. Communication & Logic Patterns

### A. Backend for Frontend (BFF)
*   **🔴 Problem:** Frontend musi robić 5 zapytań do różnych mikroserwisów i sklejać dane.
*   **🟢 Rozwiązanie:** Dedykowane API (BFF) skrojone pod widok. Zwraca gotowy ViewModel.
*   **🧠 Architect's Nuance:** Ryzyko duplikacji logiki w wielu BFF (Mobile vs Web).
*   **🤖 AI Architect:** Generative UI wymaga BFF, który zwraca schemat UI, a nie surowe dane.

**🛠️ Praktyki Implementacyjne:**
*   Trzymaj kod BFF blisko kodu Frontendu (np. w Next.js API Routes).
*   Typuj kontrakt BFF używając tRPC lub generowanych typów TypeScript.
*   Nie umieszczaj logiki biznesowej w BFF – tylko agregacja i formatowanie.

### B. API Gateway
*   **🔴 Problem:** Każdy mikroserwis musi implementować Auth i Rate Limiting.
*   **🟢 Rozwiązanie:** Jeden punkt wejścia (Bramka). Obsługuje sprawy techniczne, potem routuje do serwisu.
*   **🧠 Architect's Nuance:** Single Point of Failure.

**🛠️ Praktyki Implementacyjne:**
*   Konfiguruj Rate Limiting per klient/IP na poziomie Gateway.
*   Centralizuj logowanie i metryki (wszystkie requesty przechodzą tędy).
*   Używaj Gateway do translacji protokołów (np. gRPC -> HTTP).

### C. Token-Based Authentication (Stateless)
*   **🔴 Problem:** Sesje na serwerze nie skalują się horyzontalnie (trzeba synchronizować RAM).
*   **🟢 Rozwiązanie:** JWT. Stan jest u klienta (w tokenie). Serwer tylko weryfikuje podpis.
*   **🧠 Architect's Nuance:** Trudne unieważnianie (Revocation) tokenów przed czasem.

**🛠️ Praktyki Implementacyjne:**
*   Trzymaj JWT w `httpOnly` Cookies (bezpieczniejsze niż LocalStorage).
*   Stosuj krótkie czasy życia Access Tokena i mechanizm Refresh Tokena.
*   Weryfikuj podpis JWT asymetrycznie (klucz publiczny/prywatny).

### D. Server-Sent Events (SSE)
*   **🔴 Problem:** Polling (pytanie co 1s "czy gotowe?") ubija serwer. WebSockets są ciężkie.
*   **🟢 Rozwiązanie:** Jednokierunkowy strumień HTTP z serwera.
*   **🧠 Architect's Nuance:** Limit połączeń HTTP/1.1 w przeglądarce (max 6). HTTP/2 rozwiązuje problem.
*   **🤖 AI Architect:** Standard de facto do streamowania odpowiedzi z LLM (efekt maszyny do pisania).

**🛠️ Praktyki Implementacyjne:**
*   Użyj formatu `data: {json}\n\n` do przesyłania wiadomości.
*   Obsłuż automatyczne wznawianie połączenia po stronie klienta (`EventSource`).
*   Pamiętaj o nagłówku `Content-Type: text/event-stream` i wyłączeniu buforowania proxy.

### E. Throttling & Debouncing
*   **🔴 Problem:** Search Bar wysyła zapytanie przy każdej literze.
*   **🟢 Rozwiązanie:**
    *   *Debounce:* Czekaj, aż user przestanie pisać (np. 300ms).
    *   *Throttle:* Wykonuj max raz na X ms (np. przy scrollowaniu).
*   **🧠 Architect's Nuance:** UX: Debounce opóźnia reakcję. Czasem lepiej pokazać lokalne wyniki od razu.

**🛠️ Praktyki Implementacyjne:**
*   Użyj `lodash.debounce` lub custom hooka `useDebounce`.
*   Anuluj poprzednie requesty (AbortController), jeśli przyjdzie nowy przed zakończeniem starego.
*   Dla scrolla zawsze używaj Throttle (np. `requestAnimationFrame`).

### F. Proxy Pattern (Rewrites)
*   **🔴 Problem:** CORS blokuje zapytania do zewnętrznego API.
*   **🟢 Rozwiązanie:** Przekieruj request przez własny serwer (Next.js Rewrites).
*   **🧠 Architect's Nuance:** Ukrywa klucze API przed klientem (Security).

**🛠️ Praktyki Implementacyjne:**
*   Konfiguruj rewrites w `next.config.js` lub Nginx.
*   Nie loguj body requestów proxy, aby nie wyciekły dane wrażliwe.
*   Dodawaj nagłówki bezpieczeństwa w warstwie proxy.

### G. Lazy Initialization
*   **🔴 Problem:** Ciężka funkcja liczy domyślny stan `useState` przy każdym renderze.
*   **🟢 Rozwiązanie:** Przekaż funkcję, a nie wynik: `useState(() => heavy())`. Wykona się tylko raz.
*   **🧠 Architect's Nuance:** Optymalizacja warta zachodu tylko przy naprawdę drogich obliczeniach.

**🛠️ Praktyki Implementacyjne:**
*   Stosuj tylko, gdy inicjalizacja blokuje główny wątek.
*   Jeśli obliczenie jest asynchroniczne, użyj `useEffect` lub `useQuery`.
*   Profiluj wydajność przed i po wdrożeniu.

### H. Middleware Pattern
*   **🔴 Problem:** Kopiowanie kodu autoryzacji w każdym endpoincie.
*   **🟢 Rozwiązanie:** Łańcuch funkcji (Chain of Responsibility). Request przechodzi przez Auth -> Log -> Validation -> Handler.
*   **🧠 Architect's Nuance:** Kolejność ma znaczenie. Błąd w middleware zatrzymuje łańcuch.

**🛠️ Praktyki Implementacyjne:**
*   W Next.js używaj `middleware.ts` do globalnych reguł (np. redirecty).
*   Dla API używaj bibliotek typu `nc` (next-connect) lub wbudowanych mechanizmów frameworka.
*   Middleware powinien być szybki i lekki – unikanie ciężkich zapytań do bazy.

### I. Atomic Design
*   **🔴 Problem:** Niespójne komponenty UI. Trudne utrzymanie.
*   **🟢 Rozwiązanie:** Hierarchia: Atomy (Button) -> Molekuły (Search) -> Organizmy (Header).
*   **🧠 Architect's Nuance:** Nie bądź dogmatyczny. Czasem podział jest sztuczny.

**🛠️ Praktyki Implementacyjne:**
*   Buduj komponenty od najmniejszych (Atomy) w górę.
*   Używaj Storybooka do katalogowania i testowania izolowanych komponentów.
*   Organizmy powinny być konteksto-zależne, a Molekuły i Atomy głupie (prezentacyjne).

### J. Virtualization / Windowing
*   **🔴 Problem:** Lista 10,000 elementów zamula przeglądarkę (DOM nodes).
*   **🟢 Rozwiązanie:** Renderuj tylko to, co widać w oknie + mały bufor. Recykling elementów DOM.
*   **🧠 Architect's Nuance:** Problemy z `Ctrl+F` (szukanie na stronie) i SEO (treść nie istnieje w DOM).

**🛠️ Praktyki Implementacyjne:**
*   Użyj `react-window` lub `tanstack-virtual`.
*   Zadbaj o stałą wysokość wiersza dla lepszej wydajności (lub użyj dynamicznego mierzenia).
*   Zapewnij dostępność (ARIA), informując o całkowitej liczbie elementów.
