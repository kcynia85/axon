# AI Engineering & Ops Patterns

> **Context:** Wzorce specyficzne dla pracy z LLM i Agentami.
> **Status:** Standard Wdrożeniowy

---

## 1. The Model Router Pattern (AI Gateway)
*   **🔴 Problem:** Używanie GPT-4o do prostego "Hello World" to przepalanie pieniędzy.
*   **🟢 Rozwiązanie:** Gateway, który kieruje zapytanie do najtańszego modelu zdolnego je obsłużyć (Haiku vs Opus).
*   **🧠 Architect's Nuance:** Nie pisz routera w kodzie aplikacji. Użyj Proxy (LiteLLM / Helicone), aby zmieniać zasady routingu bez redeploymentu.
*   **🤖 AI Architect:** Router powinien mieć "fallback". Jeśli Haiku zwróci JSON z błędem składni, automatycznie ponów w GPT-4o (Self-Healing).

**🛠️ Praktyki Implementacyjne:**
*   Użyj `LiteLLM` w Pythonie lub `Helicone` jako proxy HTTP.
*   Zdefiniuj progi cenowe per funkcjonalność (np. Chatbot: max $0.01/req).
*   Loguj "Model Latency" obok kosztów, aby wykrywać degradację tańszych modeli.

## 2. Generative UI (Generatywny Interfejs)
*   **🔴 Problem:** Czat to słaby interfejs do analizy danych.
*   **🟢 Rozwiązanie:** AI zwraca JSON, frontend renderuje natywny komponent (Wykres, Tabela, Formularz).
*   **🧠 Architect's Nuance:** Stosuj "Contract-First". Najpierw zdefiniuj Schemat Zod komponentu, potem promptuj AI. Nie pozwól AI wymyślać propsów.
*   **🤖 AI Architect:** Używaj `tool_use` zamiast surowego JSON-a w tekście. Modele są trenowane, by nie robić błędów w tool calls.

**🛠️ Praktyki Implementacyjne:**
*   Stwórz bibliotekę "AI-Ready Components" w React, które przyjmują czysty JSON.
*   Użyj `Vercel AI SDK` z funkcją `streamUI` do renderowania w czasie rzeczywistym.
*   Zawsze waliduj propsy przez `Zod` przed renderowaniem, aby uniknąć "White Screen of Death".

## 3. Human-in-the-Loop State Machine
*   **🔴 Problem:** Agent autonomicznie wysłał obraźliwego maila do CEO.
*   **🟢 Rozwiązanie:** Maszyna stanów (np. LangGraph) z węzłem `WAIT_FOR_APPROVAL` przed ryzykowną akcją.
*   **🧠 Architect's Nuance:** Stan akceptacji musi być persystentny (baza danych), a nie w pamięci RAM, bo człowiek może kliknąć "Akceptuj" za 2 dni.
*   **🤖 AI Architect:** Wygeneruj dla człowieka "Reasoning Summary" – dlaczego Agent chce to zrobić – aby ułatwić decyzję (Click-to-Approve).

**🛠️ Praktyki Implementacyjne:**
*   Wdróż `LangGraph` z PostgreSQL Checkpointerem do persystencji stanu.
*   Wysyłaj powiadomienia (Slack/Email) z linkiem "Approve/Reject" (Webhook).
*   Ustaw timeout na decyzję (np. "jeśli brak zgody przez 24h -> Anuluj").

## 4. Durable Execution (Trwałe Wykonywanie)
*   **🔴 Problem:** Agent czekał 60s na odpowiedź OpenAI i Lambda go ubiła (Timeout).
*   **🟢 Rozwiązanie:** Silnik workflow (Temporal/Inngest). Stan kroku jest zapisywany w DB. Po awarii proces wstaje od ostatniego kroku.
*   **🧠 Architect's Nuance:** Idempotentność to mus. Jeśli proces wstanie i wyśle maila drugi raz, to porażka.
*   **🤖 AI Architect:** Agenci powinni być bezstanowi (Stateless). Cała pamięć (Memory) powinna być ładowana z zewnątrz na początku kroku.

**🛠️ Praktyki Implementacyjne:**
*   Użyj `Inngest` dla Next.js (Serverless) lub `Temporal` dla ciężkich workerów.
*   Każdy krok (Step) w workflow powinien zwracać wynik serializowalny do JSON.
*   Implementuj `sleep` przez silnik workflow, a nie `time.sleep()`.

