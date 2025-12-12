# Classic Architecture Reference

> **Context:** Fundamenty architektury systemów rozproszonych.
> **Status:** Hard Standard

---

## 1. Layered Architecture (Warstwowa)
*   **🔴 Problem:** Kod miesza logikę biznesową z SQL i HTML. Spaghetti.
*   **🟢 Rozwiązanie:** Warstwy (Prezentacja -> Biznes -> Dane). Zależności tylko w dół.
*   **🧠 Architect's Nuance:** Łatwe na start, ale ryzyko "anemicznej domeny" (logika ucieka do serwisów).
*   **🤖 AI Architect:** AI łatwiej rozumie kod, gdy plik robi jedną rzecz (SRP). Warstwy pomagają w "Context Injection".

**🛠️ Praktyki Implementacyjne:**
*   Stosuj ścisłą kontrolę importów (np. `eslint-plugin-boundaries`), aby warstwa danych nie importowała warstwy prezentacji.
*   Interfejsy definiuj w warstwie wyższej, implementacje w niższej (Dependency Inversion).
*   Unikaj "Pass-through services" – metod, które tylko wołają repozytorium bez żadnej logiki.

## 2. Microkernel / Plugin Pattern
*   **🔴 Problem:** Dodanie nowej funkcji wymaga przebudowy i restartu całego systemu.
*   **🟢 Rozwiązanie:** Mały Core + Wymienne wtyczki.
*   **🧠 Architect's Nuance:** Definiuj stabilne API wtyczek. Zmiana API łamie wszystkie wtyczki.
*   **🤖 AI Architect:** Idealne dla Agentów (Core = LLM, Plugins = Tools/Skills).

**🛠️ Praktyki Implementacyjne:**
*   Wtyczki powinny być ładowane dynamicznie (np. `importlib` w Pythonie) na podstawie konfiguracji.
*   Core powinien udostępniać Events/Hooks (`on_message`, `on_start`), pod które wtyczki się podpinają.
*   Izoluj błędy wtyczek – crash pluginu nie może wyłożyć Core'a (try/catch wokół wywołań).

## 3. Space-Based Architecture (In-memory)
*   **🔴 Problem:** Baza danych jest wąskim gardłem przy milionach zapytań.
*   **🟢 Rozwiązanie:** Dane w RAM (Grid). Zapis asynchroniczny.
*   **🧠 Architect's Nuance:** Trudne odzyskiwanie po awarii zasilania. Wymaga replikacji.
*   **🤖 AI Architect:** Context Window to w pewnym sensie "Space". Ulotna pamięć operacyjna.

**🛠️ Praktyki Implementacyjne:**
*   Użyj Redis Cluster lub Apache Ignite jako warstwy danych.
*   Zaimplementuj mechanizm "Write-Behind" do trwałego magazynu (np. co 1s zrzut do SQL).
*   Partycjonuj dane w pamięci, aby skalować się horyzontalnie (dodanie węzła RAM zwiększa pojemność).

## 4. Event-Driven Architecture (Zdarzeniowa)
*   **🔴 Problem:** Serwisy są silnie powiązane. Awaria jednego kładzie inne.
*   **🟢 Rozwiązanie:** Komunikacja przez zdarzenia (Events) i brokera.
*   **🧠 Architect's Nuance:** Trudny monitoring (Distributed Tracing). "Eventual Consistency" to wyzwanie dla UX.
*   **🤖 AI Architect:** Agenci mogą subskrybować zdarzenia ("Gdy pojawi się nowy mail -> Analizuj").

**🛠️ Praktyki Implementacyjne:**
*   Zawsze używaj schematów wiadomości (np. Avro/Protobuf) w Schema Registry.
*   Każde zdarzenie musi mieć unikalny `trace_id` przekazywany przez cały łańcuch (OpenTelemetry).
*   Konsumenci muszą być idempotentni (obsługa duplikatów wiadomości).

## 5. Leader-Follower / Master-Slave
*   **🔴 Problem:** Jedna baza nie wyrabia z odczytami.
*   **🟢 Rozwiązanie:** Zapis do Leadera, odczyt z wielu Followerów.
*   **🧠 Architect's Nuance:** Opóźnienie replikacji (Replication Lag). User może nie widzieć swoich zmian natychmiast.

