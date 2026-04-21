# Implementation Plan: Vector DB, Knowledge RAG, System Awareness RAG & Meta-Agent

## Objective
Implementacja trzech powiązanych modułów aplikacji Axon (Domyślna Baza Wektorowa, RAG#1 — Knowledge RAG, RAG#2 — System Awareness RAG + Meta-Agent) z zachowaniem pełnej izolacji kontekstów, paradygmatu Human-in-the-Loop oraz architektury Modular Monolith.

## [KROK 1 — MAPOWANIE ZAKRESU]

Płaska lista komponentów do zbudowania (podział według Modular Monolith & Clean Architecture):

- [ARCH] Interfejs `VectorStoreAdapter` (Wzorzec Port-Adapter).
- [ARCH] Implementacja `SupabaseLocalVectorAdapter`.
- [ARCH] Implementacja `VectorStoreProxy` (Dynamic Proxy rozwiązujące aktywnego dostawcę per request/sesję z bazy lub cache, umożliwiające hot-swap bez restartu).
- [BE] Endpointy konfiguracji bazy wektorowej (GET/PUT `/api/v1/settings/knowledge-engine/vectors`).
- [FE] Widok konfiguracji `/settings/knowledge-engine/vectors` (z weryfikacją połączenia).
- [x] [DB] Migracja bazy danych: utworzenie tabeli `system_embeddings` (rozszerzenie `pgvector`).
- [x] [BE] Workery Inngest dla RAG#2 (np. handler na event `system.entity.upserted`), realizujące asynchroniczną indeksację w tle.
- [x] [BE] Serwis `SystemIndexingService` (wywoływany przez workery Inngest, generujący wektory i zapisujący do `system_embeddings`).
- [x] [FE] Nowa zakładka "System" w Settings (pod-zakładki: "System" i "Meta Agent").
- [ ] [BE] Serwis `KnowledgeRetrieverService` (RAG#1 — odpytuje wyłącznie kolekcje wiedzy użytkownika przez Proxy).
- [x] [BE] Serwis `SystemAwarenessRetrieverService` (RAG#2 — odpytuje wyłącznie `system_embeddings` przez Proxy).
- [FE] Integracja RAG#1 z polem wyszukiwania w widoku Home.
- [FE] Integracja RAG#1 z sekcją "Cognition" -> "Knowledge Hubs" w Agent Studio.
- [FE] Integracja RAG#1 na Space Canvas (Agent Node, Crew Node) oraz w Inspektorach.
- [FE] Widok konfiguracji Meta-Agenta (Settings -> "Meta Agent" -> "Settings").
- [x] [BE] Endpoint generowania propozycji przez Meta-Agenta (z wykorzystaniem ścisłej walidacji wyjścia LLM przez modele Pydantic; odrzucanie/ponawianie błędnych struktur).
- [x] [FE] Komponent pływającego przycisku (biała kulka) na Space Canvas.
- [x] [FE] Wysuwany panel boczny Meta-Agenta (wzorzec Notion AI).
- [x] [FE] Przepływ Human-in-the-Loop (UI renderujące zwalidowany Draft, przycisk akceptacji, konwersja do docelowego Artefaktu/Bytu na Canvasie).

## [KROK 2 — GRAPH ZALEŻNOŚCI]

Zależności między komponentami (A → B oznacza, że A blokuje B):

1. [ARCH] Interfejs `VectorStoreAdapter` → [ARCH] `SupabaseLocalVectorAdapter`
2. [ARCH] `SupabaseLocalVectorAdapter` → [ARCH] `VectorStoreProxy` (Hot-Swap)
3. [ARCH] `VectorStoreProxy` → [BE] Endpointy konfiguracji bazy wektorowej
4. [BE] Endpointy konfiguracji bazy wektorowej → [FE] Widok konfiguracji `/settings/knowledge-engine/vectors`
5. [ARCH] `VectorStoreProxy` → [BE] `KnowledgeRetrieverService` (RAG#1)
6. [ARCH] `VectorStoreProxy` → [BE] `SystemAwarenessRetrieverService` (RAG#2)
7. [DB] Migracja tabeli `system_embeddings` → [BE] `SystemIndexingService`
8. [BE] `SystemIndexingService` → [BE] Workery Inngest (Asynchroniczne zdarzenia)
9. [BE] Workery Inngest → [BE] `SystemAwarenessRetrieverService` (RAG#2)
10. [BE] `SystemAwarenessRetrieverService` (RAG#2) → [FE] Zakładka "System" w Settings
11. [BE] `SystemAwarenessRetrieverService` (RAG#2) → [BE] Endpoint generowania propozycji Meta-Agenta
12. [BE] Endpoint generowania propozycji Meta-Agenta (Walidacja Pydantic) → [FE] Panel boczny Meta-Agenta
13. [FE] Komponent pływającego przycisku → [FE] Panel boczny Meta-Agenta
14. [FE] Panel boczny Meta-Agenta (Renderowanie Draftu) → [FE] Przepływ Human-in-the-Loop (Akceptacja i materializacja)

## [KROK 3 — WERYFIKACJA IZOLACJI RAG]

- **Izolacja na poziomie bazy:** RAG#1 działa w przestrzeni danych użytkownika (`/resources/knowledge`). RAG#2 operuje w fizycznie i logicznie odseparowanej tabeli `system_embeddings` powiązanej wyłącznie z metadanymi systemu.
- **Izolacja na poziomie Serwisu:** `KnowledgeRetrieverService` (RAG#1) i `SystemAwarenessRetrieverService` (RAG#2) posiadają odrębne metody dostępu i filtry.
- **Punkt styku (Wspólny Adapter):** Oba serwisy używają `VectorStoreProxy`. 
- **Weryfikacja:** **Izolacja zachowana**. Logika proxy wymaga podania kontekstu/przestrzeni nazw przy każdym wywołaniu, uniemożliwiając krzyżowe skażenie zapytań (np. RAG#1 nie ma technicznej możliwości przekazania nazwy tabeli/indeksu przeznaczonej dla RAG#2).

## [KROK 4 — WERYFIKACJA META-AGENTA]

Akcje Meta-Agenta względem zasad:
- Odczyt stanu Space z RAG#2: **dozwolone** (izolowane od RAG#1).
- Generowanie payloadów domenowych: **dozwolone** (zabezpieczone ścisłą walidacją struktury wyjściowej przez Pydantic na backendzie; błędny format wymusza fail/retry na poziomie LLM).
- Zapis jako `draft`: **dozwolone** (zwraca zwalidowany JSON do frontendowego stanu aplikacji jako Draft).
- Mutacje UI (publikowanie, przesuwanie node'ów): **NARUSZENIE** (zablokowane architektonicznie – Meta-Agent nie wystawia funkcji aktualizacji UI).
- Uruchomienie auto-indexingu RAG#2: **dozwolone** (wypuszczenie eventu Inngest `system.entity.upserted`).

**Weryfikacja Human-in-the-Loop (P-4):** Meta-Agent działa wyłącznie jako "Wniosek/Draft Generator". Użytkownik widzi ten Draft w Panelu Bocznym. Żadna akcja na płótnie nie zachodzi, dopóki użytkownik ręcznie nie zatwierdzi operacji.

## [KROK 5 — FAZY IMPLEMENTACJI]

### Faza 1: Domyślna Baza Wektorowa (Infrastruktura & Hot-Swap)
**Zakres:** 
- Interfejs `VectorStoreAdapter` oraz implementacja `SupabaseLocalVectorAdapter`.
- Klasa `VectorStoreProxy` implementująca dynamiczny routing do aktualnie skonfigurowanego adaptera na bazie stanu aplikacji (z pominięciem konieczności restartu aplikacji).
- Endpointy i widok UI do konfiguracji i walidacji połączenia (`/settings/knowledge-engine/vectors`).
**Done When:** Zmiana dostawcy w UI jest natychmiastowo respektowana przez kolejne zapytania do `VectorStoreProxy` w backendzie, a test połączenia w UI kończy się sukcesem dla podanych kluczy Supabase Local.
**Pliki/moduły:** `axon-app/backend/app/modules/settings/`, `axon-app/frontend/src/modules/settings/`.
**Ryzyka:** Pule połączeń (connection pools) do starych dostawców wektorowych muszą być poprawnie zamykane podczas hot-swapa przez Proxy, aby uniknąć wycieków pamięci.

### Faza 2: RAG#2 — System Awareness (Indeksowanie Asynchroniczne)
**Zakres:** 
- Migracja bazy danych dodająca `system_embeddings` (przy użyciu `pgvector`).
- Implementacja funkcji Inngest reagujących na zdarzenia (np. `agent.created`, `crew.updated`).
- `SystemIndexingService` tworzący i updatujący wektory w `system_embeddings` w tle.
- `SystemAwarenessRetrieverService` odczytujący dane z tej tabeli.
- Zakładka "System" w Settings.
**Done When:** Zmiana opisu Agenta w systemie wyzwala zdarzenie Inngest, które w tle bez blokowania UI generuje embedding i zapisuje go do `system_embeddings`. Rekord ten pojawia się na liście w zakładce "System".
**Pliki/moduły:** `axon-app/backend/app/modules/system/`, integracje Inngest w głównych modułach (emitowanie zdarzeń).
**Ryzyka:** Błędy po stronie providera embedingów podczas joba w tle muszą być odpowiednio obsługiwane i ponawiane przez mechanizmy Inngest.

### Faza 3: RAG#1 — Knowledge RAG (Izolowana Integracja)
**Zakres:** 
- `KnowledgeRetrieverService` skonfigurowany do odpytywania kolekcji użytkownika z użyciem `VectorStoreProxy`.
- Integracja wyszukiwania naturalnego w widoku Home, w Agent Studio oraz przestrzeni Canvas (Inspektory i Node'y).
**Done When:** Elementy UI pozwalające na interakcję z bazą wiedzy poprawnie zlecają zapytania do `KnowledgeRetrieverService` i odbierają sformatowane wyniki (chunki tekstowe, dokumenty) – całkowicie ślepe na byty konfiguracyjne z RAG#2.
**Pliki/moduły:** `axon-app/backend/app/modules/knowledge/`, `axon-app/frontend/src/modules/home/`, `axon-app/frontend/src/modules/studio/`, `axon-app/frontend/src/modules/spaces/`.
**Ryzyka:** Należy zapewnić ścisłe typowanie wejścia/wyjścia na styku pomiędzy UI a serwisem retrievera.

### Faza 4: Meta-Agent & Human-in-the-Loop (Ścisła Walidacja)
**Zakres:** 
- UI: Pływająca biała kulka na Space Canvas oraz wysuwany panel boczny w stylu Notion AI.
- Endpoint `/api/v1/meta-agent/propose` sprzęgnięty z `SystemAwarenessRetrieverService` (RAG#2).
- Backend: Konfiguracja ścisłej walidacji wyjścia LLM używając Pydantic dla narzuconej struktury Draftu (np. `{"entity": "crew", "status": "draft", ...}`).
- UI: Komponent renderujący zwalidowany Draft z przyciskiem do konwersji go na pełnoprawny Node na płótnie.
**Done When:** Użytkownik na Space Canvas pyta Meta-Agenta. Backend wykonuje zapytanie RAG#2, zmusza LLM do wygenerowania JSON-a. Jeśli JSON jest błędny, backend sam ponawia próbę. Jeśli jest poprawny (zwalidowany Pydantic), Frontend odbiera obiekt `Draft` i wyświetla go w panelu bocznym. Kliknięcie "Approve" przekuwa Draft w realny obiekt na Canvasie.
**Pliki/moduły:** `axon-app/backend/app/modules/spaces/`, `axon-app/frontend/src/modules/spaces/ui/meta-agent/`.
**Ryzyka:** Możliwe spowolnienie działania Meta-Agenta przy konieczności ponawiania zapytań (LLM retries) w przypadku zwrócenia przez AI struktury niezgodnej ze schematem Pydantic. Należy ustawić twardy limit retry (np. max 3).

## [WYMAGA WYJAŚNIENIA]

*(Obecnie brak otwartych pytań. Wszystkie wątpliwości architektoniczne zostały rozstrzygnięte i włączone do planu faz)*