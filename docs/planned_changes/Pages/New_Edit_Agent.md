- Page views
    
    ```markdown
    +-----------------------------------------------------------------+
    |                                                                 |
    |  Jakiego agenta chcesz stworzyć?                             [x]  |
    |  =============================================================  |
    |                                                                 |
    |  +---------------------------+  +-----------------------------+ |
    |  |     M A N A G E R         |  |      W O R K E R            | |
    |  |---------------------------|  |-----------------------------| |
    |  | 👨‍💼 Agent-koordynator.     |  | 🛠️ Agent-specjalista.      | |
    |  | Planuje i deleguje zadania|  | Skupiony na wykonywaniu     | |
    |  | do innych agentów.        |  | konkretnych zadań.          | |
    |  +---------------------------+  +-----------------------------+ |
    |                                                                 |
    |                                                                 |
    |               lub załaduj gotowy szablon                        |
    |                                                                 |
    |           [ 📚  Załaduj z Biblioteki Promptów ]                 |
    |                                                                 |
    +-----------------------------------------------------------------+
    ```
    
    ```markdown
    +-----------------------------------------------------------------+
    |                                                                 |
    |  Załaduj Archetyp z Biblioteki                               [x]  |
    |  =============================================================  |
    |                                                                 |
    |  Wybierz gotowy Archetyp, aby wstępnie wypełnić formularz.      |
    |                                                                 |
    |  [ Wpisz, aby wyszukać w bibliotece...                  🔎 ]     |
    |                                                                 |
    |  +-----------------------------------------------------------+  |
    |  | [🧠] Archetyp: Product Guardian                           |  |
    |  |      *Strażnik roadmapy i OKRów. Analizuje nowe inicjatywy* |  |
    |  +-----------------------------------------------------------+  |
    |                                                                 |
    |  +-----------------------------------------------------------+  |
    |  | [💻] Archetyp: Code Reviewer                              |  |
    |  |      *Automatyczny recenzent kodu. Szuka błędów i...*      |  |
    |  +-----------------------------------------------------------+  |
    |                                                                 |
    |  +-----------------------------------------------------------+  |
    |  | [✍️] Archetyp: UX Writer                                  |  |
    |  |      *Agent dbający o microcopy. Tworzy spójne i...*       |  |
    |  +-----------------------------------------------------------+  |
    |                                                                 |
    |                                     [ Anuluj ] [ Wybierz → ]    |
    |                                                                 |
    +-----------------------------------------------------------------+
    ```
    
    ```markdown
    +-----------------------------------------------------------------------------+
    | Workspaces > Product Management > Agents > Nowy Agent                       |
    |-----------------------------------------------------------------------------+
    | [🧠▼] [ Product Guardian ]                  [ Anuluj ] [ Zapisz Agenta ]    |
    |-----------------------------------------------------------------------------+
    |                                                   |                         |
    |  LEWA KOLUMNA (KONFIGURACJA)                      |  PRAWA KOLUMNA (FINANSE)|
    |  -----------------------------------------------  |  -----------------------|
    |  1. TOŻSAMOŚĆ (IDENTITY)                          |  [💰] Estymator Kosztów |
    |  Określ, kim jest Agent i jaka jest jego misja.   |                         |
    |                                                   |  WYBRANY MODEL:         |
    |  Rola: [ Ruthless Product Manager             ]   |  🛡️ Strategic Router    |
    |                                                   |  (o1-preview / GPT-4o)  |
    |  Cel:  [ Chronić Roadmapę przed "feature creep"   |                         |
    |          i pilnować zgodności z OKRami.       ]   |  KOSZT URUCHOMIENIA:    |
    |                                                   |  ~ $ 0.05 / run         |
    |  Sposób Myślenia: [ ( ) Wykonawca ] [ (◉) Strateg ]| (Wysoki - RAG + Tools) |
    |                                                   |                         |
    |  Backstory (Bio):                                 |  ZUŻYCIE KONTEKSTU:     |
    |  [ Jesteś asertywnym PM-em. Twoim zadaniem jest   |  [====----------------] |
    |    analizować pomysły i odrzucać te, które nie    |  24% (Ok. 30k tokenów)  |
    |    wpływają na North Star Metric.               ] |                         |
    |                                                   |  ALOKACJA PAMIĘCI:      |
    |  -----------------------------------------------  |  • System: 1.2k         |
    |  2. MÓZG I WIEDZA (COGNITIVE LAYER)               |  • Guardrails: 2.5k     |
    |  W co wyposażony jest umysł Agenta?               |  • Definicje Skills: 1k |
    |                                                   |    (Opisy funkcji)      |
    |  Instrukcja Krytycznego Myślenia (Meta-Prompt):   |  • Wiedza (RAG): Var.   |
    |  [ Stosuj zasadę "1-in-1-out". Weryfikuj pomysły  |                         |
    |    z sekcją "Anti-Goals" w Roadmapie.           ] |  DOSTĘPNE HUBY (RAG):   |
    |                                                   |  1. Product Mgmt        |
    |  Zakres Wiedzy (Knowledge Scope):                 |     (45 plików)         |
    |  Wybierz Huby z modułu Resources (Multi-Select).  |  2. Discovery           |
    |                                                   |     (120 plików)        |
    |  [ 📈 Product Management Hub x ] [ 🔍 Discovery x ]  [ ⌄ Pokaż szczegóły ]  |
    |  [ Wpisz, aby szukać więcej...                ▼ ] |                         |
    |                                                   |                         |
    |  SYSTEM OCHRONNY (Smart List Editor):             |                         |
    |                                                   |                         |
    |  ✅ ZASADY DZIAŁANIA (Instructions)               |                         |
    |  Co Agent MUSI robić?                             |                         |
    |  +---------------------------------------------+  |                         |
    |  | - Zawsze cytuj źródło z RAG (podaj plik).   |  |                         |
    |  | - Formatuj daty w standardzie ISO-8601.     |  |                         |
    |  | - | <--- (Enter dodaje myślnik)             |  |                         |
    |  +---------------------------------------------+  |                         |
    |                                                   |                         |
    |  ⛔ OGRANICZENIA (Constraints)                    |                         |
    |  Czego Agentowi NIE WOLNO?                        |                         |
    |  +---------------------------------------------+  |                         |
    |  | - Nie zmieniaj zadań w statusie "Now".      |  |                         |
    |  | - Wymagaj LTV:CAC > 3 dla nowych funkcji.   |  |                         |
    |  +---------------------------------------------+  |                         |
    |                                                   |                         |
    |  -----------------------------------------------  |                         |
    |  3. INTERFEJS DANYCH (KONTRAKT I/O)               |                         |
    |  Agent przetwarza dane. Co wchodzi i co wychodzi? |                         |
    |                                                   |                         |
    |  ▼ Dane Wejściowe (Input)                         |                         |
    |    [ 🪄 Wypełnij na podst. Roli i Wiedzy ]        | <--- MAGIC WAND         |
    |  +---------------------------------------------+  |      (Analizuje cel     |
    |  | KLUCZ ZMIENNEJ | RODZAJ DANYCH | WYMAGANE?|    |       agenta)           |
    |  |----------------|---------------|----------|----|                         |
    |  | feature_idea   | [ Tekst       ▼]| [Tak]    | [🗑️]|                         |
    |  | stakeholder    | [ Tekst       ▼]| [Tak]    | [🗑️]|                         |
    |  +---------------------------------------------+  |                         |
    |                                                   |                         |
    |  ▼ Wynik Pracy (Output)                           |                         |
    |  +---------------------------------------------+  |                         |
    |  | decision_memo  | [ Tekst       ▼]| [Tak]    | [🗑️]|                         |
    |  | priority_score | [ Liczba (Int)▼]| [Tak]    | [🗑️]|                         |
    |  +---------------------------------------------+  |                         |
    |                                                   |                         |
    |  -----------------------------------------------  |                         |
    |  4. SILNIK I ZACHOWANIE (ENGINE)                  |                         |
    |                                                   |                         |
    |  Model LLM (Z Settings > LLMs):                   |                         |
    |  [ 🛡️ Strategic Router (Recommended)        ▼ ]   |                         |
    |                                                   |                         |
    |  Tryb Interaktywności (Human-in-the-Loop):        |                         |
    |  Kiedy Agent ma zatrzymać pracę i pytać?          |                         |
    |                                                   |                         |
    |  [ ( ) Brak (Pełna automatyzacja)             ]   |                         |
    |  [ (◉) Briefing na starcie (Zatwierdź plan)   ]   | <--- BRIEFING           |
    |        *Zanim Agent podejmie decyzję,             |                         |
    |         przedstawi plan analizy.*                 |                         |
    |  [ ( ) Konsultacje (Pytaj w trakcie)          ]   |                         |
    |                                                   |                         |
    |  [ ⌄ Zaawansowane (Cytowanie, Delegacja) ]        |                         |
    |                                                   |                         |
    |  -----------------------------------------------  |                         |
    |  5. UMIEJĘTNOŚCI WEWNĘTRZNE (INTERNAL SKILLS)     |                         |
    |  Kompetencje poznawcze i obliczeniowe.            |                         |
    |  *Brak integracji zewnętrznych.*                  |                         |
    |                                                   |                         |
    |  A. UMIEJĘTNOŚCI WBUDOWANE (NATIVE):              |                         |
    |  [x] 🌐 Web Search (Przeszukiwanie Internetu)     |                         |
    |  [ ] 🐍 Code Interpreter (Python Sandbox)         |                         |
    |  [x] 📂 File Browser (Odczyt plików z RAG)        |                         |
    |                                                   |                         |
    |  B. BIBLIOTEKA FUNKCJI (CUSTOM FUNCTIONS):        |                         |
    |  Funkcje zdefiniowane w Settings > Internal Tools.|                         |
    |                                                   |                         |
    |  [ + Dodaj Funkcję (Skill Picker) ]               |                         |
    |                                                   |                         |
    |  +---------------------------------------------+  |                         |
    |  | NAZWA I OPIS FUNKCJI           TYP      |   |  |                         |
    |  |─────────────────────────────────────────|---|  |                         |
    |  | [🧩] lead_scoring              Internal |🗑️|  |                         |
    |  |      "Oblicza potencjał leada           |   |  |                         |
    |  |       (Math Logic)."                    |   |  |                         |
    |  |─────────────────────────────────────────|---|  |                         |
    |  | [🧩] validate_nip_pl           Internal |🗑️|  |                         |
    |  |      "Sprawdza sumę kontrolną."         |   |  |                         |
    |  +---------------------------------------------+  |                         |
    |                                                   |                         |
    |  -----------------------------------------------  |                         |
    |  6. DOSTĘPNOŚĆ (WORKSPACES)                       |                         |
    |  [✓] Product Management                           |                         |
    |  [ ] Delivery                                     |                         |
    +-----------------------------------------------------------------------------+
    ```
    
    ```markdown
    +-----------------------------------------------------------------------------+
    | Wybierz Umiejętność (Internal Skills)                               [ X ]   |
    |-----------------------------------------------------------------------------+
    | [ 🔍 Szukaj np. calc, validator, parser... ]                                |
    |                                                                             |
    | FILTRY: [ Wszystkie ] [ Finanse ] [ Utils ] [ Prawne ]                      |
    |                                                                             |
    | DOSTĘPNE FUNKCJE:                                                           |
    |                                                                             |
    | [🧩] lead_scoring                                                           |
    |      "Oblicza potencjał leada na podstawie przychodu i zatrudnienia."       |
    |      Kategoria: Sprzedaż                                                    |
    |      [ + Dodaj ]                                                            |
    |                                                                             |
    | [🧩] validate_pesel                                                         |
    |      "Sprawdza poprawność sumy kontrolnej numeru PESEL."                    |
    |      Kategoria: Prawne                                                      |
    |      [ + Dodaj ]                                                            |
    |                                                                             |
    | [🧩] sentiment_analysis_local                                               |
    |      "Lokalna analiza sentymentu tekstu (Positive/Negative)."               |
    |      Kategoria: AI Utils                                                    |
    |      [ + Dodaj ]                                                            |
    |                                                                             |
    | --------------------------------------------------------------------------- |
    | [ ⚙️ Zarządzaj funkcjami (Settings > Internal Tools) ]                      |
    +--------
    ---------------------------------------------------------------------+
    ```
    
    ```markdown
    +-----------------------------------------------------------------------------+
    | FINALNY WIDOK: Estymator Kosztów (Prawa Kolumna)                            |
    |-----------------------------------------------------------------------------|
    |  [💰] Estymator Kosztów                      [↗️ Pełny ekran]                |
    |  ---------------------------------------------------------------------------|
    |  WPŁYW NA KOSZT: [ 🟠 Średni ]                                              |
    |  • Koszt Statyczny:      $0.015 / run                                      |
    |  • Szac. Koszt Dynamiczny: ~ $0.033 / run                                   |
    |                                                                             |
    |  AI SUGGESTIONS:                                                            |
    |  [ Zmień model na 'GPT-4o-mini' (-$0.02) ] [ Wyłącz RAG (-$0.008) ]          |
    |                                                                             |
    |  [ ⌄ Pokaż szczegóły ]                                                      |
    |   • Breakdown Statyczny: Setup($0.005), RAG($0.008), Narzędzia($0.002)     |
    |   • Breakdown Dynamiczny: In(~15k, $0.025), Out(~2k, $0.008)              |
    |   • Zużycie Kontekstu: [====--] 24% (30k)                                  |
    +-----------------------------------------------------------------------------+
    
    +-------------------------------------------------------------------------------------------------+
    | MODAL VIEW: Estymator Kosztów (Pełny Ekran)                                   [ Zamknij [X] ]   |
    |-------------------------------------------------------------------------------------------------|
    |                                                                                                 |
    |  WPŁYW NA KOSZT: [ 🟠 Średni ]                                                                  |
    |  • Koszt Statyczny:                                                   $0.015 / run              |
    |  • Szac. Koszt Dynamiczny:                                          ~ $0.033 / run              |
    |                                                                                                 |
    |  AI SUGGESTIONS:                                                                                |
    |  [ Zmień model na 'GPT-4o-mini' (-$0.02) ] [ Wyłącz RAG (-$0.008) ]                              |
    |                                                                                                 |
    |  [ ⌄ Pokaż szczegóły ]                                                                          |
    |  -----------------------------------------------------------------------------------------------|
    |  SZCZEGÓŁOWY PODZIAŁ KOSZTÓW:                                                                   |
    |  • Koszt Statyczny:                                                                             |
    |    - Inicjalizacja Agenta (Setup):         $0.005                                               |
    |    - Koszt użycia RAG (1 Hub):             $0.008                                               |
    |    - Koszt wywołania Narzędzi (2):         $0.002                                               |
    |  • Koszt Dynamiczny (Estymacja):                                                                |
    |    - Tokeny Wejściowe (Prompt): ~15k       $0.025                                               |
    |    - Tokeny Wyjściowe (Odpowiedź): ~2k     $0.008                                               |
    |  -----------------------------------------------------------------------------------------------|
    |  ANALIZA ZUŻYCIA KONTEKSTU:                                                                     |
    |  • Zużycie Okna Kontekstowego:    [====----------------] 24% (Ok. 30k tokenów)                  |
    |  • Alokacja Pamięci Agenta:      • System: 1.2k | • Guardrails: 2.5k                           |
    |-------------------------------------------------------------------------------------------------+
    ```
    
