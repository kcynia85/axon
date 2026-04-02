# Plan Implementacji: Algorytmiczny Scraper Cenników & Synchronizacja Inngest

## 1. Cel Mechanizmu
Stworzenie bezkosztowego rozwiązania do utrzymywania zawsze aktualnych cenników modeli LLM w aplikacji Axon. Mechanizm będzie oparty w całości na bibliotekach Pythona (bez użycia modeli AI), co zapewni darmową i przewidywalną ekstrakcję. Rozwiązanie wykorzysta zadania w tle (Inngest) do codziennego scrapowania stron z cennikami podanych w ustawieniach dostawcy (Provider Studio) oraz pozwoli na ręczne odświeżanie z poziomu interfejsu (Settings/Models).

## 2. Rozbudowa Bazy Danych
Wymagane jest wygenerowanie migracji Alembic dla tabeli `llm_providers` dodającej:
- `pricing_page_url` (String, nullable) - URL do dedykowanej strony cennikowej dostawcy.
- `pricing_scraper_strategy` (String, default='auto') - heurystyka parsowania (np. 'openai_spa', 'anthropic_table', 'litellm_fallback').
- `pricing_last_synced_at` (DateTime, nullable) - timestamp przechowujący informację o ostatniej udanej aktualizacji cennika.
- `pricing_data_cache` (JSONB, nullable) - opcjonalny bufor zescrapowanych cen `{"gpt-4": {"input": 10.0, "output": 30.0}}`.

## 3. Scraper (Algorytmiczny Parser w Pythonie)
W module `infrastructure` powstanie klasa `PricingScraperService` niekorzystająca z LLM:
- **Narzędzia:** `httpx` (asynchroniczne żądania), `beautifulsoup4` (parsowanie HTML).
- **Strategie Wydobywania Danych:**
  - **OpenAI:** Ponieważ cennik na `openai.com/api/pricing/` jest aplikacją SPA, parser poszuka statycznego obiektu `__NEXT_DATA__` (JSON) osadzonego w HTML, z którego algorytmicznie wyciągnie cennik modeli "gpt-".
  - **Anthropic / Cloudflare:** Parser wyszuka tagi `<table>`, przeskanuje nagłówki pod kątem słów "Model", "Input", "Output" (lub "Prompt", "Completion") i przekształci wiersze w ustandaryzowany słownik.
  - **LiteLLM (Fallback):** W przypadku błędu (np. zmiana struktury strony), system fallbackowo odwoła się do darmowego i utrzymywanego przez społeczność pliku JSON repozytorium LiteLLM, z którego wyciągnie aktualne rynkowe ceny.

## 4. Background Jobs (Darmowy plan Inngest)
Architektura w oparciu o event-driven background jobs:
- **Synchronizacja Cykliczna (Cron):**
  - Definicja funkcji w Inngest: `@inngest_client.create_function(trigger=inngest.TriggerCron("sync-all-pricing", "0 2 * * *"))`.
  - Uruchamiana codziennie o 2:00. Skrypt iteruje po tabeli `llm_providers` posiadających wpisany URL cennika.
  - Dla każdego providera pobiera stronę, używa odpowiedniej strategii parsera i aktualizuje kolumny `model_pricing_config` dla powiązanych z nim modeli w tabeli `llm_models`.
  - Po sukcesie aktualizuje `pricing_last_synced_at` w rekordzie Providera.
- **Synchronizacja Ręczna (Event):**
  - Funkcja: `@inngest_client.create_function(trigger=inngest.TriggerEvent(event="provider.pricing/sync.requested"))`.
  - Reaguje na kliknięcie przez użytkownika w interfejsie i natychmiast uruchamia scraper dla wybranego dostawcy.

## 5. API Backend (FastAPI)
- Aktualizacja Pydantic schemas (np. `CreateLLMProviderRequest`).
- Endpoint `POST /api/v1/settings/llm-providers/{id}/sync-pricing`: Wrzuca event `provider.pricing/sync.requested` do Inngest i zwraca status `202 Accepted` bez blokowania klienta.

## 6. Zmiany w UI (Frontend - React)
- **Provider Studio (`ProviderAuthSection.tsx`):**
  - Dodanie sekcji "Cenniki (Algorytmiczne Scrapowanie)".
  - Pole wejściowe dla adresu URL cennika.
  - Opcjonalny wybór strategii scrapowania.
- **Tabela Modeli (`LLMModelsList.tsx`):**
  - Dodanie w menu akcji (Dropdown) wiersza: **"Pobierz najnowszy cennik ze strony"** (wywołuje endpoint POST dla danego providera).
  - W dolnej sekcji (pod tabelą modeli) wyświetlenie informacji wizualnej:
    *"Ostatnia aktualizacja cenników: 12.10.2023 14:00"* (odczytywane z `pricing_last_synced_at` najstarszego providera wyświetlanego w tabeli).
  - Dodanie w pasku akcji przycisku pozwalającego wymusić asynchroniczną synchronizację wszystkich widocznych w tabeli modeli (dla ich providerów).

## 7. Kolejność Wykonywania Prac
1. Dodanie kolumn bazy danych oraz przygotowanie migracji Alembic.
2. Zaktualizowanie backendowych modeli (SQLAlchemy) oraz schematów walidacji (Pydantic) + wystawienie danych w API.
3. Budowa serwisu `PricingScraperService` obsługującego Beautiful Soup 4 oraz specyficzne parsery dla największych dostawców (OpenAI, Anthropic).
4. Oprogramowanie handlerów Inngest (zadanie Cron oraz zadanie manualne).
5. Modyfikacja komponentów UI w Provider Studio w celu umożliwienia wklejania URL.
6. Rozbudowa komponentu tabeli o wyzwalacz akcji i datę ostatniej synchronizacji pod tabelą.