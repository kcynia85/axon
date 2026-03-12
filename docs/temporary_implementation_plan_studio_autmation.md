### 1. Analiza wymagań i mapowanie komponentów (na podstawie FigJam)

Zgodnie z projektem ekranu "New/Edit Automation", formularz dzieli się na 4 kroki, które będą odpowiadały 4 sekcjom (Sections) w layoutcie Studio. Użyjemy istniejących, gotowych komponentów z `@frontend/src/shared/ui/form/**`.

#### Krok 1: Definicja (Definition)
*   **Opis semantyczny (dla AI)** – pole wieloliniowe na opis.
    *   *Komponent:* `FormTextarea` / `FormItemField`
*   **Keywords** – lista słów kluczowych dodawana dynamicznie.
    *   *Komponent:* `FormTagInput`

#### Krok 2: Konfiguracja Połączenia (Connection Configuration)
*   **Platforma (np. n8n)** – rozwijana lista platform wspieranych w systemie.
    *   *Komponent:* `FormSelect` (opcje statyczne lub pobierane np. n8n, Make, Custom)
*   **Metoda (np. POST)** – wybór metody HTTP.
    *   *Komponent:* `FormSelect`
*   **Adres URL (Webhook)** – standardowe pole tekstowe.
    *   *Komponent:* `FormTextField`
*   **Autoryzacja**:
    *   Klucz w nagłówku (Header Auth) – *Komponent:* `FormSelect` (typ autoryzacji).
    *   Nazwa Nagłówka – *Komponent:* `FormTextField`.
    *   Wartość (Sekret) – *Komponent:* `FormTextField` (z typem inputa "password").

#### Krok 3: Interfejs Danych (Data Interface)
Obie podsekcje będą używały komponentu `FormPropertyTable`, który już obsługuje definiowanie nazwy (`Name`), formatu (`Type/Format`) oraz wymagania (`Req.`).
*   **Context** – wejście dla automatyzacji (np. `profile_link`, `session_key`).
    *   *Komponent:* `FormPropertyTable`
*   **Artefact** – oczekiwany rezultat (np. `leads_csv`).
    *   *Komponent:* `FormPropertyTable`

#### Krok 4: Dostępność (Availability)
*   **Wybór departamentów/widoczności** (Globalne, Product Management, Discovery, Design, Delivery, Growth & Market).
    *   *Komponent:* wielokrotny `FormCheckbox` lub zintegrowana lista `FormRadio` w ramach grupy pól.

---

### 2. Architektura i struktura plików (Modular-First)

Moduł znajdzie się w obrębie `src/modules/studio/features/automation-studio`. Zgodnie z architekturą, rozdzielimy warstwę logiki (hooki z formularzem) od widoku (komponenty sekcji i layout).

```text
frontend/src/modules/studio/features/automation-studio/
├── application/
│   └── useAutomationForm.ts                 # Logika formularza (react-hook-form + zod)
├── types/
│   ├── automation-schema.ts                 # Schemat walidacji Zod oraz typy TypeScript
│   └── sections.constants.ts                # Definicje ID i nazw sekcji dla nawigacji
└── ui/
    ├── AutomationStudio.tsx                 # Główny kontener widoku (Pure View z FormProvider)
    ├── components/
    │   ├── AutomationSectionNav.tsx         # Nawigacja lewego panelu dla Automation Studio
    │   └── AutomationLivePoster.tsx         # Prawy panel poglądowy "Poster"
    └── sections/
        ├── AutomationDefinitionSection.tsx  # Krok 1 (FormSection)
        ├── AutomationConnectionSection.tsx  # Krok 2 (FormSection)
        ├── AutomationInterfaceSection.tsx   # Krok 3 (FormSection)
        └── AutomationAvailabilitySection.tsx# Krok 4 (FormSection)
```

---

### 3. Implementacja Krok po Kroku

#### Krok A: Schemat danych i Typy (`automation-schema.ts`)
Zdefiniowanie kontraktu danych w Zod. Pełna inferencja typów z zapewnieniem bezpieczeństwa (`strict: true`).

