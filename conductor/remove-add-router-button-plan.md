# Plan: Usuń przycisk "+ Dodaj Router"

Użytkownik chce usunąć przycisk "+ Dodaj Router", który pojawia się w widoku przeglądarki routerów LLM. Przycisk ten znajduje się w dwóch miejscach: w `LLMRoutersBrowser.tsx` (wewnątrz `ActionBar`) oraz w `RoutersPage.tsx` (jako `actions` w `PageLayout`).

## Zmiany

### 1. `axon-app/frontend/src/modules/settings/ui/LLMRoutersBrowser.tsx`
- Usunięcie propa `onAddRouter` z definicji komponentu `LLMRoutersBrowser`.
- Usunięcie fragmentu kodu renderującego przycisk "+ Dodaj Router" w `actions` komponentu `ActionBar`.

### 2. `axon-app/frontend/src/app/(main)/settings/llms/routers/page.tsx`
- Usunięcie przekazywania `actions` do `PageLayout`.
- Usunięcie przekazywania propa `onAddRouter` do `LLMRoutersBrowser`.
- (Opcjonalnie) Usunięcie nieużywanej funkcji `goToCreateRouter` oraz importu `ActionButton`.

## Weryfikacja
- Uruchomienie aplikacji i przejście do sekcji ustawień routerów LLM.
- Sprawdzenie, czy przycisk "+ Dodaj Router" zniknął z nagłówka strony oraz z paska akcji przeglądarki.
