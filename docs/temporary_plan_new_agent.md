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

---

## 🧭 2. Struktura i Układ (Layout)

Zastosowanie trójkolumnowego układu `grid-cols-[280px_1fr_400px]`:

### A. Lewa Kolumna: Navigator (Sticky)
- [x] Pionowa lista sekcji projektowych (Identity, Cognition, Engine, Skills, Interface, Availability).
- [ ] Wskaźniki postępu wypełnienia sekcji (np. `IDENTITY 3/5`).
- [x] Szybki skok (`scroll-into-view`) do konkretnych płatów edytora.

### B. Środkowa Kolumna: Blueprint Canvas (Form)
- [x] **Header:** Ogromny tytuł `NOWY AGENT` dynamicznie zmieniający się w `[IMIĘ AGENTA]` podczas pisania.
- [x] **Blueprint Sections:** Szerokie, otwarte płaty interfejsu zamiast zamkniętych kart.
- [x] **Typography Inputs:** Borderless inputs o dużym stopniu pisma, gdzie tekst jest głównym elementem designu.

### C. Prawa Kolumna: Live Poster (Sticky)
- [x] Wyświetlanie komponentu `WorkspaceCard` (variant agent) w skali 1:1.
- [x] Podgląd na żywo: jak agent będzie wyglądał w systemie (Avatar, Rola, Tagi, Background Glow).
- [x] Status bar informujący o koszcie modelu i przewidywanych capabilities.

---

## 🧩 3. Funkcjonalność i Kroki (Blueprinting)

### Sekcja 1: Tożsamość (Identity)
- [ ] **Avatar Gallery Slider:** Wielkoformatowy suwak z predefiniowanymi zdjęciami agentów w wysokiej jakości.
- [x] **Role & Backstory:** Pola tekstowe o dużej interlinii (leading-loose).

### Sekcja 2: Pamięć i Rozumowanie (Memory)
- [ ] **Knowledge Hubs:** Wyświetlane jako duże kafelki (identyczne jak w Spaces Overview).
- [x] **Guardrails Editor:** Specjalna strefa "Safe Zone" dla instrukcji i ograniczeń.

### Sekcja 3: Silnik (Engine)
- [ ] **Temperature Slider:** Osiągnięcie efektu "Volume Knob" – duża cyfra w tle zmieniająca się wraz z ruchem suwaka.
- [ ] **Model Selector:** Wybór LLM jako elegancki, minimalistyczny przełącznik.

### Sekcja 4: Interfejs Danych (Data Interface)
- [ ] Konfiguracja Context i Artefacts jako parametrów technicznych w układzie tabelarycznym o wysokim kontraście.

---

## 🚀 4. Harmonogram Implementacji

### Faza 1: Infrastruktura (Routing & Layout)
- [x] Nowy Route: `workspaces/[id]/agents/studio/page.tsx`.
- [x] Implementacja `StudioLayout` (Focus Mode, Black Background).
- [x] Migracja logiki z `useNewAgentWizard` do `useAgentStudio`.

### Faza 2: Typografia i Komponenty Studio
- [x] Budowa zestawu `StudioComponents`: `BigHeading`, `BorderlessInput`, `NumericalIndex`.
- [x] Implementacja Reactive Live Poster (prawa kolumna).

### Faza 3: Sekcje i Interakcje
- [x] Refaktor formularzy do układu płatowego (Sections).
- [ ] Implementacja galerii avatarów w wysokiej rozdzielczości.
- [ ] Obsługa Keyboard Shortcuts (Cmd+S, Esc).

### Faza 4: Integracja i Persistence
- [x] Pełna synchronizacja z `useAgentDraft` (localStorage).
- [x] Przekierowanie ze starego przycisku "Add Agent" do nowego widoku Studio.

---

## ✅ Definicja Done (v3)
- Użytkownik projektuje agenta w trybie pełnoekranowym.
- Interfejs opiera się na dużym kroju pisma (Display).
- Każda zmiana jest natychmiast widoczna na "plakacie" agenta po prawej stronie.
- Draft jest zachowany po odświeżeniu strony.
