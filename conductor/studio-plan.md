# Plan Implementacji: Edycja Encji we wszystkich modułach Studio

## Cel (Objective)
Rozbudowa modułu `Studio` (`frontend/src/modules/studio`) o możliwość edytowania istniejących encji we wszystkich jego wariantach: `agent-studio`, `crew-studio`, `automation-studio`, `service-studio` oraz `template-studio`. Plan zakłada usunięcie mocków przy dodawaniu, obsługę wczytywania, zapisu i edycji, przy ścisłym przestrzeganiu standardów narzuconych przez profil `react-architecture-refactor` (Zero useEffect, wzorzec Container-Presenter, Pure Views, użycie hooków aplikacyjnych bez niepotrzebnych stanów ubocznych).

## Tło (Background)
Obecnie różne moduły Studio w systemie wspierają proces tworzenia nowych encji (np. w `agent-studio` formularz inicjalizowany jest pustymi danymi lub z draftu). Brakuje zunifikowanych mechanizmów do wczytania danych z API z istniejących encji, brakuje dynamicznego routingu dla edycji (uwzględniającego ID encji) oraz jednolitych funkcji mutujących i pobierających.

## Architektura Docelowa (React Architecture Standards)
Zgodnie z zasadami "Pure View":
1. **Container (Logic & Orchestration)**: Komponent na poziomie strony odpowiedzialny za pobranie danych (via Server Components lub Suspense/React Query) i wstrzyknięcie ich do widoku. Brak `useEffect` w celu ładowania danych!
2. **View (Pure Presentation)**: Czysty komponent prezentacyjny (np. `AgentStudioView`). Nie zawiera logiki pobierania danych ani manualnego zarządzania statusem "loading".
3. **Application Hook (Domain Logic)**: Hook zarządzający formularzem, walidacją i akcjami mutującymi. W trybie edycji, formularz otrzymuje `initialData` przy inicjalizacji bez uciekania się do aktualizowania stanu poprzez `useEffect`.

## Plan Implementacji (Implementation Steps)

### Krok 1: Infrastruktura API i Mutacje dla wszystkich encji
Dla każdej domeny (agents, crews, automations, services, templates) w odpowiednim pliku infrastruktury istnieją hooki (lub muszą zostać stworzone):
   - `useGet[Entity](id: string)` do pobrania szczegółów istniejącego obiektu.
   - `useUpdate[Entity]()` do jego aktualizacji po stronie serwera.

### Krok 2: Ujednolicony Routing i Containery
Utworzenie spójnych ścieżek dostępu dla edycji każdego z typów:
   - `frontend/src/app/(workspace)/workspaces/[workspace]/studio/agent/[id]/page.tsx`
   - `frontend/src/app/(workspace)/workspaces/[workspace]/studio/crew/[id]/page.tsx`
   - `frontend/src/app/(workspace)/workspaces/[workspace]/studio/automation/[id]/page.tsx`
   - `frontend/src/app/(workspace)/workspaces/[workspace]/studio/service/[id]/page.tsx`
   - `frontend/src/app/(workspace)/workspaces/[workspace]/studio/template/[id]/page.tsx`

Stworzenie odpowiednich Containerów (np. `AgentStudioContainer`), które:
   - Pobierają dane dla `[id]`.
   - Podają załadowane dane (`initialData`) jako propsy w dół do Pure View.

### Krok 3: Refaktoryzacja Hooków Aplikacyjnych (Zero useEffect)
Dla każdego ze studiów:
   - Hook (np. `useAgentStudio`) musi wspierać parametr `initialData`.
   - Inicjalizacja formularza (`useForm`) następuje z wykorzystaniem `defaultValues: initialData`, bez sztucznego wywoływania `useEffect` do aktualizacji.
   - Funkcja przesyłająca formularz decyduje (na podstawie obecności `id`), czy wywołać Create, czy Update.

### Krok 4: Czyste Widoki i przepływ (Pure Views)
1. Gdy ID jest podane (tryb edycji), komponenty kontrolujące kroki formularza omijają domyślnie etap `discovery` (np. wybór pustego płótna/szablonu) i przechodzą bezpośrednio do widoku `design`.
2. Główne komponenty np. `AgentStudio` stają się czystymi widokami, akceptującymi propsy wejściowe sterowane z Containera.

### Krok 5: Weryfikacja
- Dodanie/aktualizacja testów jednostkowych potwierdzających renderowanie formularza z danymi w przypadku istnienia `id` w ścieżce.
- Manualne przejście i zapis każdej z encji poprzez UI Studio, w celu potwierdzenia że akcja `Update` prawidłowo działa i przekierowuje użytkownika.
- Weryfikacja kodu ("Zero useEffect").