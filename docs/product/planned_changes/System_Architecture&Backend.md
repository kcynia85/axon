- [ ]  Instancje (Immutability) Patterns, Crews, Agents, Templates, Services, Automations w Space
- [ ]  Voice Assistent + Memory
- [ ]  Najlepsze praktyki architektury informacji z notatek w Notion
    
    [Wzorce projektowe UX](https://www.notion.so/Wzorce-projektowe-UX-ee9d059fcb1343ac849e790a864cc496?pvs=21) 
    
    [Architektura informacji](https://www.notion.so/Architektura-informacji-1b823d8ee60f44f48d81646126d7d64c?pvs=21) 
    
- [ ]  **Centralny Indeks Systemowy (Unified System Index)**
    - Plan Implementacji
        
        Oto szczegółowy **Plan Implementacji Centralnego Indeksu Systemowego (Unified System Index)** dla Axon.
        
        Plan został opracowany zgodnie z architekturą **Modular Monolith** (Python/FastAPI) oraz frontendem **Next.js 16**.
        
        ---
        
        # 🧠 AXON ARCHITECTURE PLAN: UNIFIED SYSTEM INDEX
        
        **Cel:** Stworzenie mechanizmu "Samoświadomości Systemu" (System Self-Awareness). Każdy kluczowy obiekt (Agent, Automatyzacja, Narzędzie, Crew) jest automatycznie wektoryzowany, co pozwala Agentom AI na ich wyszukiwanie i używanie w przyszłych modułach (Space).
        
        ---
        
        ## Faza 1: Warstwa Danych i Infrastruktury (Python)
        
        Musimy stworzyć jedną tabelę, która działa jak "skorowidz" dla całego systemu. Nie chcemy robić `JOIN`ów przez 5 tabel podczas wyszukiwania semantycznego.
        
        ### 1.1. Model Bazy Danych (`system_index`)
        
        Dodajemy tabelę w module `Infrastructure` (lub `Shared/Kernel`, jeśli taki posiadasz).
        
        ```python
        # app/infrastructure/db/models/system_index.py
        from sqlalchemy import Column, String, JSON, DateTime, func, Text
        from sqlalchemy.dialects.postgresql import UUID, JSONB
        from pgvector.sqlalchemy import Vector
        from app.infrastructure.db.base import Base
        
        class SystemEmbedding(Base):
            __tablename__ = "system_embeddings"
        
            # Composite Primary Key (zabezpiecza przed duplikatami)
            entity_id = Column(UUID(as_uuid=True), primary_key=True)
            entity_type = Column(String(50), primary_key=True)  # 'automation', 'agent', 'tool', 'crew'
        
            # Dane semantyczne
            search_content = Column(Text, nullable=False)       # Tekst, z którego powstał wektor
            embedding = Column(Vector(1536))                    # text-embedding-3-small
        
            # Dane prezentacyjne (szybki odczyt bez JOIN)
            # Przechowuje: name, description, icon, url, tags
            display_meta = Column(JSONB, default={})
        
            # Meta techniczne
            last_indexed_at = Column(DateTime, default=func.now(), onupdate=func.now())
            checksum = Column(String)                           # Hash contentu (by nie indeksować, gdy nic się nie zmieniło)
        
        ```
        
        ### 1.2. Migracja Alembic
        
        Należy wygenerować migrację dodającą rozszerzenie `vector` (jeśli jeszcze nie ma) i nową tabelę.
        
        ```bash
        alembic revision --autogenerate -m "Add system_embeddings table"
        
        ```
        
        ---
        
        ## Faza 2: Warstwa Domeny (Kontrakty)
        
        Definiujemy interfejs, który musi spełniać każdy moduł, aby być "widocznym" dla systemu.
        
        ### 2.1. Protokół `SearchableEntity`
        
        ```python
        # app/domain/interfaces/searchable.py
        from typing import Protocol, Dict, Any
        from uuid import UUID
        
        class SearchableEntity(Protocol):
            @property
            def id(self) -> UUID: ...
        
            def get_entity_type(self) -> str:
                """Zwraca: 'automation', 'agent', etc."""
                ...
        
            def get_search_payload(self) -> str:
                """
                Zwraca pełny tekst semantyczny.
                Np. dla Automatyzacji: Nazwa + Opis + Lista Inputów + Tagi.
                """
                ...
        
            def get_display_meta(self) -> Dict[str, Any]:
                """
                Zwraca dane potrzebne frontendowi do wyświetlenia wyniku
                bez odpytywania tabeli źródłowej.
                Np. {'name': 'X', 'icon': '⚡', 'route': '/settings/automations/X'}
                """
                ...
        
        ```
        
        ### 2.2. Implementacja w Modelach (Przykład: Automation)
        
        ```python
        # app/modules/automations/domain/models.py
        
        class Automation(Base):
            # ... pola tabeli ...
        
            def get_entity_type(self) -> str:
                return "automation"
        
            def get_search_payload(self) -> str:
                # Budujemy bogaty kontekst dla AI
                inputs_desc = ", ".join([f"{p['key']} ({p['label']})" for p in self.params_config])
                return f"""
                Type: Automation (n8n Workflow)
                Name: {self.name}
                Description: {self.description}
                Inputs: {inputs_desc}
                Tags: {self.tags}
                """.strip()
        
            def get_display_meta(self) -> dict:
                return {
                    "name": self.name,
                    "description": self.description[:100], # Skrót
                    "icon": "⚡",
                    "url": f"/settings/automations/{self.id}"
                }
        
        ```
        
        ---
        
        ## Faza 3: Warstwa Aplikacji (Serwisy)
        
        Logika biznesowa tworzenia indeksu.
        
        ### 3.1. `SystemIndexingService`
        
        ```python
        # app/shared/services/indexing.py
        from langchain_openai import OpenAIEmbeddings
        from sqlalchemy.dialects.postgresql import insert
        
        class SystemIndexingService:
            def __init__(self, db, api_key):
                self.db = db
                self.embedder = OpenAIEmbeddings(model="text-embedding-3-small", api_key=api_key)
        
            async def index_entity(self, entity: SearchableEntity):
                content = entity.get_search_payload()
        
                # 1. Sprawdź checksum (opcjonalna optymalizacja)
                # new_checksum = hashlib.md5(content.encode()).hexdigest()
                # ... logic to skip if checksum matches ...
        
                # 2. Generuj wektor
                vector = await self.embedder.aembed_query(content)
        
                # 3. Upsert (Zapisz lub Zaktualizuj)
                stmt = insert(SystemEmbedding).values(
                    entity_id=entity.id,
                    entity_type=entity.get_entity_type(),
                    search_content=content,
                    embedding=vector,
                    display_meta=entity.get_display_meta()
                ).on_conflict_do_update(
                    index_elements=['entity_id', 'entity_type'],
                    set_={
                        "search_content": content,
                        "embedding": vector,
                        "display_meta": entity.get_display_meta(),
                        "last_indexed_at": func.now()
                    }
                )
        
                self.db.execute(stmt)
                self.db.commit()
        
        ```
        
        ### 3.2. Integracja z Endpointami (Background Tasks)
        
        W kontrolerze FastAPI używamy `BackgroundTasks`, aby nie blokować UI.
        
        ```python
        # app/api/routes/automations.py
        @router.post("/", response_model=AutomationRead)
        async def create_automation(
            data: AutomationCreate,
            background_tasks: BackgroundTasks, # <--- Kluczowe
            db: Session = Depends(get_db)
        ):
            # 1. Standardowy zapis
            new_auto = service.create(db, data)
        
            # 2. Zlecenie indeksowania w tle
            indexer = SystemIndexingService(db, settings.OPENAI_API_KEY)
            background_tasks.add_task(indexer.index_entity, new_auto)
        
            return new_auto
        
        ```
        
        ---
        
        ## Faza 4: API & Frontend (Next.js 16 Implementation)
        
        Tu łączymy Next.js (Server Actions) z Backendem Pythonowym.
        
        ### 4.1. Endpoint Wyszukiwania (FastAPI)
        
        ```python
        # app/api/routes/search.py
        @router.get("/vector")
        def search_system(q: str, limit: int = 5, db: Session = Depends(get_db)):
            indexer = SystemIndexingService(db, ...)
            query_vector = indexer.embedder.embed_query(q)
        
            # Cosine Similarity w pgvector (<=> operator dystansu)
            results = db.query(
                SystemEmbedding,
                SystemEmbedding.embedding.cosine_distance(query_vector).label("distance")
            ).order_by("distance").limit(limit).all()
        
            return [
                {
                    "id": r.SystemEmbedding.entity_id,
                    "type": r.SystemEmbedding.entity_type,
                    "meta": r.SystemEmbedding.display_meta,
                    "score": 1 - r.distance # Zamiana dystansu na podobieństwo (0-1)
                }
                for r in results
            ]
        
        ```
        
        ### 4.2. Next.js Server Action (Zapis)
        
        ```tsx
        // app/actions/create-automation.ts
        'use server'
        import { revalidatePath } from 'next/cache';
        
        export async function saveAutomation(formData: FormData) {
          // 1. Walidacja Zod...
        
          // 2. Call to Python Backend
          const res = await fetch(`${process.env.AXON_API}/automations`, {
            method: 'POST',
            body: JSON.stringify(payload),
            // ...
          });
        
          // 3. Revalidate
          revalidatePath('/settings/automations');
        
          return { success: true };
        }
        
        ```
        
        ### 4.3. UI: Wyszukiwarka Semantic Omnibar (RSC)
        
        Tworzymy komponent, który pobiera wyniki po stronie serwera Next.js (nie ujawnia klucza API ani logiki Pythona przeglądarce).
        
        ```tsx
        // app/components/omnibar/results.tsx
        import { Suspense } from 'react';
        
        // Async Component (RSC)
        async function SearchResults({ query }: { query: string }) {
          if (query.length < 3) return null;
        
          // Next.js Server -> Python Backend (szybka sieć wewnętrzna)
          const res = await fetch(`${process.env.AXON_API}/search/vector?q=${query}`, {
            cache: 'no-store'
          });
          const data = await res.json();
        
          return (
            <ul className="space-y-2">
              {data.map((item: any) => (
                <li key={item.id} className="flex justify-between p-3 bg-white/5 rounded">
                  <div className="flex gap-3">
                     <span>{item.meta.icon}</span>
                     <div>
                       <div className="font-bold">{item.meta.name}</div>
                       <div className="text-xs text-gray-400">{item.type}</div>
                     </div>
                  </div>
                  <span className="text-green-400 text-xs">
                    {Math.round(item.score * 100)}% match
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        
        ```
        
        ---
        
        ## Faza 5: Migracja Istniejących Danych (Seed)
        
        Skoro system już istnieje i ma jakieś dane, musimy je zaindeksować za pierwszym razem.
        
        **Skrypt `scripts/reindex_all.py`:**
        
        1. Pobiera wszystkie rekordy z tabel `automations`, `agents`, `tools`.
        2. Iteruje po nich.
        3. Dla każdego wywołuje `SystemIndexingService.index_entity()`.
        4. Uruchamiamy to w pipeline CI/CD lub ręcznie po wdrożeniu zmian.
        
        ---
        
        ## Podsumowanie Planu
        
        1. **Baza:** Tabela `system_embeddings` (Postgres + pgvector).
        2. **Interface:** Protokół `SearchableEntity` wymusza na modułach dostarczenie metadanych.
        3. **Proces:** Zapis obiektu -> Background Task -> OpenAI Embedding -> Upsert.
        4. **UI:** Next.js Server Components strumieniują wyniki wyszukiwania z Pythona.
        
        Czy akceptujesz ten plan techniczny? Jeśli tak, możesz go przekazać zespołowi developerskiemu (lub Agentowi Kodującemu).
        
    - *Samoświadomość systemu dla Agenta Architekta.*
    - **Plan:** Tabela `system_embeddings`. Protokół `SearchableEntity`. Każdy Agent, Flow, Tool i Automation jest automatycznie indeksowany w wektorach, aby AI mogło je znaleźć i użyć.
- [ ]  **Langfuse — Track&Audit dla Agents**
    - **Integracja:** `CallbackHandler` w LangChain.
    - **Funkcje:** Trace każdego kroku (Agent -> Tool -> n8n), zarządzanie promptami w chmurze Langfuse, analityka kosztów per User.
- [ ]  **[FEAT-INT-01] Internal Tools: Code-as-Configuration**
    - **Cel:** Definiowanie narzędzi w IDE (Python), nie w UI.
    - **Komponenty:** SDK (`@tool` decorator), CLI (`manage.py sync_tools`), API (`/sync`). UI w trybie Read-Only dla tych narzędzi.
- [ ]  **Mechanizm Global Auto-Save**
    - Plan Implementacji
        
        ## Implementacja
        
        To jest **doskonałe, strategiczne pytanie**. Myślisz o systemie jako o spójnej całości, a nie o zbiorze oddzielnych funkcji. To jest dokładnie właściwe podejście.
        
        Odpowiedź brzmi: **Tak, absolutnie powinieneś to zrobić.** Zaimplementowanie auto-save'u jako **uniwersalnego wzorca** w całej aplikacji jest znacznie lepsze niż robienie tego tylko dla jednego elementu.
        
        To, co proponujesz, zmienia auto-save z "funkcji" w **"fundamentalną zasadę działania"** Axon.
        
        Oto, jak to wpływa na koszt i dlaczego jest to tak dobra inwestycja.
        
        ---
        
        ### Analiza Kosztów: Wzorzec Reużywalny vs. Jednorazowa Implementacja
        
        Na pierwszy rzut oka, implementacja dla 5 elementów wydaje się 5x droższa. W rzeczywistości jest inaczej, jeśli podejdziemy do tego systemowo.
        
        Koszt implementacji nie rośnie liniowo. Dzieli się na dwa etapy:
        
        1. **Koszt Jednorazowy (Wysoki):** Stworzenie **reużywalnego mechanizmu** auto-save.
        2. **Koszt "Na Element" (Niski):** Zastosowanie tego mechanizmu do każdego kolejnego formularza.
        
        ### 1. Koszt Jednorazowy: Budowa "Silnika" Auto-Save
        
        To jest główna inwestycja. Tutaj budujesz fundamenty, które będą działać dla `Flow`, `Crew`, `Agent`, `Space` i `Project`.
        
        - **Backend:**
            - **Ujednolicenie Modeli:** Upewniasz się, że wszystkie odpowiednie tabele w bazie danych (`flow_templates`, `crew_templates`, `agent_templates`, `spaces`, `projects`) mają **spójną kolumnę `status`** (`draft`, `published`, `archived`).
            - **Generyczne Endpointy:** Projektujesz spójne API, np. `PUT /api/{resource_type}/{id}`, które potrafi obsługiwać aktualizacje dla różnych typów zasobów.
        - **Frontend:**
            - **Stworzenie Reużywalnego "Haka" (`useAutoSave`):** To jest serce rozwiązania. Tworzysz niestandardowy "hak" w React'cie, który hermetyzuje całą logikę:
                - Przyjmuje jako argumenty: stan formularza, URL do API, opóźnienie `debounce`.
                - Zarządza stanem `isDirty`.
                - Obsługuje logikę `debounce`.
                - Wysyła żądania `POST`/`PUT`.
                - Zwraca aktualny status zapisu (`zapisywanie`, `zapisano`, `błąd`).
            - **Stworzenie Reużywalnego Komponentu UI (`SaveStatusIndicator`):** Tworzysz jeden komponent, który wyświetla status zapisu i jest używany we wszystkich formularzach.
        
        **Szacowany Koszt Jednorazowy:** To jest główna część pracy. Może zająć **4-6 dni roboczych**, aby stworzyć i solidnie przetestować ten reużywalny mechanizm.
        
        ### 2. Koszt "Na Element": Zastosowanie "Silnika"
        
        Gdy masz już gotowy `useAutoSave` i `SaveStatusIndicator`, dodanie auto-save'u do każdego nowego formularza staje się **trywialne i bardzo szybkie**.
        
        Dla każdego formularza (`Flow`, `Crew`, `Agent` itd.) proces wygląda tak:
        
        1. Importujesz `useAutoSave` i `SaveStatusIndicator`.
        2. Wywołujesz `useAutoSave` w swoim komponencie, przekazując mu stan formularza i URL.
        3. Umieszczasz `<SaveStatusIndicator />` w nagłówku.
        
        **Szacowany Koszt "Na Element":** **0.5 - 1 dzień roboczy** na każdy formularz (wliczając testy). Dla 5 elementów, to dodatkowe **3-5 dni**.
        
        ---
        
        ### Podsumowanie Całkowitego Kosztu i Złożoności
        
        - **Całkowity Szacowany Czas:** **7-11 dni roboczych** dla pełnego wdrożenia auto-save w całej aplikacji.
        - **Złożoność:** **Średnia do Wysokiej** dla stworzenia mechanizmu reużywalnego, ale **bardzo niska** dla jego późniejszego stosowania.
        
        ### Czy to jest "Drogie"? (Analiza Wartości)
        
        Czy 7-11 dni pracy to dużo? **Absolutnie nie**, biorąc pod uwagę, że budujesz **fundamentalną, systemową funkcjonalność**, a nie jednorazowy "hack".
        
        **Korzyści z tego podejścia:**
        
        1. **Spójność UX:** Cała aplikacja działa w ten sam, przewidywalny i niezawodny sposób. Użytkownik, ucząc się obsługi jednego formularza, umie obsługiwać wszystkie.
        2. **Szybkość Developmentu w Przyszłości:** Każdy nowy edytowalny element, który dodasz do Axon w przyszłości, otrzyma funkcję auto-save **niemal za darmo**. To ogromna oszczędność w długim terminie.
        3. **Jakość i Niezawodność Kodu:** Masz jedną, centralną, dobrze przetestowaną logikę auto-save, zamiast pięciu oddzielnych, potencjalnie błędnych implementacji. To drastycznie redukuje liczbę bugów.
        
        **Werdykt:** To jest **bardzo mądra inwestycja architektoniczna**. Koszt początkowy jest wyższy niż dla pojedynczej implementacji, ale w zamian otrzymujesz spójną, niezawodną i skalowalną aplikację, której dalszy rozwój będzie znacznie szybszy i tańszy. To jest dokładnie tak, jak powinno się budować profesjonalne oprogramowanie.
        
        To jest **genialne, strategiczne pytanie**. Myślenie o tym teraz, na etapie projektowania, pozwoli Ci zbudować **fundamentalnie spójną i niezawodną aplikację**.
        
        Zasada jest prosta: auto-save powinien być używany **wszędzie tam, gdzie użytkownik wykonuje pracę kreatywną lub konfiguracyjną, której utrata byłaby frustrująca**.
        
        Oto szczegółowa lista miejsc w Axon, gdzie ten mechanizm powinien zostać zaimplementowany, podzielona na logiczne kategorie.
        
        ---
        
        ## Gdzie implementacja w `Workspaces` i `Settings`)
        
        To są najbardziej oczywiste i najważniejsze miejsca. Utrata pracy nad złożonym szablonem jest niezwykle bolesna.
        
        1. **`Agent New/Edit`:**
            - **Dlaczego:** Już to szczegółowo omówiliśmy. To złożony, wieloetapowy formularz. Auto-save jest tu absolutnie kluczowy.
        2. **`Crew New/Edit`:**
            - **Dlaczego:** Podobnie jak z Agentem. Definiowanie zadań, wybieranie Agentów – to praca, która musi być chroniona.
        3. **`Flow New/Edit`:**
            - **Dlaczego:** Zwłaszcza przy edycji `Patternów`. Użytkownik może spędzić dużo czasu na projektowaniu złożonej struktury w "Mini-Canvasie". Utrata tej struktury byłaby katastrofą.
        4. **`Automation New/Edit` (w `Workspaces`):**
            - **Dlaczego:** Konfiguracja automatyzacji, definiowanie `Inputs` i `Outputs` to praca, która powinna być zapisywana na bieżąco.
        5. **`Internal Tool New/Edit` (w `Settings`):**
            - **Dlaczego:** Pisanie precyzyjnych opisów dla LLM i definiowanie `scope'u` to praca, którą warto chronić.
        6. **`External Service New/Edit` (w `Settings`):**
            - **Dlaczego:** Podobnie jak wyżej, konfiguracja `Inputs`, `Outputs` i przypisywanie do `Workspaces` powinno być auto-zapisywane.
        7. **`LLM Model New/Edit` (w `Settings`):**
            - **Dlaczego:** To jest bardzo ważne! Użytkownik może spędzić dużo czasu, pisząc i dopracowując idealny `Systemowy Prompt` dla `Thinking Mode`. Przypadkowe zamknięcie karty byłoby tu niezwykle frustrujące.
        
        ---
        
        ### Kategoria 2: Praca Operacyjna (Poziom `Space Canvas`)
        
        To jest bardziej subtelne, ale równie ważne. Praca na `Space Canvas` to też praca kreatywna.
        
        1. **Edycja Właściwości Węzła w Inspektorze:**
            - **Dlaczego:** Gdy zaznaczysz węzeł i w prawym panelu edytujesz jego `OKR`, `Opis` lub `Inputs`, te zmiany również powinny być automatycznie zapisywane (z `debounce`). To jest w zasadzie "mini-formularz".
        2. **Zmiany w Strukturze Canvasu:**
            - **Dlaczego:** Przesuwanie węzłów, tworzenie i usuwanie połączeń, zmiana rozmiaru stref – to wszystko jest pracą.
            - **Jak:** System auto-save dla canvasu działałby nieco inaczej. Nie zapisywałby na serwer każdej pojedynczej zmiany piksela. Zamiast tego, używałby `debounce` lub `throttle`: po serii zmian (np. przesunięciu kilku węzłów), system czeka 2-3 sekundy i wysyła jedną, "zbiorczą" aktualizację z nowymi pozycjami i połączeniami do backendu.
        3. **Pisanie Komentarzy (`Comments`):**
            - **Dlaczego:** Jeśli użytkownik pisze długi, przemyślany komentarz, jego utrata jest bardzo denerwująca.
            - **Jak:** Treść komentarza w trakcie pisania powinna być zapisywana w tle (albo do `localStorage`, albo jako `draft` na serwerze).
        
        ---
        
        ### Kategoria 3: Zarządzanie "Meta" (Poziom `Projects` i `Spaces`)
        
        To są proste formularze, ale dla spójności UX, one również powinny mieć auto-save.
        
        1. **Edycja Nazwy / Opisu `Projectu`:**
            - **Dlaczego:** Dla spójności. Użytkownik nie powinien się zastanawiać, "które formularze mają auto-save, a które nie".
        2. **Edycja Nazwy / Opisu `Space Canvas`:**
            - **Dlaczego:** Ten sam powód – spójność i niezawodność.
        
        ### Podsumowanie
        
        Zaprojektowanie auto-save jako **uniwersalnego, reużywalnego mechanizmu** i zastosowanie go we **wszystkich** tych miejscach sprawi, że Twoja aplikacja będzie postrzegana jako:
        
        - **Niezawodna:** "Nigdy nie tracę swojej pracy w Axon."
        - **Nowoczesna:** Działa tak, jak najlepsze aplikacje na rynku (Figma, Notion, Google Docs).
        - **Przyjazna dla Użytkownika:** Eliminuje stres i frustrację, pozwalając skupić się na kreatywnej pracy.
    - **Strategia:** Uniwersalny hook `useAutoSave` + wizualny wskaźnik.
    - **Zakres:** New/Edit Agent, Crew, Flow, Project, Space Canvas (debounce dla pozycji węzłów).
- [ ]  **Safe Delete**
    - **Logika:** Kaskadowe usuwanie (soft delete) lub sprawdzanie zależności ("Nie można usunąć Agenta X, bo jest używany we Flow Y").