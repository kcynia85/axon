# 🎨 Plan Implementacji: Axon Agent Studio (v3)

**Cel:** Ewolucja z zamkniętego modala w stronę pełnoekranowego, profesjonalnego edytora blueprintów ("Agent Studio"), opartego na odważnej typografii i estetyce Poster/Canvas.

---

## 🏗️ 1. Architektura Wizualna & DNA

Agent Studio musi być spójne z widokami *Agents Overview* oraz *Spaces Overview*, rezygnując z formularzowego charakteru na rzecz narzędzia inżynierskiego.

### Główne Założenia Wizualne:
- [x] **Typography-First:** Użycie `font-display` (Cal Sans / Inter Tight) w skali `text-5xl` do `text-7xl` dla nagłówków sekcji.
- [x] **Black Canvas:** Tło `bg-black` lub `zinc-950` z wysokim kontrastem i dużą ilością *negative space*.
- [x] **Poster Aesthetic:** Sekcje przedzielone grubymi liniami lub dużymi, numerowanymi indeksami (monospaced).
- [x] **Focus Mode:** Ukrycie globalnego sidebaru Axon na rzecz pełnej koncentracji na projektowaniu agenta.
- [x] **Split-Screen Archetypes:** Wejście do Studio oparte na podziale ekranu (50/50) pomiędzy "Pusty Blueprint" a "Bibliotekę Archetypów".

---

## 🧭 2. Struktura i Układ (Layout)

Agent Studio posiada dwa główne stany: **Discovery (Archetypes)** oraz **Design (Editor)**.

### A. Stan Discovery: Archetype Library (Split Full Screen)
Zanim przejdziemy do edytora, użytkownik dokonuje wyboru bazy (Step 1 & 2 z `axon_new_agent_logic.jpg`):
- [x] **Lewa Strona (Empty Base):** Duży, interaktywny przycisk "ZACZNIJ OD ZERA" (Pusty Agent).
- [x] **Prawa Strona (Archetype Library):** Przeglądarka biblioteki z wyszukiwarką, kategoriami (Research, Creative) i featured items (Product Guardian, Code Reviewer, UX Writer).
- [x] **Interakcja:** Wybór archetypu natychmiast pre-definiuje wszystkie pola w edytorze.

### B. Stan Design: Editor Layout (Step 3)
Zastosowanie trójkolumnowego układu `grid-cols-[280px_1fr_400px]`:

#### 1. Lewa Kolumna: Navigator (Sticky)
- [x] Pionowa lista sekcji projektowych (Identity, Cognition, Engine, Skills, Interface, Availability).
- [x] Wskaźniki postępu wypełnienia sekcji (np. `IDENTITY 3/5`).
- [x] Szybki skok (`scroll-into-view`) do konkretnych płatów edytora.
- [x] **Quick Swap:** Przycisk powrotu do biblioteki archetypów bez utraty obecnego draftu.

#### 2. Środkowa Kolumna: Blueprint Canvas (Form)
- [x] **Header:** Ogromny tytuł `NOWY AGENT` dynamicznie zmieniający się w `[IMIĘ AGENTA]` podczas pisania.
- [x] **Blueprint Sections:** Szerokie, otwarte płaty interfejsu zamiast zamkniętych kart.
- [x] **Typography Inputs:** Borderless inputs o dużym stopniu pisma, gdzie tekst jest głównym elementem designu.

#### 3. Prawa Kolumna: Live Poster (Sticky)
- [x] Wyświetlanie komponentu `WorkspaceCard` (variant agent) w skali 1:1.
- [x] Podgląd na żywo: jak agent będzie wyglądał w systemie (Avatar, Rola, Tagi, Background Glow).
- [x] Status bar informujący o koszcie modelu i przewidywanych capabilities.

---

## 🧩 3. Funkcjonalność i Kroki (Blueprinting)

Zgodnie z logiką `axon_new_agent_logic.jpg`, Studio obsługuje pełną konfigurację podzieloną na 6 kluczowych obszarów:

