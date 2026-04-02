# Implementation Plan: Knowledge Engine (RAG) Configuration Management

## Background & Motivation
Obecnie ustawienia "Knowledge Engine" (Vector Databases, Embedding Models, Chunking Strategies) w aplikacji Axon zawierają jedynie uproszczone listy lub mocki wizualne. Backend wspiera pełny CRUD dla tych zasobów, ale brakuje spójnego, interaktywnego UI do zarządzania nimi (tworzenia, edycji, testowania).
Zgodnie z koncepcją "developer-friendly", moduł ten ma oferować potężne narzędzia konfiguracyjne (np. symulator chunkowania), analogicznie do narzędzi testujących w `axon-tools`. Celem jest ułatwienie inżynierom pracy nad RAG bez wychodzenia z aplikacji, zachowując jednocześnie spójność UI z resztą platformy Axon (SidePeeks, Listy typu Card/Table).

## Scope & Impact
Plan obejmuje wyłącznie frontend (katalog `axon-app/frontend/src/modules/settings`). API i bazy danych są już gotowe.
Zmiany dotkną:
1.  **Chunking Strategies (`settings/knowledge-engine/chunking`)**: Zmiana listy na interaktywny edytor podzielony na dwie sekcje (Konfiguracja + Symulator Chunkowania).
2.  **Embedding Models (`settings/knowledge-engine/embedding`)**: Zamiana prostej tabeli na siatkę kart spójną z "Vector Databases", dodanie SidePeeka ze szczegółami i formularzem edycji/dodawania modelu oraz informacji o kosztach.
3.  **Vector Databases (`settings/knowledge-engine/vectors`)**: Zmiana widoku na "read-only/monitoring", dodanie symulowanego okna "Test połączenia" i uaktualnienie opisu SidePeeka, choć sam CRUD baz nie będzie aktywny, aby nie zachęcać do zewnętrznych baz bez wyraźnej potrzeby (Zgodnie z wcześniejszymi ustaleniami – priorytet dla PGVector). Formularz konfiguracji w UI jednak zostanie zaimplementowany jako "mock/szkic" dla celów wizualizacji (zgodnie z dostarczonym flow na screenie).

## Proposed Solution (DDD / Modular Monolith Alignment)
Architektura aplikacji wymaga ścisłego podziału na logikę aplikacyjną (hooks) i UI.
Będziemy korzystać z gotowych hooków w `useSettings.ts`.
Rozwiązanie to czysty, bezstanowy React (Pure View) bez użycia `useEffect` w głównych komponentach list (obsługa przez `useQuery`).

### 1. Chunking Strategies
- Stworzenie nowego układu dwukolumnowego.
- Lewa strona: Lista aktualnych strategii i formularz nowej (Nazwa, Metoda, Parametry, Separatory).
- Prawa strona: Interaktywny "Symulator Chunkowania". Zostanie tu wykorzystany endpoint `/settings/chunking-strategies/simulate`, który jest już zaimplementowany w backendzie.
- Użycie Zod do walidacji formularzy w UI.

### 2. Embedding Models
- Zastąpienie tabeli listą kart (podobnie jak dla wektorowych baz danych).
- Dodanie `EmbeddingModelSidePeek` z danymi szczegółowymi (Max Context, Wymiary, Koszt).
- Formularz tworzenia/edycji modelu podzielony na kroki (1. Wybór dostawcy, 2. Parametry Techniczne, 3. Ekonomia).
- Dodanie panelu "Plan Migracji" informującego użytkownika o kosztach i procesie (np. tworzenie tabeli `vectors_1536_v2`), jako element edukacyjny/informacyjny z mockowanymi danymi.

### 3. Vector Databases (Uzupełnienie flow)
- Utrzymanie aktualnego widoku Listy i SidePeek (dodany w poprzednim kroku).
- Zgodnie ze screenem, zaprojektowanie formularza "Konfiguracja Bazy Wektorowej" (Typ, Embedding Model, Prefix tabeli, Indeksowanie - HNSW/IVFFlat) otwieranego z poziomu listy.
- Dodanie okna "Test Połączenia" z logami wyjścia.

## Implementation Steps

1.  **Shared UI & Layouts:**
    - Wykorzystanie istniejącego `SidePeek` i wbudowanych komponentów `Card`, `Input`, `Select`, `Badge`.
2.  **Embedding Models (`modules/settings/ui/EmbeddingModelsList.tsx` & `EmbeddingModelSidePeek.tsx`):**
    - Refaktor `EmbeddingModelsList.tsx` - z Table na Grid.
    - Stworzenie `EmbeddingModelSidePeek.tsx` używając zrefaktoryzowanego systemu `SidePeekSection`.
    - Stworzenie formularza `EmbeddingModelForm.tsx` implementującego layout z podziałem na "Plan Migracji" (symulowany).
3.  **Chunking Strategies (`modules/settings/ui/ChunkingStrategiesList.tsx`):**
    - Przebudowa strony na Split-Layout (Panel konfiguracji vs Symulator).
    - Integracja hooka `useChunkingStrategies` i zapytań mutujących `simulateChunking`.
4.  **Vector Databases (`modules/settings/ui/VectorDatabasesList.tsx` - update):**
    - Stworzenie formularza (lub mocku formularza) `VectorDatabaseForm.tsx` (Typ, Prefix, HNSW) dla wglądu w opcje konfiguracyjne.
5.  **Integration & Routing:**
    - Zmiana zawartości `page.tsx` dla odpowiednich ścieżek, jeśli zajdzie potrzeba wstrzyknięcia nowego układu.

## Verification & Testing
- Sprawdzenie wizualne czy layout zgadza się ze screenami (siatka, kolory, typografia `text-[10px] uppercase font-bold`).
- Przetestowanie działania symulatora Chunkowania na małej porcji tekstu (zmockowane lub real endpoint).
- Weryfikacja działania SidePeeka (czy się zamyka/otwiera odpowiednio).
- Sprawdzenie logów konsoli przeglądarki pod kątem błędów hydracji czy błędów Reactowych.

## Migration & Rollback
- Oparto w 100% na UI - brak ryzyk związanych z danymi w DB.
- W razie problemów z renderowaniem, wystarczy revertować modyfikowane pliki komponentów w `src/modules/settings/ui`.
