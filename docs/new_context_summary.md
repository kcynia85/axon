# 🧠 AXON PROJECT: MASTER SYSTEM DEFINITION

## 1. WIZJA I FILOZOFIA PRODUKTU

**Axon** to **"AI Command Center"** – platforma typu **Mapping-Process-First** służąca do wizualizacji, orkiestracji i wykonywania procesów biznesowych.

### Kluczowe Paradygmaty:

1. **Hybrydowy Orkiestrator (The Hybrid Engine):** Axon nie tylko "robi" rzeczy. On zarządza procesem, w którym pracę wykonują różne podmioty:
    - **AI (Agenci):** Generują treści i dane.
    - **Automatyzacje (n8n):** Wykonują zadania w tle.
    - **Ludzie (External Services):** Wykonują pracę w zewnętrznych narzędziach (np. Figma), a Axon tylko to mapuje.
    - **Procedury (Templates):** Dostarczają instrukcji.
2. **Mapping-Process-First:** Głównym bytem jest wizualna mapa procesu na płótnie (**Space**). To ona nadaje strukturę chaosowi.
3. **Mostek Kontekstowy:**
    - **Strategia (Notion):** Źródło prawdy dla celów, OKR-ów i dokumentacji.
    - **Orkiestracja (Axon):** Hub wykonawczy, który linkuje do strategii i agreguje wyniki (**Artefakty**).
4. **Human-in-the-Loop:** Człowiek jest ostatecznym decydentem. Każdy wynik (`Outcome`) – czy to wygenerowany przez AI, czy wklejony ręcznie link – musi zostać zatwierdzony, by stał się `Artefaktem`.
5. **System Self-Awareness:** System indeksuje swoje własne komponenty (wektoryzacja), aby Meta-Agent mógł pomagać w budowaniu procesów.

---

## 2. ARCHITEKTURA TECHNICZNA

- **Wzorzec:** Modular Monolith (Vertical Slices) + Clean Architecture.
- **Backend:** Python 3.11+, **FastAPI**, SQLAlchemy (Async).
- **Baza Danych:** PostgreSQL + **pgvector** (RAG & System Index).
- **Frontend:** **Next.js 16** (App Router), React, Tailwind CSS, Shadcn/UI, **React Flow** (Canvas).
- **AI Engine:** **LangChain** (narzędzia) + **crewAI** (logika agentów/zespołów).
- **Execution Engine:** **n8n** (zewnętrzny silnik workflowów wywoływany przez webhooki).
- **Observability:** **Langfuse** (tracing, koszty, zarządzanie promptami).

---

## 3. TRYBY PRACY WĘZŁÓW (EXECUTION MODES)

To definiuje, jak zachowują się klocki na Canvasie:

| Tryb | Komponent | Rola Axona | Rola Użytkownika | Input/Output |
| --- | --- | --- | --- | --- |
| **Generatywny** | **Agent / Crew** | Wykonawca (AI) | Recenzent | I: Dane z grafu<br>O: Wygenerowany Artefakt |
| **Delegowany** | **Automation** | Trigger (Webhook) | Obserwator | I: JSON Payload<br>O: JSON Response |
| **Mapowany** | **External Service** | Mapa / Wskaźnik | Wykonawca (w innym narzędziu) | I: Instrukcja<br>O: Wklejenie linku (dowód) |
| **Instruktażowy** | **Template** | Baza Wiedzy | Wykonawca (wg checklisty) | I: Brak<br>O: Odhaczenie wykonania |

---

## 4. MODEL DOMENOWY (HIERARCHIA I DANE)

### A. Core (Organizacja)

1. **PROJECT (Projekt):**
    - Kontener nadrzędny. Posiada: `name`, `status`, `notion_url`.
    - Posiada **jeden** dedykowany `Space`.
2. **SPACE (Canvas):**
    - Interaktywne płótno. Przechowuje graf (`nodes`, `edges`) i stan wizualny.
    - Może istnieć niezależnie od Projektu (jako brudnopis).
3. **WORKSPACE (Strefa):**
    - To **wizualna strefa (Zone)** na Canvasie, a nie osobny byt w bazie.
    - Reprezentuje domenę: `Product`, `Discovery`, `Design`, `Delivery`, `Growth`.

### B. Library (Zasoby w `Resources`)

1. **AGENT ARCHETYPE:** Szablon osobowości (Rola, Cel, Backstory, Guardrails).
2. **AUTOMATION:** Definicja webhooka do n8n (Driver + Schema).
3. **EXTERNAL SERVICE:** Definicja narzędzia zewnętrznego (np. Figma). Typy: `Utility` vs `GenAI`.
4. **INTERNAL TOOL:** Rejestr funkcji Pythonowych (Code-as-Config).
5. **KNOWLEDGE HUB:** Zbiór plików Markdown/PDF (RAG).