**🛠️ Praktyki Implementacyjne:**
*   Kieruj wszystkie zapytania `INSERT/UPDATE` na Mastera, a `SELECT` na Slave'y (driver bazy często to wspiera).
*   Monitoruj "Replication Lag" – jeśli przekroczy próg, kieruj odczyty krytyczne na Mastera.
*   Używaj "Sticky Reads" dla sesji użytkownika (czytaj z Mastera chwilę po własnym zapisie).

## 6. Ambassador Pattern (Proxy)
*   **🔴 Problem:** Każdy mikroserwis musi implementować logowanie, retry, auth.
*   **🟢 Rozwiązanie:** Sidecar container, który to robi.
*   **🧠 Architect's Nuance:** Dodaje narzut sieciowy (latency).
*   **🤖 AI Architect:** AI Gateway (Sidecar) może logować prompty i maskować PII przed wysłaniem do chmury.

**🛠️ Praktyki Implementacyjne:**
*   Wdróż jako osobny kontener w tym samym Podzie (Kubernetes), komunikujący się przez `localhost`.
*   Skonfiguruj Envoy lub Nginx jako proxy przechwytujące ruch wychodzący.
*   Centralizuj zarządzanie certyfikatami i secretami w Ambasadorze, odciążając aplikację.

## 7. Peer-to-Peer (P2P)
*   **🔴 Problem:** Centralny serwer to Single Point of Failure.
*   **🟢 Rozwiązanie:** Węzły gadają bezpośrednio.
*   **🧠 Architect's Nuance:** Trudne zarządzanie spójnością i bezpieczeństwem.

**🛠️ Praktyki Implementacyjne:**
*   Zaimplementuj protokół Gossip do wymiany informacji o stanie klastra.
*   Każdy węzeł powinien znać listę kilku "seed nodes" na start.
*   Stosuj kryptografię klucza publicznego do weryfikacji tożsamości węzłów.

## 8. Sharding (Fragmentacja)
*   **🔴 Problem:** Tabela ma 10TB i indeksy nie mieszczą się w RAM.
*   **🟢 Rozwiązanie:** Podział danych (np. wg UserID) na różne maszyny.
*   **🧠 Architect's Nuance:** Cross-shard joins są niemożliwe lub bardzo wolne. Dobierz klucz shardowania mądrze.
*   **🤖 AI Architect:** Shardowanie wektorów (Vector DB) jest kluczowe przy miliardach dokumentów.

**🛠️ Praktyki Implementacyjne:**
*   Wybierz klucz shardowania (Shard Key), który zapewnia równomierny rozkład danych (unikanie "Hot Shards").
*   Używaj "Consistent Hashing" do mapowania kluczy na serwery.
*   Zaimplementuj warstwę routingu w aplikacji lub proxy, która wie, gdzie szukać danych klienta X.

## 9. Micro-Frontends
*   **🔴 Problem:** Frontend Monolit jest zbyt duży dla jednego zespołu.
*   **🟢 Rozwiązanie:** Niezależne aplikacje sklejane w całość.
*   **🧠 Architect's Nuance:** Problemy ze spójnością UI i wydajnością (duplikacja bibliotek).
*   **🤖 AI Architect:** Generative UI może być traktowane jako dynamiczny mikro-frontend.

**🛠️ Praktyki Implementacyjne:**
*   Współdziel biblioteki (React, Lodash) przez Module Federation (Webpack), aby nie ładować ich wielokrotnie.
*   Utrzymuj wspólny Design System jako oddzielną paczkę npm.
*   Komunikacja między mikro-frontendami powinna odbywać się przez Custom Events w oknie przeglądarki (luźne powiązanie).

## 10. Service-Oriented Architecture (SOA)
*   **🔴 Problem:** Duplikacja logiki biznesowej w firmie.
*   **🟢 Rozwiązanie:** Usługi wielokrotnego użytku komunikujące się przez ESB.
*   **🧠 Architect's Nuance:** ESB często staje się "Smart Pipes, Dumb Endpoints" (Antywzorzec).

**🛠️ Praktyki Implementacyjne:**
*   Definiuj kontrakty usług w WSDL lub OpenAPI (Swagger).
*   Szyna danych (ESB) powinna służyć tylko do routingu i transformacji formatów, nie do logiki biznesowej.
*   Usługi powinny być "grube" (zawierać logikę), a interfejsy stabilne.

