# Coding Action Hub

> **Cel:** Centrum sterowania procesem wytwarzania oprogramowania. Od wymagań po deployment.

---

## 🏛️ Architecture & Standards (Fundamenty)
Zanim zaczniesz pisać kod, upewnij się, że znasz zasady gry.

*   **Philosopy:** [AI-Native Architect Manifesto](../Zasoby/AI-Native%20Architect/Philosophy/Manifesto.md) - Dlaczego łączymy DDD z Vibe Coding?
*   **Structure:** [Hexagonal Architecture (Porty i Adaptery)](../Zasoby/Engineering%20Knowledge%20Base/Architecture%20Patterns/Hexagonal_Architecture.md) - Izolacja logiki od AI Providerów.
*   **Guardrails:** [Software Architecture Standards](../Zasoby/Engineering%20Knowledge%20Base/Standards/Software_Architecture_Standards.md) - Wymagane prompty dla DDD, ADR i Hexagonal Architecture.
*   **Velocity:** [Vibe Coding Protocol](../Zasoby/AI-Native%20Architect/Vibe_Coding_Protocol.md) - Jak iterować z AI (Napkin -> Interface -> Code).
*   **Persona:** [AI System Architect Prompt](../Zasoby/Prompts/AI_System_Architect_Persona.md) - Skopiuj to na start sesji.

### 📚 Pattern Catalogs (Full Reference)
*   🤖 **AI Engineering:** [AI Ops Patterns](../Zasoby/Engineering%20Knowledge%20Base/Patterns/AI_Ops_Patterns.md) (Router, RAG Fusion, Shadow Mode).
*   🏛️ **Classic:** [Classic Architecture Reference](../Zasoby/Engineering%20Knowledge%20Base/Patterns/Classic_Architecture_Reference.md) (Layered, Event-Driven, Microkernel).
*   🌐 **Web:** [Modern Web Standards](../Zasoby/Engineering%20Knowledge%20Base/Patterns/Modern_Web_Architecture.md) (ISR, Streaming, Atomic Design).
*   💾 **Data:** [Data & Persistence Patterns](../Zasoby/Engineering%20Knowledge%20Base/Patterns/Data_Persistence_Patterns.md) (JSONB, Outbox, CRDT).

---

## 🎯 Common Cases (Najczęstsze Zadania)

### 🚀 New Feature (Nowa Funkcjonalność)
*   **Zadanie:** Stworzenie nowego modułu, API endpointu, widoku lub komponentu.
*   **🤖 AI Action:** [Użyj Product Requirements Prompt (PRP)](../04.%20Delivery/A.%20Handoff/Product%20Requirements%20Prompt%20(PRP).md) - To Twój główny sterownik. Wypełnij go, aby agent wiedział co robić.
*   **🧠 Human Knowledge:**
    *   Wzorce: [Wzorce Architektoniczne](../Zasoby/Engineering%20Knowledge%20Base/Architecture%20Patterns/)
    *   **Snippet:** [Hexagonal Structure Example](../Zasoby/Standards/Snippets/Hexagonal_Structure_Example.md) (Gotowa struktura folderów).
    *   Standardy: [Coding Tracker](../04.%20Delivery/B.%20Build%20&%20QA/Coding%20Tracker.md)

### 🐛 Bug Fix & Maintenance
*   **Zadanie:** Naprawa błędu, debugowanie, czyszczenie długu technologicznego.
*   **🤖 AI Action:** Użyj promptu: "Działaj jako Senior Developer. Przeanalizuj ten stack trace/kod. Znajdź przyczynę błędu [Opis] i zaproponuj rozwiązanie zgodnie z zasadami SOLID."
*   **🧠 Human Knowledge:**
    *   Weryfikacja: [Smoke Test](../04.%20Delivery/B.%20Build%20&%20QA/Smoke%20Test.md)

### 🏗️ Code Review & Security
*   **Zadanie:** Sprawdzenie jakości kodu, audyt bezpieczeństwa przed wdrożeniem.
*   **🤖 AI Action:** Użyj promptu: "Przeprowadź Code Review tego pliku. Sprawdź podatności (XSS, SQL Injection), wydajność i czytelność. Wypunktuj krytyczne błędy."
*   **🧠 Human Knowledge:**
    *   Bezpieczeństwo: [OWASP Top 10](../Zasoby/AI%20&%20Business%20Integration/Prawo%20i%20Bezpieczeństwo/OWASP%20Top%2010%20LLM%20and%20GenAI.md)

