---
template_type: crew
---

# Data, Persistence & Resilience Patterns

> **Context:** Bazy danych, cache i niezawodność infrastruktury.
> **Status:** Standard

---

## 1. JSONB + GIN Index (Hybrid SQL/NoSQL)
*   **🔴 Problem:** Schemat danych zmienia się szybciej niż migracje SQL (np. metadane z AI).
*   **🟢 Rozwiązanie:** Kolumna JSONB w Postgres + indeks GIN.
*   **🧠 Architect's Nuance:** Nie używaj JSONB do wszystkiego. Relacje (Foreign Keys) zostaw w SQL.
*   **🤖 AI Architect:** Idealne do przechowywania "nieustrukturyzowanych" wyjść z LLM przed ich parsowaniem.

**🛠️ Praktyki Implementacyjne:**
*   Indeksuj tylko te pola w JSONB, po których faktycznie wyszukujesz.
*   Używaj schematów walidacji (np. Zod) w kodzie aplikacji, aby utrzymać higienę danych w JSONB.
*   Unikaj głębokiego zagnieżdżania, jeśli planujesz częste aktualizacje (JSONB nadpisuje cały obiekt).

## 2. Stale-While-Revalidate (SWR)
*   **🔴 Problem:** Użytkownik czeka na świeże dane.
*   **🟢 Rozwiązanie:** Zwróć stare dane z cache natychmiast, w tle odśwież.
*   **🧠 Architect's Nuance:** Nie nadaje się do danych krytycznych (np. saldo konta).
*   **🤖 AI Architect:** Streaming odpowiedzi to forma "progressive hydration", ale SWR jest lepszy dla całych bloków tekstu.

**🛠️ Praktyki Implementacyjne:**
*   Użyj bibliotek takich jak `SWR` (Vercel) lub `TanStack Query`.
*   Ustaw rozsądny `dedupingInterval`, aby nie spamować API przy każdym renderze.
*   Obsłuż wizualnie stan "revalidating" (np. mały spinner), jeśli dane mogą się drastycznie zmienić.

## 3. Cache-Aside (Lazy Loading)
*   **🔴 Problem:** Cache zawiera śmieci, o które nikt nie pyta.
*   **🟢 Rozwiązanie:** Ładuj do cache tylko na żądanie (Miss -> DB -> Cache).
*   **🧠 Architect's Nuance:** Problem "Cache Stampede" (gdy cache wygasa, 1000 zapytań uderza w bazę).

**🛠️ Praktyki Implementacyjne:**
*   Zawsze ustawiaj TTL (Time To Live) dla wpisów w cache.
*   Implementuj "Locking" lub "Probabilistic Early Expiration" aby zapobiec Cache Stampede.
*   Upewnij się, że klucze cache są unikalne i deterministyczne.

## 4. Write-Through / Write-Behind
*   **🔴 Problem:** Spójność cache z bazą.
*   **🟢 Rozwiązanie:**
    *   *Through:* Zapisz tu i tu w jednej transakcji (bezpieczne, wolne).
    *   *Behind:* Zapisz w cache, kolejka zapisuje do bazy (szybkie, ryzykowne).
*   **🧠 Architect's Nuance:** Write-Behind grozi utratą danych przy awarii zasilania.

**🛠️ Praktyki Implementacyjne:**
*   Dla Write-Through używaj transakcji rozproszonych lub wzorca Two-Phase Commit, jeśli to możliwe.
*   Dla Write-Behind używaj trwałej kolejki (np. Kafka), aby nie zgubić zapisu.
*   Monitoruj opóźnienie zapisu (Lag) w Write-Behind.

## 5. Materialized View (Widok Zmaterializowany)
*   **🔴 Problem:** Raport analityczny mieli bazę przez 10 sekund.
*   **🟢 Rozwiązanie:** Oblicz wynik raz i zapisz jako fizyczną tabelę. Odświeżaj co noc.
*   **🧠 Architect's Nuance:** Dane są "wczorajsze". Użytkownik musi o tym wiedzieć.
*   **🤖 AI Architect:** Świetne źródło dla RAG. AI czyta gotowe podsumowania, zamiast liczyć surowe rekordy.

**🛠️ Praktyki Implementacyjne:**
*   Użyj `REFRESH MATERIALIZED VIEW CONCURRENTLY` w Postgresie, aby nie blokować odczytów podczas odświeżania.
*   Rozważ użycie triggerów do odświeżania widoku przy zmianie danych (Incremental View Maintenance).
*   Indeksuj widok zmaterializowany tak jak zwykłą tabelę.

