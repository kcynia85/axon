---
template_type: crew
---

# AI Resilience & Cost Patterns (The Shield)

> **Context:** AI jest wolne, drogie i niedeterministyczne. Te wzorce chronią budżet i stabilność systemu.
> **Target:** AI System Architect / DevOps

---

## 1. Semantic Caching (Oszczędność $$$)

**Problem:** Tradycyjny cache (Redis) działa na zasadzie `key-value` (dokładne dopasowanie).
*   Pytanie A: "Stolica Polski?"
*   Pytanie B: "Podaj stolicę Polski."
*   *Redis:* To dwa różne klucze -> Dwa zapytania do LLM -> Podwójny koszt.

### 🛡️ Rozwiązanie: Cache Wektorowy
1.  Zamień pytanie na wektor (Embedding).
2.  Sprawdź w bazie wektorowej (np. Qdrant/Redis Vector), czy mamy podobne pytanie (np. cos sim > 0.95).
3.  Jeśli tak -> Zwróć zapisaną odpowiedź.

**Zysk:** Redukcja kosztów API o 30-60% w powtarzalnych systemach (np. Support Bot).

---

## 2. Durable Execution (Nieśmiertelne Funkcje)

**Problem:** Agenty AI wykonują zadania wieloetapowe (Multi-step reasoning), które mogą trwać minuty. Co jeśli serwer zrestartuje się w połowie?

### 🛡️ Rozwiązanie: Workflow Engines (Temporal / Inngest)
Zamiast pisać kod w pętli `while`, używamy silnika Durable Execution.
*   Kod jest zawieszany i wznawiany.
*   Stan zmiennych jest persystowany automatycznie.
*   **Efekt:** Gwarancja dokończenia procesu ("Immortal Functions"), bez pisania ręcznej logiki retry/state saving.

---

## 3. Bulkhead Pattern (Grodzie Bezpieczeństwa)

**Inspiracja:** Grodzie na statku. Jeśli jedna sekcja zatonie, woda nie przelewa się do innych.

### 🛡️ Zastosowanie w AI
Wydziel osobne pule zasobów (Thread Pools / Rate Limits) dla ryzykownych operacji AI.
*   Jeśli moduł "AI Chatbot" zostanie przeciążony (zablokuje wątki), NIE MOŻE to zablokować modułu "Płatności" ani "Logowanie".
*   *Zasada:* Krytyczne ścieżki biznesowe muszą działać nawet gdy AI leży.

---

## 4. Token Bucket Rate Limiting (Kubełkowy Limit Tokenów)

**Problem:** Standardowy Rate Limit liczy zapytania (RPM). W AI to mylące.
*   Request A: "Tak" (1 token).
*   Request B: Analiza książki (10 000 tokenów).

### 🛡️ Rozwiązanie: Token-Based Limiting (TPM)
Limitujemy **przepustowość tokenów na minutę (TPM)**, a nie tylko liczbę zapytań.
*   Każdy użytkownik ma "kubełek" z tokenami (np. 50k tokenów/dzień).
*   Przed zapytaniem estymujemy koszt i odejmujemy z kubełka.
*   **Efekt:** Sprawiedliwy podział zasobów i ochrona budżetu API przed "ciężkimi" zapytaniami.
