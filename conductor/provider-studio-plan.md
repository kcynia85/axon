# Plan Implementacji: Provider Studio

## Cel (Objective)
Zaprojektowanie i wdrożenie nowego widoku dla dodawania i konfiguracji dostawców LLM (Cloud, Meta-Provider, Local) w ramach modułu Studio. Widok będzie dynamicznie reagować na typ wybranego dostawcy, zachowując spójność z architekturą i konwencjami wypracowanymi w `CrewStudio`.

## Architektura i Założenia (Background & Architecture)
1. **Routing & Wejście**: Akcja z `settings/llms/providers` ("+ Dodaj Dostawcę") otworzy dedykowany kontener Provider Studio.
2. **Rozdział Logiki od UI**: 
   - `ProviderStudioContainer` jako Smart Component (logika zapisu, nawigacji, ładowania szkicu).
   - `ProviderStudioView` jako w 100% "Dumb Component" renderujący `StudioLayout`.
3. **Zarządzanie Stanem**: Zastosowanie `react-hook-form` z resolverem `zod`. Typ dostawcy (pole `provider_type`) będzie głównym elementem sterującym wyliczaniem postępu i widocznością poszczególnych pól.
4. **Zgodność Typów (Discriminated Unions)**: Użycie `z.discriminatedUnion("provider_type", [...])` w celu zapewnienia absolutnego bezpieczeństwa typów, eliminując nieprawidłowe kombinacje danych.
5. **Skalowalność**: Nowi providerzy w przyszłości (np. Edge/On-Device) będą dodawani jako kolejne warianty schematu i proste warunki `if` w komponentach sekcji, zachowując widok w pełni bezstanowy.

## Proponowana Struktura Plików
```text
frontend/src/modules/studio/features/provider-studio/
├── application/
│   ├── hooks/
│   │   ├── useProviderStudioSectionNav.ts
│   │   └── useProviderForm.ts
│   ├── provider-actions.ts
├── types/
│   ├── provider-schema.ts
│   ├── provider-studio.types.ts
│   └── sections.constants.ts
└── ui/
    ├── ProviderStudioContainer.tsx
    ├── ProviderStudio.tsx
    ├── ProviderStudioView.tsx
    ├── components/
    │   └── ProviderStudioSectionNav.tsx
    └── sections/
        ├── ProviderTypeSelectionSection.tsx
        ├── ProviderAuthSection.tsx
        ├── ProviderTokenizationSection.tsx
        ├── ProviderJsonSchemaSection.tsx
        └── ProviderApiAdapterSection.tsx
```

## Etapy Implementacji (Implementation Plan)

### Etap 1: Warstwa Domeny i Typów
- Utworzenie `provider-schema.ts` bazującego na projektach z FigmaJam. Rozdzielenie schematów dla Cloud, Meta i Local.
- Utworzenie `sections.constants.ts` opisującego sekcje nawigacyjne (Autoryzacja, Tokenizacja, JSON Schema, Adapter).
- Utworzenie `provider-studio.types.ts` łączącego formularz z View.

### Etap 2: Logika Aplikacji i Formularza
- Zbudowanie `useProviderForm.ts` konfigurującego `react-hook-form` i Zod.
- Odtworzenie logiki nawigacyjnej z CrewStudio w postaci `useProviderStudioSectionNav.ts`, aby w locie weryfikować ukończenie danej sekcji w oparciu o stan formularza.

### Etap 3: Konstrukcja UI (Sekcje Formularza)
- `ProviderTypeSelectionSection`: komponent pozwalający wybrać rodzaj Providera (zmieniający `provider_type` w tle).
- `ProviderAuthSection`: pola bazowe + URL + klucz API. Dynamiczne pokazywanie `custom_headers` tylko dla Meta.
- `ProviderTokenizationSection`: wybór strategii tokenizacji oraz `tokenization_fallback` dla Meta, a dla Local opcje rozliczeń.
- `ProviderJsonSchemaSection` i `ProviderApiAdapterSection`: standardowe sekcje bazowe.

### Etap 4: Integracja Widoku i Kontenera
- Implementacja `ProviderStudioView` opartego o `StudioLayout` (zdefiniowanie canvas, footer, nav).
- Budowa `ProviderStudio` łączącego kontekst formularza.
- Implementacja `ProviderStudioContainer` obsługującego mockowy zapis (i przygotowanego na docelowe server actions).
