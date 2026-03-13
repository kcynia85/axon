# Architektura Domeny: Podział Resources vs Workspaces

Po weryfikacji definicji biznesowych ustalamy jasny podział odpowiedzialności między domenami **Resources** oraz **Workspaces**.

## Resources (Zasoby Globalne / Konstrukcyjne)
Moduł ten służy jako globalny katalog definicji, z którego korzystają różne obszary robocze do budowania swoich procesów.

### 1. Archetypes (Prompt Archetypes)
- **Cel:** Globalne "szablony DNA" dla Agentów (np. "Generyczny Inżynier QA", "Ekspert Python").
- **Powód przypisania:** Archetyp to wiedza abstrakcyjna i współdzielona. Nie posiada kontekstu wykonawczego konkretnego projektu, dopóki nie zostanie zinstancjonowany jako Agent w Workspace.

### 2. Services (Definicje Usług / Mapowanie Zdolności)
- **Cel:** Abstrakcyjne definicje zewnętrznych narzędzi (np. "Github", "n8n", "Jira") oraz ich Capabilities (np. "Create Issue", "Merge PR"). Służą one jako słownik dla węzłów (Nodes) w **Space Canvas**, pozwalając Agentom wiedzieć, *co* dany serwis potrafi.
- **Powód przypisania:** Ponieważ **nie zawierają one danych autoryzacyjnych** (tokenów, specyficznych połączeń do instancji klienta), a jedynie opisują abstrakcyjne możliwości serwisu (jego API, zdolności), są zasobem globalnym z katalogu dostępnym do wykorzystania podczas projektowania układu na Canvasie.

### 3. Internal Tools
- **Cel:** Globalne funkcje systemowe napisane w kodzie (np. `web_scraper`, `math_calculator`).
- **Powód przypisania:** Kod systemowy jest uniwersalny i dostępny dla całej platformy niezależnie od projektu.

---

## Workspaces (Zasoby Operacyjne / Przestrzeń Wykonawcza)
Moduł ten zawiera zinstancjonowane encje, które posiadają stan, przechowują kontekst biznesowy i realizują zadania wyznaczone przez konkretny zespół.

### 1. Agents
- **Cel:** Zinstancjonowane Archetypy z nadanym zadaniem i kontekstem danego zespołu.
- **Powód przypisania:** Agent operuje na danych z konkretnego Workspace i realizuje jego cele.

### 2. Crews
- **Cel:** Zespoły Agentów połączone w konkretny proces (Sekwencyjny, Hierarchiczny itp.).
- **Powód przypisania:** Organizacja pracy i procesów wewnątrz projektu.

### 3. Automations (Wyzwalacze / Workflowy)
- **Cel:** Operacyjne reguły spinające zdarzenia (np. z webhoooka zdefiniowanego "n8n") z wykonaniem konkretnej Załogi (Crew) dla danego klienta.
- **Powód przypisania:** Automatyzacja typu "gdy przyjdzie email na support zespołu A, uruchom Crew X" to wiedza operacyjna, ściśle powiązana z celami i stanem konkretnego obszaru roboczego (Workspace).
- **Akcja naprawcza w kodzie:** Konieczne jest przeniesienie modeli i routerów `Automations` z domeny `Resources` do `Workspaces`.

### 4. Templates (Checklisty / Szablony Wejścia-Wyjścia)
- **Cel:** Zdefiniowane przez użytkowników w Workspace struktury określające jakie dane wejściowe muszą wejść do procesu i co ma z niego wyjść.
- **Powód przypisania:** Mimo nazwy "szablon", są to zdefiniowane w obrębie danego biznesu ramy działania dla Agentów.

---

## Konkluzja & Dług Technologiczny do wyczyszczenia:
- Modele `Service` pozostają w `Resources` jako `ExternalService` (katalog definicji). 
- Modele `Automation` zostają usunięte z `Resources` i przeniesione wyłącznie pod skrzydła `Workspaces`.
- Zostaną usunięte zduplikowane typy i ujednolicone nazewnictwo Pydantic-Zod, aby zapobiec konfliktom w UI i API.
