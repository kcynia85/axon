# Plan Ekstrakcji i Refaktoryzacji - Cost Estimator

## Faza 1: Utworzenie Generycznych Komponentów Bazowych (UI Primitives)
- [ ] Utworzenie `src/shared/ui/ui/Progress.tsx` - Generyczny pasek postępu (bez logiki biznesowej).
- [ ] Utworzenie `src/shared/ui/complex/MetricProgressBar.tsx` - Komponent wyższego rzędu łączący pasek postępu z nagłówkiem i sformatowaną wartością.
- [ ] Utworzenie `src/shared/ui/ui/NativeAccordion.tsx` - Lekki, natywny HTML-owy akordeon (`details/summary`) bez zależności od JS.
- [ ] Utworzenie `src/shared/ui/ui/PropertyRow.tsx` - Komponent do wyświetlania wierszy typu "Klucz - Wartość" ustandaryzowany dla dashboardów.

## Faza 2: Aplikacja Generycznych Klocków w Domenie (Cost Estimator)
- [ ] Refaktoryzacja `CostProgressBar.tsx` - Użycie `MetricProgressBar` zamiast hardcodowanych divów.
- [ ] Refaktoryzacja `CostDetailsAccordion.tsx` - Podmiana `<details>` na `<NativeAccordion>` i divów wierszowych na `<PropertyRow>`.
- [ ] Refaktoryzacja `CostEstimator.tsx` - Zastąpienie surowego kontenera gotowymi komponentami systemowymi: `<Card>`, `<CardHeader>`, `<CardTitle>`, `<CardContent>`.

## Zgodność z Core Principles:
*   **Component-first & DRY:** Powtarzalne układy (jak wiersze danych czy paski) stają się globalnymi zasobami.
*   **First generic functions:** Oddzielenie warstwy prezentacyjnej UI od logiki wyświetlania kosztów.
*   **Readability over cleverness:** Główny plik estymatora staje się prostą deklaratywną kompozycją jasnych bloków.
