# Vibe Coding Protocol (The Accelerators)

> **Status:** New Standard
> **Philosophy:** "Move Fast and Break Things... but Fix them Instantly with AI."
> **Cel:** Utrzymanie stanu "Flow" (Vibe) podczas pracy z LLM.

---

## 1. Cykl Vibe Coding: The Loop

Nie pisz specyfikacji na 100 stron. Iteruj małymi skokami.

### 🔄 Faza 1: The "Napkin" Sketch (10 min)
*   **Action:** Opisz luźno, co chcesz zrobić. Nie przejmuj się detalami.
*   **Prompt:** *"Chcę prosty dashboard w Next.js pokazujący sprzedaż. Ma mieć wykres liniowy i tabelę. Użyj Shadcn UI."*
*   **Cel:** Pierwszy, brudny prototyp. Zobacz, czy to w ogóle ma sens.

### 🔄 Faza 2: Interface-First (20 min)
*   **Action:** Zanim poprosisz o logikę, poproś o **Type Definitions** (TS) lub **Pydantic Models**.
*   **Prompt:** *"Zdefiniujmy interfejsy TypeScript dla tego dashboardu. Jakie dane przyjmuje wykres? Jak wygląda obiekt transakcji?"*
*   **Zasada:** Jeśli typy się zgadzają, AI rzadziej halucynuje implementację.

### 🔄 Faza 3: The "Fill-in" (30 min)
*   **Action:** Każ agentowi implementować funkcje jedna po drugiej.
*   **Prompt:** *"Teraz zaimplementuj komponent `SalesChart.tsx` używając zdefiniowanych wcześniej typów. Użyj biblioteki Recharts."*

### 🔄 Faza 4: Refactor & Hardening (10 min)
*   **Action:** Włącz "Twarde Standardy" (DDD/Architecture Standards).
*   **Prompt:** *"Przeanalizuj ten kod. Czy logikę biznesową wyciągnęliśmy do osobnego hooka/pliku? Czy nazewnictwo jest spójne z domeną?"*

---

## 2. Context Engineering (Zarządzanie Pamięcią Agenta)

Model "głupieje", gdy rozmowa jest za długa. Musisz zarządzać jego oknem kontekstowym.

### 🧹 Technika: Context Reset
Gdy model zaczyna się gubić (zapomina ustaleń, generuje błędy):
1.  **Zrób Commit:** Zapisz to, co działa.
2.  **Nowy Chat:** Otwórz czystą sesję.
3.  **Context Injection:** Wklej tylko to, co niezbędne:
    *   `Project_Context.md` (zawsze).
    *   Ostatni działający plik kodu.
    *   Bieżące zadanie (SOP).

### 🥪 Technika: Sandwich Prompting (Walka z "Lost in the Middle")
Modele najlepiej zapamiętują początek i koniec promptu. Środek jest ignorowany.
*   **Góra (Context):** *"Jesteś architektem w projekcie X. Oto pliki..."*
*   **Środek (Data):** Wklejony kod, logi błędów, JSON-y.
*   **Dół (Instruction):** *"BARDZO WAŻNE: Nie usuwaj Idempotency Key. Pamiętaj o obsłudze błędów."*
**Zasada:** Kluczowe instrukcje bezpieczeństwa (Invariants) powtórz na samym dole.

### 🗿 Technika: Tribal Knowledge Check
Zanim podejmiesz decyzję, sprawdź czy nie łamiesz ustaleń.
*   **Prompt:** *"Przeszukaj pliki ADR w folderze `docs/architecture`. Czy mamy ustaloną politykę retry dla zewnętrznych API? Jeśli tak, zastosuj ją."*

### 📍 Technika: @ Reference
Nie wklejaj całych plików. Wskazuj je.
*   ŹLE: (Wklejenie treści `User.ts`) "Zmień to..."
*   DOBRZE: *"W pliku @User.ts dodaj pole `lastLogin`."* (W nowoczesnych IDE jak Cursor/Windsurf).

---

## 3. The "Diff" Check

AI często psuje stary kod, dodając nowy.
*   **Zasada:** Zawsze patrz na `git diff` przed akceptacją.
*   **Ostrzeżenie:** Jeśli AI usuwa duży blok kodu, którego nie kazałeś usuwać - odrzuć zmianę.

---

## 4. Chain of Thought (Wymuszanie Myślenia)

Gdy zadanie jest trudne, nie pozwalaj AI pisać kodu od razu.
*   **Prompt:** *"Nie pisz jeszcze kodu. Najpierw napisz plan krok po kroku, jak zamierzasz to rozwiązać. Wypunktuj potencjalne problemy (Edge Cases)."*
*   **Efekt:** Model "myśli" (generuje tokeny reasoning), co drastycznie zwiększa jakość późniejszego kodu.