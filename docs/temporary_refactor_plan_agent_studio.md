# Plan Refaktoryzacji: AgentStudio.tsx

### 📂 Krok 1: Docelowe drzewo katalogów (po refaktoryzacji)

Struktura opiera się na **Modular-first** oraz **Vertical Slice Architecture**.

```text
@frontend/src/
├── shared/
│   └── ui/
│       └── form/                          # Nowe, wyabstrahowane komponenty Axon
│           ├── TagInput.tsx
│           ├── SearchableSelect.tsx
│           ├── DynamicListInput.tsx
│           ├── SelectableCard.tsx
│           └── PropertyTableInput.tsx
│
└── modules/
    └── studio/
        └── features/
            └── agent-studio/
                ├── types/
                │   └── agent-studio.types.ts       # Typy, interfejsy i schematy
                │
                ├── application/
                │   ├── hooks/
                │   │   ├── useAgentFormState.ts    # Logika formularza (useFieldArray, useWatch)
                │   │   ├── useStudioScroll.ts      # Logika Intersection Observera i scrolla
                │   │   └── useStudioShortcuts.ts   # Logika skrótów klawiszowych (useEffect escape hatch)
                │   └── useAgentStudio.ts           # Główna fasada dla UI (kompozycja hooków)
                │
                └── ui/
                    ├── AgentStudio.tsx             # Główny layout i provider (Zustand/FormContext)
                    ├── components/
                    │   └── StudioSectionNav.tsx    # Boczna nawigacja (01, 02, 03...)
                    └── sections/
                        ├── IdentitySection.tsx     # (Sekcja 1) Avatar, Nazwa, Cel, Backstory, TagInput
                        ├── CognitionSection.tsx    # (Sekcja 2) Huby (SearchableSelect), Guardrails (DynamicListInput)
                        ├── EngineSection.tsx       # (Sekcja 3) Model (SearchableSelect), Temperature
                        ├── SkillsSection.tsx       # (Sekcja 4) Native/Custom Skills (SelectableCard)
                        ├── InterfaceSection.tsx    # (Sekcja 5) Context, Artefacts (PropertyTableInput)
                        └── AvailabilitySection.tsx # (Sekcja 6) Deployment Scope (SelectableCard)
```

---

### 🧱 Krok 2: Komponenty formularzy "Axon" do wydzielenia

W pliku znajduje się wiele fragmentów kodu, które powinny być generycznymi elementami systemu designu (Design System). Wydzielimy je do `@frontend/src/shared/ui/form/`:

