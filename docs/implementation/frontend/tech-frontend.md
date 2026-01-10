# Axon Frontend — Dokumentacja Techniczna

> **Rola:** Przewodnik Developera & Komponenty
> **Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI

Hej Frontendowcu! 🎨 Tutaj dowiesz się, jak nie zgubić się w kodzie naszej aplikacji.

---

## 🏗 Architektura: Vertical Slices (Kawałki Tortu)

Większość starych aplikacji to "Layer Cake" (Tort Warstwowy): osobna warstwa na UI, osobna na logikę, osobna na API. Żeby dodać jeden guzik, musisz przekopać się przez 5 folderów w różnych miejscach projektu. Koszmar.

My używamy **Vertical Slice Architecture**. Wyobraź sobie, że kroisz tort pionowo.
Jeden "Kawałek" (Slice) to jedna kompletna funkcja, np. "Utwórz Projekt".

W tym jednym folderze masz wszystko, czego potrzebujesz:
*   Wygląd (UI)
*   Logikę (Application)
*   Połączenie z serwerem (Infrastructure)

### Struktura Folderów

```text
src/
├── app/                        # Routing (Next.js). Tutaj tylko spinamy klocki.
│   ├── dashboard/page.tsx      # Strona Dashboardu
│   └── ...
│
├── shared/                     # WSPÓLNE ZASOBY (Używaj ostrożnie!)
│   ├── ui/                     # Klocki LEGO (Shadcn/UI) - Buttony, Inputy
│   └── lib/                    # Narzędzia (np. klient API)
│
└── modules/                    # GŁÓWNE MODUŁY BIZNESOWE
    ├── projects/               # [MODUŁ PROJEKTÓW]
    │   ├── index.ts            # "Recepcja" modułu. Tylko to co tu jest, jest publiczne.
    │   ├── domain/             # SŁOWNIK. Typy danych (np. interface Project).
    │   │
    │   └── features/           # KONKRETNE FUNKCJE (SLICES)
    │       ├── browse-projects/# [SLICE: Przeglądanie Projektów]
    │       │   ├── ui/         # Komponent <ProjectList>
    │       │   ├── application/# Hook useProjectList()
    │       │   └── infrastructure/ # Pobieranie danych z API
    │       │
    │       ├── create-project/ # [SLICE: Tworzenie Projektu]
    │       │   ├── ui/
    │       │   └── ...
```

---

## 👨‍💻 Zasady Gry (Clean Architecture)

Żeby nie zrobić bałaganu, mamy kilka żelaznych zasad. Traktuj je poważnie!

#### 1. Zasada "Recepcji" (Public API)
Jeśli jesteś w folderze `app/` albo w *innym* module, możesz importować rzeczy TYLKO z pliku `index.ts` danego modułu.
*   ✅ `import { ProjectList } from "@/modules/projects";` (Wchodzisz głównym wejściem)
*   ❌ `import { ProjectList } from "@/modules/projects/features/browse/ui/list";` (Nie wchodź przez okno!)

#### 2. Zasada "Samowystarczalności" (Inside a Slice)
Gdy pracujesz nad funkcją (np. `create-project`), masz pełną swobodę wewnątrz swojego folderu.
Możesz importować:
*   Swoje własne pliki (`./ui`, `./application`)
*   Typy z Domeny (`../../domain`)
*   Wspólne klocki (`@/shared/ui`)

#### 3. Zasada "Czystej Domeny" (Domain)
Folder `domain/` to świętość. Tam jest czysty TypeScript. Żadnego Reacta, żadnych hooków, żadnego HTMLa. Tylko czysta logika i typy.

---

## 🧪 Jak to testujemy?

Używamy **Vitest**. To taki szybszy brat Jest'a.
*   `npm run test` - odpala testy.
*   Staramy się testować logikę biznesową i hooki, mniej skupiamy się na testowaniu czy guzik ma kolor czerwony (chyba że to kluczowe).

---

## 🚧 Backlog (Czego brakuje?)

1.  **Testy E2E (Playwright):** Jeszcze ich nie ma. Musimy je napisać, żeby automatycznie klikały po stronie.
2.  **Pełna obsługa błędów:** Czasami jak API padnie, użytkownik widzi biały ekran. Potrzebujemy ładnych "Error Boundaries".
3.  **Animacje:** Interfejs jest trochę sztywny. Przydałoby się więcej życia (Framer Motion).