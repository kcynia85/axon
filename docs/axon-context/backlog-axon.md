# 📋 Axon System Backlog

Dokument zawiera listę planowanych funkcjonalności (Features) dla systemu Axon, podzielonych na obszary domenowe (Huby) oraz infrastrukturę.

## 🚀 Core & Infrastructure (Kernel)

- [ ] **Circuit Breaker / Fallback Adapter**
    - **Opis:** Implementacja wzorca Circuit Breaker dla zwiększenia odporności systemu. Jeśli główne API (Gemini) zgłosi błąd krytyczny (503/Quota), system automatycznie przełącza się na zapasowy adapter (np. OpenAI/Claude).
    - **Status:** Przesunięte z MVP do Backlogu (YAGNI).

- [ ] **Multi-user Workspace & Roles (Zarządzanie Zespołem)**
    - **Opis:** Wprowadzenie modelu organizacji/workspace'u. Możliwość zapraszania innych użytkowników (do 3 osób).
    - **Role:**
        - `Owner`: Pełen dostęp, zarządzanie subskrypcją i ustawieniami agentów.
        - `Collaborator`: Tworzenie projektów, interakcja z agentami, edycja dokumentów.
        - `Viewer/Client`: Dostęp tylko do odczytu wybranych projektów (np. dla klienta agencji).

- [ ] **Shared Agent Context & Mentioning**
    - **Opis:** Mechanizm współdzielenia kontekstu między agentami w ramach jednej sesji lub projektu. Możliwość "wołania" innego agenta (np. `@Designer`) w trakcie rozmowy z Managerem, aby przekazać mu wycinek kontekstu do realizacji specyficznego zadania.

- [ ] **Associative Memory System (User/Project Facts)**
    - **Opis:** Implementacja "aktywnej pamięci" (Warstwa Epizodyczna/Asocjacyjna), wykraczającej poza standardową historię czatu i RAG.
    - **Mechanizm:**
        - Tabela `memories` w Supabase (przechowywanie faktów, decyzji projektowych, preferencji użytkownika).
        - Narzędzie `save_memory` dla agentów do aktywnego zapisywania kluczowych ustaleń (np. "Klient wymaga dużych fontów").
        - Automatyczne wstrzykiwanie relewantnych faktów (Retrieval) do promptu systemowego w nowej sesji na podstawie kontekstu zadania.
    - **Cel:** Rozwiązanie problemu "amnezji kontekstowej" i personalizacja pracy agenta pod specyfikę projektu.

- [ ] **No-Code Agent Builder**
    - **Opis:** Kreator własnych agentów bez konieczności kodowania w Pythonie.
    - **Funkcjonalność:**
        - Wizualny edytor System Instructions.
        - Wybór modelu (Tier 1/2/3) i temperatury.
        - Przypisywanie gotowych narzędzi (np. "Web Search", "Jira Integration") metodą Drag & Drop.
        - Testowanie agenta w trybie piaskownicy (Sandbox) przed publikacją dla zespołu.

## 🧠 Product Management & Operations

- [ ] **SOP & Workflow Builder**
    - **Rola:** Boss Architect
    - **Opis:** Dedykowany interfejs (lub zaawansowany chat workflow) dla Boss Architecta.
    - **Funkcjonalność:** Użytkownik (jako Solopreneur) podaje cel: *"Chcę wprowadzić nowy proces onboardingu klienta"*. Boss Architect nie tylko opisuje proces, ale generuje interaktywny SOP w systemie. Definiuje kroki, przypisuje do nich odpowiednich Workerów (np. Krok 1: UX Writer pisze maila powitalnego; Krok 2: Senior Dev generuje klucze API) i tworzy szablony zadań.
    - **Wartość:** Zamiana wiedzy proceduralnej w wykonywalny kod systemu. Automatyzacja delegowania.

## 🎨 Design Hub

- [ ] **Vision-Enabled Design Audits (Audyty Wizualne)**
    - **Rola:** UX Auditor
    - **Opis:** Wykorzystanie multimodalnych możliwości modelu Gemini Pro Vision. Agent "UX Auditor" nie tylko analizuje tekstowe briefy, ale potrafi "spojrzeć" na zrzut ekranu interfejsu lub wyeksportowaną klatkę z Figmy, aby wykryć błędy w dostępności, kontraście czy spójności wizualnej.