1. **`TagInput`** (zastąpi inline'owy input "Keywords"):
   - Pole pozwalające wpisywać tekst i konwertować go na "Badges/Tags" po wciśnięciu `Enter` lub `,`.
2. **`SearchableSelect`** (zastąpi inline'owe Hubs i Models):
   - Złożony dropdown (oparty na `DropdownMenu` lub natywnym Popover API) z wbudowaną wyszukiwarką, listą "Ostatnio używanych" oraz pełną listą opcji.
3. **`DynamicListInput`** (zastąpi Instructions i Constraints):
   - Generyczna lista inputów tekstowych z przyciskiem "Plus" do dodawania i ikoną kosza do usuwania elementów (integruje się bezszwowo z `useFieldArray`).
4. **`SelectableCard`** (zastąpi checkboxy "Reflexion Mode", "Grounded Mode", "Skills", "Availability"):
   - Przycisk udający kartę (border, tło na hover/aktywację) ze zintegrowanym `Checkboxem`, tytułem, opisem i opcjonalną ikoną.
5. **`PropertyTableInput`** (zastąpi sekcję Interface - Context & Artefacts):
   - Gridowa struktura pozwalająca definiować nazwę pola, typ (select) oraz wymagalność (checkbox) w jednym wierszu.

---

### 🛤️ Krok 3: Plan krok po kroku (Step-by-Step)

**Faza 1: Typowanie i System Design (Przygotowanie)**
- [x] 1. Utworzyć `agent-studio.types.ts` i przenieść/zdefiniować tam typy takie jak `AgentStudioState`, interfejsy dla sekcji oraz stałe `ALL_MODELS`, `ALL_HUBS`.
- [x] 2. Wyekstrahować i zbudować 5 generycznych komponentów formularzy opisanych w Kroku 2 wewnątrz `shared/ui/form/`.

**Faza 2: Abstrakcja Logiki (Custom Hooks)**
- [x] 1. Utworzyć `useStudioShortcuts.ts` i przenieść tam logikę nasłuchującą na `Ctrl+S` oraz `Escape` (zgodnie z "Zero useEffect paradigm", zamykamy subskrypcje DOM w dedykowanym hooku).
- [x] 2. Utworzyć `useStudioScroll.ts` i wynieść tam `IntersectionObserver` oraz logikę płynnego scrollowania (`scrollToSection`). Re-wykorzystamy natywne API przeglądarki i referencje.
- [x] 3. Utworzyć `useAgentFormState.ts`, aby przenieść zarządzanie polami dynamicznymi (lokalne stany `keywordInput`, `modelSearch` itd. znikną, ponieważ zostaną zhermetyzowane w nowych komponentach z Fazy 1).

**Faza 3: Dzielenie Widoków (Reguła < 200 LOC)**
- [x] 1. Rozbić moloch formularza na niezależne sekcje w `ui/sections/`: `IdentitySection.tsx`, `CognitionSection.tsx`, itd.
- [x] 2. Zamiast przekazywać cały obiekt `form` przez propsy, w każdej sekcji wywołać `useFormContext()` z biblioteki `react-hook-form`, aby komponent sam pobrał kontroler formularza.
- [x] 3. Przenieść logikę nawigacji bocznej (kalkulację progresu sekcji) do `StudioSectionNav.tsx`. Obliczenia `getProgress` powinny być wywoływane "w locie" podczas renderowania (Derived State - zero useEffect).

**Faza 4: Kompozycja i Czyszczenie (Finalny AgentStudio.tsx)**
- [x] 1. Złożyć `AgentStudio.tsx` z powrotem. Jego jedyną rolą będzie teraz inicjalizacja hooków, trzymanie głównego stanu (stan `step`: "discovery" | "design") oraz ułożenie layoutu (`StudioLayout`). Plik ten skurczy się z ~750 do ok. 100-150 linijek.

✅ **REFAKTORYZACJA UKOŃCZONA POMYŚLNIE**

---

### ⚠️ Krok 4: Potencjalne ryzyka i metody ich uniknięcia

1. **Ryzyko: Prop Drilling i Piekło Zależności**
   - *Problem:* Rozbicie na mniejsze pliki może kusić do przekazywania stanu formularza (`form`, `watchedValues`, metody `append/remove`) w dół przez 3-4 poziomy propsów.
   - *Rozwiązanie (Standardy RHF):* Wykorzystamy `FormProvider` z `react-hook-form` na poziomie `AgentStudio.tsx`. Każdy z komponentów sekcji użyje `useFormContext()` do wyciągnięcia potrzebnych danych.

2. **Ryzyko: Nadmierne Re-rendery (Performance Drop)**
   - *Problem:* Obecny kod używa potężnego `useMemo` na wielkim obiekcie `watchedValues`, w którym nasłuchuje na zmiany kilkunastu pól. Powoduje to, że wpisanie jednej litery np. w `agent_name` przerenderowuje całą aplikację.
   - *Rozwiązanie (Standardy RHF):* Usuniemy globalny koszyk `useWatch`. Izolujemy `useWatch` lokalnie: np. `<LivePoster />` będzie sam nasłuchiwał tylko tych pól, których potrzebuje do podglądu. Sekcje formularza nie będą się nawzajem przerenderowywać.

3. **Ryzyko: Utrata stanu przy zmianie trybu ("discovery" <-> "design")**
   - *Problem:* Zmiana `step` powoduje unmount formularza. Jeśli nie zapiszemy danych, po powrocie z biblioteki draft zniknie.
   - *Rozwiązanie (Standardy Zustand/Next):* Cały draft formularza jest/będzie synchronizowany do globalnego magazynu Zustand (lub lokalnego Storage'u) podczas `onBlur` lub za pomocą Server Actions. Dzięki temu stan przeżyje odmontowanie komponentu. Wprowadzimy też zasadę wyprowadzania skutków ubocznych do Event Handlerów zamiast nasłuchiwać ich w `useEffect`.

4. **Ryzyko: Nieprawidłowa implementacja `SearchableSelect` (Problemy z a11y)**
   - *Problem:* Zbudowanie własnego, skomplikowanego comboboxa grozi złamaniem dostępności (focus trap, klawiatura).
   - *Rozwiązanie (Standardy UI):* Zgodnie z wytyczną ze `stack_react_nextjs.md`, zastosujemy **Radix UI Primitives** (obecne pod spodem w naszych komponentach np. `DropdownMenu`) lub natywne `Popover API` do stworzenia wyabstrahowanych komponentów formularzy, gwarantując dostępność.