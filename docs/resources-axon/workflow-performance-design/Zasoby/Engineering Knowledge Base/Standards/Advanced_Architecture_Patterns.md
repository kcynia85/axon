# Advanced Architecture Patterns (Battle-Tested)

> **Context:** Wzorce niezbędne w realnych systemach produkcyjnych, które chronią przed chaosem i "rozproszonym monolitem".
> **Target:** AI System Architect / Senior Engineer

---

## 1. Vertical Slice Architecture (Feature > Layer)

**Definicja:** Zamiast dzielić kod poziomo (Controllers, Services, Repositories), dzielimy go pionowo na funkcjonalności (Features).

### 📐 Struktura
Każdy "Slice" (np. `RegisterUser`) zawiera wszystko, czego potrzebuje w JEDNYM folderze.

```
src/
└── features/
    └── register-user/
        ├── register-user.handler.ts  # Logika (Command Handler)
        ├── register-user.schema.ts   # Walidacja (Zod)
        ├── register-user.endpoint.ts # API Controller
        └── register-user.test.ts     # Testy
```

### 🧠 Dlaczego dla AI? (Locality of Behaviour)
AI działa najlepiej, gdy ma pełny kontekst w jednym pliku/folderze. Warstwy poziome zmuszają AI do skakania po plikach, co zwiększa ryzyko błędów. Vertical Slices = Wyższa jakość kodu AI.

### 🧩 The Shared Kernel (DRY Patch)
Uwaga: Vertical Slice nie oznacza kopiowania wszystkiego. Wspólny kod ląduje w `src/shared`.

*   **Co idzie do Shared:**
    *   `database.ts` (Konfiguracja połączenia)
    *   `auth.middleware.ts` (Weryfikacja tokenów)
    *   `logger.ts` (Instancja loggera)
    *   `money.vo.ts` (Value Objects używane wszędzie)
*   **Zasada:** `Feature` może importować z `Shared`. `Shared` NIE MOŻE importować z `Feature`.

---

## 2. Transactional Outbox Pattern (Spójność Danych)

**Problem (Dual Write):** Jak zapisać dane do bazy (SQL) i wysłać zdarzenie (Kafka/EventBridge) w sposób atomowy?
*   *Scenariusz awarii:* Zapisano do bazy, ale padł internet -> Zdarzenie nie poszło -> System niespójny.

### 🛡️ Rozwiązanie
1.  **Zapis:** W tej samej transakcji SQL zapisz dane biznesowe ORAZ zdarzenie do tabeli `outbox_messages`.
2.  **Publikacja:** Osobny proces (Worker/CDC) czyta tabelę `outbox_messages` i wysyła je do brokera.
3.  **Gwarancja:** At-least-once delivery.

### 💾 Implementation Snippet
Nie wymyślaj tego od zera. Użyj gotowca:
👉 `Zasoby/Engineering Knowledge Base/Standards/Snippets/Outbox_Pattern_Implementation.md`

### 🤖 Prompt Instruktażowy
*"Nie wysyłaj zdarzenia bezpośrednio w kontrolerze. Zapisz je do tabeli Outbox w ramach transakcji DB. Worker zajmie się wysyłką."*

---

## 3. Strangler Fig Pattern (Migracja Legacy)

**Strategia:** Zamiast przepisywać wszystko naraz ("Big Bang"), budujemy nowy system wokół starego.

### 🔄 Proces z AI
1.  **Intercept:** Przekieruj ruch dla *jednego* endpointu (np. `/api/v1/login`) do nowego serwisu.
2.  **Implement:** Użyj AI do napisania nowej implementacji w nowoczesnym stacku.
3.  **Verify:** Testuj równolegle.
4.  **Kill:** Wyłącz stary endpoint.

---

## 4. Backend for Frontend (BFF)

**Definicja:** Dedykowane API dla konkretnego interfejsu (Mobile vs Web vs AI Agent).

