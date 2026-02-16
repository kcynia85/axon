- Page views
    
    Oto ostateczna, dopracowana specyfikacja widoków dla **Settings > LLMs**.
    
    Projekty te uwzględniają wszystkie poprawki z **Krytycznej Analizy UX**:
    
    1. **Wizualizacja Fallbacku:** Jasne strzałki i warunki w Routerach.
    2. **Lepszy Passthrough:** Walidacja typów i czytelna tabela.
    3. **Typografia:** Zastosowanie fontu Monospace dla danych technicznych.
    4. **Aktywne Drafty:** Zachęcające przyciski CTA.
    
    ---
    
    ### 1. LLM Settings Overview (Centrum Zarządzania)
    
    Główny widok z podziałem na trzy filary.
    
    ```
    Settings > LLMs (Reasoning Models)
    ──────────────────────────────────────────────────────────────────────────────
    [ 🏢 Dostawcy ]       [ 🧠 Rejestr Modeli ]       [ 🔀 Routery (Aliasy) ]
    ──────────────────────────────────────────────────────────────────────────────
                           (Aktywna Zakładka)
    
    [ 🔍 Szukaj modelu... ]    [ ↻ Synchronizuj Statusy ]    [ + Dodaj Model ]
    
    NAZWA I ID (Mono)            RODZINA         CONTEXT      KOSZT (In/Out 1M)
    ──────────────────────────────────────────────────────────────────────────────
    
    ┌────────────────────────────────────────────────────────────────────────────┐
    │ [🛡️] Production Safe       Router          ---          (Zmienny)          │
    │      alias: gpt-smart      Fallback                     ● Active           │
    └────────────────────────────────────────────────────────────────────────────┘
    
    ┌────────────────────────────────────────────────────────────────────────────┐
    │ [🧠] GPT-4o                Standard        128k         $ 2.50 / $ 10.00   │
    │      openai/gpt-4o         OpenAI                       ● Ready            │
    └────────────────────────────────────────────────────────────────────────────┘
    
    ┌────────────────────────────────────────────────────────────────────────────┐
    │ [🧠] o1-preview            Reasoning       128k         $ 15.00 / $ 60.00  │
    │      openai/o1-preview     OpenAI                       ● Ready            │
    └────────────────────────────────────────────────────────────────────────────┘
    
    ┌────────────────────────────────────────────────────────────────────────────┐
    │ [🧠] Hermes 3 405B         Llama           32k          $ 2.50 / $ 2.50    │
    │      nous/hermes-3         OpenRouter                   ● Ready            │
    └────────────────────────────────────────────────────────────────────────────┘
    
    ```
    
    ---
    
    ### 2. ZAKŁADKA: Dostawcy (Architecture Layer)
    
    Fundament techniczny. Definicja, skąd system wie, jakie suwaki pokazać.
    
    ```
    [ + Dodaj Dostawcę ]
    
    DOSTAWCA             STEROWNIK (SCHEMA)           CENNIK                 AKCJE
    ──────────────────────────────────────────────────────────────────────────────
    
    ┌────────────────────────────────────────────────────────────────────────────┐
    │ [OpenAI Icon]      [ ● Active ]                 Źródło: openai.com/pricing │
    │ OpenAI             Schema: v2 (Dynamic)         [ ↻ Auto-Sync ]            │
    │                                                                            │
    │                    [ ⚙️ Edytuj JSON Schema ] <-- Dla Deva (Future Proof)   │
    └────────────────────────────────────────────────────────────────────────────┘
    
    ┌────────────────────────────────────────────────────────────────────────────┐
    │ [OpenRouter Icon]  [ ● Active ]                 Źródło: API Live           │
    │ OpenRouter         Adapter: Native API          [ ⚡ API Sync ]            │
    │ (Meta-Provider)                                                            │
    │                    [ 🌐 Przeglądaj Marketplace (14 zainstalowanych) ]      │
    └────────────────────────────────────────────────────────────────────────────┘
    
    ```
    
    ---
    
    ### 3. WIDOK: New/Edit Model (Agnostyczny Formularz)
    
    Serce systemu. **Split Layout**.
    Zwróć uwagę na sekcję **3. PARAMETRY NIESTANDARDOWE** – poprawioną pod kątem UX (typy danych).
    
    ```
    +-----------------------------------------------------------------------------+
    | Settings > LLMs > Edycja: o1-preview                                        |
    |-----------------------------------------------------------------------------+
    | [🧠▼] [ o1-preview ]                        [ Anuluj ] [ Zapisz Model ]     |
    |-----------------------------------------------------------------------------+
    |                                                   |                         |
    |  LEWA KOLUMNA (DYNAMICZNA KONFIGURACJA)           |  PRAWA KOLUMNA (TEST)   |
    |  -----------------------------------------------  |  -----------------------|
    |  1. TOŻSAMOŚĆ                                     |  [🧪] Sanity Check      |
    |  Nazwa: [ o1-preview                          ]   |                         |
    |  Dostawca: [ OpenAI                           ]   |  Konsola weryfikacyjna. |
    |  ID API:   [ o1-preview                       ]   |                         |
    |                                                   |  PROMPT TESTOWY:        |
    |  -----------------------------------------------  |  [ Wyjaśnij teorię      |
    |  2. PARAMETRY DOSTAWCY (SCHEMA-DRIVEN)            |    strun w 2 zdaniach. ]|
    |  *Renderowane na podstawie definicji Dostawcy.*   |                         |
    |                                                   |  [ ▶ Wyślij Test ]      |
    |  Reasoning Effort:                                |                         |
    |  [ Low ] [ (◉) Medium ] [ High ]                  |  ---------------------  |
    |                                                   |  WYNIK (LIVE):          |
    |  Max Completion Tokens:                           |  (Thinking...)          |
    |  [ 32,000                    ]                    |  "Teoria strun zakłada, |
    |                                                   |  że fundamentalnym..."  |
    |  -----------------------------------------------  |                         |
    |  3. PARAMETRY NIESTANDARDOWE (PASSTHROUGH)        |  METRYKI:               |
    |  Wstrzyknij parametry spoza schematu.             |  ⏱ Latency: 4.5s        |
    |                                                   |  💰 Cost: $0.02         |
    |  +-------------------------------------------+    |  🧠 Tokens: 450/120     |
    |  | KLUCZ (JSON Key) | WARTOŚĆ    | TYP     |    |                         |
    |  |------------------|------------|---------|    |  RAW RESPONSE:          |
    |  | beta_feature_x   | true       | [Bool ▼]|    |  {                      |
    |  | top_k            | 50         | [Int  ▼]|    |    "model": "o1",       |
    |  +-------------------------------------------+    |    "usage": {...}       |
    |  [ + Dodaj Parametr ]                             |  }                      |
    |                                                   |                         |
    |  -----------------------------------------------  |  STATUS:                |
    |  4. GLOBALNE INSTRUKCJE (SYSTEM PROMPT)           |  ✅ Connected           |
    |  [ Zawsze używaj formatowania Markdown...       ] |                         |
    |                                                   |                         |
    |  -----------------------------------------------  |                         |
    |  5. EKONOMIA (PRICING)                            |                         |
    |  [ 🌐 Aktualizuj z URL ]                          |                         |
    |  Input: [$ 15.00 ]   Output: [$ 60.00 ]           |                         |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ---
    
    ### 4. WIDOK: Router Editor (Ulepszona Wizualizacja)
    
    Poprawiona wizualizacja logiki **Fallback**. Użytkownik widzi dokładnie, *kiedy* nastąpi przełączenie na model zapasowy.
    
    ```
    +-----------------------------------------------------------------------------+
    | Settings > LLMs > Edycja Routera: Production Safe                           |
    |-----------------------------------------------------------------------------+
    | Nazwa (Alias): [ Production Safe                                          ] |
    | Strategia:     [ (◉) Fallback (Kaskada) ]  [ ( ) Load Balancer ]            |
    |                                                                             |
    | ŁAŃCUCH PRIORYTETÓW (EXECUTION CHAIN):                                      |
    |                                                                             |
    | 1. PRIMARY MODEL                                                            |
    |    ┌──────────────────────────────────────────────────────────────────┐     |
    |    │ [🧠] OpenAI / GPT-4o                                     [⚙️] [🗑️] │     |
    |    └──────────────────────────────────────────────────────────────────┘     |
    |             │                                                               |
    |             │  ⚡ IF ERROR (API 5xx, Timeout > 30s)                         |
    |             ▼                                                               |
    |                                                                             |
    | 2. FALLBACK 1                                                               |
    |    ┌──────────────────────────────────────────────────────────────────┐     |
    |    │ [🧠] OpenRouter / openai/gpt-4o                          [⚙️] [🗑️] │     |
    |    └──────────────────────────────────────────────────────────────────┘     |
    |             │                                                               |
    |             │  ⚡ IF ERROR (Any)                                            |
    |             ▼                                                               |
    |                                                                             |
    | 3. LAST RESORT                                                              |
    |    ┌──────────────────────────────────────────────────────────────────┐     |
    |    │ [🧠] Anthropic / Claude 3.5 Sonnet                       [⚙️] [🗑️] │     |
    |    └──────────────────────────────────────────────────────────────────┘     |
    |                                                                             |
    | [ + Dodaj Model Zapasowy ]                                                  |
    +-----------------------------------------------------------------------------+
    
    ```
    
    ---
    
    ### 5. MODAL: OpenRouter Marketplace
    
    Katalog modeli z jasnym CTA.
    
    ```
    +-----------------------------------------------------------------------------+
    | 🌐 OpenRouter Marketplace                                           [ X ]   |
    |-----------------------------------------------------------------------------+
    | Katalog modeli od Meta-Dostawcy. Ceny są "live".                            |
    |                                                                             |
    | [🔍 Szukaj...]   Filtry: [ Context > 128k ] [ < $1/M ] [ Uncensored ]       |
    |                                                                             |
    | DOSTĘPNE MODELE (Sort: Popularność)                                         |
    | --------------------------------------------------------------------------- |
    |                                                                             |
    | [x] Anthropic: Claude 3.5 Sonnet                                            |
    |     $3.00 / $15.00  •  200k Context                                         |
    |     [ ✅ Zainstalowano ]                                                    |
    |                                                                             |
    | [ ] Google: Gemini 1.5 Pro                                                  |
    |     $1.25 / $3.75   •  2M Context                                           |
    |     [ + Zainstaluj ]  <-- Primary CTA                                       |
    |                                                                             |
    | [ ] DeepSeek: DeepSeek-V3                                                   |
    |     $0.14 / $0.28   •  Chinese Powerhouse                                   |
    |     [ + Zainstaluj ]                                                        |
    |                                                                             |
    | --------------------------------------------------------------------------- |
    | [ Zamknij ]                                                                 |
    +-----------------------------------------------------------------------------+
    
    ```
    
    Te widoki stanowią zamkniętą całość. Są one technicznie wykonalne (zgodnie z omówioną architekturą JSON Schema) i ergonomiczne dla użytkownika (UX Best Practices).
    
- Plan Implementacji
    
    Oto finalny, **rygorystyczny architektonicznie Plan Implementacji** dla modułu Settings > LLMs.
    
    Wprowadziłem kluczową zmianę: **Zastosowanie Portów i Adapterów**.
    Dzięki temu moduł `Agents` nie będzie wiedział, że istnieje moduł `LLMs`. Będzie znał tylko interfejs (kontrakt), co czyni architekturę w 100% zgodną z Clean Architecture i VSA (Vertical Slices Architecture).
    
    ---
    
    ### I. Mapa Plików (Struktura VSA + Shared Ports)
    
    ```
    backend/app/
    ├── shared/
    │   ├── ports/                  # <--- NOWOŚĆ: Kontrakty (Interfejsy)
    │   │   └── illm_gateway.py     # Abstrakcja: "Jak system prosi o AI"
    │   └── db/
    │       └── base.py
    │
    ├── modules/
    │   ├── llms/                   # SLICE 1: Dostarczanie Inteligencji (Infrastructure)
    │   │   ├── models.py           # DB: Provider, Model, Router (JSONB Schema)
    │   │   ├── schemas.py          # Pydantic: DTOs dla API
    │   │   ├── router.py           # API: Konfiguracja (CRUD)
    │   │   └── services/
    │   │       ├── gateway.py      # 🔥 ADAPTER: Implementacja illm_gateway.py
    │   │       ├── provider_registry.py
    │   │       └── openrouter_client.py
    │   │
    │   └── agents/                 # SLICE 2: Konsumenci Inteligencji
    │       ├── service.py          # Korzysta z illm_gateway (nie z modułu llms!)
    │       └── ...
    │
    ├── main.py                     # WIRING: Wstrzykiwanie zależności
    
    ```
    
    ---
    
    ### II. Krok 1: Definicja Portu (Contract)
    
    Zanim napiszemy linijkę kodu konfiguracyjnego, definiujemy, jak reszta systemu rozmawia z "Mózgami". To zapewnia luźne powiązania.
    
    **Plik:** `backend/app/shared/ports/illm_gateway.py`
    
    ```python
    from typing import Protocol, List, Dict, Any, Union
    from pydantic import BaseModel
    
    # DTO (Data Transfer Object) - Czysta struktura danych
    class LLMRequest(BaseModel):
        model_identifier: str  # Może to być ID modelu LUB ID Routera
        messages: List[Dict[str, str]]
        # Opcjonalne nadpisanie parametrów (Passthrough)
        custom_params: Dict[str, Any] = {}
    
    class LLMResponse(BaseModel):
        content: str
        usage: Dict[str, int]  # tokeny
        cost: float
    
    # PORT (Interfejs)
    class ILLMGateway(Protocol):
        async def generate(self, request: LLMRequest) -> LLMResponse:
            """
            Wykonuje zapytanie do LLM.
            Obsługuje automatycznie: Routing, Fallback, Mapowanie parametrów.
            """
            ...
    
    ```
    
    ---
    
    ### III. Krok 2: Domena Modułu LLMs (Agnostyczna Baza)
    
    Tutaj tworzymy strukturę danych odporną na zmiany w przyszłości (Future-Proof).
    
    **Plik:** `backend/app/modules/llms/models.py`
    
    ```python
    from sqlalchemy import Column, String, Float, ForeignKey
    from sqlalchemy.dialects.postgresql import JSONB
    from app.shared.db.base import Base
    
    class LLMProvider(Base):
        __tablename__ = "llm_providers"
        id = Column(String, primary_key=True)
    
        # Schema-Driven UI: To definiuje wygląd formularza we Frontendzie
        # Zmiana tutaj = Zmiana w UI bez deployu kodu.
        config_schema = Column(JSONB, default=list)
    
        # Tłumacz: Axon Params -> Vendor Params
        parameter_mapping = Column(JSONB, default=dict)
    
    class LLMModel(Base):
        __tablename__ = "llm_models"
        id = Column(String, primary_key=True)
        provider_id = Column(String, ForeignKey("llm_providers.id"))
    
        # Wartości konfiguracyjne (Dynamiczne)
        config_values = Column(JSONB, default=dict)
    
        # Fallback params (gdy API providera ma nowość, której Axon nie zna)
        passthrough_params = Column(JSONB, default=dict)
    
    class LLMRouter(Base):
        __tablename__ = "llm_routers"
        id = Column(String, primary_key=True)
    
        # Logika Niezawodności: Lista modeli w kolejności priorytetu
        fallback_chain = Column(JSONB, default=list)
    
    ```
    
    ---
    
    ### IV. Krok 3: Implementacja Adaptera (The Core Logic)
    
    To jest "Mózg Mózgów". Implementuje interfejs `ILLMGateway`. Obsługuje Routery i tłumaczy parametry.
    
    **Plik:** `backend/app/modules/llms/services/gateway.py`
    
    ```python
    from app.shared.ports.illm_gateway import ILLMGateway, LLMRequest, LLMResponse
    import litellm # Biblioteka ujednolicająca
    
    class AxonLLMGateway(ILLMGateway):
        def __init__(self, db_session):
            self.db = db_session
    
        async def generate(self, request: LLMRequest) -> LLMResponse:
            # 1. Sprawdź czy to Router czy Model
            target = self._resolve_target(request.model_identifier)
    
            if isinstance(target, LLMRouter):
                return await self._execute_with_fallback(target, request)
            else:
                return await self._execute_model(target, request)
    
        async def _execute_model(self, model: LLMModel, request: LLMRequest):
            # A. Połącz konfigurację z bazy z custom_params z requestu
            params = {**model.config_values, **model.passthrough_params, **request.custom_params}
    
            # B. Mapuj parametry (np. 'reasoning_effort' -> API specific key)
            api_params = self._map_params(model.provider, params)
    
            # C. Wykonaj (LiteLLM)
            response = await litellm.acompletion(
                model=f"{model.provider.id}/{model.api_model_id}",
                messages=request.messages,
                **api_params
            )
            return self._format_response(response)
    
        async def _execute_with_fallback(self, router: LLMRouter, request: LLMRequest):
            # Pętla po łańcuchu fallback
            for model_id in router.fallback_chain:
                try:
                    model = self.db.query(LLMModel).get(model_id)
                    return await self._execute_model(model, request)
                except Exception as e:
                    print(f"Model {model_id} failed. Trying next...")
                    continue
            raise Exception("All models in router failed.")
    
    ```
    
    ---
    
    ### V. Krok 4: Frontend (Schema-Driven UI)
    
    Frontend jest "głupi". Nie wie, czym jest `temperature`. Renderuje to, co każe mu JSON z bazy.
    
    **Kluczowy Komponent:** `DynamicParams.tsx`
    
    ```tsx
    // Pobiera 'schema' z endpointu GET /api/llms/providers/{id}
    export const DynamicParams = ({ schema, formMethods }) => {
      return (
        <>
          {schema.map(field => (
            <Controller
              name={`config_values.${field.key}`}
              render={({ field: input }) => {
                // Renderowanie warunkowe na podstawie typu w JSON
                if (field.type === 'slider') return <Slider {...input} {...field.props} />
                if (field.type === 'select') return <Select {...input} options={field.options} />
                return <Input {...input} />
              }}
            />
          ))}
        </>
      )
    }
    
    ```
    
    **Widok Edycji:** Używa `SplitFormLayout`.
    
    - **Lewa:** `DynamicParams` + Sekcja `Passthrough` (Tabela Key-Value).
    - **Prawa:** `SanityCheck` (Wysyła request do `AxonLLMGateway` z tymczasowym konfigiem).
    
    ---
    
    ### VI. Krok 5: Wiring (Dependency Injection)
    
    To jest "klej", który spina VSA w `main.py`.
    
    ```python
    # backend/app/main.py
    from fastapi import FastAPI, Depends
    from app.modules.llms.services.gateway import AxonLLMGateway
    from app.modules.agents.router import router as agents_router
    
    app = FastAPI()
    
    # Dependency Provider
    def get_llm_gateway(db = Depends(get_db)):
        return AxonLLMGateway(db)
    
    # Wstrzyknięcie do modułu Agents
    # Moduł Agents nie importuje Gatewaya bezpośrednio!
    # Dostaje go jako argument w funkcjach.
    app.include_router(agents_router)
    
    ```
    
    W routerze agentów:
    
    ```python
    # backend/app/modules/agents/router.py
    from app.shared.ports.illm_gateway import ILLMGateway # Importujemy tylko interfejs!
    
    @router.post("/run")
    async def run_agent(
        gateway: ILLMGateway = Depends(get_llm_gateway) # FastAPI wstrzykuje implementację
    ):
        # Agent używa abstrakcji. Nie obchodzi go, czy pod spodem jest OpenAI, czy Router.
        response = await gateway.generate(...)
    
    ```
    
    ---
    
    ### Podsumowanie Planu
    
    Ten plan jest:
    
    1. **DDD:** Jasne granice kontekstu ("Infrastruktura AI" vs "Wykorzystanie AI").
    2. **Pure Architecture:** Moduły biznesowe (Agenty) zależą od abstrakcji (Portów), a nie od detali implementacyjnych (Modułu LLM).
    3. **VSA:** Kod jest pogrupowany funkcjonalnie, ale współdzieli kluczowe abstrakcje w `shared`.
    4. **Agnostyczny:** Dodanie obsługi GPT-5 odbywa się poprzez SQL (`UPDATE providers SET config_schema...`), bez rekompilacji UI.
    
    Możesz przekazać ten plan developerom. Jest kompletny.