## 5. RAG Fusion (Fuzja RAG)
*   **🔴 Problem:** Użytkownik pyta "to z wczoraj", a Vector Search tego nie rozumie.
*   **🟢 Rozwiązanie:** AI generuje 4 warianty pytania ("co user robił 10.12?", "ostatnie pliki") i szuka ich równolegle.
*   **🧠 Architect's Nuance:** Wyniki trzeba złączyć (Reciprocal Rank Fusion) i usunąć duplikaty. To kosztuje latencję.
*   **🤖 AI Architect:** Nie generuj pytań w ciemno. W prompcie podaj "Current Date" i kontekst użytkownika.

**🛠️ Praktyki Implementacyjne:**
*   Wygeneruj 3 zapytania, uruchom `Promise.all` na retrievalu.
*   Zastosuj algorytm RRF (Reciprocal Rank Fusion) do sortowania wyników (`score = 1 / (k + rank)`).
*   Limituj liczbę ostatecznych chunków do context window (np. Top 5 połączonych).

## 6. Contextual Compression (Kompresja Kontekstowa)
*   **🔴 Problem:** "Lost in the Middle" i koszt 1M tokenów.
*   **🟢 Rozwiązanie:** Mniejszy model (Kompresor) wycina z dokumentów tylko zdania relewantne do pytania przed włożeniem do promptu.
*   **🧠 Architect's Nuance:** Uważaj na utratę kontekstu globalnego. Czasem lepiej dać mniej dokumentów (Top-3), ale w całości.
*   **🤖 AI Architect:** Chain-of-Thought działa gorzej na poszatkowanym tekście. Kompresja jest dobra dla faktów, słaba dla wnioskowania.

**🛠️ Praktyki Implementacyjne:**
*   Użyj `LLMChainExtractor` z LangChain do wyciągania zdań.
*   Stosuj małe modele (np. `gpt-3.5-turbo-instruct` lub lokalne modele BERT) jako kompresory.
*   Buforuj (Cache) skompresowane dokumenty dla popularnych zapytań.

## 7. Hybrid Search
*   **🔴 Problem:** Vector Search nie znajduje "Model X-200" (traktuje to jak szum).
*   **🟢 Rozwiązanie:** Vector (Semantyka) + Keyword (BM25) + Re-ranking (Cohere).
*   **🧠 Architect's Nuance:** Re-ranking jest wolny i płatny. Używaj go tylko dla Top-50 wyników.
*   **🤖 AI Architect:** Keyword Search wymaga czyszczenia inputu (usuń "stopwords" typu "czy", "że"). AI może to zrobić przed szukaniem.

**🛠️ Praktyki Implementacyjne:**
*   Skonfiguruj Qdrant/Weaviate z włączonym indeksem Full-Text.
*   Użyj wag (np. 0.7 Vector + 0.3 Keyword) przy łączeniu wyników.
*   Zastosuj `Cohere Rerank` (API) na ostatecznej liście kandydatów.

## 8. Semantic Caching
*   **🔴 Problem:** 1000 userów pyta o to samo ("Jak zresetować hasło?").
*   **🟢 Rozwiązanie:** Cache wektorowy. Jeśli podobieństwo pytania > 0.95, zwróć zapisaną odpowiedź.
*   **🧠 Architect's Nuance:** Cache musi być "Tenant-Aware". Nie zwróć danych firmy A pracownikowi firmy B.
*   **🤖 AI Architect:** Odpowiedź z cache jest statyczna. Jeśli prompt wymagał "użyj mojego imienia", cache to zepsuje.

**🛠️ Praktyki Implementacyjne:**
*   Użyj `Redis VSS` lub `GPTCache` jako warstwy pośredniej.
*   Kluczem cache'u powinno być: `embedding(pytanie) + tenant_id`.
*   Ustaw TTL (Time To Live) zależnie od dynamiki danych (np. 24h dla FAQ).

## 9. LLM-as-a-Judge
*   **🔴 Problem:** Unit testy nie sprawdzą, czy odpowiedź jest "uprzejma".
*   **🟢 Rozwiązanie:** GPT-4 ocenia output GPT-3.5 w skali 1-5.
*   **🧠 Architect's Nuance:** Sędzia musi mieć Chain-of-Thought ("Najpierw pomyśl, potem oceń"). Ocena bez uzasadnienia jest losowa.
*   **🤖 AI Architect:** Używaj "Reference-Free Evaluation" (ocena bez Ground Truth) tylko ostrożnie. Model lubi swoje własne "halucynacje".