- Plan Implementacji
    
    To jest konkretny plan implementacji, który mapuje nasze ustalenia na Twoją istniejącą strukturę plików. Skupiamy się na module **Agents**, ale wprowadzamy niezbędne zmiany w **Shared** i **Backendzie**, aby obsłużyć nowe wymagania (DDD, VSA).
    
    ### Zaktualizowana Mapa Plików (Co dodajemy/zmieniamy)
    
    ```
    axon/
    ├── backend/
    │   ├── app/
    │   │   ├── modules/
    │   │   │   ├── agents/
    │   │   │   │   ├── models.py           # [MODYFIKACJA] Nowe kolumny JSONB
    │   │   │   │   ├── schemas.py          # [MODYFIKACJA] Pydantic dla nowych pól
    │   │   │   │   └── service.py          # [MODYFIKACJA] Obsługa logiki
    │   │
    ├── frontend/
    │   ├── src/
    │   │   ├── modules/
    │   │   │   ├── agents/
    │   │   │   │   ├── components/
    │   │   │   │   │   ├── AgentForm.tsx         # [REFACTOR] Główny Wrapper
    │   │   │   │   │   ├── AgentCostEstimator.tsx # [NOWY] Prawa kolumna
    │   │   │   │   │   │
    │   │   │   │   │   ├── sections/             # [NOWY FOLDER] Sekcje formularza
    │   │   │   │   │   │   ├── IdentitySection.tsx
    │   │   │   │   │   │   ├── CognitiveSection.tsx (Mózg/Wiedza)
    │   │   │   │   │   │   ├── InterfaceSection.tsx (I/O + Magic)
    │   │   │   │   │   │   └── EngineSection.tsx    (Interaktywność)
    │   │   │   │   │   │
    │   │   │   │   │   └── editors/              # [NOWY FOLDER] Mini-edytory
    │   │   │   │   │       ├── GuardrailsList.tsx
    │   │   │   │   │       └── RadioCard.tsx
    │   │   │   │   │
    │   │   │   │   └── hooks/
    │   │   │   │       └── useAgentForm.ts       # [MODYFIKACJA] Logika formularza
    │   │   │
    │   │   └── shared/
    │   │       ├── components/
    │   │       │   └── layouts/
    │   │       │       └── SplitFormLayout.tsx   # [NOWY] Layout 8/4 kolumny
    
    ```
    
    ---
    
    ### Faza 1: Backend (Fundament Danych)
    
    Musimy przygotować bazę danych na przyjęcie złożonych struktur konfiguracyjnych (JSONB), zamiast tworzyć setki kolumn.
    
    **Plik:** `backend/app/modules/agents/models.py`
    
    ```python
    from sqlalchemy import Column, String, Boolean, ForeignKey
    from sqlalchemy.dialects.postgresql import JSONB, ARRAY
    from app.shared.db.base import Base
    
    class Agent(Base):
        __tablename__ = "agents"
    
        id = Column(String, primary_key=True)
        project_id = Column(String, ForeignKey("projects.id"))
    
        # 1. Tożsamość
        name = Column(String)
        role = Column(String)
        goal = Column(String)
        backstory = Column(String)
    
        # 2. Mózg i Wiedza (Cognitive) - NOWOŚĆ
        critical_instruction = Column(String)  # Meta-prompt
        guardrails = Column(ARRAY(String))     # Lista zasad ["Nie kłam", "Bądź miły"]
        knowledge_config = Column(JSONB)       # { "files": ["roadmap.md"], "folders": [] }
    
        # 3. Silnik i Zachowanie (Engine) - NOWOŚĆ
        # Przechowujemy konfigurację jako JSON, aby była elastyczna
        engine_config = Column(JSONB)
        """
        Struktura engine_config:
        {
            "model_id": "router-production-safe",
            "allow_delegation": true,
            "interactivity": "briefing",  # none | briefing | consultation
            "advanced": {
                "grounded_mode": true,
                "citations": true
            }
        }
        """
    
        # 4. Interfejs (I/O)
        interface_schema = Column(JSONB) # { "inputs": [...], "outputs": [...] }
    
    ```
    
    ---
    
    ### Faza 2: Frontend - Layout i Komponenty Bazowe
    
    Tworzymy ramy dla widoku.
    
    **Plik:** `frontend/src/shared/components/layouts/SplitFormLayout.tsx`
    
    ```tsx
    import React from 'react';
    
    export const SplitFormLayout = ({ children, rightPanel }: { children: React.ReactNode, rightPanel: React.ReactNode }) => {
      return (
        <div className="grid grid-cols-12 gap-0 h-[calc(100vh-64px)]">
          {/* Lewa: Scrollowalny formularz */}
          <div className="col-span-8 overflow-y-auto p-8 pb-32">
            <div className="max-w-3xl mx-auto space-y-8">
              {children}
            </div>
          </div>
    
          {/* Prawa: Sticky Panel */}
          <div className="col-span-4 border-l bg-gray-50/50 p-6 overflow-y-auto">
            <div className="sticky top-6">
              {rightPanel}
            </div>
          </div>
        </div>
      );
    };
    
    ```
    
    ---
    
    ### Faza 3: Frontend - Sekcje Formularza (Vertical Slice: Agents)
    
    Rozbijamy monolityczny `AgentForm` na mniejsze klocki.
    
    **Plik:** `frontend/src/modules/agents/components/AgentForm.tsx` (Główny orkiestrator)
    
    ```tsx
    import { useForm, FormProvider } from 'react-hook-form';
    import { SplitFormLayout } from '@/shared/components/layouts/SplitFormLayout';
    import { IdentitySection } from './sections/IdentitySection';
    import { CognitiveSection } from './sections/CognitiveSection';
    import { EngineSection } from './sections/EngineSection';
    import { AgentCostEstimator } from './AgentCostEstimator';
    
    export const AgentForm = () => {
      const methods = useForm({
        defaultValues: {
          role: '',
          guardrails: [],
          interactivity: 'consultation',
          // ...
        }
      });
    
      return (
        <SplitFormLayout rightPanel={<AgentCostEstimator />}>
          <FormProvider {...methods}>
            <form className="space-y-12">
              <IdentitySection />
              <div className="h-px bg-border" /> {/* Separator */}
              <CognitiveSection />
              <div className="h-px bg-border" />
              <EngineSection />
              {/* InterfaceSection i ToolsSection... */}
            </form>
          </FormProvider>
        </SplitFormLayout>
      );
    };
    
    ```
    
    **Plik:** `frontend/src/modules/agents/components/sections/EngineSection.tsx` (Przykład implementacji)
    
    ```tsx
    import { useFormContext, Controller } from 'react-hook-form';
    import { RadioCard } from '../editors/RadioCard'; // Twój customowy komponent kart
    import { HandRaisedIcon, CpuChipIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
    
    export const EngineSection = () => {
      const { control } = useFormContext();
    
      return (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">4. Silnik i Zachowanie</h2>
    
          <div className="space-y-2">
            <label className="text-sm font-medium">Poziom Interaktywności</label>
            <Controller
              name="interactivity"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 gap-3">
                  <RadioCard
                    selected={field.value === 'none'}
                    onClick={() => field.onChange('none')}
                    title="Brak (Pełna automatyzacja)"
                    description="Agent wykonuje zadanie w tle, bez pytań."
                    icon={<CpuChipIcon className="w-5 h-5" />}
                  />
                  <RadioCard
                    selected={field.value === 'briefing'}
                    onClick={() => field.onChange('briefing')}
                    title="Briefing na starcie"
                    description="Zatwierdź plan działania przed wykonaniem."
                    icon={<HandRaisedIcon className="w-5 h-5" />}
                  />
                  <RadioCard
                    selected={field.value === 'consultation'}
                    onClick={() => field.onChange('consultation')}
                    title="Konsultacje"
                    description="Agent pyta, gdy napotka wątpliwości."
                    icon={<ChatBubbleLeftRightIcon className="w-5 h-5" />}
                  />
                </div>
              )}
            />
          </div>
        </section>
      );
    };
    
    ```
    
    **Plik:** `frontend/src/modules/agents/components/editors/GuardrailsList.tsx`
    
    ```tsx
    import { useFieldArray, useFormContext } from 'react-hook-form';
    import { Button } from '@/shared/components/ui/button';
    import { Input } from '@/shared/components/ui/input';
    import { TrashIcon, PlusIcon } from 'lucide-react';
    
    export const GuardrailsList = () => {
      const { control, register } = useFormContext();
      const { fields, append, remove } = useFieldArray({
        control,
        name: "guardrails"
      });
    
      return (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 animate-in fade-in">
              <span className="text-muted-foreground text-sm">-</span>
              <Input
                {...register(`guardrails.${index}`)}
                placeholder="Np. Nie usuwaj zadań z sekcji 'Now'"
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                <TrashIcon className="w-4 h-4 text-muted-foreground hover:text-red-500" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append("")}
            className="text-indigo-600 border-indigo-100 hover:bg-indigo-50"
          >
            <PlusIcon className="w-4 h-4 mr-2" /> Dodaj Zasadę
          </Button>
        </div>
      );
    };
    
    ```
    
    ---
    
    ### Faza 4: Prawa Kolumna (Live Cost Estimator)
    
    **Plik:** `frontend/src/modules/agents/components/AgentCostEstimator.tsx`
    
    ```tsx
    import { useFormContext } from 'react-hook-form';
    import { useTokenCount } from '@/shared/hooks/useTokenCount'; // Twój hook
    
    export const AgentCostEstimator = () => {
      const { watch } = useFormContext();
    
      // Obserwuj zmiany w formularzu na żywo
      const role = watch('role') || '';
      const backstory = watch('backstory') || '';
      const guardrails = watch('guardrails') || [];
      const knowledge = watch('knowledge_config') || []; // Lista plików
    
      // Zliczanie tokenów (Symulacja)
      // W realnym świecie, dla plików użyłbyś metadanych z bazy, tutaj uproszczenie
      const textTokens = useTokenCount(role + backstory + guardrails.join(' '));
      const fileTokens = knowledge.length * 1500; // Heurystyka: średnio 1.5k tokenów na plik MD
    
      const totalTokens = textTokens + fileTokens;
      const maxContext = 128000;
      const percentage = Math.min((totalTokens / maxContext) * 100, 100);
    
      return (
        <div className="space-y-6 sticky top-6">
          {/* ... Nagłówek i Cena ... */}
    
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span>Zużycie Kontekstu</span>
              <span>{Math.round(percentage)}%</span>
            </div>
    
            {/* Pasek Postępu */}
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${percentage > 80 ? 'bg-red-500' : 'bg-indigo-500'}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
    
            <div className="text-xs text-muted-foreground space-y-1 mt-2">
              <p>📝 Tekst i zasady: <strong>{textTokens}</strong> tok</p>
              <p>📂 Baza wiedzy ({knowledge.length} plików): <strong>~{fileTokens}</strong> tok</p>
            </div>
          </div>
    
          {/* ... Sekcja Progressive Disclosure ... */}
        </div>
      );
    };
    
    ```
    
    Ten plan jest gotowy do wdrożenia. Krok po kroku budujesz zaawansowany interfejs, zaczynając od backendu (model danych), przez strukturę layoutu, aż po interaktywne komponenty React.