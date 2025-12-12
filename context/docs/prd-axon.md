# 📄 PRD (Product Requirements Document) - Business Layer

> **Produkt:** Axon (RAGAS)
> **Typ:** AI Command Center / B2B SaaS
> **Metodologia:** [AI Implementation Plan](../01.%20Product%20Management/AI%20Implementation%20Plan.md) & [Unit Economics](../01.%20Product%20Management/Unit%20Economics%20&%20Business%20Model.md)

---

## 1. Diagnoza (Problem & Opportunity)

### Problem (Pain Point)
*   **Chaos Context-Switching:** Freelancer traci 40% czasu na przełączanie się między rolami (PM -> Researcher -> Designer -> Developer).
*   **Samotność Decyzyjna:** Brak partnera do "odbijania myśli" (Rubber Ducking) i weryfikacji pomysłów.
*   **Biurokracja:** Utrzymanie dokumentacji (PDR, Changelog) jest zaniedbywane, co prowadzi do długu technologicznego.

### Rozwiązanie (Value Prop)
*   **Axon jako "Second Brain":** System, który pamięta kontekst projektu i decyzje.
*   **Agent Team:** 3 wyspecjalizowanych agentów (Manager, Researcher, Builder) dostępnych 24/7.
*   **Invisible Governance:** System sam dba o biurokrację w tle.

### Cel SMART (MVP)
*   **Cel:** Zredukować czas potrzebny na "Setup projektu" (Research + Wstępna Architektura) z 5 dni do 4 godzin.
*   **Metryka:** Czas od "Nowy Projekt" do "Gotowy Plan Działania w Inbox".

---

## 2. Model Biznesowy & Unit Economics

### Model (The Engine)
*   **Typ:** B2B SaaS (Micro-Agency / Freelancer).
*   **Pricing (Estymacja):**
    *   **Starter:** $29/mc (BYOK - Bring Your Own Keys).
    *   **Pro:** $99/mc (All-inclusive, Managed Infrastructure).

### Unit Economics (Symulacja dla wersji PRO)
*   **ARPU:** $99
*   **Koszty Zmienne (COGS):**
    *   LLM API (Gemini/OpenAI): ~$15 (przy intensywnym użyciu).
    *   Cloud Run / Vercel: ~$5.
    *   Supabase (Vector): ~$2.
*   **Marża Brutto:** ~$77 (77%).
*   **Wniosek:** Model jest zdrowy, pod warunkiem utrzymania kosztów tokenów w ryzach (użycie cache i mniejszych modeli Flash dla prostych zadań).

---

## 3. Dane i Paliwo (Data Strategy)

### Wsad (Input)
*   **Knowledge Base:** Pliki Markdown z folderu `00. Hubs` i `Zasoby` (Best Practices, Checklisty).
*   **Project Context:** Pliki użytkownika, historia czatu.

### Bezpieczeństwo i Prywatność
*   **Separacja:** Każdy Workspace ma swoje odseparowane kolekcje wektorowe (RLS w Supabase).
*   **Brak Trenowania:** Wykorzystanie API Enterprise (Google/OpenAI), które nie trenują na danych klienta.

---

## 4. Plan Wdrożenia (Implementation Plan)

### Faza 1: "Genesis" (Tydzień 1-2)
*   **Zakres:** Setup repozytorium, Baza Wektorowa, Pierwszy Agent (Hello World).
*   **Cel:** Działający chat z własną wiedzą (RAG).

### Faza 2: "The Trio" (Tydzień 3-4)
*   **Zakres:** Implementacja ról: Manager, Researcher, Builder.
*   **Cel:** Użytkownik może zlecić zadanie, które przechodzi przez 2 agentów.

### Faza 3: "UI Polish" (Tydzień 5-6)
*   **Zakres:** Dashboard, Streaming UI, Artifact Panel.
*   **Cel:** UX na poziomie "Notion-like".