## 6. Soft Delete
*   **🔴 Problem:** Użytkownik usunął dane przez pomyłkę.
*   **🟢 Rozwiązanie:** `deleted_at = TIMESTAMP`. Filtruj w każdym zapytaniu.
*   **🧠 Architect's Nuance:** Pamiętaj o indeksach (wszystkie muszą mieć `WHERE deleted_at IS NULL`). RODO (Prawo do zapomnienia) wymaga Hard Delete po czasie.

**🛠️ Praktyki Implementacyjne:**
*   Użyj globalnego scope'u w ORM (np. Hibernate @Where, Eloquent SoftDeletes) aby automatycznie filtrować usunięte rekordy.
*   Stwórz proces "Garbage Collector", który fizycznie usuwa stare rekordy (np. po 30 dniach).
*   Pamiętaj o unikalnych indeksach – często muszą obejmować kolumnę `deleted_at` (częściowy indeks).

## 7. Optimistic Locking
*   **🔴 Problem:** Dwóch edytorów nadpisuje ten sam artykuł (Lost Update).
*   **🟢 Rozwiązanie:** Kolumna `version`. `UPDATE ... WHERE version = 5`. Jeśli w bazie jest 6, rzuć błąd.
*   **🧠 Architect's Nuance:** Wymaga obsługi błędu w UI ("Ktoś zmienił dane, odśwież").

**🛠️ Praktyki Implementacyjne:**
*   Dodaj pole `version` (integer) do każdej encji edytowalnej.
*   Obsłuż wyjątek `OptimisticLockException` w warstwie serwisu, ponawiając operację lub zwracając błąd do klienta.
*   W przypadku konfliktu, zaproponuj użytkownikowi mergowanie zmian lub nadpisanie.

## 8. Transactional Outbox
*   **🔴 Problem:** Zapisano zamówienie, ale nie wysłano maila (padł system).
*   **🟢 Rozwiązanie:** Zapisz maila do tabeli `outbox` w tej samej transakcji SQL. Worker wyśle go później.
*   **🧠 Architect's Nuance:** Gwarantuje "At-least-once". Odbiorca musi być idempotentny.

**🛠️ Praktyki Implementacyjne:**
*   Użyj narzędzi CDC (Change Data Capture) jak Debezium do czytania tabeli outbox, lub prostego pollingu.
*   Usuwaj przetworzone wiadomości z outboxa, aby tabela nie rosła w nieskończoność.
*   Koreluj wiadomości ID transakcji biznesowej dla łatwiejszego debugowania.

## 9. Unit of Work
*   **🔴 Problem:** Niespójny stan przy wielu operacjach na repozytoriach.
*   **🟢 Rozwiązanie:** Obiekt, który śledzi zmiany i robi `commit` na koniec.
*   **🧠 Architect's Nuance:** Często wbudowane w ORM (SQLAlchemy Session). Nie implementuj ręcznie.

**🛠️ Praktyki Implementacyjne:**
*   Wstrzykuj Unit of Work do serwisu aplikacyjnego.
*   Wołaj `commit()` tylko raz, na samym końcu procesu biznesowego.
*   Upewnij się, że w przypadku błędu następuje automatyczny `rollback()`.

## 10. Active Record vs Data Mapper
*   **🔴 Problem:** Jak łączyć obiekty z bazą.
*   **🟢 Rozwiązanie:**
    *   *AR:* `user.save()`. Łatwe, ale łamie SRP.
    *   *DM:* `repo.save(user)`. Czyste, ale więcej kodu.
*   **🧠 Architect's Nuance:** W DDD tylko Data Mapper.

**🛠️ Praktyki Implementacyjne:**
*   Wybierz Active Record dla prostych CRUD-ów i prototypów.
*   Wybierz Data Mapper dla skomplikowanej domeny biznesowej.
*   Nie mieszaj obu podejść w jednym projekcie.

## 11. CRDT (Conflict-free Replicated Data Types)
*   **🔴 Problem:** Google Docs style editing. Konflikty przy merge.
*   **🟢 Rozwiązanie:** Struktury matematyczne (Yjs), które zawsze dają ten sam wynik scalania.
*   **🧠 Architect's Nuance:** Duży narzut pamięciowy (historia zmian).
*   **🤖 AI Architect:** AI generuje content, człowiek poprawia. CRDT łączy to bezboleśnie.

**🛠️ Praktyki Implementacyjne:**
*   Użyj gotowych bibliotek jak `Yjs` lub `Automerge`.
*   Regularnie kompaktuj historię zmian (garbage collection), aby zmniejszyć rozmiar dokumentu.
*   Synchronizuj stan przez WebSockets dla wrażenia czasu rzeczywistego.

