# Axon Frontend — Dokumentacja Techniczna

> **Rola:** Przewodnik Developera & Architektura Komponentów
> **Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Shadcn/UI, React Flow
> **Ostatnia aktualizacja:** 2026-02-24

---

## 🏗 Architektura: Vertical Slices + Modularny Monolit

### Struktura katalogów

```text
src/
├── app/                              # ROUTING (Next.js App Router)
│   ├── (main)/                       # Strony z głównym layoutem (sidebar)
│   │   ├── dashboard/                # Pulpit
│   │   ├── projects/                 # Projekty
│   │   ├── spaces/                   # Lista Spaces
│   │   ├── workspaces/               # Workspaces + podstrony
│   │   ├── inbox/                    # Skrzynka odbiorcza
│   │   ├── resources/                # Knowledge, Prompts, Services, Automations, Tools
│   │   └── settings/                 # LLM Providers, Models, Knowledge Engine
│   ├── (canvas)/                     # Strony z pełnoekranowym canvasem
│   │   └── spaces/[id]/             # Canvas View
│   └── (auth)/                       # Logowanie, rejestracja
│
├── shared/                           # WSPÓLNE ZASOBY
│   ├── ui/                           # Shadcn/UI components (Button, Input, Dialog...)
│   ├── domain/                       # Shared Zod schemas (workspaces.ts, ...)
│   ├── lib/                          # API client, utils
│   ├── config/                       # Navigation, constants
│   └── infrastructure/               # Auth provider, query client
│
└── modules/                          # MODUŁY BIZNESOWE
    ├── spaces/                       # Space Canvas (node graph)
    ├── workspaces/                   # Workspace config (Templates, Agents, Crews...)
    ├── projects/                     # Projekty i artefakty
    ├── agents/                       # Konfiguracja agentów
    ├── knowledge/                    # Knowledge Hubs & Sources
    ├── inbox/                        # Powiadomienia
    ├── resources/                    # Prompts, Services, Automations
    ├── settings/                     # LLM, Embedding, Chunking config
    ├── dashboard/                    # Dashboard widgets
    ├── auth/                         # Auth flows
    └── ...
```

### Warstwa wewnętrzna modułu

Każdy moduł ma spójną strukturę:

```text
modules/<nazwa>/
├── domain/          # Typy TS, enumy, stałe (CZYSTA DOMENA — zero Reacta!)
├── application/     # Hooki (useXxx), logika biznesowa, serwisy
├── infrastructure/  # API calls, mock data
└── ui/              # Komponenty React (widoki, inspektory, modale)
```

---

## 🧩 Kluczowe Moduły

### `modules/workspaces` — Konfiguracja Komponentów

Użytkownik definiuje reusable Template'y, Agentów, Crew, Patterns i Services.

| Plik | Rola |
|------|------|
| `ui/TemplatesSection.tsx` | Lista template'ów z SidePeek |
| `ui/modals/TemplateModal.tsx` | Formularz tworzenia Template z sekcjami **Required Inputs** i **Required Outputs** |
| `ui/AgentsSection.tsx` | Lista agentów |
| `ui/CrewsSection.tsx` | Lista crew z processem |
| `application/useTemplates.ts` | React Query hooks (CRUD) |
| `infrastructure/api.ts` | HTTP client calls |
| `infrastructure/mockApi.ts` | Mock data (dev mode) |

**Shared Schema:** `shared/domain/workspaces.ts` zawiera `TemplateSchema` z polami:
- `template_inputs: z.array(z.object({ id, label, expectedType }))` — wymagane wejścia
- `template_outputs: z.array(z.object({ id, label }))` — oczekiwane wyjścia

---

### `modules/spaces` — Space Canvas (Node Graph)

Interaktywny canvas oparty o `@xyflow/react` z node'ami: Zone, Agent, Template, Crew, Service, Automation.

| Plik | Rola |
|------|------|
| `domain/types.ts` | `TemplateContext`, `TemplateArtefact`, `SpaceTemplateDomainData` |
| `domain/defaults.ts` | `mapTemplateWorkspaceConfigToNodeData()` — mapper I/O |
| `domain/constants.ts` | `MAP_OF_AVAILABLE_COMPONENTS_BY_CATEGORY` |
| `application/hooks/useSpaceCanvasDragAndDropLogic.ts` | Drop handler — tworzy node z template data |
| `application/hooks/useSpaceCanvasModificationOperations.ts` | Sidebar add — tworzy node z template data |
| `application/hooks/useSpaceTemplateInspectorLogic.ts` | Logika inspektora (actions, contexts, artefacts) |
| `ui/SpaceCanvasLeftSidebar.tsx` | Sidebar z listą komponentów do dodania |
| `ui/inspectors/SpaceTemplateNodeInspector.tsx` | Inspektor template node'a |
| `ui/pure/SpaceTemplateNodeInspectorView.tsx` | Widok inspektora (tabs: Actions, Context, Artefacts) |

#### Przepływ danych Template I/O

```
┌─────────────────────────────────────┐
│ Workspaces: TemplateModal           │
│ User defines template_inputs &      │
│ template_outputs                    │
└────────────────┬────────────────────┘
                 │ drag & drop / sidebar click
                 ▼
┌─────────────────────────────────────┐
│ defaults.ts:                        │
│ mapTemplateWorkspaceConfigToNodeData│
│   template_inputs  → contexts[]    │
│   template_outputs → artefacts[]   │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│ Space Canvas: Template Node         │
│ Inspector tabs:                     │
│   📋 Actions — checklist items      │
│   🔗 Context — mapped from inputs   │
│   📦 Artefacts — mapped from outputs│
└─────────────────────────────────────┘
```

---

## 👨‍💻 Zasady Gry (Clean Architecture)

#### 1. Zasada "Recepcji" (Public API)
Import z innego modułu TYLKO przez `index.ts`:
*   ✅ `import { ProjectList } from "@/modules/projects";`
*   ❌ `import { ProjectList } from "@/modules/projects/features/browse/ui/list";`

#### 2. Zasada "Czystej Domeny"
Folder `domain/` = czysty TypeScript. Zero Reacta, zero hooków, zero HTML.

#### 3. Zasada "Kolokacji"
UI types żyją obok komponentu. NIE twórz globalnych `types/` dla UI-only kontraktów.

#### 4. `page.tsx` / `layout.tsx` = thin adapters
Nigdy nie wkładaj logiki biznesowej do plików routingu Next.js.

---

## 🧪 Testowanie

| Narzędzie | Komenda | Zakres |
|-----------|---------|--------|
| **Vitest** | `pnpm test` | Unit testy logiki i hooków |
| **TypeScript** | `pnpm tsc --noEmit` | Type checking |
| **ESLint** | `pnpm lint` | Linting |

---

## 🛠 Komendy developerskie

```bash
# Serwer dev
cd frontend && pnpm dev           # lub npm run dev

# Type checking
cd frontend && pnpm tsc --noEmit

# Lint
cd frontend && pnpm lint

# Testy
cd frontend && pnpm test
```

---

## 🚧 Backlog (Czego brakuje?)

1.  **Testy E2E (Playwright):** Automatyczne klikanie po interfejsie.
2.  **Error Boundaries:** Ładne komunikaty zamiast białego ekranu gdy API padnie.
3.  **Animacje (Framer Motion):** Płynniejsze przejścia i micro-interactions.
4.  **Offline support:** Service Worker + optimistic updates.
5.  **Template editing flow:** Edycja istniejących template'ów (inputs/outputs) po stworzeniu.