```typescript
import { z } from "zod";

const propertySchema = z.object({
  name: z.string().min(1, "Nazwa jest wymagana"),
  field_type: z.string(),
  is_required: z.boolean().default(false),
});

export const automationFormSchema = z.object({
  definition: z.object({
    semanticDescription: z.string().min(1, "Opis jest wymagany"),
    keywords: z.array(z.string()).default([]),
  }),
  connection: z.object({
    platform: z.string().min(1, "Wybierz platformę"),
    method: z.string().min(1, "Wybierz metodę"),
    url: z.string().url("Podaj poprawny URL"),
    auth: z.object({
      type: z.string(),
      headerName: z.string().optional(),
      secret: z.string().optional(),
    }),
  }),
  dataInterface: z.object({
    context: z.array(propertySchema).default([]),
    artefacts: z.array(propertySchema).default([]),
  }),
  availability: z.object({
    isGlobal: z.boolean().default(false),
    departments: z.array(z.string()).default([]),
  }),
});

export type AutomationFormData = z.infer<typeof automationFormSchema>;
```

#### Krok B: Logika formularza (`useAutomationForm.ts`)
Zgodnie z zasadą *"Zero useEffect"* dla logiki biznesowej, całe powiązanie odbywa się przez React Hook Form + resolver.

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { automationFormSchema, type AutomationFormData } from "../types/automation-schema";

export const useAutomationForm = (initialData?: Partial<AutomationFormData>) => {
  const form = useForm<AutomationFormData>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: {
      definition: { semanticDescription: "", keywords: [] },
      connection: { platform: "n8n", method: "POST", url: "", auth: { type: "header" } },
      dataInterface: { context: [], artefacts: [] },
      availability: { isGlobal: false, departments: [] },
      ...initialData,
    },
  });

  return { form };
};
```

#### Krok C: Budowa Widoków (`ui/AutomationStudio.tsx` i Sekcje)
Główny komponent renderujący na wierzchu aplikacji jako overlay z zachowaniem identycznego layoutu co `AgentStudio` i `CrewStudio`. Użyjemy `StudioLayout` jako szkieletu.

1. **AutomationStudio.tsx** – montuje całość używając `FormProvider` dla formularza oraz stanu dla nawigacji (`activeSection`, `scrollToSection`). Posiada `fixed inset-0 z-[200]` tak samo jak `ServiceStudio`.
2. **Sekcje**:
   - Wykorzystają `FormSection` (kontener z ID oraz linią przerywaną), `FormHeading`, `FormSubheading`.
   - Każde wejście danych obudowane za pomocą kontrolera RHF lub custom hooków (np. podpięcie `FormPropertyTable` za pomocą `useFieldArray` z React Hook Form w `AutomationInterfaceSection.tsx`).

#### Krok D: Integracja w Routing (`/resources/automations/page.tsx`)
Zgodnie z wymogami, komponent uruchamiany jest po kliknięciu buttona "+ Register Service" w widoku strony:

```tsx
// frontend/src/app/(main)/resources/automations/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/ui/Button";
import { AutomationStudio } from "@/modules/studio/features/automation-studio/ui/AutomationStudio";

export default function AutomationsPage() {
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Automations</h1>
        {/* Wywołanie Studio */}
        <Button onClick={() => setIsStudioOpen(true)}>+ Register Service</Button>
      </div>

      {/* Lista istniejących automatyzacji... */}

      {isStudioOpen && (
        <AutomationStudio 
          onSave={(data) => {
            console.log("Saved data", data);
            setIsStudioOpen(false);
          }}
          onCancel={() => setIsStudioOpen(false)}
        />
      )}
    </div>
  );
}
```

---

### 4. Zgodność z założonymi wytycznymi

1. **Kodowanie:** Explicit return types, zero `any`, użycie niemutowalności (hook form trzyma stan, brak ukrytych mutacji), nazewnictwo według domeny DDD (`semanticDescription`, `dataInterface`, `context`).
2. **"Zero useEffect":** Walidacja i submission opiera się natywnie na Hook Form. Nawigacja wywoływana za pomocą refów na interakcji onClick (jak w `scrollToSection`).
3. **Spójność UI:** Studio zaimplementowane poprzez generyczny `StudioLayout` współdzielony z Agento/Crew Studio. Użycie już istniejących komponentów z katalogu `shared/ui/form` (`FormSelect`, `FormTagInput`, `FormPropertyTable`, `FormCheckbox`), co wprost buduje ten sam wizualny sznyt bez nadmiarowego CSSa.