**🛠️ Praktyki Implementacyjne:**
*   Zaimplementuj bibliotekę `RAGAS` lub `DeepEval` w pipeline CI/CD.
*   Uruchamiaj Evals tylko na próbce (np. 10%) lub "Nightly Build" ze względu na koszty.
*   Zapisuj wyniki sędziego do bazy, aby śledzić trend jakości w czasie.

## 10. Shadow Mode
*   **🔴 Problem:** Nowy prompt na produkcji może zepsuć UX.
*   **🟢 Rozwiązanie:** Puszczasz ruch na Stary i Nowy model równolegle. User widzi Stary. Nowy jest logowany do analizy.
*   **🧠 Architect's Nuance:** To podwaja koszty API. Stosuj tylko na próbce ruchu (np. 5%).
*   **🤖 AI Architect:** Porównuj nie tylko treść, ale też strukturę JSON-a. Często nowe modele psują formatowanie.

**🛠️ Praktyki Implementacyjne:**
*   Wykorzystaj Feature Flags (np. LaunchDarkly) do włączenia Shadow Mode dla adminów.
*   Loguj pary (Request, Response A, Response B) do pliku/bazy analitycznej.
*   Użyj LLM-as-a-Judge offline, aby porównać A vs B na zebranych logach.

## 11. Data Lineage (Cytowania)
*   **🔴 Problem:** Halucynacje. Użytkownik nie ufa odpowiedzi.
*   **🟢 Rozwiązanie:** Każde zdanie ma przypis `[Doc 1, p.4]`.
*   **🧠 Architect's Nuance:** Przechowuj metadane (URL, Page) w bazie wektorowej. Zwracaj je w API.
*   **🤖 AI Architect:** Wymuś cytowania w System Prompcie ("Never say anything without citing sources").

**🛠️ Praktyki Implementacyjne:**
*   W procesie Ingestion (ETL) zachowuj pole `metadata` z `source_url` i `chunk_index`.
*   Frontend powinien renderować cytowania jako klikalne linki/tooltips.
*   Jeśli model nie zwróci cytowania, oznacz odpowiedź jako "Nieweryfikowalną".

## 12. The "Tainted Data" Concept
*   **🔴 Problem:** Prompt Injection -> XSS w przeglądarce usera.
*   **🟢 Rozwiązanie:** Traktuj output LLM jak dane od hakera. Walidacja (Zod) + Sanityzacja (HTML purge).
*   **🧠 Architect's Nuance:** Walidacja musi być "Fail-Safe". Jeśli Zod rzuci błędem, pokaż "Błąd generowania", a nie uszkodzony UI.
*   **🤖 AI Architect:** Użyj "Repair Parsers". Jeśli JSON jest błędny, wyślij go z powrotem do AI z błędem walidacji, żeby się poprawiło (Self-Correction).

**🛠️ Praktyki Implementacyjne:**
*   Zawsze używaj `DOMPurify` na frontendzie przed wyświetleniem HTML z LLM.
*   Backend powinien paroswać JSON w bloku `try/catch` z fallbackiem.
*   Oznaczaj typy danych z AI jako `Tainted<string>` w TypeScript (nominative typing), aby wymusić sanityzację.

## 13. Token Bucket Rate Limiting
*   **🔴 Problem:** User wysłał książkę do analizy i zjadł limit API dla całej firmy.
*   **🟢 Rozwiązanie:** Limituj Tokeny na minutę (TPM), a nie Requesty na minutę (RPM).
*   **🧠 Architect's Nuance:** Musisz estymować tokeny PRZED wysłaniem do API (np. `tiktoken`), żeby odrzucić request lokalnie.
*   **🤖 AI Architect:** Daj userowi informację zwrotną ("Zostało Ci 500 słów w tym miesiącu"). To buduje świadomość kosztów.

**🛠️ Praktyki Implementacyjne:**
*   Użyj biblioteki `tiktoken` (lub odpowiednika dla modelu) w middleware.
*   Przechowuj licznik zużycia w Redis (`INCRBY user_id tokens`).
*   Zwracaj nagłówek `X-RateLimit-Remaining-Tokens`.