### 🧠 Niuans AI
AI generujące UI (v0, bolt.new) potrzebuje prostego dostępu do danych. Skomplikowana logika domenowa powinna być ukryta za fasadą BFF, która zwraca gotowe JSON-y pod widok.

### 📜 Contract-First (The Law)
Zanim pozwolisz AI napisać Frontend (React), musisz mieć **Kontrakt**.
1.  **Define:** Wygeneruj `openapi.json` (Swagger) z kodu BFF.
2.  **Feed:** Nakarm tym plikiem generator UI.
3.  **Generate:** AI wygeneruje klienta API (np. TanStack Query) idealnie pasującego do backendu.
*   **Prompt:** *"Oto mój plik `openapi.json`. Wygeneruj hooki React Query dla endpointu `/orders`."*

---

## 5. Saga Pattern (Orkiestracja Długich Procesów)

**Problem:** Brak transakcji ACID w systemach rozproszonych (mikroserwisy/agenty).

### 🛡️ Rozwiązanie: Kompensacja
Każdy krok musi mieć zdefiniowaną akcję "Cofnij" (Compensating Transaction).

| Krok (Action) | Kompensacja (Rollback) |
| :--- | :--- |
| `BookFlight()` | `CancelFlight()` |
| `ChargeCard()` | `RefundCard()` |
| `ReserveHotel()` | `CancelReservation()` |

### 🤖 Rola AI
AI świetnie nadaje się do orkiestracji Sagi (jako "Saga Coordinator"), ale musi mieć zdefiniowane instrukcje `on_failure` dla każdego kroku.

---

## 6. Event Sourcing (Podróż w Czasie)

**Definicja:** Zamiast przechowywać tylko aktualny stan (`Saldo: 100`), przechowujemy historię zdarzeń (`Wpłacono: 50`, `Wypłacono: 10`), a stan wyliczamy.

### 🧠 AI Use Case (Personalizacja)
Modele AI potrzebują **kontekstu historycznego**. W systemach CRUD dane historyczne są nadpisywane.
*   *CRUD:* "Użytkownik ma status Gold".
*   *ES:* "Użytkownik był Bronze, potem Silver, potem miał reklamację, a teraz jest Gold".
To pozwala AI wykrywać trendy behawioralne.

---

## 7. CRDT (Conflict-free Replicated Data Types)

**Problem:** Kolaboracja AI + Człowiek. Użytkownik i Agent edytują ten sam dokument jednocześnie.

### 🛡️ Rozwiązanie
Struktury danych (np. Yjs, Automerge), które gwarantują matematyczną spójność przy scalaniu (Merge), niezależnie od kolejności.
*   **Zasada:** Nigdy nie pisz własnego algorytmu synchronizacji. Użyj CRDT.

---

## 8. Microkernel (Plugin Pattern)

**Strategia:** Budowa systemu jako małego "Jądra" (Core) i zestawu wymiennych wtyczek.

### 🧠 AI Use Case (Tooling)
Tak działają agenty AI (np. ChatGPT Plugins).
*   **Core:** Silnik LLM.
*   **Plugins:** Kalkulator, Wyszukiwarka, Code Interpreter.
Jądro definiuje tylko **Interfejs** wtyczki (np. plik `manifest.json`).

---

## 9. Sidecar Pattern (Infrastruktura AI)

**Definicja:** Wydzielenie logiki infrastrukturalnej (Logowanie, Rate Limiting, Retry) do osobnego procesu ("Przyczepki") obok głównej aplikacji.

### 🛡️ Zastosowanie: AI Gateway
Aplikacja wysyła czysty prompt. Sidecar (np. Envoy/Proxy) robi:
1.  Maskowanie danych osobowych (PII).
2.  Sprawdzenie cache.
3.  Zarządzanie kluczami API.
4.  Wysłanie do OpenAI.
Developer nie musi implementować tego w każdej funkcji.
