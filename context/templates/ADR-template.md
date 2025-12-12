# ADR-[NUMBER]: [Tytuł decyzji]

**Status:** [Proponowany | Zaakceptowany | Odrzucony | Wycofany]
**Data:** YYYY-MM-DD
**Autorzy:** [Twoje Imię]

## 1. Kontekst (Context)
Jaki problem próbujemy rozwiązać? Jakie mamy ograniczenia?
*   Przykład: Potrzebujemy przechowywać sesje użytkowników i historię czatu z AI.
*   Ograniczenie: Musimy zmieścić się w darmowym planie Vercel na start.

## 2. Rozważane Opcje (Options)
Jakie rozwiązania braliśmy pod uwagę?
1.  **Opcja A:** [Nazwa, np. PostgreSQL]
2.  **Opcja B:** [Nazwa, np. MongoDB]
3.  **Opcja C:** [Nazwa, np. Vercel KV / Redis]

## 3. Decyzja (Decision)
Wybieramy opcję: **[Nazwa wybranej opcji]**, ponieważ...
[Krótkie uzasadnienie, np. "Jest najtańsza i wystarczająco szybka"].

## 4. Konsekwencje (Consequences)
To najważniejsza sekcja. Trade-offy ("Co zyskujemy, a co tracimy").

**🟢 Pozytywne:**
*   [Zaleta 1]
*   [Zaleta 2]

**🔴 Negatywne / Ryzyka:**
*   [Wada 1]
*   [Wada 2 - np. "Będziemy musieli ręcznie migrować dane w przyszłości"]

## 5. Zgodność z AI (AI Compliance)
*   Czy ta decyzja jest zrozumiała dla naszych Agentów AI?
*   Czy wymaga aktualizacji pliku `ARCH.md`?
*   **Context Window / Token Usage:** Czy rozwiązanie generuje duże struktury danych? (Sprawdź wpływ na zużycie tokenów i limit kontekstu).
