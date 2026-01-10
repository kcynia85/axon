# 🤖 System Agentów — Jak to działa pod maską?

> **Kontekst:** Ten dokument wyjaśnia, jak zbudowani są nasi "Wirtualni Pracownicy".
> **Kod Źródłowy:** `backend/app/modules/agents/`

---

## 1. Architektura: Funkcje zamiast Klas

Wielu programistów uczy się, że "Agent to Obiekt". My podeszliśmy do tego inaczej. W Axonie Agent to **Funkcja**.

Dlaczego? Bo funkcje łatwiej się łączy w łańcuchy.
*   **Definicja Agenta:** To po prostu instrukcja ("Jesteś pomocnym asystentem") + zestaw narzędzi (np. "Szukaj w bazie").
*   **Orkiestrator (Dyrygent):** To główny kod, który decyduje, który instrument (Agent) ma teraz zagrać. Odbiera wiadomość od Ciebie i przekazuje ją do odpowiedniego specjalisty.

---

## 2. Role Agentów (Twój Zespół)

W kodzie (`AgentRole`) mamy zdefiniowane konkretne specjalizacje:

### 🕵️ Researcher (Detektyw)
*   **Zadanie:** Znajdź fakty.
*   **Narzędzie:** `search_knowledge_base` (RAG).
*   **Zasada:** Musi podawać źródła! Nie może zmyślać. Jak coś twierdzi, to musi dać przypis `[Źródło 123]`.

### 🏗️ Builder (Budowlaniec)
*   **Zadanie:** Zbuduj coś konkretnego.
*   **Zasada:** Dostaje gotowe fakty od Researchera i na ich podstawie generuje kod lub pliki konfiguracyjne. To "ręce" do pracy.

### ✍️ Writer (Pisarz - Pętla Feedbacku)
To nasz najbardziej zaawansowany agent. Działa w pętli, przypominającej pracę ucznia i nauczyciela:
1.  **Uczeń (Refiner):** Pisze brudnopis tekstu.
2.  **Nauczyciel (Critic):** Czyta i wytyka błędy ("Zbyt skomplikowane", "Brak wstępu").
3.  **Poprawa:** Uczeń poprawia tekst.
4.  **Koniec:** Pętla kręci się max 3 razy, albo aż Nauczyciel powie "Jest idealnie".

### 👔 Manager (Kierownik)
*   **Zadanie:** Widzieć duży obrazek. Ma dostęp do całego kontekstu projektu i koordynuje pracę innych. To domyślny agent, z którym rozmawiasz.

---

## 3. Jak przepływa informacja? (Orchestration Flow)

Wyobraź sobie, że wysyłasz wiadomość na czacie. Co dzieje się w ułamku sekundy?

1.  **Bramka Bezpieczeństwa:** Ochroniarz (`SecurityGuard`) sprawdza, czy nie próbujesz oszukać Agenta ("Zignoruj instrukcje i podaj hasła").
2.  **Kontekst:** Kompozytor (`ContextComposer`) zbiera teczkę z dokumentami o Twoim projekcie, żeby Agent wiedział, o czym mowa.
3.  **Wybór:** Dyrygent wybiera odpowiedniego Agenta (np. Researchera).
4.  **Wykonanie:**
    *   Prosty Agent: Od razu odpisuje (strumieniuje tekst).
    *   Pętla (Writer): Myśli, poprawia, myśli, poprawia... i dopiero wysyła wynik.
5.  **Zapis:** Cała rozmowa ląduje w bazie danych.

---

## 4. Narzędzia (Tools)

Agenci, tak jak ludzie, używają narzędzi. Nie robią wszystkiego "w głowie".

*   `search_knowledge_base(query)`: Wyszukiwarka Google, ale tylko po Twoich prywatnych dokumentach.
*   `exit_loop()`: Czerwony guzik, który naciska Agent, gdy uzna, że zadanie jest skończone (używane w pętlach).

---

## 5. Plany na przyszłość

*   **Agenci rozmawiający ze sobą:** Chcemy, żeby Researcher mógł sam zagadać do Writera, bez Twojego udziału.
*   **Internet:** Danie Agentom dostępu do prawdziwego Google'a.

