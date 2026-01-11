---
template_type: flow
---

# React Best Practices (2025)

## Core Principles
*   **Functional Components:** Tylko funkcje, zero klas.
*   **Hooks:** `useEffect` tylko do synchronizacji z zewnętrznymi systemami. Do danych używaj React Query.
*   **Composition:** Unikaj prop drilling. Używaj `children` i slotów.

## State Management
*   **Server State:** TanStack Query (React Query).
*   **Client State:** Zustand (global), React Hook Form (formularze).
*   **Context API:** Tylko do wstrzykiwania zależności (Dependency Injection) lub motywów.

## Performance
*   **Code Splitting:** `React.lazy` / Dynamic Imports w Next.js.
*   **Memoization:** `useMemo` i `useCallback` tylko tam, gdzie profilowanie wykaże potrzebę.
*   **Virtualization:** Dla długich list używaj `react-window` lub `tanstack-virtual`.
