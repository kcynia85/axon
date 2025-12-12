<!--
🤖 AI AGENT INSTRUCTION: LOGIC ARCHITECT
Rola: System Designer.
Cel: Zaprojektuj przepływy użytkownika, które są logiczne, odporne na błędy i realizują cele biznesowe.
-->

# User Flows & Logic

## 🧠 Atlas Psychologii (Baza Taktyczna)
> *Wzorce poznawcze do projektowania przepływów:*
> *   [🎨 Mapa psychologii w UX UI (CSV)](../../../Psychology/Psychology/Mapa%20psychologii%20w%20UX%20UI%20229feb1f1ec149d3ac2681a7a6bd5fd1.csv) – *Prawa: Hicka, Millera, Gestalt, Obciążenie poznawcze.*

---

## 1. Core Flows (Kluczowe Ścieżki)## 💡 Metodologia i Narzędzia
> *Materiały pomocnicze z biblioteki wiedzy:*
> *   [🧠 Psychologia poznawcza (Cognitive Load)](../../Psychology/Psychologia%20poznawcza/Przeci%C4%85%C5%BCenie%2013a585629e49805eae48f2b71b496870.md)
> *   [🗺️ Modele Mentalne](../../Psychology/Psychologia%20w%20Projektowaniu%20UX%20UI/Pami%C4%99%C4%87%20i%20Modele%20Mentalne/Modele%20Mentalne%20vs%20Koncepcyjne%201ac585629e49804388dfd968865f0cf5.md)
> *   [⚡ System 1 i System 2](../../Psychology/Psychologia%20poznawcza/System%201%20i%20System%202%20b4d6935cf98d471aa2ce0dfc979436fd.md)

---

## 1. Kluczowe Zasady Projektowania Przepływów
1.  **Prawo Hicka:** Minimalizuj liczbę wyborów na każdym kroku.
2.  **Chunking:** Dziel długie procesy na małe, strawne kawałki (np. Wizard).
3.  **Progresywne Ujawnianie:** Pokazuj tylko to, co potrzebne w danym momencie.
4.  **Stan Domyślny (Default Bias):** Sugeruj najlepszą opcję, nie zmuszaj do wyboru od zera.

---

## 2. Mapa Przepływów (Flow Map)

### Flow A: Happy Path (Ścieżka Intuicyjna - System 1)
*Użytkownik działa szybko, bez zastanowienia.*
1.  **Wejście:** [Np. Landing Page] -> Jasne Value Prop.
2.  **Akcja:** [Kliknięcie CTA] -> Bezpośrednie przejście, brak logowania (jeśli możliwe).
3.  **Proces:** [Konfiguracja] -> Użycie inteligentnych domyślnych ustawień.
4.  **Finał:** [Sukces] -> Natychmiastowa nagroda (Feedback).

### Flow B: Stress Path (Ścieżka Błędu/Analizy - System 2)
*Użytkownik napotyka problem lub musi podjąć trudną decyzję.*
1.  **Wyzwalacz:** Błąd walidacji / Skomplikowany wybór.
2.  **Wsparcie:**
    *   Jasny komunikat błędu (bez obwiniania - *Maksyma Grzeczności*).
    *   Kontekstowa pomoc (Tooltip).
    *   Możliwość cofnięcia ("Undo" - *Bezpieczeństwo psychologiczne*).
3.  **Powrót:** Łatwy powrót na ścieżkę Happy Path.

---

## 3. Audyt Logiki (Checklista Kognitywna)
*   [ ] **Czy zmuszamy do pamiętania?** (Unikaj! System powinien pamiętać za usera).
*   [ ] **Czy przerywamy "Flow"?** (Np. pop-upem o newsletter w trakcie checkoutu).
*   [ ] **Czy feedback jest natychmiastowy?** (Reguła <400ms - Próg Doherty'ego).
*   [ ] **Czy używamy wzorców znanych z innych apek?** (Prawo Jakoba).
*   [ ] **Czy koniec jest satysfakcjonujący?** (Efekt Zeigarnik - domknięcie pętli).