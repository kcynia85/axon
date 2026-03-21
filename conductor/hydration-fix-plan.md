# Plan: Naprawa hydracji narzędzi i synchronizacji w Studio oraz Sidepeek

Ten plan opisuje kroki niezbędne do naprawy błędów w wyświetlaniu dodanych narzędzi w Studio oraz braku aktualizacji interfejsu danych w podglądzie Agenta (Sidepeek).

## Cel
1.  Zapewnienie poprawnej hydracji (wyświetlania) dodanych narzędzi przy otwieraniu istniejącego Agenta w Studio.
2.  Poprawa synchronizacji danych między sekcją Tools a sekcjami Context/Artefacts.
3.  Aktualizacja `AgentProfilePeek`, aby korzystał z nowego interfejsu danych (`data_interface`) zamiast przestarzałych schematów.

## Kroki implementacji

### 1. Poprawa hydracji w `SkillsSection.tsx`
Zaktualizujemy `SkillsSection`, aby:
-   Obsługiwał zarówno UUID jak i `tool_function_name` w `custom_functions` (dla wstecznej kompatybilności).
-   Uruchamiał synchronizację `data_interface` przy zmianach listy narzędzi.
-   Zapewnił, że `availableSkills` poprawnie mapuje dane nawet przed pełnym załadowaniem.

### 2. Synchronizacja `input_schema` i `output_schema`
Chociaż przechodzimy na `data_interface`, wiele części systemu nadal polega na `input_schema` i `output_schema`. Będziemy je synchronizować równolegle w `syncDataInterface`.

### 3. Refaktoryzacja `AgentProfilePeek.tsx`
Zaktualizujemy komponent podglądu, aby:
-   Priorytetyzował dane z `agent.data_interface.context` i `agent.data_interface.artefacts`.
-   Usuwał twardo zakodowane wartości mockowe ("income", "business_size"), jeśli Agent ma zdefiniowany interfejs.

### 4. Szczegóły kodu

#### Zmiana w `SkillsSection.tsx`:
Dodamy efekt lub poprawimy logikę renderowania, aby `addedFunctions` znajdowało narzędzia po dowolnym z identyfikatorów (ID lub Name).

#### Zmiana w `AgentProfilePeek.tsx`:
```tsx
const inputFields = agent.data_interface?.context?.length > 0
  ? agent.data_interface.context.map(c => [c.name, c.field_type])
  : Object.entries(agent.input_schema || {});

const outputFields = agent.data_interface?.artefacts?.length > 0
  ? agent.data_interface.artefacts.map(a => [a.name, a.field_type])
  : Object.entries(agent.output_schema || {});
```

## Weryfikacja
1.  Otwarcie istniejącego Agenta z narzędziami -> Narzędzia powinny być widoczne w sekcji Tools (zaznaczone).
2.  Dodanie narzędzia -> Sekcja Context i Artefacts w Sidepeek powinna się natychmiast zaktualizować.
3.  Brak narzędzi -> Sidepeek nie powinien pokazywać mockowych danych, jeśli użytkownik wyczyścił interfejs.
