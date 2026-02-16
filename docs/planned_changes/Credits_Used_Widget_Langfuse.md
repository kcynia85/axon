- Plan Implementacji
    
    Oto kompleksowy **Plan Implementacji Integracji Langfuse Cloud** w systemie Axon.
    
    Plan jest zaprojektowany tak, aby był "bezinwazyjny" dla Twojej obecnej architektury. Langfuse wchodzi jako warstwa "Audytora" i "Bibliotekarza Promptów", nie naruszając logiki biznesowej ani istniejącego Estymatora.
    
    ---
    
    # 🗺️ Mapa Drogowa Integracji (Roadmap)
    
    1. **Setup & Config:** Instalacja SDK i konfiguracja środowiska.
    2. **Tracing Implementation:** Wpięcie "czarnej skrzynki" do silnika Agentów.
    3. **Prompt Management:** Migracja promptów z kodu/bazy do Langfuse CMS.
    4. **Analytics Loop:** Wyświetlenie realnych kosztów w Dashboardzie Axona.
    
    ---
    
    ## 📅 Faza 1: Konfiguracja Środowiska (Infrastructure)
    
    **Cel:** Połączenie Axon Backend z chmurą Langfuse.
    
    ### 1.1. Konto i Klucze
    
    1. Zaloguj się na [cloud.langfuse.com](https://cloud.langfuse.com/).
    2. Utwórz nowy projekt: `Axon Production` (lub `Axon Dev`).
    3. Wygeneruj API Keys: `Secret Key` i `Public Key`.
    
    ### 1.2. Zmienne Środowiskowe (Backend)
    
    Dodaj do pliku `.env` w katalogu `backend/`:
    
    ```bash
    # Langfuse Configuration
    LANGFUSE_SECRET_KEY=sk-lf-...
    LANGFUSE_PUBLIC_KEY=pk-lf-...
    LANGFUSE_HOST="<https://cloud.langfuse.com>" # Dla wersji Cloud (EU Data Residency)
    
    # Opcjonalne: Żeby Langfuse nie spowalniał Axona (fire-and-forget)
    LANGFUSE_TIMEOUT=20
    
    ```
    
    ### 1.3. Instalacja Zależności
    
    Zaktualizuj `backend/requirements.txt`:
    
    ```
    langfuse>=2.0.0
    langchain>=0.1.0
    
    ```
    
    Uruchom: `pip install -r requirements.txt`
    
    ---
    
    ## 🕵️ Faza 2: Tracing (Obserwowalność Agentów)
    
    **Cel:** Widoczność każdego kroku Agenta (Myśl -> Tool -> n8n -> Wynik).
    
    Integracja odbywa się w warstwie `modules/agents`. Ponieważ używasz LangChain/LangGraph, integracja jest trywialna dzięki `CallbackHandler`.
    
    ### 2.1. Modyfikacja Silnika Agenta
    
    Edytuj plik, w którym uruchamiasz Agenta (np. `app/modules/agents/service.py` lub `engine.py`).
    
    ```python
    # app/modules/agents/engine.py
    
    from langfuse.callback import CallbackHandler
    from app.core.config import settings
    
    async def run_agent_workflow(
        agent_graph,
        user_input: str,
        session_id: str,
        user_id: str,
        metadata: dict = None
    ):
        """
        Uruchamia agenta z włączonym śledzeniem Langfuse.
        """
    
        # 1. Inicjalizacja Handlera
        # Automatycznie pobiera klucze z os.environ (ENV)
        langfuse_handler = CallbackHandler(
            user_id=user_id,          # Kto uruchamia? (Ważne do cost tracking per user)
            session_id=session_id,    # Ciągłość rozmowy
            tags=["axon-agent", metadata.get("role", "general")], # Tagi do filtrowania
            metadata=metadata         # Dodatkowe dane (np. Workspace ID)
        )
    
        # 2. Uruchomienie z Configiem
        # LangChain automatycznie przekaże handler do wszystkich pod-modułów (LLM, Tools)
        result = await agent_graph.ainvoke(
            {"messages": [("user", user_input)]},
            config={"callbacks": [langfuse_handler]}
        )
    
        # Handler automatycznie wysyła dane w tle (background thread),
        # więc nie blokuje odpowiedzi do Frontendu.
    
        return result
    
    ```
    
    **Co zyskujesz od razu?**
    
    - W panelu Langfuse widzisz drzewo wywołań.
    - Widzisz dokładnie, jaki JSON został wysłany do **n8n** (bo n8n to Tool w LangChain).
    - Widzisz latency każdego kroku.
    
    ---
    
    ## 📝 Faza 3: Prompt Management (CMS dla Promptów)
    
    **Cel:** Przestajemy hardcodować System Prompty w bazie SQL Axona. Trzymamy je w Langfuse, gdzie można je wersjonować i testować.
    
    ### 3.1. Przeniesienie Promptu
    
    1. Wejdź do Langfuse UI -> **Prompts**.
    2. Utwórz nowy prompt: `sales-agent-system-prompt`.
    3. Treść:
        
        ```
        Jesteś ekspertem sprzedaży w firmie {{company_name}}.
        Twój cel to {{goal}}.
        Używaj tonu: {{tone}}.
        
        ```
        
    
    ### 3.2. Pobieranie Promptu w Axonie
    
    Modyfikujemy sposób, w jaki Agent jest budowany (`app/modules/agents/builder.py`).
    
    ```python
    # app/modules/agents/prompt_manager.py
    from langfuse import Langfuse
    
    # Inicjalizacja klienta (singleton)
    langfuse = Langfuse()
    
    def get_agent_system_message(prompt_name: str, variables: dict):
        """
        Pobiera prompt z Langfuse i wstrzykuje zmienne.
        """
        # get_prompt domyślnie bierze wersję oznaczoną jako "production"
        prompt_template = langfuse.get_prompt(prompt_name)
    
        # Compile zamienia {{zmienne}} na tekst
        compiled_prompt = prompt_template.compile(**variables)
    
        return compiled_prompt
    
    ```
    
    **Zaleta:** Jeśli chcesz zmienić zachowanie Agenta, zmieniasz to w Langfuse UI, klikasz "Promote to production", a Axon przy następnym uruchomieniu pobierze nową wersję. Zero deployu kodu.
    
    ---
    
    ## 📊 Faza 4: Pętla Zwrotna (Analytics w UI Axon)
    
    **Cel:** Pokazać w Axonie ("Rzeczywistość"), ile Agent faktycznie kosztuje, obok Estymatora ("Symulacja").
    
    ### 4.1. Backend Endpoint (Proxy do Langfuse API)
    
    Axon Backend musi zapytać Langfuse API o statystyki.
    
    ```python
    # app/modules/agents/router.py (nowy endpoint)
    from langfuse import Langfuse
    
    langfuse = Langfuse()
    
    @router.get("/{agent_id}/stats")
    async def get_agent_stats(agent_id: str):
        """
        Zwraca koszty i liczbę tokenów dla danego Agenta (na podstawie tagów).
        """
        # Langfuse ma analityczne API.
        # W SDK Pythonowym można użyć klienta do pobrania metryk.
        # Uwaga: Może wymagać strzału HTTP do api.langfuse.com/api/public/metrics
    
        # Przykładowa (uproszczona) logika:
        daily_metrics = langfuse.api.metrics.daily(
            tag=f"agent_id:{agent_id}" # Zakładamy, że tagujemy trace ID agenta
        )
    
        return {
            "total_cost": daily_metrics.total_cost,
            "total_tokens": daily_metrics.total_tokens,
            "avg_latency": daily_metrics.avg_latency
        }
    
    ```
    
    ### 4.2. Frontend (Aktualizacja Panelu Prawego)
    
    W komponencie `CostEstimator.tsx`:
    
    1. **Sekcja "Estimated":** Zostaje bez zmian (liczy lokalnie `tiktoken`).
    2. **Sekcja "Actual (Last 24h)":**
        - Używa `useQuery` do pobrania danych z `GET /api/agents/{id}/stats`.
        - Wyświetla dane z Langfuse.
    
    ---
    
    ## 🛡️ Bezpieczeństwo i Prywatność
    
    Przy implementacji Langfuse Cloud (SaaS) pamiętaj:
    
    1. **Maskowanie PII:** Langfuse pozwala na maskowanie danych przed wysłaniem. Jeśli przetwarzasz bardzo wrażliwe dane (RODO/GDPR), skonfiguruj maskowanie w `CallbackHandler`.
    2. **Data Residency:** Wybierz serwery w UE (Langfuse Cloud ma taką opcję).
    
    ---
    
    ## ✅ Lista zadań (Checklist) dla Developera
    
    - [ ]  Zarejestrować konto Langfuse i pobrać klucze.
    - [ ]  Dodać klucze do `.env` lokalnie i na serwerze.
    - [ ]  Dodać `langfuse` do `requirements.txt`.
    - [ ]  Zmienić `engine.py` -> dodać `CallbackHandler` do wywołania `agent.ainvoke`.
    - [ ]  (Opcjonalnie) Przenieść jeden System Prompt do Langfuse UI i przetestować pobieranie.
    - [ ]  Sprawdzić w Langfuse Dashboard, czy widać Trace'y z wywołaniami n8n.
    
    To zamyka temat integracji. System Axon stanie się teraz w pełni obserwowalny.
    
- **UI:** Wizualizacja zużycia tokenów/budżetu w czasie rzeczywistym (np. pasek postępu lub licznik).