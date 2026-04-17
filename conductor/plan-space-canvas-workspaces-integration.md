# Plan Implementacji: Integracja Workspaces ze Space Canvas

## 1. Analiza istniejącego codebase (Wnioski)
- **Space Canvas** znajduje się w `axon-app/frontend/src/modules/spaces` i opiera się na bibliotece `@xyflow/react` oraz własnej architekturze komponentów domenowych.
- Pasek boczny (Sidebar) ładuje dostępne komponenty za pomocą hooka `useSpaceCanvasSidebarManagement`, który aktualnie używa zhardcodowanej mapy `MAP_OF_AVAILABLE_COMPONENTS_BY_CATEGORY` z `constants.ts`.
- **Workspaces** dostarcza dane poprzez hooks z `@tanstack/react-query` w katalogu `modules/workspaces/application/` (dla Crews, Templates, Services, Automations) oraz `modules/agents/infrastructure/useAgents` (dla Agents).
- **Zarządzanie stanem i cache**: Cała komunikacja z API przechodzi przez React Query, co automatycznie zapewnia nam świeżość danych przy zmianie workspace'u.
- **Drag & Drop**: Aktualnie mechanizm drag & drop przekazuje tylko `label`, `type` i `zoneColor`. Aby Canvas mógł powiązać node'a z konkretną encją z bazy, konieczne jest rozszerzenie payloadu o `id`.

## 2. Struktura danych (Mapowanie Workspace → Space Canvas)
Zastąpimy zhardcodowane struktury `SpaceComponentItem` danymi mapowanymi z API:
- **Agent**: `Agent.id` ➞ `uniqueIdentifier`, `Agent.agent_name` (lub `agent_role_text`) ➞ `componentName`, `"agent"` ➞ `componentType`
- **Crew**: `Crew.id` ➞ `uniqueIdentifier`, `Crew.crew_name` ➞ `componentName`, `"crew"` ➞ `componentType`
- **Template**: `Template.id` ➞ `uniqueIdentifier`, `Template.template_name` ➞ `componentName`, `"template"` ➞ `componentType`
- **Service**: `ExternalService.id` ➞ `uniqueIdentifier`, `ExternalService.service_name` ➞ `componentName`, `"service"` ➞ `componentType`
- **Automation**: `Automation.id` ➞ `uniqueIdentifier`, `Automation.automation_name` ➞ `componentName`, `"automation"` ➞ `componentType`
- **Pattern**: Zgodnie z wymaganiami encja ta NIE pochodzi z Workspaces i jest tworzona lokalnie. Zostawiamy tę kategorię pustą lub wypełnioną ew. lokalnymi danymi ze Space Canvas (jeśli takie istnieją w stanie).

## 3. Sposób powiązania encji z node'ami
Podczas upuszczania elementu na canvas (Drag & Drop), encja z `Workspaces` staje się node'em.
Aby utrzymać to powiązanie, rozszerzymy obiekt przekazywany do `dataTransfer` w hooku `useSpaceCanvasSidebarManagement` o właściwość `id` (lub `entityId`), przypisując jej `componentItem.uniqueIdentifier`. Node na canvasie będzie dzięki temu wiedział, który zasób reprezentuje, nie zmieniając przy tym zewnętrznego UI samego płótna.

