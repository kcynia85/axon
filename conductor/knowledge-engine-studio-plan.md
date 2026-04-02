# Plan Implementacji: Środowisko Developerskie (Studio) dla Knowledge Engine (RAG)

## 1. Analiza Koncepcji i Wybór Architektury

Zgłosiłeś niezwykle trafny problem: formularze edycji wrzucane w prawe panele (SidePeeks) lub bezpośrednio na listy łamią spójność z resztą platformy Axon, gdzie skomplikowane encje (Agenci, Routery, Dostawcy) posiadają własne dedykowane środowiska pracy oparte na `StudioLayout`. Dodatkowo, testowanie RAG (np. symulator chunkowania) wymaga przestrzeni "deweloperskiej".

Zaproponowałeś dwie ścieżki:
A. Rozszerzenie zewnętrznej paczki `axon-tools`.
B. Wykorzystanie reużywalnego widoku `Studio` wewnątrz głównej aplikacji.

**Rekomendacja: Wybór opcji B (Środowisko Studio wewnątrz Axon).**

*Dlaczego nie `axon-tools`?* 
`axon-tools` służy do testowania zewnętrznych funkcji Pythona (Custom Tools) przed ich wgraniem do bazy. Konfiguracje RAG (Strategie Chunkowania, Modele Embeddingu) to natywne encje bazy danych Axona (Settings), które wpływają na globalny przepływ danych w systemie. Wyprowadzenie ich konfiguracji do zewnętrznego CLI złamałoby zasadę SSOT (Single Source of Truth) dla bazy konfiguracyjnej Axona.

*Dlaczego `StudioLayout` w Axon?*
Axon posiada już potężny, reużywalny szkielet `StudioLayout` (3 kolumny: Nawigacja, Płótno/Formularz, Podgląd/Symulator). Idealnie wpisuje się on w potrzebę symulacji RAG. Prawa kolumna (Poster) posłuży jako środowisko testowe (np. podgląd chunków), podczas gdy środkowa (Canvas) będzie zawierała formularze konfiguracyjne ze screenów.

## 2. Architektura i Założenia (DDD)

Zbudujemy 3 nowe moduły Studio (lub jeden zbiorczy), jednak dla utrzymania modularności i spójności z np. `ProviderStudio` czy `ModelStudio`, najlepiej stworzyć dedykowane "mikro-studia" wywoływane z zakładek Settings.

1.  **Chunking Studio (`modules/studio/features/chunking-studio`)**
    *   **Lewa Kolumna (Nav):** Nawigacja po sekcjach formularza (Nazwa, Metoda, Parametry, Separatory).
    *   **Środek (Canvas):** Formularz zgodny z `ChunkingStrategySchema`, zbudowany z wykorzystaniem `react-hook-form` i `FormSection`.
    *   **Prawa Kolumna (Poster):** Interaktywny "Symulator Chunkowania". Użytkownik wkleja tekst, a symulator na żywo reaguje na zmiany parametrów z Canvas, wykonując strzał do `/settings/chunking-strategies/simulate`.

2.  **Embedding Studio (`modules/studio/features/embedding-studio`)**
    *   **Lewa Kolumna (Nav):** Nawigacja (Wybór Dostawcy, Parametry, Ekonomia).
    *   **Środek (Canvas):** Formularz konfiguracji Modelu Embeddingu.
    *   **Prawa Kolumna (Poster):** "Plan Migracji". Komponent, który nasłuchuje na zmiany w formularzu (np. zmianę Wymiarów z 768 na 1536) i na bieżąco oblicza estymowany koszt reindeksacji oraz kroki techniczne.

3.  **Vector DB Studio (`modules/studio/features/vector-studio`)** - *Opcjonalnie, jeśli chcemy zachować pełną symetrię z makietami.*
    *   **Środek (Canvas):** Konfiguracja Bazy (Typ, Model, Prefix, Indeksowanie).
    *   **Prawa Kolumna (Poster):** Terminal "Test Połączenia", strumieniujący logi na żywo.

## 3. Plan Implementacji Krok po Kroku

### Etap 1: Przygotowanie Struktury Studio
1. Tworzymy nowe foldery w `axon-app/frontend/src/modules/studio/features/`:
   - `chunking-studio`
   - `embedding-studio`
2. W każdym z nich tworzymy standardową strukturę: `ui/` (komponenty, sekcje, layout), `application/` (hooki), `types/`.

### Etap 2: Implementacja Chunking Studio
1. **`ChunkingStudioView.tsx`**: Zmontowanie `StudioLayout`. Wpięcie `FormProvider`.
2. **Sekcje Formularza (`ui/sections/`)**: 
   - `StrategyBasicSection` (Nazwa, Metoda)
   - `StrategyParamsSection` (Rozmiary, Overlap)
   - `StrategySeparatorsSection` (renderowane warunkowo tylko dla Recursive).
3. **Symulator (`ui/components/ChunkingSimulatorPoster.tsx`)**: 
   - Komponent w prawej kolumnie, posiadający własne pole `Textarea` na input. Wykorzystuje `useWatch` z formularza, aby pobrać parametry i wysłać je do `simulateChunking`. Renderuje wizualne karty (chunks) z informacją o liczbie tokenów/znaków.

### Etap 3: Implementacja Embedding Studio
1. **`EmbeddingStudioView.tsx`**: Zmontowanie `StudioLayout`.
2. **Sekcje Formularza**: Wybór providera, Wymiary/Tokeny, Koszty.
3. **Plan Migracji (`ui/components/MigrationPlanPoster.tsx`)**: 
   - Nasłuchuje na wartości formularza (wymiary). Wyświetla ostrzeżenia o destruktywnej naturze zmiany (wymuszony hard reset) i symuluje koszt przebudowy.

### Etap 4: Routing i Nawigacja
1. Usunięcie `VectorDatabaseForm`, `EmbeddingModelForm`, i `ChunkingSimulator` z modułu `settings/ui` (wycofanie poprzednich zmian łamiących spójność architektoniczną).
2. W stronach `settings/knowledge-engine/...` listy (np. `ChunkingStrategiesList`) po kliknięciu "Edytuj" lub "Utwórz" będą przenosić użytkownika do odpowiedniego routingu Studio, np.:
   - `/settings/knowledge-engine/chunking/studio/new`
   - `/settings/knowledge-engine/embedding/studio/[id]`

## 4. Zgodność z "Zero useEffect" i Czystą Architekturą
- Główne widoki Studio (`*StudioView.tsx`) będą czystymi komponentami renderującymi strukturę `StudioLayout`.
- Stan całej konfiguracji znajduje się w 100% w `react-hook-form`, eliminując potrzebę synchronizowania stanu wewnętrznego symulatorów przez `useEffect`. Symulatory będą po prostu czytać stan formularza poprzez `useWatch`.
- Utrzymujemy 100% spójności UX/UI z Agent Studio i Provider Studio, realizując wizję "Developer-first environment".