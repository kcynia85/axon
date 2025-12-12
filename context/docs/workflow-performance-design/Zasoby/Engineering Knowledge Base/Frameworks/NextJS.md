# Next.js (App Router) Standards

## Struktura
*   `app/` - Routing, Layouts, Pages.
*   `modules/` - Logika biznesowa (DDD).
*   `components/` - "Głupie" komponenty UI.

## Data Fetching
*   **Server Components:** Pobieraj dane bezpośrednio w komponentach serwerowych (async/await).
*   **Client Components:** Używaj React Query (z hydracją stanu serwera).
*   **Server Actions:** Do mutacji danych (POST/PUT/DELETE).

## Rendering
*   **Static (Default):** Strony marketingowe, blogi.
*   **Dynamic:** Dashboardy, dane użytkownika (`force-dynamic`).
*   **Streaming:** Używaj `<Suspense>` i `loading.tsx` dla lepszego UX.

## Optimization
*   `next/image` do obrazów.
*   `next/font` do ładowania czcionek (zero layout shift).
*   `generateMetadata` dla SEO.
