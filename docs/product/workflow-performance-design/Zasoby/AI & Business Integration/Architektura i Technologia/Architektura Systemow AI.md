---
template_type: crew
---

# Architektura Systemów AI i Zarządzanie Danymi

## 1. ML (Machine Learning) vs LLM (Large Language Models)

| Aspekt | ML (Klasyczne) | LLM (Generatywne) |
| :--- | :--- | :--- |
| **Zadanie** | Konkretne (np. przewidywanie odejść, klasyfikacja). | Wszechstronne (pisanie, analiza, kodowanie). |
| **Dane** | Wymaga własnych, ustrukturyzowanych danych. | Działa na wiedzy ogólnej + kontekście (prompt). |
| **Koszt** | Wysoki start (trening), niski koszt użycia. | Niski start (API), wysoki koszt skali (tokeny). |
| **Kontrola** | Wysoka (wiemy, jak działa). | Niższa (czarna skrzynka, halucynacje). |

## 2. Architektura Wdrożeń (Przykłady)

### System Rekomendacyjny (E-commerce)
1.  **Input:** Kliki, koszyk, historia (Interakcje).
2.  **Proces:** Porównanie z innymi (Collaborative Filtering) lub analiza cech (Content-based).
3.  **Output:** "Klienci tacy jak Ty kupili też..." (Dynamiczna lista).

### Inteligentny Agent Obsługi (Support)
1.  **Input:** Wiadomość klienta + Dane o rezerwacji/koncie.
2.  **Proces (AI):** Analiza sentymentu + Klasyfikacja problemu + Wyszukanie rozwiązania w bazie wiedzy.
3.  **Output:** Gotowa sugestia odpowiedzi dla Agenta (Co-pilot) lub automatyczna odpowiedź (Chatbot).

## 3. Dane: Paliwo dla AI

### Jakość Danych (Garbage In, Garbage Out)
Dane muszą być:
*   **Relewantne:** Związane z problemem (np. ostrość zdjęcia dla e-commerce, a nie tylko kliki).
*   **Olabelkowane:** Opisane (np. "To jest zwrot", "To jest reklamacja").
*   **Kompletne:** Bez dziur w tabelach.
*   **Zróżnicowane:** Bez biasu (np. dane tylko z jednego miasta nie nauczą modelu o całym kraju).

### Podejście RIGC (Ocena projektu AI)
Zanim zaczniesz, sprawdź czy projekt jest:
*   **R (Relevant):** Istotny dla celów biznesowych.
*   **I (Impactful):** Ma duży wpływ (ROI).
*   **G (Grounded):** Oparty na dostępnych danych.
*   **C (Compatible):** Pasuje do obecnych systemów.
