# 👆 Interaction & Navigation

## Focus & Visibility
- **Visible Focus:** Nigdy nie usuwaj domyślnego obramowania (`outline: none`) dla elementów interaktywnych, chyba że zastępujesz go wyraźnym, customowym wskaźnikiem fokusu (`:focus-visible`). Jest to kluczowe dla nawigacji klawiaturą.
- **Stany aktywnego zaznaczenia (Focus States):** Są kluczowe dla osób korzystających z klawiatury. Muszą wyraźnie wskazywać, który element jest aktywny (link, przycisk, input).
- **Kolejność tabulacji:** Upewnij się, że kolejność fokusa jest logiczna i zgodna z wizualnym układem strony.

## Links

Hiperłącza są fundamentem internetu. Powinny być wyeksponowane i posiadać zrozumiałe etykiety. Pamiętaj, że mają mniejszy obszar dotykowy niż przyciski i wymagają precyzji.

### Opisowe Etykiety (Descriptive Labels)
- **Problem:** Linki typu "kliknij tutaj" czy "więcej" są niejasne dla użytkowników czytników ekranu (którzy często nawigują po liście samych linków).
- **Rozwiązanie:** Twórz konkretne etykiety wskazujące cel (np. "Przeczytaj pełny raport" zamiast "kliknij tutaj").
- **Umiar:** Zachowaj zwięzłość. "Przeczytaj raport" jest lepsze niż "Przeczytaj pełny raport o projektowaniu dostępnych linków...".

### Otwieranie w Nowym Oknie (New Window)
- **Zasada:** Unikaj otwierania linków w nowym oknie/karcie, gdyż łamie to działanie przycisku "Wstecz".
- **Oznaczenie:** Jeśli jest to konieczne, wyraźnie zaznacz to w tekście linku (np. "(nowe okno)") lub wizualnie/programowo. Informacja powinna znaleźć się na końcu tekstu linku, aby uniknąć powtórzeń w czytnikach.

### Cel Linku (Link Destination)
- **Adresy URL:** Nie używaj surowych adresów URL jako tekstu linku (czytniki literują je znak po znaku). Użyj opisowej nazwy (np. "Hong Kong Disneyland" zamiast "www.hongkongdisneyland.com").
- **Pliki:** Informuj o typie pliku i jego przeznaczeniu (np. ikoną z altem lub tekstem).

### Rozpoznawalność (Recognizability)
- **Wyróżnienie:** Linki muszą być łatwo rozpoznawalne w tekście podstawowym.
- **Kolor:** Sam kolor to za mało (dostępność dla daltonistów).
- **Podkreślenie:** Najskuteczniejszym sposobem wyróżnienia jest standardowe podkreślenie linku.

### Spójny Głos i Ton (Voice & Tone)
- **Komunikacja:** Zachowaj spójny styl komunikacji. Linki powinny być instruktywne, ale naturalne.
- **Przejrzystość:** Priorytetem jest jasna informacja o tym, co się stanie po kliknięciu.

### Technologia i Semantyka (Attributes)
- **Atrybut href:** Linki muszą posiadać atrybut `href`, nawet w aplikacjach SPA. Unikaj `onclick` na elementach niebędących linkami (`div`, `span`).
- **Semantyka:** Czytniki ekranu same ogłaszają "link", więc nie dodawaj słów "link do..." w treści etykiety.

## Keyboard Navigation
- **Pełna dostępność:** Wszystkie elementy interaktywne muszą być obsługiwane samą klawiaturą (Tab, Enter, Spacja, Strzałki).