## 12. Edge Computing
*   **🔴 Problem:** Latencja dla użytkownika w Australii (serwer w USA).
*   **🟢 Rozwiązanie:** Kod działa na brzegach sieci (Cloudflare Workers).
*   **🧠 Architect's Nuance:** Baza danych nadal jest w USA (chyba że masz replikację). Edge bez danych to tylko proxy.

**🛠️ Praktyki Implementacyjne:**
*   Używaj Edge do zadań bezstanowych: autoryzacja, routing, proste transformacje danych.
*   Jeśli potrzebujesz danych, użyj replikowanych baz danych na brzegu (np. Cloudflare D1, Turso).
*   Cache'uj agresywnie na Edge'u.

## 13. Serverless Singleton
*   **🔴 Problem:** Lambda startuje, otwiera połączenie do DB. 1000 Lambd zabija bazę.
*   **🟢 Rozwiązanie:** Cache połączenia w zmiennej globalnej (poza handlerem).
*   **🧠 Architect's Nuance:** Używaj też Proxy do bazy (PgBouncer).

**🛠️ Praktyki Implementacyjne:**
*   Inicjalizuj klienta bazy danych w zmiennej globalnej (poza funkcją handler).
*   Sprawdzaj przy każdym wywołaniu, czy połączenie jest aktywne.
*   Ustaw limity połączeń po stronie bazy danych.

## 14. Monorepo Architecture
*   **🔴 Problem:** Zmiana kontraktu API wymaga PR w 3 repozytoriach.
*   **🟢 Rozwiązanie:** Jeden kod. Atomowe commity.
*   **🧠 Architect's Nuance:** Wymaga dobrego toolingu (Turborepo/Nx), żeby nie budować wszystkiego naraz.

**🛠️ Praktyki Implementacyjne:**
*   Używaj narzędzi do zarządzania zależnościami i buildem (Nx, Turborepo, Bazel).
*   Egzekwuj granice między modułami (linting), aby uniknąć spaghetti dependencies.
*   Współdziel konfigurację (ESLint, TSConfig) między paczkami.

## 15. Immutable Infrastructure
*   **🔴 Problem:** "U mnie działa". Serwery rozjeżdżają się konfiguracją (Configuration Drift).
*   **🟢 Rozwiązanie:** Nie naprawiaj serwera. Wymień go na nowy obraz.
*   **🧠 Architect's Nuance:** Wymaga pełnej automatyzacji CI/CD.

**🛠️ Praktyki Implementacyjne:**
*   Wszystkie zmiany infrastruktury definiuj jako kod (Terraform/Ansible).
*   Wyłącz logowanie SSH na serwery produkcyjne (dla ludzi).
*   Zamiast patchować OS, buduj nowy obraz VM/Kontenera i podmieniaj instancje.

## 16. Blue-Green Deployment
*   **🔴 Problem:** Deployment powoduje downtime.
*   **🟢 Rozwiązanie:** Stawiasz nową wersję obok. Jak działa, przełączasz ruch.
*   **🧠 Architect's Nuance:** Kosztowne (2x infrastruktura). Migracje bazy danych są trudne (muszą być kompatybilne wstecz).

**🛠️ Praktyki Implementacyjne:**
*   Automatyzuj przełączanie ruchu na poziomie Load Balancera.
*   Przeprowadzaj "Smoke Tests" na środowisku Green przed przełączeniem ruchu.
*   Miej procedurę szybkiego rollbacku (przełączenie z powrotem na Blue).

## 17. Canary Deployment
*   **🔴 Problem:** Błąd na produkcji dotyka 100% użytkowników.
*   **🟢 Rozwiązanie:** Wypuść na 5%. Monitoruj błędy. Zwiększaj.
*   **🧠 Architect's Nuance:** Wymaga zaawansowanego load balancera.

**🛠️ Praktyki Implementacyjne:**
*   Definiuj "Canary Analysis" – automatyczne sprawdzanie metryk (błędy, latencja).
*   Jeśli metryki się pogorszą, automatycznie zatrzymaj rollout.
*   Używaj "Sticky Sessions", aby użytkownik nie skakał między wersjami.

## 18. Feature Flags
*   **🔴 Problem:** Długie branche (Merge Hell).
*   **🟢 Rozwiązanie:** Merguj często, ukrywaj kod za flagą `if (enabled)`.
*   **🧠 Architect's Nuance:** Sprzątaj stare flagi! To dług techniczny.

