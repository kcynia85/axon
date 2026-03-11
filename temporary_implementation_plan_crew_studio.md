# Plan Implementacji: Crew Studio - STATUS: ZAKOŃCZONO ✅

Poniższy plan został przygotowany na podstawie analizy makiet (Hierarchical, Parallel, Sequential) oraz wytycznych architektonicznych projektu (`00_coding_standards.md`, `stack_react_nextjs.md` - Modular Monolith, Pure View, Zero useEffect, komponenty z `shared/ui/form`).

## Faza 1: Typy i Walidacja (Domain & Types) - DONE ✅
- [x] Utworzenie struktury katalogów: `frontend/src/modules/studio/features/crew-studio/{types,application,ui}`.
- [x] Zdefiniowanie schematu walidacji Zod (`types/crew-schema.ts`). Schemat musi być dyskryminowanym union type ze względu na pole `collaborationType` (Hierarchical, Parallel, Sequential).
- [x] Wygenerowanie i wyeksportowanie natywnych typów TypeScript na podstawie schematu Zod (np. `CrewFormData`).

## Faza 2: Logika Aplikacji (Application Logic) - DONE ✅
- [x] Implementacja głównego hooka `application/useCrewForm.ts` inicjalizującego `react-hook-form` w połączeniu z `zodResolver`.
- [x] Implementacja logiki czyszczenia/resetowania specyficznych pól podczas zmiany typu współpracy (np. usunięcie zdefiniowanych zadań sekwencyjnych po przełączeniu na tryb równoległy).
- [x] Implementacja kalkulacji szacunkowego kosztu jako **Derived State** (wykorzystując metodę `watch` na wybranej puli agentów/zadań bez użycia `useEffect`).

## Faza 3: Komponenty Prezentacyjne (UI & Components - Pure View) - DONE ✅
Wszystkie komponenty powinny korzystać z istniejącego ekosystemu `frontend/src/shared/ui/form/**`.

- [x] Implementacja Layoutu `ui/CrewStudio.tsx` (główny wrapper formularza, nagłówek, stopka z przyciskami zapisu).
- [x] Implementacja `ui/sections/CrewBasicInfoSection.tsx` (Cel: `FormTextarea`, Keywords: `FormTagInput`).
- [x] Implementacja `ui/sections/CrewTypeSelectionSection.tsx` (Przełącznik wyboru procesu współpracy).
- [x] Implementacja dynamicznej sekcji wykonawczej `ui/sections/CrewExecutionSection.tsx`, która za pomocą switcha renderuje:
  - [x] `ui/sections/execution/HierarchicalExecution.tsx` (lista `FormSelect` multiple dla dostępnych agentów).
  - [x] `ui/sections/execution/ParallelExecution.tsx` (pola `FormTextarea` dla "Owner's Goal" i opcjonalnej instrukcji oraz wybór agentów).
  - [x] `ui/sections/execution/SequentialExecution.tsx` (integracja `useFieldArray`, dynamiczne dodawanie kroków Task, w każdym Tasku treść i pojedynczy `FormSelect` do wyboru Specjalisty).
- [x] Implementacja `ui/sections/CrewAvailabilitySection.tsx` (Wykorzystanie `FormCheckbox` w siatce do określania widoczności załogi).

## Faza 4: Zarządzanie Danymi i Mutacje (RSC & Server Actions) - DONE ✅
- [x] Utworzenie punktu wejścia w Next.js (`frontend/src/app/workspaces/[workspace]/crews/studio/page.tsx`) jako **React Server Component (RSC)**.
- [x] Realizacja fetchowania danych początkowych (agenci) bezpośrednio w RSC i przekazanie ich jako statyczne `props` do komponentu klienckiego (Zasada *Zero useEffect* na kliencie).
- [x] Implementacja akcji zapisu – utworzenie **Server Action** z dyrektywą `"use server"` w `application/crew-actions.ts`.
- [x] Połączenie Server Action z `handleSubmit` formularza poprzez `CrewStudioContainer.tsx`.
- [x] Zabezpieczenie ścieżki i widoku z wykorzystaniem `<Suspense fallback={<CrewStudioSkeleton />}>` oraz obsługi błędów w `error.tsx`.