### C. Runtime (Elementy na Canvasie)

1. **CANVAS NODE:** Instancja szablonu. Posiada stan (`Idle`, `Working`, `Input_Needed`, `Done`) oraz `Outcomes`.
2. **ARTIFACT:** Wynik pracy węzła. Statusy: `Draft` -> `In Review` -> `Approved`.
3. **CHAT SESSION:** Kontekstowa rozmowa z Agentem (Tryb Konsultacji).

---

## 5. DESIGN SYSTEM I UX (WIDOKI)

### A. Global Navigation

- **Sidebar:** Home, Inbox, Spaces, Projects, Workspaces, Resources, Settings, Docs.

### B. Projects (Agregator)

- **Projects Overview:** Grid kart. Karta pokazuje: Nazwę, Tagi aktywnych Workspaces (pobrane ze Space), Status, Licznik Artefaktów.
- **Project Summary:** Read-only Dashboard.
    - **Key Resources:** Linki do Notion (SSoT), Figmy, etc.
    - **Workspaces:** Chipy (np. `[Discovery]`, `[Design]`) odzwierciedlające strefy na Canvasie.
    - **Recent Activity:** Log zdarzeń.
    - **Artifacts:** Interaktywna lista wyników z filtrowaniem.

### C. Space (Canvas - Warsztat)

- **Lewy Panel (Toolbox):** Minimalistyczny. Tylko `Zones` i `Core Components`.
- **Prawy Panel (Contextual):**
    - **Selection: Zone:** Wyświetla listę komponentów (Patterns, `Agents`, `Automations`, `Services`) dostępnych dla danej domeny (przypisanych w ich definicjach).
    - **Selection: Node:** Inspektor właściwości, statusu, logów i Outcomes.

### D. Resources (Biblioteka)

- **Layout:** Local Sidebar z kategoriami: `Wiedza` (Base, Archetypes) i `Narzędzia` (Automations, Services, Internal Tools).
- **Widoki:** List/Details View dla każdej kategorii.

### E. Builders (Edytory)

Wszystkie edytory (`New Agent`, `New Automation`) używają **Split Layout** (Lewa: Config, Prawa: Preview/Context).

1. **New/Edit Agent:**
    - **Start:** Modal Intencji (`Manager` vs `Worker` vs `Z Biblioteki`).
    - **Inteligentna Pre-konfiguracja:** Automatyczne ustawianie flag (Delegacja, Thinking Mode) w zależności od roli.
    - **Sekcje:** Tożsamość, Kontrakt I/O (Input/Output Schema), Ustawienia Zaawansowane (Guardrails, Knowledge Hub), Silnik (LLM), Narzędzia.
    - **Prawa kolumna:** Estymator Kosztów.
2. **New/Edit Automation:**
    - **Lewa:** Konfiguracja Drivera (URL, Auth) i Schematu Danych (Magic Wand do importu JSON).
    - **Prawa:** Symulator (Testowanie webhooka na żywo).
3. **New/Edit External Service:**
    - Definicja "Możliwości" (Capabilities) i oczekiwanych Artefaktów (np. "Wklej link").

---

## 6. KLUCZOWE MECHANIZMY SYSTEMOWE

1. **Outcomes & Approval:**
    - Każdy węzeł produkuje `Outcome`.
    - Dla AI: `Outcome` to wygenerowana treść.
    - Dla Manual: `Outcome` to wklejony link.
    - Wymagane kliknięcie `[✅ Zatwierdź]`, aby dane popłynęły dalej (Human-in-the-Loop).
2. **Schema-Driven I/O:**
    - Agenci i Automatyzacje mają zdefiniowane `Input Schema` i `Output Schema`.
    - Frontend używa "Smart Fill" (heurystyka), aby pomóc użytkownikowi zdefiniować te schematy na podstawie prostego opisu.
3. **Auto-Save:**
    - Globalny mechanizm zapisu wersji roboczych (`Draft`) dla wszystkich formularzy.
4. **Markdown Ingestion:**
    - Backend parsuje pliki `.md` z `Frontmatter` (z bazy wiedzy) i potrafi z nich wygenerować gotowe struktury `Flow` na Canvasie lub szablony `Crew`.
5. **Lazy Validation (Automations):**
    - Status automatyzacji (`Ready`, `Error`) jest aktualizowany tylko przy zapisie lub próbie wykonania (brak ciągłego pingowania).

To jest **kompletna specyfikacja systemu Axon**. Jest gotowa do przekazania Agentowi Kodującemu.