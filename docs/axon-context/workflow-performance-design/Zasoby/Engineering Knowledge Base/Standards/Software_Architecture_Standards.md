# Software Architecture Standards (The Guardrails)

> **Status:** Enforced Standard
> **Context:** Twarde bariery architektoniczne zapobiegające "AI Spaghetti Code".
> **Zasada:** Nie piszemy kodu, dopóki nie zdefiniujemy Domeny.

---

## 1. Domain-Driven Design (DDD) Protocol

Agent AI ma tendencję do myślenia o kodzie jako "pliku", a nie "biznesie". Ten prompt to zmienia.

### 🤖 System Prompt: Domain Definition
*Wklej to na początku każdej nowej funkcjonalności.*

```markdown
# ACT AS: Senior Software Architect (DDD Expert)

Twoim zadaniem jest zdefiniowanie modelu domenowego ZANIM napiszesz jakąkolwiek linijkę kodu.
Zabrania się używania frameworków (React, FastAPI) na tym etapie. Skup się wyłącznie na logice biznesowej.

## 📋 Zadanie: Zdefiniuj Bounded Context dla "[NAZWA_MODUŁU]"

1. **Ubiquitous Language (Słownik):**
   - Zdefiniuj kluczowe pojęcia (np. "Order", "Cart", "Shipment") i ich definicje.
   - Używaj tych nazw w kodzie (klasy, zmienne). Nie używaj synonimów.

2. **Agregaty i Encje:**
   - Który obiekt jest "Agregatem" (Root)?
   - Jakie ma niezmienniki (Invariants)? (np. "Zamówienie nie może być wysłane bez adresu").

3. **Komendy i Zdarzenia (CQS):**
   - **Command:** `PlaceOrder`, `ChangeAddress` (Co użytkownik chce zrobić?)
   - **Event:** `OrderPlaced`, `AddressChanged` (Co się stało?)

Dopiero po zaakceptowaniu modelu domenowego, przejdziemy do implementacji.
```

---

## 2. Architecture Decision Records (ADR) Protocol

AI często podejmuje decyzje "bo tak". ADR wymusza uzasadnienie.

### 🚦 Kiedy wymagamy ADR?
1.  Wybór nowej bazy danych / technologii.
2.  Zmiana struktury folderów.
3.  Wdrożenie skomplikowanego algorytmu.
4.  Integracja z zewnętrznym API (sposób autoryzacji/retry policy).

### 🤖 Template: ADR Generation
*Poproś Agenta o wypełnienie tego szablonu przed trudną decyzją.*

```markdown
# ADR-[NUMER]: [Krótki Tytuł Decyzji]

## 📝 Kontekst
Jaki problem rozwiązujemy? Jakie są ograniczenia?

## 🤔 Rozważane Opcje
1. **Opcja A:** [Opis] (Zalety/Wady)
2. **Opcja B:** [Opis] (Zalety/Wady)

## 🎯 Decyzja
Wybieramy: **Opcja X**

## 💡 Uzasadnienie
Dlaczego ta opcja wygrywa? (Koszt, wydajność, prostota, time-to-market).

## ⚠️ Konsekwencje
Co musimy zaakceptować? (np. większy koszt infrastruktury, dług technologiczny).
```

---

## 3. Hexagonal Architecture (Ports & Adapters)

Struktura, która izoluje Twój biznes od frameworka. Jeśli zmienisz FastAPI na Flask, folder `Domain` pozostaje nietknięty.

**Dlaczego to krytyczne w erze AI?**
Pozwala na podmianę modelu (np. z GPT-4 na Claude 3.5) bez dotykania logiki biznesowej. Twoja domena zależy od abstrakcji `AIProvider`, a nie od `openai` SDK.

### 📂 Standard Struktury Katalogów