## 11. Interpreter Pattern (DSL)
*   **🔴 Problem:** Logika biznesowa jest zbyt złożona dla if/else.
*   **🟢 Rozwiązanie:** Własny język (DSL).
*   **🧠 Architect's Nuance:** Trudne utrzymanie. Krzywa uczenia dla nowych devów.
*   **🤖 AI Architect:** LLM to uniwersalny interpreter języka naturalnego na komendy.

**🛠️ Praktyki Implementacyjne:**
*   Zbuduj Abstract Syntax Tree (AST) dla swojego języka.
*   Użyj gotowych parserów (np. ANTLR lub biblioteki parsujące w Twoim języku) zamiast pisać regexy.
*   Ogranicz zakres języka tylko do niezbędnych operacji (bezpieczeństwo).

## 12. Shared-Nothing Architecture
*   **🔴 Problem:** Blokady (Locks) na współdzielonych zasobach.
*   **🟢 Rozwiązanie:** Każdy węzeł ma własną pamięć/dysk.
*   **🧠 Architect's Nuance:** Idealne do skalowania liniowego.

**🛠️ Praktyki Implementacyjne:**
*   Sesje użytkownika trzymaj w bazie/Redisie, a nie w pamięci procesu (Stateless).
*   Unikaj współdzielonych plików systemowych – używaj S3/Blob Storage.
*   Każdy request powinien zawierać wszystkie dane potrzebne do jego obsłużenia (lub pobierać je z lokalnego sharda).

## 13. Publish-Subscribe (Pub/Sub)
*   **🔴 Problem:** Nadawca musi znać odbiorców.
*   **🟢 Rozwiązanie:** Nadawca wysyła w eter (Topic). Odbiorcy słuchają.
*   **🧠 Architect's Nuance:** Ryzyko "Fire and Forget" - co jeśli nikt nie słucha?

**🛠️ Praktyki Implementacyjne:**
*   Używaj "Wildcards" w tematach (np. `orders.*`), aby subskrybenci mogli filtrować ruch.
*   Monitoruj "Dead Letter Queues" dla wiadomości, których nikt nie odebrał lub przetworzył.
*   Zapewnij trwałość wiadomości (Persistence) w brokerze, jeśli odbiorca jest offline.

## 14. Event Sourcing
*   **🔴 Problem:** Utrata historii zmian w CRUD.
*   **🟢 Rozwiązanie:** Zapisuj zdarzenia (`OrderPlaced`), a nie stan (`Status: Paid`).
*   **🧠 Architect's Nuance:** Wymaga snapshotów dla wydajności. Trudna zmiana schematu zdarzeń (Versioning).
*   **🤖 AI Architect:** LLM uwielbia Event Sourcing. Może "opowiedzieć historię" obiektu.

**🛠️ Praktyki Implementacyjne:**
*   Nigdy nie zmieniaj raz zapisanych zdarzeń (Immutable).
*   Stosuj "Upcasting" – transformuj stare zdarzenia do nowego formatu w locie przy odczycie.
*   Projekcje (Read Models) buduj asynchronicznie w osobnej bazie (CQRS).

## 15. Blackboard Pattern (Tablica)
*   **🔴 Problem:** Rozwiązanie problemu wymaga współpracy wielu ekspertów, którzy nie znają się nawzajem.
*   **🟢 Rozwiązanie:** Wspólna tablica. Eksperci patrzą i dokładają swoją wiedzę.
*   **🧠 Architect's Nuance:** Trudna synchronizacja i wykrycie "kiedy koniec".
*   **🤖 AI Architect:** Podstawa systemów Multi-Agent. Agenci (Research, Writer, Editor) patrzą na wspólny kontekst.

**🛠️ Praktyki Implementacyjne:**
*   Tablica powinna być centralną bazą danych lub strukturą w pamięci (Redis).
*   Zdefiniuj jasne kryteria stopu (np. "gdy rozwiązanie osiągnie pewność > 90%").
*   Agenci powinni działać cyklicznie, skanując tablicę w poszukiwaniu danych, które potrafią przetworzyć.