**🛠️ Praktyki Implementacyjne:**
*   Używaj serwisu do zarządzania flagami (LaunchDarkly, PostHog).
*   Nazywaj flagi opisowo (np. `enable_new_checkout_flow`).
*   Regularnie audytuj i usuwaj martwe flagi z kodu.

## 19. Multi-Tenancy
*   **🔴 Problem:** Dane klienta A wyciekają do klienta B.
*   **🟢 Rozwiązanie:** Row-Level Security (RLS) w bazie. Każde zapytanie ma wymuszony filtr.
*   **🧠 Architect's Nuance:** Bezpieczniejsze niż `WHERE` w kodzie aplikacji.

**🛠️ Praktyki Implementacyjne:**
*   Ustawiaj kontekst użytkownika (np. `app.current_tenant_id`) w sesji bazy danych przy każdym requeście.
*   Pisz testy, które próbują uzyskać dostęp do danych innego tenanta (i mają upaść).
*   Dla krytycznych danych rozważ fizyczną separację (osobna baza/schema).

## 20. Retry with Exponential Backoff
*   **🔴 Problem:** Serwer leży. 1000 klientów dobija go retry co 1ms.
*   **🟢 Rozwiązanie:** Czekaj 1s, 2s, 4s, 8s...
*   **🧠 Architect's Nuance:** Dodaj "Jitter" (losowość), żeby nie uderzyli wszyscy równo w 4. sekundzie.

**🛠️ Praktyki Implementacyjne:**
*   Używaj gotowych bibliotek (np. `tenacity` w Pythonie), nie pisz pętli retry ręcznie.
*   Ustaw maksymalną liczbę prób i maksymalny czas oczekiwania.
*   Retry stosuj tylko do błędów tranzytowych (sieć, timeout), a nie logicznych (400 Bad Request).

## 21. Dead Letter Queue (DLQ)
*   **🔴 Problem:** Wadliwa wiadomość blokuje kolejkę w nieskończoność.
*   **🟢 Rozwiązanie:** Po 5 próbach przesuń do DLQ. Alarmuj admina.
*   **🧠 Architect's Nuance:** Ktoś musi te DLQ przeglądać i naprawiać.

**🛠️ Praktyki Implementacyjne:**
*   Skonfiguruj DLQ automatycznie w infrastrukturze kolejki (SQS, RabbitMQ).
*   Zaimplementuj narzędzie do podglądu i ponownego wysłania (Redrive) wiadomości z DLQ.
*   Monitoruj głębokość DLQ i alertuj, gdy rośnie.

## 22. Bulkhead Pattern (Grodzie)
*   **🔴 Problem:** Awaria modułu raportów zużywa całą pulę wątków. Logowanie też przestaje działać.
*   **🟢 Rozwiązanie:** Izolowane pule zasobów. Awaria w jednej grodzi nie zalewa statku.
*   **🧠 Architect's Nuance:** Hystrix/Resilience4j.

**🛠️ Praktyki Implementacyjne:**
*   Wydziel osobne pule wątków/połączeń dla różnych klientów zewnętrznych.
*   Ogranicz liczbę równoległych wywołań do konkretnego serwisu.
*   Jeśli pula jest pełna, odrzucaj nowe żądania natychmiast (Fail Fast).

## 23. Circuit Breaker (Bezpiecznik)
*   **🔴 Problem:** Zewnętrzne API leży. Czekamy na timeout 30s.
*   **🟢 Rozwiązanie:** Po 5 błędach "otwórz obwód". Zwracaj błąd natychmiast (Fail Fast).
*   **🧠 Architect's Nuance:** Stan "Half-Open" sprawdza co jakiś czas, czy API wstało.

**🛠️ Praktyki Implementacyjne:**
*   Dostosuj progi błędów i czasy resetowania do specyfiki usługi.
*   Loguj każdą zmianę stanu bezpiecznika (Open/Closed).
*   Zapewnij fallback (np. dane z cache) gdy obwód jest otwarty.

## 24. Leaky Bucket
*   **🔴 Problem:** Skoki ruchu (Bursts) zabijają serwer.
*   **🟢 Rozwiązanie:** Kolejka (wiadro) z dziurą. Przetwarzamy ze stałą prędkością. Nadmiar się wylewa (odrzucamy).
*   **🧠 Architect's Nuance:** Wygładza ruch, ale zwiększa latencję.

**🛠️ Praktyki Implementacyjne:**
*   Użyj Redis do przechowywania stanu wiadra w środowisku rozproszonym.
*   Dostosuj rozmiar wiadra (Burst Capacity) i prędkość wycieku (Rate) do możliwości serwera.
*   Informuj klienta o odrzuceniu (HTTP 429 Too Many Requests).