```
src/
├── domain/                 # CZYSTY PYTHON/TS (Zero Frameworków)
│   ├── models/             # Agregaty, Value Objects (np. Order, Email)
│   ├── ports/              # Interfejsy (AIProvider, Repositories)
│   └── exceptions.py       # Błędy biznesowe
│
├── application/            # USE CASES (Orkiestracja)
│   ├── commands/           # "Zrób to" (CreateOrderHandler)
│   ├── queries/            # "Pobierz to" (GetOrderHandler)
│   └── dtos/               # Data Transfer Objects (Proste struktury)
│
├── infrastructure/         # BRUDNY ŚWIAT (Bazy, API, Modele AI)
│   ├── adapters/           # Implementacja portów (OpenAIAdapter, AnthropicAdapter)
│   ├── config/             # Zmienne środowiskowe
│   └── db/                 # Migracje, modele ORM
│
└── presentation/           # WEJŚCIE DO SYSTEMU
    ├── api/                # FastAPI Endpoints / Controllers
    └── cli/                # Komendy terminalowe
```

### 🤖 Prompt Weryfikacyjny
*"Sprawdź, czy w folderze `domain` nie ma importów z `fastapi`, `sqlalchemy`, `openai` lub `react`. Jeśli są - usuń je i przenieś do `infrastructure`."*

---

## 4. System Resilience (Anti-Storm Protocols)

Agenci AI często wpadają w pętle ponawiania (Retry Storms). Musimy przed tym chronić system.

### 🛡️ Idempotency Keys
Każda operacja zmieniająca stan (POST, PUT, PATCH) musi być idempotentna.
*   **Zasada:** Jeśli klient wyśle ten sam request dwa razy (z tym samym `Idempotency-Key`), system musi zwrócić **ten sam wynik**, a nie tworzyć duplikat zasobu.
*   **Wymóg:** Tabela `idempotency_logs` w bazie danych.

### 🛡️ Rate Limiting
Agenci AI są szybsi niż ludzie. API musi mieć limity.
*   **Global Limit:** np. 100 req/min na klienta.
*   **LLM Protection:** Jeśli endpoint triggeruje kosztowne zapytanie do LLM, limit musi być niższy (np. 10 req/min).

### 🛡️ Circuit Breaker (Bezpiecznik)
Automat wykrywający awarię zewnętrznego API (np. OpenAI, Stripe).
*   **Flow:** Jeśli >5 błędów w 10s -> Otwórz obwód (Fail Fast).
*   **Cel:** Nie "wisimy" na timeoutach. System natychmiast zwraca 503, dając zewnętrznemu API czas na powrót do zdrowia.

---

## 5. Performance Guardrails (Wydajność)

AI często generuje nieoptymalny kod dostępu do danych.

### 🚫 Zakaz N+1 Queries
Problem: Pobieranie listy obiektów, a potem w pętli dociąganie relacji (N zapytań zamiast 1).
*   **Rozwiązanie (ORM):** Wymagaj `select_related` (SQLAlchemy/Django) lub `include` (Prisma) dla relacji.
*   **Prompt Strażnika:** *"Przeanalizuj kod pod kątem problemu N+1. Czy pętla `for` wykonuje zapytania do bazy? Jeśli tak, użyj Eager Loading."*

### 🚫 Bulk Operations
*   **Zasada:** Nigdy nie wstawiaj/aktualizuj 1000 rekordów w pętli. Używaj `bulk_insert` / `bulk_update`.

### 🛡️ Serverless Singleton
W środowiskach Serverless/Dev (Next.js) każde przeładowanie tworzy nowe połączenie do DB.
*   **Wymóg:** Zawsze używaj wzorca `globalThis` dla instancji `PrismaClient` / `TypeORM`.

---

## 6. Deployment Safety & Multi-Tenancy

### 🚩 Feature Flags Strategy (Deep Dive)
Wdrażanie kodu != Włączanie funkcjonalności.
1.  **Release:** Wdróż kod ukryty za `if (flags.enabled)`.
2.  **Test:** Włącz flagę tylko dla `userId: admin`.
3.  **Rollout:** Włącz dla 10% użytkowników.
4.  **Full:** Włącz dla 100%.

### 🏢 Multi-Tenancy (Row-Level Security)
W systemach B2B (SaaS) bezpieczeństwo danych to priorytet.
*   **Zasada:** Nie polegaj tylko na `WHERE tenant_id = X` w kodzie aplikacji (Developer może zapomnieć).
*   **Wymóg:** Użyj **Postgres RLS (Row-Level Security)**. Baza danych automatycznie filtruje wiersze na podstawie zalogowanego użytkownika. To "Defense in Depth".
