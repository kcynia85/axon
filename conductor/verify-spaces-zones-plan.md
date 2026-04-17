# Plan weryfikacji funkcjonalności Zones w Space Canvas

## Cel
Weryfikacja, czy mechanizm stref (Zones) w module Spaces działa poprawnie, w tym automatyczne tworzenie strefy przy Drag & Drop oraz działanie Inspektora Strefy.

## Kroki Implementacyjne
1. **Utworzenie pliku testu E2E:** `axon-app/frontend/tests/spaces_zones.spec.ts`
   - Skrypt użyje Playwright do nawigacji na `/spaces`.
   - Zasymuluje przeciągnięcie elementu (np. Agenta) na obszar Canvas.
   - Wykorzysta `page.evaluate`, aby wstrzyknąć poprawny obiekt `DataTransfer` (wymagany przez `useSpaceCanvasDragAndDropLogic.ts`).
2. **Weryfikacja w UI:**
   - Sprawdzenie obecności węzła typu `zone`.
   - Sprawdzenie widoczności etykiety strefy (`.node-zone-label`).
   - Interakcja z etykietą w celu otwarcia `SpaceZoneNodeInspector`.
   - Potwierdzenie obecności pól edycyjnych w inspektorze.

## Weryfikacja
Uruchomienie testu:
```bash
cd axon-app/frontend && npx playwright test tests/spaces_zones.spec.ts
```

## Wyjście awaryjne (Rollback)
Usunięcie nowo utworzonego pliku testu.