## 25. Snapshot Pattern
*   **🔴 Problem:** Odtworzenie stanu z 1 miliona zdarzeń trwa wieki.
*   **🟢 Rozwiązanie:** Co 100 zdarzeń zapisz stan (Snapshot). Odtwarzaj od Snapshota + nowe zdarzenia.
*   **🧠 Architect's Nuance:** Snapshoty to tylko optymalizacja, nie źródło prawdy.

**🛠️ Praktyki Implementacyjne:**
*   Generuj snapshoty asynchronicznie w tle.
*   Wersjonuj strukturę snapshotów, aby uniknąć problemów przy zmianie modelu.
*   Trzymaj snapshoty w szybkim magazynie (np. Redis lub dedykowana tabela).

## 26. Service Discovery
*   **🔴 Problem:** Adresy IP kontenerów zmieniają się dynamicznie.
*   **🟢 Rozwiązanie:** Rejestr usług (Consul/K8s DNS). Pytasz o nazwę "user-service", dostajesz IP.
*   **🧠 Architect's Nuance:** Client-side vs Server-side discovery.

**🛠️ Praktyki Implementacyjne:**
*   W Kubernetes używaj wbudowanego DNS (Service Names).
*   Zaimplementuj Health Checks, aby rejestr usuwał martwe instancje.
*   Cache'uj adresy lokalnie, aby nie pytać rejestru przy każdym requeście.

## 27. Evolutionary Database Design
*   **🔴 Problem:** Wielki design bazy na start (Waterfall) nigdy nie jest trafiony.
*   **🟢 Rozwiązanie:** Zmiany przyrostowe. Migracje.
*   **🧠 Architect's Nuance:** Unikaj niszczących zmian. Zamiast zmieniać nazwę kolumny: dodaj nową -> migruj dane -> usuń starą.

**🛠️ Praktyki Implementacyjne:**
*   Każda zmiana schematu musi być skryptem migracyjnym (Flyway/Liquibase/Prisma).
*   Testuj migracje (w górę i w dół) na kopii danych produkcyjnych.
*   Oddziel migracje struktury od migracji danych.

## 28. Zero Trust Architecture
*   **🔴 Problem:** Haker wszedł do sieci wewnętrznej (VPN) i ma dostęp do wszystkiego.
*   **🟢 Rozwiązanie:** Brak zaufania do sieci. Każdy request (nawet z localhost) wymaga autoryzacji (mTLS / JWT).
*   **🧠 Architect's Nuance:** Trudniejsze w konfiguracji, ale jedyne sensowne w chmurze.

**🛠️ Praktyki Implementacyjne:**
*   Wymuszaj mTLS (Mutual TLS) między mikroserwisami.
*   Weryfikuj token JWT w każdym serwisie, nie tylko na bramce.
*   Stosuj zasadę najmniejszych przywilejów (Least Privilege) dla ról serwisowych.

## 29. N+1 Problem Solution
*   **🔴 Problem:** Pobierasz listę postów (1 query), a potem w pętli autora każdego posta (N queries).
*   **🟢 Rozwiązanie:** Dociągnij wszystko jednym zapytaniem (`JOIN` / `IN`).
*   **🧠 Architect's Nuance:** Data Loader (Facebook) automatycznie batchuje zapytania w GraphQL.

**🛠️ Praktyki Implementacyjne:**
*   Używaj `select_related` (SQLAlchemy) lub `include` (Prisma) w ORM.
*   Monitoruj zapytania SQL w logach lub APM (np. Sentry/New Relic) aby wykrywać N+1.
*   W GraphQL używaj `dataloader` do batchowania zapytań z resolverów.

## 30. Polyglot Persistence
*   **🔴 Problem:** Próba wciśnięcia wszystkiego (relacje, dokumenty, grafy, cache) do jednej bazy SQL.
*   **🟢 Rozwiązanie:** SQL dla finansów. Elastic dla wyszukiwania. Redis dla sesji. Neo4j dla grafu znajomych.
*   **🧠 Architect's Nuance:** Koszt utrzymania i spójności rośnie wykładniczo. Nie przesadzaj.

**🛠️ Praktyki Implementacyjne:**
*   Synchronizuj dane między bazami asynchronicznie (CDC/Event Bus).
*   Zdefiniuj "System of Record" (źródło prawdy) dla każdego typu danych.
*   Ukryj złożoność wielu baz za jednolitym API (Command/Query Service).