### 🎨 UI Implementation (Figma -> Code)
*   **Zadanie:** Przełożenie projektu graficznego na kod.
*   **🤖 AI Action:** [Użyj Figma Dev Mode MCP Hub](../00.%20Hubs/Figma_Dev_Mode_Hub.md) - Instrukcja jak pobrać design, tokeny i komponenty prosto z Figmy.
*   **🧠 Human Knowledge:**
    *   Setup: [Konfiguracja MCP](../00.%20Hubs/Figma_Dev_Mode_Hub.md#🔧-konfiguracja-agenta-cursor-rules)

### 🗄️ Database & Data Models
*   **Zadanie:** Projektowanie schematu bazy, migracje, zapytania SQL.
*   **🤖 AI Action:** Użyj promptu: "Zaprojektuj schemat bazy danych (ERD) dla [Modułu]. Uwzględnij relacje, indeksy i klucze obce. Użyj konwencji nazewniczej snake_case."
*   **🧠 Human Knowledge:**
    *   Struktura: [Tech PRD](../04.%20Delivery/A.%20Handoff/Tech%20PRD.md) (Sekcja Baza Danych)

### 🧪 Testing (Unit & E2E)
*   **Zadanie:** Pisanie testów jednostkowych lub end-to-end.
*   **🤖 AI Action:** Użyj promptu: "Napisz testy jednostkowe (Vitest/Jest) dla tej funkcji. Pokryj przypadki brzegowe i ścieżkę sukcesu."
*   **🧠 Human Knowledge:**
    *   Standardy: [AI Quality Assurance Checklist](../04.%20Delivery/B.%20Build%20&%20QA/AI%20Quality%20Assurance%20Checklist.md)

### 📚 Dokumentacja i Edukacja (Tech -> Biznes)
*   **Zadanie:** Generowanie dokumentacji technicznej, logów zmian lub tłumaczenie zawiłości IT dla biznesu.
*   **🤖 AI Action:** Użyj promptu: "Wygeneruj dokumentację API (OpenAPI/Swagger) dla tego endpointu. Następnie wytłumacz działanie tego algorytmu w prostym języku dla Managera Marketingu."
*   **🧠 Human Knowledge:**
    *   Standardy: [Tech PRD](../04.%20Delivery/A.%20Handoff/Tech%20PRD.md)

### 🤖 Automatyzacja Biznesowa (Scripts)
*   **Zadanie:** Skrypty automatyzujące (np. Excel/Google Sheets, Scraping, Kalkulatory cenowe, Integracje).
*   **🤖 AI Action:** Użyj promptu: "Napisz skrypt Python/Apps Script, który pobierze dane z [Źródło] i zaktualizuje arkusz kalkulacyjny. Stwórz logikę kalkulatora cenowego dla strony."

---

## 🏗️ AI Agent Engineering
*   **Zadanie:** Projektowanie autonomicznych systemów AI, RAG i Multi-Agent Systems.
*   **🧠 Engineering Knowledge Base:**
    *   **Architektura:** [Agent Architecture Patterns & SOP](../Zasoby/Engineering%20Knowledge%20Base/AI%20Engineering/Agent_Architecture_Patterns.md) (Routing, Orchestrator, Boss/Worker).
    *   **Data & RAG:** [RAG Engineering Compendium](../Zasoby/Engineering%20Knowledge%20Base/AI%20Engineering/RAG_Engineering_Compendium.md) (Chunking, Embeddingi, Retrievery).
    *   **Security:** [AI Security Guardrails](../Zasoby/Engineering%20Knowledge%20Base/AI%20Engineering/AI_Security_Guardrails.md) (Prompt Injection, RAGAS).
    *   **Tooling:** [Agent Tooling Stack](../Zasoby/Engineering%20Knowledge%20Base/AI%20Engineering/Agent_Tooling_Stack.md) (LangGraph, MCP, n8n).

---

## ⚖️ AI Evaluation (Evals)
*   **Zadanie:** Jak sprawdzić, czy AI "nie kłamie" i czy system działa lepiej po zmianach?
*   **🧠 Engineering Knowledge Base:**
    *   **Protokół Sędziowski:** [LLM-as-a-Judge Protocol](../Zasoby/Engineering%20Knowledge%20Base/AI%20Engineering/Evals/LLM_as_a_Judge_Protocol.md) - Jak używać GPT-4 do oceniania innych modeli (Metryki RAGAS: Faithfulness, Relevancy).
    *   **Strategia:** [AI Testing Strategy](../Zasoby/Engineering%20Knowledge%20Base/AI%20Engineering/AI_Testing_Strategy.md) - Testing Trophy, VCR/Replay i Shadow Mode.

---

## 🤖 Prompt Engineering Support
*   **Zadanie:** Potrzebujesz lepszego prompta? Chcesz, żeby Agent sam się poprawił?
*   **🧠 Human Knowledge:**
    *   **Standard Wydajności:** [Context Efficiency Protocol (Token Management)](../Zasoby/AI-Native%20Architect/Prompt%20Engineering%20Guide/Context_Efficiency_Protocol.md)
    *   Przewodnik: [Prompt Engineering Guide](../Zasoby/AI-Native%20Architect/Prompt%20Engineering%20Guide/)
    *   Autonomia: [Meta Prompt Generator](../Zasoby/AI-Native%20Architect/Meta_Prompt_Generator.md)
    *   Decyzyjność: [Decision Making Framework](../Zasoby/AI-Native%20Architect/Decision_Making_Framework.md)

---

## 🛠️ Stack & Standards
*   **Języki:** TypeScript, Python.
*   **Frameworki:** Next.js (App Router), FastAPI.
*   **Baza:** Supabase / PostgreSQL.
*   **Style:** Tailwind CSS.

---

## 🧠 Common Sense (Banalne, ale Krytyczne)
> **Dla Agenta:** Zanim wpadniesz w pętlę "Over-engineering", sprawdź podstawy.

1.  **Environment Variables:** Nigdy nie hardcoduj kluczy API. Sprawdź, czy `.env` jest w `.gitignore`.
2.  **Read the Logs:** Zanim zapytasz "dlaczego nie działa?", przeczytaj CAŁY stack trace błędu (od góry do dołu). Odpowiedź zazwyczaj tam jest.
3.  **Production Safety:** Nigdy nie uruchamiaj `DELETE`, `DROP` lub masowych migracji na produkcji bez backupu i transakcji (`BEGIN; ... COMMIT;`).
4.  **Mobile View:** Twoja aplikacja webowa to tak naprawdę aplikacja mobilna. Testuj w trybie responsywnym (F12) od pierwszej minuty.
5.  **Restart Server:** Jeśli dodałeś zmienną środowiskową lub bibliotekę i "nie działa" – zrestartuj serwer deweloperski.