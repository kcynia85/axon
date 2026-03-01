# Axon Frontend — Dokumentacja Techniczna

> **Rola:** Przewodnik Developera & Architektura Komponentów
> **Stack:** Next.js 16 (App Router), React 19 (Compiler enabled), TypeScript, Tailwind CSS 4, Shadcn/UI + HeroUI, React Flow, Vercel AI SDK.
> **Ostatnia aktualizacja:** 2026-03-01

---

## 🏗 Architektura: Vertical Slices + Modularny Monolit

Projekt jest zorganizowany wokół **modułów biznesowych** (Vertical Slices). Każdy moduł jest samowystarczalny i zawiera własną logikę domenową, aplikacyjną oraz UI.

### Struktura katalogów (src/)

```text
src/
├── app/                              # ROUTING (Next.js App Router)
│   ├── (auth)/                       # Layouty i strony autentykacji
│   ├── (canvas)/                     # Pełnoekranowy edytor Spaces
│   ├── (main)/                       # Główny interfejs roboczy (Sidebared)
│   ├── api/                          # Route Handlers (SSE, AI actions)
│   └── auth/                         # Callbacki Supabase
│
├── shared/                           # KERNEL (Wspólne zasoby)
│   ├── domain/                       # Globalne schematy Zod i typy
│   ├── infrastructure/               # Providers, Supabase client
│   ├── lib/                          # authenticatedClient, hooki systemowe
│   ├── config/                       # Nawigacja i stałe
│   └── ui/                           # UI Library (ui/, complex/, layout/)
│
└── modules/                          # MODUŁY BIZNESOWE (Slices)
    ├── agents/                       # Konfiguracja AI, Czat, AiProvider
    ├── auth/                         # Logika logowania, rejestracji i haseł
    ├── dashboard/                    # Widok powitalny (AI Hero Input)
    ├── inbox/                        # System powiadomień i akceptacji artefaktów
    ├── knowledge/                    # Zarządzanie wiedzą (Assets, Hubs)
    ├── projects/                     # Projekty, artefakty i zasoby kluczowe
    ├── prompts/                      # Zarządzanie system promptami
    ├── resources/                    # Narzędzia, usługi zewnętrzne, automatyzacje
    ├── settings/                     # Konfiguracja modeli LLM i silników RAG
    ├── spaces/                       # Edytor grafowy (React Flow), BlueprintEngine
    ├── system/                       # Diagnostyka i seeding danych
    ├── tools/                        # Katalog skilli agentów (NATIVE/MCP)
    └── workspaces/                   # Konfiguracja SOP (Templates), Zespołów (Crews)
```

---

## 💎 Shared Core & Patterns

### 1. Standardized Browser Pattern
Wszystkie widoki eksploracji (np. Projekty, Workspaces, Modele) muszą używać:
*   **`BrowserLayout`**: Standardowy kontener z wyszukiwarką i filtrami.
*   **`ResourceList<T>`**: Generyczny handler list (Skeletons, EmptyState, Grid/List).
*   **`useResourceFilters`**: Wspólna logika wyszukiwania i filtrowania.

### 2. SidePeek & Unified Inspectors
Boczny panel `SidePeek.tsx` (oparty na Radix Sheet) jest jedynym standardem wyświetlania szczegółów. W module `spaces` służy on jako kontener dla dedykowanych inspektorów węzłów.

### 3. API & Auth
Zakaz używania surowego `fetch`. Korzystamy z **`authenticatedClient`**, który zapewnia automatyczną autoryzację sesją Supabase.

---

## 🗺 Moduł Spaces (Canvas Engine)

Edytor wizualny oparty na **React Flow**.
*   **BlueprintEngine:** Automatyczna serializacja grafów do reużywalnych wzorców (Patterns).
*   **LOD (Level of Detail):** Wydajnościowe upraszczanie widoku węzłów przy dużym oddaleniu.
*   **Neural Shimmer:** System animacji informujący o pracy agentów na canvasie.

---

## 👨‍💻 Zasady Gry (Engineering Standards)

1.  **Generic-First:** Zawsze sprawdzaj, czy Twój komponent nie powinien trafić do `shared/complex`.
2.  **Czysta Domena:** Folder `domain/` wewnątrz modułu zawiera tylko czysty TypeScript.
3.  **Hybryda UI:** `Shadcn` dla prostych formatek, `HeroUI` dla złożonych widoków (np. Taby w inspektorach).
4.  **React Compiler:** Nie optymalizuj ręcznie `useMemo` – compiler Next.js 16 zrobi to lepiej.

---

## 🧪 Testowanie
*   **Vitest:** Testy jednostkowe logiki biznesowej i kontraktów Zod.
*   **Playwright (Backlog):** Testy E2E dla kluczowych procesów (np. "Create Project Flow").