- [ ] **Heuristic Evaluation Checklist Generator**
    - **Rola:** UX Auditor
    - **Opis:** Automatyczne generowanie list kontrolnych do oceny heurystycznej na podstawie specyfiki projektu (np. e-commerce, SaaS, mobile app) i wiedzy z bazy wektorowej (Nielsen, Baymard).

## 💻 Delivery Hub (Engineering)

- [ ] **Architecture Decision Record (ADR) System**
    - **Rola:** AI System Architect
    - **Opis:** Agent wspierający tworzenie i utrzymanie dokumentacji architektonicznej. Pomaga sformalizować decyzje techniczne, analizuje konsekwencje wyborów i dba o spójność z istniejącym stosem technologicznym.

- [ ] **Interactive Code Refactoring Sessions**
    - **Rola:** Senior Developer
    - **Opis:** Sesje pair-programmingu z AI, gdzie agent analizuje wklejony kod (lub pobrany z repozytorium), sugeruje optymalizacje, wykrywa "code smells" i proponuje refaktoryzację zgodnie z ustalonymi wzorcami (np. SOLID, DRY).

- [ ] **LLM-as-a-Judge Security & Quality Gate**
    - **Rola:** QA Engineer / AI Auditor
    - **Opis:** System automatycznej oceny jakości generowanych artefaktów (kodu, treści) przed ich prezentacją użytkownikowi. Weryfikacja pod kątem bezpieczeństwa, zgodności z wymaganiami i braku halucynacji.

## 📈 Growth & Market Hub

- [ ] **Mass AI Product Tagging & Categorization (E-commerce Automation)**
    - **Rola:** Data Steward / E-commerce Specialist
    - **Model:** **Gemini 2.0 Flash** lub **Flash-Lite** (High Throughput / Low Cost).
    - **Opis:** Masowe przetwarzanie katalogu produktów. Agent analizuje zdjęcia (Vision) oraz opisy techniczne, aby automatycznie przypisać:
        - Tagi SEO i słowa kluczowe.
        - Atrybuty filtrowania (np. Kolor, Materiał, Styl).
        - Kategorie drzewa produktów.
    - **Wartość:** Drastyczne przyspieszenie wdrażania asortymentu (Time-to-market) i poprawa SEO on-site.

## ✍️ Writing Hub

- [ ] **Brand Voice & Tone Guard**
    - **Rola:** UX Writer / Copywriter
    - **Opis:** Strażnik spójności komunikacji. Analizuje generowane treści pod kątem zgodności z zadeklarowanym stylem marki (Brand Persona), tonem (Tone of Voice) i słownictwem branżowym.

## 🎮 Gamification Hub (Post-MVP)

- [ ] **Comprehensive Gamification System**
    - **Status:** Moved from MVP to Backlog.
    - **Opis:** Pełny system motywacyjny zaimplementowany w UI.
    - **Funkcjonalności:**
        - **Streaks:** Licznik dni nieprzerwanej pracy z systemem.
        - **Avatar:** Personalizacja wirtualnego przedstawiciela użytkownika.
        - **Skill Map:** Wizualizacja rozwoju kompetencji (drzewo umiejętności) w podziale na domeny (Design, Dev, Marketing).
        - **Leveling:** Poziomy doświadczenia zdobywane za wykonywanie zadań.
        - **Daily Quests:** Codzienne wyzwania (np. "Zleć 3 zadania agentom").

## 🔮 Future Expansion (Post-MVP Roles)

- [ ] **Post-MVP Agent Roles Implementation (Backlog):**
    - [ ] UX Researcher / Strateg
    - [ ] UI Designer
    - [ ] UX Auditor
    - [ ] Marketing Strategist
    - [ ] Email Marketing Specialist
    - [ ] Data Analyst / CRO Specialist
    - [ ] Copywriter (Sales & Storyteller)
    - [ ] Content Marketer
    - [ ] UX Writer
    - [ ] Product Discovery Lead
    - [ ] Senior Developer
    - [ ] QA Engineer / AI Auditor
    - [ ] AI Engineer