## 4. Przepływ danych (Data Flow) między modułami
1. Użytkownik wybiera Workspace w lewym sidebarze (`currentlySelectedWorkspaceIdentifier` zmienia stan).
2. Uruchamiają się hooki `useAgents`, `useCrews`, `useTemplates` itp. z włączonym `enabled: !!currentlySelectedWorkspaceIdentifier`.
3. Otrzymane dane są transformowane do struktury wymaganej przez pasek (grupy kategorii).
4. Przeciągnięcie node'a przekazuje typ oraz jego `id` z bazy danych.
5. (Zgodnie z obecną implementacją UI inspektorów node'ów) Inspector, mając `id` w danych node'a, wie z jakiej encji korzystać do wyświetlania i edycji szczegółów.

## 5. Zasady synchronizacji
Dzięki wykorzystaniu React Query (hooków z aplikacji Workspaces), synchronizacja następuje automatycznie:
- Jeśli użytkownik otworzy Workspaces w innej zakładce i np. usunie Agenta, powrót na Canvas i jakakolwiek inwalidacja cache spowoduje odświeżenie Sidebaru.
- Brak wymogu pisania własnych mechanizmów synchronizacji. Zmiany są spójne ze źródłem prawdy (API).
- By zapobiec wyświetlaniu encji oznaczonych do usunięcia (względem optimistic UI), listę z API można przepuścić przez filtr sprawdzający `pendingIds` z `usePendingDeletionsStore` (tak samo jak w widokach Workspaces).

## 6. Propozycja zmian w kodzie

### Modyfikowane pliki:
`axon-app/frontend/src/modules/spaces/application/hooks/useSpaceCanvasSidebarManagement.ts`

### Dodawane importy (Zgodne z istniejącą strukturą):
```typescript
import { useAgents } from "@/modules/agents/infrastructure/useAgents";
import { useCrews } from "@/modules/workspaces/application/useCrews";
import { useTemplates } from "@/modules/workspaces/application/useTemplates";
import { useServices } from "@/modules/workspaces/application/useServices";
import { useAutomations } from "@/modules/workspaces/application/useAutomations";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
// MAP_OF_AVAILABLE_COMPONENTS_BY_CATEGORY zostaje usunięty z importów
```

### Logika hooka:
1. Pobieranie danych:
```typescript
const workspaceId = currentlySelectedWorkspaceIdentifier || "";
const { data: agents } = useAgents(workspaceId);
const { data: crews } = useCrews(workspaceId);
const { data: templates } = useTemplates(workspaceId);
const { data: services } = useServices(workspaceId);
const { data: automations } = useAutomations(workspaceId);
const { pendingIds } = usePendingDeletionsStore();
```
2. Dynamiczne wyliczanie kategorii (`filteredComponentCategoriesForDisplay`):
   Zamiast bazować na `Object.entries(MAP_OF_AVAILABLE_COMPONENTS_BY_CATEGORY)`, zdefiniujemy obiekt, który mapuje dane z hooków do typu `ComponentItemDisplay` filtrując `pendingIds` i `componentSearchQuery`.

3. Rozszerzenie Payloadu D&D:
   Wewnątrz funkcji mapującej:
```typescript
onDragStart: (dragEvent: React.DragEvent<HTMLElement>) => 
    handleDragAndDropStart(dragEvent, 'entity', {
        id: componentItem.identifier, // <--- NOWE
        label: componentItem.displayName,
        type: componentItem.type,
        zoneColor: activeColor
    })
```

## 7. Edge case'y (Przypadki brzegowe)
- **Brak wybranego Workspace**: Jeśli `currentlySelectedWorkspaceIdentifier` to `null`, hooki zapytań (mające warunek `enabled: !!workspaceId`) nie wykonają się. Lista dostępnych encji pozostanie pusta.
- **Brak encji danego typu**: Wyświetlamy po prostu pustą kategorię (lub ją filtrujemy z widoku, jeśli interfejs na to pozwala - UI View dba o to na podstawie kluczy obiektu, więc zostanie to wyrenderowane natywnie).
- **Usunięcie encji (Optimistic Deletion)**: Zastosowanie filtra `!pendingIds.has(item.id)` w mapowaniu zapobiegnie przeciagnięciu encji, która lada moment zniknie.
- **Opóźnienie w ładowaniu (Loading State)**: Jeżeli `isLoading` dla któregoś hooka będzie trwać, po prostu wyrenderuje się bez nich na Sidebarze. Po skończeniu fetchowania React samoistnie zaktualizuje Canvas Sidebar.
- **Patterny (Patterns)**: Z racji braku powiązania ich z `Workspaces` dla celów Canvasu (tworzone na miejscu), zainicjujemy dla tej grupy pustą tablicę lub pozostawimy ewentualne statyczne, wbudowane patterny lokalne, omijając hook `usePatterns`.
