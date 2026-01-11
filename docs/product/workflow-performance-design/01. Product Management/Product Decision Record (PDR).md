---
template_type: crew
target_workspace: Product Management
---

<!-- 
🤖 AI AGENT INSTRUCTION: DECISION LOGGING
Rola: Product Historian & Guardian.
Cel: Zapobiegaj powtarzaniu błędów i "amnezji projektowej".

🧠 ZASADA UŻYCIA:
1. Kiedy Ty lub Użytkownik podejmujecie TRUDNĄ decyzję (np. "Porzucamy feature X", "Zmiana bazy danych"), musisz to tu zapisać.
2. Format: Kontekst -> Opcje -> Decyzja -> Uzasadnienie.
3. Przed rozpoczęciem dużej zmiany w kodzie, sprawdź ten plik, czy nie łamiesz wcześniejszych ustaleń.
-->

# Product Decision Record (PDR)
*Rejestr kluczowych decyzji biznesowych i strategicznych (nie technicznych - dla technicznych patrz: ADR).*

## 💡 Metodologia i Narzędzia
> *Materiały pomocnicze z biblioteki wiedzy:*
> *   [🧠 Modele Mentalne](../Zasoby/Psychology%20&%20Behavioral%20Science/Mental%20Models/Modele%20mentalne.md)
> *   [🎣 Hooked Model (Nawyki)](../Zasoby/Mindset%20&%20Philosophy/Hooked%20Model.md)
> *   [⚖️ Uczciwość i Zaufanie w Biznesie](../Zasoby/Psychology%20&%20Behavioral%20Science/Behawioralna/Uczciwość%20i%20zaufanie%20w%20biznesie.md)

---

## 🎓 Strefa Nauki: Przykład Dobrego Wpisu

### [PDR-000] Przykład: Rezygnacja z aplikacji mobilnej na rzecz PWA
*   **Kontekst:** Mamy ograniczony budżet (50k PLN) i czas (3 m-ce). Klienci pytają o "apkę".
*   **Opcje:**
    1.  **Flutter App:** Czas: 4 m-ce. Koszt: Wysoki. Zaleta: Powiadomienia Push, App Store.
    2.  **PWA (Web):** Czas: 2 tyg (w ramach web dev). Koszt: Zerowy. Wada: Brak w App Store.
*   **Decyzja:** Wybieramy **PWA**.
*   **Uzasadnienie:** Na etapie MVP kluczowe jest sprawdzenie Product-Market Fit, a nie obecność w sklepie Apple. Push notifications działają już na iOS Safari w PWA. Zaoszczędzony budżet idzie w marketing.
*   **Konsekwencje:** Akceptujemy ryzyko "niższego prestiżu", ale zyskujemy szybkość.

---

## 📝 Szablon Wpisu
### [PDR-00X] Tytuł Decyzji (Data: RRRR-MM-DD)
*   **Kontekst:** Jaki problem musieliśmy rozwiązać?
*   **Rozważane opcje:**
    1.  Opcja A (Zalety/Wady)
    2.  Opcja B (Zalety/Wady)
*   **Decyzja:** Wybraliśmy Opcję...
*   **Uzasadnienie:** Dlaczego? (Dane, Budżet, Czas, Intuicja)
*   **Konsekwencje:** Co tracimy? Co zyskujemy?

---

## Rejestr Decyzji

### [PDR-001] Inicjalizacja Projektu (Data: 2025-12-06)
*   **Kontekst:** Startujemy z nowym projektem opartym na AI Workflow.
*   **Decyzja:** Przyjęcie struktury "AI-Native Product OS".
*   **Uzasadnienie:** Maksymalizacja efektywności jednoosobowego zespołu poprzez ścisłą integrację z LLM.
