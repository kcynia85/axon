# Plan Refaktoryzacji - Cost Estimator & Internal Skills Modal

Zgodnie z weryfikacją, w systemie istnieją obecnie dwa komponenty CostEstimatora:
- Prawidłowy, używany w prawej kolumnie Agent Studio: `frontend/src/modules/agents/ui/CostEstimator/CostEstimator.tsx`
- Zdezaktualizowany (legacy): `frontend/src/modules/workspaces/ui/CostEstimator.tsx`

Poniższy plan opiera się na dostarczonych Core Principles.

## 1. Refaktoryzacja Cost Estimator

### Cele (KISS, DRY, Modular-first, Readability over cleverness)
1. **Usunięcie legacy kodu:**
   - Całkowite usunięcie pliku `frontend/src/modules/workspaces/ui/CostEstimator.tsx`.
   - Zastąpienie wszystkich użyć starego estymatora nowym komponentem z `modules/agents/ui/CostEstimator`.
   - Gdzie potrzebne, zaimplementowanie warstwy mapującej (adaptera) przekształcającej obiekty typu `CostEstimate` z `domain/workspaces` na nowy `CostEstimatorData`, tak aby utrzymać oddzielenie danych biznesowych od widoku.

2. **Dekompozycja prawidłowego komponentu (Readability over cleverness, Modular-first):**
   Obecny `CostEstimator.tsx` zawiera wiele sub-komponentów w jednym pliku. Należy je wyciągnąć do osobnych plików w katalogu `frontend/src/modules/agents/ui/CostEstimator`:
   - `AiSuggestions.tsx`
   - `CostProgressBar.tsx`
   - `CostDetailsAccordion.tsx`
   
3. **Pure View Principle:**
   - Główny plik `CostEstimator.tsx` pozostanie czystym widokiem pełniącym rolę kompozycji dla w/w plików i przyjmującym wyłącznie zdefiniowany interfejs `CostEstimatorData` (oraz ewentualnie opcjonalne klasy/style). Nie zawiera żadnej ukrytej logiki wyliczania stanu.

## 2. Refaktoryzacja Internal Skills Modal

### Cele (Pure View principle, SRP, Explicit over implicit, ISP)
1. **Oczyszczenie Modala z wbudowanego stanu (Pure View, SRP):**
   - Komponent `InternalSkillsModal` z `frontend/src/modules/studio/features/agent-studio/ui/components/InternalSkillsModal.tsx` nie powinien instancjonować hooka `useInternalSkillsModal` w swoim ciele. 
   - Modal stanie się "głupim widokiem" otrzymującym pełen interfejs propsów do sterowania danymi i akcjami:
     ```tsx
     interface InternalSkillsModalProps {
       readonly isOpen: boolean;
       readonly onOpenChange: (open: boolean) => void;
       readonly onAddFunction: (functionId: string) => void;
       readonly searchQuery: string;
       readonly onSearchChange: (query: string) => void;
       readonly filterGroups: FilterGroup[];
       readonly onApplyFilters: (selectedIds: string[]) => void;
       readonly onClearFilters: () => void;
       readonly skills: ReadonlyArray<SkillViewItem>; // Konkretny typ zamiast wyliczania z addedFunctionIds
     }
     ```

2. **Wykluczenie "any" i warunków w mapowaniu (Explicit over implicit, Readability):**
   - Pozbycie się argumentu `any` (np. `filteredFunctions.map((fn: any) => ...)`).
   - Przeniesienie wyliczania, czy funkcja została dodana (`isAdded`), do warstwy nadrzędnej. Widok powinien po prostu dostać zmapowany model DTO, np. obiekt z właściwością `isAdded: boolean`, zamiast każdorazowo liczyć `addedFunctionIds.includes(fn.id)` przy renderowaniu elementów.

3. **Naprawa hooka z ukrytym stanem (ISP, First generic functions):**
   - W `frontend/src/modules/studio/features/agent-studio/application/hooks/sections/useInternalSkillsModal.ts` znajduje się twarda zależność od wewnętrznej stałej `CUSTOM_FUNCTIONS`.
   - Należy zrefaktoryzować tego hooka tak, aby stał się generycznym elementem zarządzania listą i wyszukiwaniem, przyjmującym `skills` jako parametr na wejściu. Usunie to ukryte wstrzykiwanie danych i ułatwi ewentualne użycie wyszukiwania na listach pobieranych asynchronicznie.
   - Hook powinien zwracać sformatowaną i przefiltrowaną listę (gotową na potrzeby widoku – uwzględniając, co już jest zaznaczone).

4. **Wykorzystanie DDD Mindset / Single Responsibility Principle:**
   - Logika biznesowa zarządzająca tym modale (otwieranie go, trzymanie stałej `CUSTOM_FUNCTIONS`, przekazywanie nowo wybranej umiejętności do `SkillsSection` lub `AgentStudio`) powinna znajdować się bezpośrednio w sekcji wykorzystującej ten modal. Modal ma stanowić zamkniętą kapsułę jedynie dla prezentacji danych i interakcji z UI.

## Podsumowanie Architektoniczne
Zastosowanie powyższych zasad całkowicie odetnie widoki od ukrytej logiki obliczeniowej, stanu modali czy "sztywnych stałych". Usunięcie zduplikowanego kodu starego estymatora, podzielenie nowego na dedykowane struktury plików i unifikacja typów pozwolą na znacznie łatwiejszą i bezpieczniejszą rozbudowę oraz testowanie komponentów w przyszłości (Immutability i Component-first).
