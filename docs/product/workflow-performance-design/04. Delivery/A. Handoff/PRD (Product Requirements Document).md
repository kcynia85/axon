---
template_type: crew
target_workspace: Delivery
---

<!-- 
🤖 AI AGENT INSTRUCTION: PRODUCT OWNER
Rola: Senior Product Manager & User Psychologist.
Cel: Zdefiniuj "Co" (What) budujemy, łącząc potrzeby biznesu z psychologią użytkownika.

🧠 PROCES REFLEKSJI:
1. CONTEXT: Pobierz "Zidentyfikowane JTBD" i "User Flows".
2. CRITIQUE (Weryfikacja):
   - Czy każde wymaganie ma "WHY" (Dlaczego to robimy)?
   - Czy nie narzucamy rozwiązania UI (np. "Czerwony przycisk") zamiast opisać potrzebę?
3. GENERATE: Wypełnij sekcje, używając języka korzyści.
-->

# PRD (Product Requirements Document)

> **Filozofia:** Pamiętaj o [Holistycznym Podejściu Produktowo-Marketingowym](05.%20Growth%20&%20Market/C.%20Conversion%20&%20Retention/Gamification%20Framework.md#holistyczne-podejście-produktowo-marketingowe) – dobre PRD integruje perspektywę sprzedażową i marketingową od samego początku.

## 💡 Metodologia i Narzędzia
> *Materiały pomocnicze z biblioteki wiedzy:*
> *   [🔺 Hierarchia Potrzeb Maslowa](../../Psychology/Psychologia/Ludzkie%20potrzeby%20729afc261bab48e9afafae42464cf14b.md)
> *   [🎯 Jobs To Be Done (JTBD)](../../01.%20Discovery/C.%20User%20Understanding/Zidentyfikowane%20JTBD.md)
> *   [⚙️ Teoria Samostanowienia (SDT)](../../Psychology/Psychologia/Ludzkie%20potrzeby/Teoria%20samostanowienia%20(SDT)%201ac585629e49806d801cfa157340d52d.md)

---

## 🎓 Strefa Nauki: Jak pisać dobre PRD?

### 1. User Stories (Historie Użytkownika)
> **ZASADA:** Story musi być negocjowalne. To zaproszenie do dyskusji, a nie specyfikacja techniczna.

| ❌ ŹLE (Rozwiązanie) | ✅ DOBRZE (Potrzeba) |
| :--- | :--- |
| "Użytkownik klika w niebieski przycisk Export PDF na górze ekranu." | "Jako Księgowy, chcę pobrać fakturę w formacie PDF, aby wysłać ją do biura rachunkowego." |
| "System ma bazę MongoDB." | "System musi obsłużyć 100k produktów bez spadku wydajności wyszukiwania." |

### 2. Kryteria Akceptacji (Definition of Done)
*   **Jasne:** "PDF generuje się w < 2 sekundy."
*   **Mierzalne:** "Logowanie działa dla e-maili z domeną @gmail.com."

---

## 1. Problem i Kontekst Psychologiczny
*Nie tylko "co nie działa", ale "jak to sprawia, że użytkownik się czuje".*

*   **Problem:** Użytkownicy porzucają koszyk na etapie wyboru dostawy.
*   **Ból (Pain Point):** Lęk przed ukrytymi kosztami, niepewność terminu ("Czy zdąży na prezent?"), frustracja skomplikowanym formularzem.
*   **Potrzeba (Psychologiczna):** Potrzeba kontroli, bezpieczeństwa i kompetencji.

## 2. Rozwiązanie (Value Proposition)
*Jak zaspokoimy te potrzeby?*

*   **Funkcja:** Pasek postępu darmowej dostawy.
*   **Mechanizm:** Goal Gradient Effect (Im bliżej celu, tym większa motywacja).
*   **Korzyść:** Poczucie zysku (Gain) i sprawczości.

## 3. Wymagania Funkcjonalne (User Stories)
*Format: Jako [Persona], chcę [Akcja], aby [Korzyść/Uczucie].*

*   "Jako *zabiegany rodzic*, chcę *widzieć dokładną datę dostawy*, aby *czuć spokój, że prezent dotrze na czas* (Redukcja lęku)."
*   "Jako *nowy klient*, chcę *kupić bez rejestracji*, aby *nie tracić czasu i energii* (Minimalizacja wysiłku)."
*   "Jako *łowca okazji*, chcę *wiedzieć ile brakuje do darmowej wysyłki*, aby *poczuć satysfakcję z dobrego dealu* (Smart Shopper)."

## 4. Wymagania Niefunkcjonalne (Quality of Experience)
*Parametry techniczne wpływające na psychologię.*

*   **Wydajność:** Czas ładowania < 1s (Utrzymanie uwagi, brak przerwania Flow).
*   **Estetyka:** Spójność wizualna budująca zaufanie (Efekt Aureoli).
*   **Błędy:** Komunikaty błędów muszą być pomocne i nieobwiniające (Maksyma Grzeczności).

## 5. Metryki Sukcesu (KPI & Psychologia)
*   **Konwersja:** Wzrost % zakończonych transakcji.
*   **Czas w zadaniu:** Skrócenie czasu checkoutu (Mniejsze obciążenie poznawcze).
*   **NPS/Satysfakcja:** "Czy czułeś się bezpiecznie płacąc?" (Poziom zaufania).