### Sekcja 1: Tożsamość (Identity)
- [x] **Avatar Gallery Slider:** Wielkoformatowy suwak z predefiniowanymi zdjęciami agentów w wysokiej jakości.
- [x] **Role & Backstory:** Pola tekstowe o dużej interlinii (leading-loose).
- [x] **Keywords:** System tagowania umiejętności miękkich i domenowych.

### Sekcja 2: Pamięć i Rozumowanie (Memory & Cognition)
- [x] **Knowledge Hubs (RAG):** Wyświetlane jako duże kafelki (identyczne jak w Spaces Overview). Wybór zakresu wiedzy.
- [x] **Guardrails & Instructions:** Specjalna strefa "Safe Zone" dla instrukcji (Zasady działania) i ograniczeń.
- [x] **Few-Shot Strategy:** Pole do wprowadzania przykładów formatowania odpowiedzi.
- [x] **Reflexion:** Opcja włączenia mechanizmu autokorekty.

### Sekcja 3: Silnik i Zachowanie (Engine)
- [x] **Model Selector:** Wybór LLM (np. Gemini 2.5 Pro) jako elegancki, minimalistyczny przełącznik.
- [x] **Temperature Slider:** Efekt "Volume Knob" – duża cyfra w tle zmieniająca się wraz z ruchem suwaka.
- [x] **Grounded Mode:** Toggle dla trybu rygorystycznego trzymania się źródeł.
- [x] **Auto-Start:** Konfiguracja zachowania przy uruchomieniu.

### Sekcja 4: Umiejętności (Skills)
- [x] **Native Skills:** Web Search, Code Interpreter, File Browser (ikony w stylu inżynierskim).
- [x] **Functions:** Lista dostępnych narzędzi (np. `lead_scoring`, `validate_nip_pl`) z opisami.

### Sekcja 5: Interfejs Danych (Data Interface)
- [x] **Context & Artefacts:** Konfiguracja parametrów wejściowych i wyjściowych (np. `brand_guidelines`, `competitors_list`).
- [x] **Autofill Logic:** Definiowanie pól wymaganych/opcjonalnych (pre-fill z archetypów).

### Sekcja 6: Dostępność (Accessibility)
- [x] **Global/Space Scope:** Wybór, w których przestrzeniach agent jest dostępny (Product Management, Discovery, etc.).

---

## 🚀 4. Harmonogram Implementacji

### Faza 1: Discovery & Archetypes (NOWE)
- [x] Implementacja widoku `SplitScreenDiscovery`.
- [x] Mockup bazy archetypów (JSON) zawierający predefiniowane dane dla 3-5 archetypów.
- [x] Animacja przejścia (Motion) z wyboru archetypu do pełnego edytora Studio.

### Faza 2: Infrastruktura (Routing & Layout)
- [x] Nowy Route: `workspaces/[id]/agents/studio/page.tsx`.
- [x] Implementacja `StudioLayout` (Focus Mode, Black Background).
- [x] Migracja logiki z `useNewAgentWizard` do `useAgentStudio`.

### Faza 3: Typografia i Komponenty Studio
- [x] Budowa zestawu `StudioComponents`: `BigHeading`, `BorderlessInput`, `NumericalIndex`.
- [x] Implementacja Reactive Live Poster (prawa kolumna).

### Faza 4: Sekcje i Interakcje
- [x] Refaktor formularzy do układu płatowego (Sections).
- [x] Implementacja galerii avatarów w wysokiej rozdzielczości.
- [x] Obsługa Keyboard Shortcuts (Cmd+S, Esc).

### Faza 5: Integracja i Persistence
- [x] Pełna synchronizacja z `useAgentDraft` (localStorage).
- [x] Przekierowanie ze starego przycisku "Add Agent" do nowego widoku Studio.

---

## ✅ Definicja Done (v3)
- [x] Użytkownik projektuje agenta w trybie pełnoekranowego.
- [x] Proces zaczyna się od wyboru archetypu w układzie Split Screen.
- [x] Interfejs opiera się na dużym kroju pisma (Display).
- [x] Każda zmiana jest natychmiast widoczna na "plakacie" agenta po prawej stronie.
- [x] Draft jest zachowany po odświeżeniu strony.