## 16. Pipes and Filters (Rury i Filtry)
*   **🔴 Problem:** Skomplikowane przetwarzanie danych.
*   **🟢 Rozwiązanie:** Seria małych kroków (Filtry) połączonych rurami.
*   **🧠 Architect's Nuance:** Łatwe testowanie każdego filtra osobno.
*   **🤖 AI Architect:** RAG Pipeline (Load -> Split -> Embed -> Store) to klasyczny Pipe & Filter.

**🛠️ Praktyki Implementacyjne:**
*   Każdy filtr powinien przyjmować i zwracać ustandaryzowany format danych.
*   Filtry powinny być niezależne i bezstanowe.
*   Obsługuj błędy w każdym filtrze, przekazując je do specjalnego kanału błędów, nie zatrzymując całej rury.

## 17. Sidecar Pattern
Patrz: Ambassador Pattern.

## 18. Strangler Fig (Figowiec)
*   **🔴 Problem:** Przepisanie starego systemu (Big Bang) trwa lata i kończy się porażką.
*   **🟢 Rozwiązanie:** Nowe funkcje w nowym systemie. Przekierowanie ruchu kawałek po kawałku.
*   **🧠 Architect's Nuance:** Wymaga precyzyjnego routingu (API Gateway). Utrzymujesz dwa systemy przez pewien czas.

**🛠️ Praktyki Implementacyjne:**
*   Użyj Load Balancera (Nginx/AWS ALB) do kierowania ruchu na podstawie ścieżki URL (stare -> legacy, nowe -> nowy serwis).
*   Nowy system może potrzebować dostępu do bazy starego systemu (jako tymczasowe rozwiązanie).
*   Stopniowo "duś" stary system, wyłączając kolejne endpointy.

## 19. Vertical Slice Architecture
*   **🔴 Problem:** Zmiana jednego feature'a wymaga skakania po 5 folderach (Controller, Service, Dao, Dto).
*   **🟢 Rozwiązanie:** Wszystko co dotyczy feature'a w jednym folderze.
*   **🧠 Architect's Nuance:** Prowadzi do duplikacji kodu, ale to lepsze niż złe abstrakcje.
*   **🤖 AI Architect:** Złoty standard dla AI. Dajesz Agentowi jeden folder i on ma cały kontekst.

**🛠️ Praktyki Implementacyjne:**
*   Grupuj kod według funkcjonalności (`features/login`), a nie typu pliku (`controllers/`).
*   Każdy Slice powinien mieć własne DTO i testy wewnątrz swojego folderu.
*   Wspólny kod (Shared Kernel) trzymaj w osobny folderze i importuj tylko to, co niezbędne.

## 20. Hexagonal Architecture (Porty i Adaptery)
*   **🔴 Problem:** Logika biznesowa zależy od frameworka. Trudne testy.
*   **🟢 Rozwiązanie:** Core (Logika) + Porty (Interfejsy) + Adaptery (Implementacje).
*   **🧠 Architect's Nuance:** Dużo boilerplate code (konwersja DTO <-> Domain Model).
*   **🤖 AI Architect:** Krytyczne dla podmiany modeli AI (Provider Pattern).

**🛠️ Praktyki Implementacyjne:**
*   Definiuj interfejsy (Porty) w warstwie domeny.
*   Wstrzykuj zależności (Adaptery) w punkcie wejścia aplikacji (Dependency Injection).
*   Testuj domenę używając "Mock Adapterów" (np. InMemoryRepository), bez dotykania bazy danych.

## 21. CQRS
*   **🔴 Problem:** Model zapisu jest skomplikowany, a odczyt musi być szybki.
*   **🟢 Rozwiązanie:** Rozdzielenie zapisu (Command) i odczytu (Query). Często dwie różne bazy.
*   **🧠 Architect's Nuance:** Eventual Consistency (opóźnienie między zapisem a odczytem).
*   **🤖 AI Architect:** AI może generować skomplikowane raporty (Query) na podstawie prostych zdarzeń (Command).

**🛠️ Praktyki Implementacyjne:**
*   Model zapisu (Write Model) powinien być zoptymalizowany pod spójność (3NF).
*   Model odczytu (Read Model) powinien być zdenormalizowany (płaskie tabele) pod konkretne widoki UI.
*   Użyj mechanizmu synchronizacji (np. Event Listeners), aby aktualizować Read Model po każdej komendzie.
