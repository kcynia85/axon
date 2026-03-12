# Plan Implementacji: Archetype Studio

## 1. Analiza wymagań z UI (Archetype Studio)

Formularz konfiguracji Archetypu z pliku FigJam dzieli się na trzy logiczne obszary (sekcje), idealnie dopasowane do dostępnych w systemie komponentów wizualnych (`FormSection`, `FormNavItem` itd.):

**Sekcja 1: Tożsamość (Identity)**
*   **Rola:** Pole tekstowe (komponent: `FormTextField`).
*   **Cel:** Pole tekstowe (`FormTextField`).
*   **Backstory (Meta Prompt):** Duże pole opisowe (`FormTextarea`).
*   **Keywords:** Edytor słów kluczowych (`FormTagInput`).

**Sekcja 2: Pamięć i Rozumowanie (Memory & Cognition)**
*   **Huby Wiedzy (Knowledge Hubs):** Wybór repozytoriów wiedzy (Product Management Hub, Discovery Hub). Użyty zostanie multiselect `FormSelect` z właściwością `multiple={true}`.
*   **Guardrails:**
    *   *Zasady działania (Instructions):* Lista instrukcji używająca `FormDynamicList`.
    *   *Ograniczenia (Constraints):* Lista ograniczeń używająca `FormDynamicList`.

**Sekcja 3: Dostępność (Workspaces)**
*   Ustawienie dostępu: "Globalne" lub ukierunkowane na konkretne grupy przestrzeni roboczych (np. "Product Management", "Discovery", "Design", "Delivery", "Growth & Market"). Użycie powtarzalnych elementów `FormCheckbox`.

---

## 2. Architektura i Warstwy (Zgodność z wytycznymi)

Kod zostanie umieszczony z zachowaniem Modular Monolith w strukturze: `frontend/src/modules/studio/features/archetypes`.

### Faza 1: Warstwa Domeny (Domain)
*Plik: `src/modules/studio/features/archetypes/domain/types.ts`*
- Utworzenie niezmiennych typów TypeScript, odzwierciedlających "Ubiquitous Language" bez klas.
- Deklaracja typu `ArchetypeDraft` zawierającego m.in. `role`, `goal`, `backstory`, `keywords`, `knowledgeHubIds`, `instructions`, `constraints`, `isGlobalAccess`, `workspaceIds`.

### Faza 2: Warstwa Aplikacji (Application)
*Pliki: `archetypeSchema.ts`, `useArchetypeForm.ts`*
- Budowa ścisłego schematu w `zod` do walidacji danych przed wysłaniem.
- Implementacja customowego hooka opakowującego bibliotekę `react-hook-form` z rezolwerem Zod. Zwracanie gotowych propów dla UI bez logiki ukrytej bezpośrednio w widoku (Pure View).

### Faza 3: Warstwa Infrastruktury (Infrastructure)
*Plik: `archetypeActions.ts` (Server Actions) lub hooki TanStack Query*
- Przygotowanie asynchronicznych funkcji obsługujących żądanie mutacji (np. `createArchetype`), w pełni unikając pobierania danych wewnątrz hooków z efektami ubocznymi ("Zero useEffect").

### Faza 4: Warstwa Widoku (UI Components)
Podział na jednozadaniowe (SRP), "czyste" komponenty wizualne wykorzystujące paczkę elementów z `@/shared/ui/form/*`.
- `ArchetypeIdentitySection.tsx`: Zbierająca pola Tożsamości.
- `ArchetypeMemorySection.tsx`: Formularze dla Hubów, Zasad i Ograniczeń.
- `ArchetypeAccessSection.tsx`: Obsługa widoczności dla Workspaces.
- `ArchetypeStudioView.tsx`: Komponent orkiestrujący całość. Zbudowany z siatki CSS grid oraz nawigacji opartej o `FormNavContainer`, łączący interfejs formularza z danymi.

### Faza 5: Adapter Frameworka (App Router)
*Plik: `src/app/.../studio/archetypes/new/page.tsx`*
- Służy wyłącznie jako cienka warstwa serwująca komponent `<ArchetypeStudioView>`, przekazując przez props wymagane początkowe dane konfiguracyjne ze słowników serwerowych.

## 3. Zgodność z "Coding Standards"
- **KISS & Functional-first:** Czyste, funkcyjne komponenty React i separacja typów.
- **Pure View:** UI nie wie nic o tym "jak" dane są fetchowane lub walidowane, przyjmuje propsy/wywołania.
- **Immutability:** Dane zarządzane tylko deklaratywnie przez React Hook Form i Zod.
- **Zero useEffect:** Zastąpienie efektów side-effect wzorcem event-driven mutations w onSubmit.