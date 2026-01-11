---
template_type: crew
---

# Discovery Action Hub

> **Cel:** Zrozumieć biznes, użytkownika i technologię zanim postawisz pierwszą linię kodu lub designu.
> **Motto:** "Garbage In, Garbage Out".

---

## 🎯 Common Cases (Najczęstsze Zadania)

### 🕵️ Start Projektu (Kickoff & Analysis)
*   **Zadanie:** Mam notatki ze spotkania / brief od klienta. Co z tym zrobić?
*   **🤖 AI Action:** [Użyj Discovery Interrogator Prompt](../Zasoby/AI-Native%20Architect/Workflow/Prompts/Discovery/Discovery_Interrogator.md)
    *   *Input:* Wklej wszystko co masz.
    *   *Output:* Gotowy `Project_Context.md` + lista pytań do klienta.
*   **🧠 Human Knowledge:**
    *   Weryfikacja: [Audyt Techniczny (Reality Check)](../02.%20Discovery/B.%20Definition%20&%20Strategy/Audyt%20Techniczny%20(Reality%20Check).md)
    *   Produkt: [Dekoder Produktu (FABE)](../02.%20Discovery/B.%20Definition%20&%20Strategy/Dekoder%20Produktu.md)

### 👤 Badania Użytkownika (User Research)
*   **Zadanie:** Zrozumienie kto i po co kupuje.
*   **🤖 AI Action:** Użyj promptu: "Na podstawie danych o produkcie, stwórz profil Persony JTBD. Zidentyfikuj główny 'Job' i bariery."
    *   *Tools:* **QoQo** (Persony & Journey Maps), **Userdoc** (User Stories).
*   **🧠 Human Knowledge:**
    *   Teoria: [Zidentyfikowane JTBD](../02.%20Discovery/C.%20User%20Understanding/Zidentyfikowane%20JTBD.md)
    *   📘 **AI Guide:** [AI-Assisted UX Research Methods](../Zasoby/Discovery/AI-Assisted%20Research/AI_UX_Research_Methods.md)
    *   Szablon: [Persona JTBD](../02.%20Discovery/C.%20User%20Understanding/Zidentyfikowane%20JTBD/Persona%20JTBD/Persona%20JTBD.md)

### 🎤 Badania Jakościowe (IDI)
*   **Zadanie:** Przeprowadzenie wywiadów z użytkownikami.
*   **🤖 AI Action:** Transkrypcja i analiza (Looppanel / Grain).
*   **🧠 Human Knowledge:**
    *   Planowanie: [Rekrutacja i Screening](../02.%20Discovery/D.%20Qualitative%20Research/Rekrutacja%20i%20Screening.md)
    *   Wywiad: [Scenariusz IDI (Szablon)](../02.%20Discovery/D.%20Qualitative%20Research/Scenariusz%20IDI%20(Szablon).md)
    *   Wnioski: [Analiza Wyników IDI](../02.%20Discovery/D.%20Qualitative%20Research/Analiza%20Wyników%20IDI.md) (Tool: **NotablyAI** do klastrowania).

### 📊 Badania Ilościowe (Data)
*   **Zadanie:** Weryfikacja hipotez na liczbach.
*   **🧠 Human Knowledge:**
    *   Analityka (Audyt & AI-Prompts): [Web Analytics Audit (GA4 & Hotjar)](../02.%20Discovery/E.%20Quantitative%20Research/Web%20Analytics%20Audit.md)
    *   Segmentacja (RFM): [Analiza RFM z AI](../02.%20Discovery/E.%20Quantitative%20Research/Analiza%20RFM.md)
    *   Ankiety: [Ankieta AI (Formless Strategy)](../02.%20Discovery/E.%20Quantitative%20Research/Ankieta%20(AI%20Formless).md)
    *   Eksperymenty: [Testy A-B (Szablon & PIE)](../02.%20Discovery/E.%20Quantitative%20Research/Testy%20A-B%20(Eksperymenty).md)
    *   Inspiracje: [Proven Hypotheses (Case Studies)](../Zasoby/UX%20Design%20Patterns/E-commerce%20&%20Conversion/Hypotheses%20&%20Cases/Proven%20Hypotheses.md)
    *   📚 **Narzędzia Analityczne (SOP):**
        *   [🧹 Data Cleaning Kit (SOP)](../Zasoby/Product%20Analytics%20Knowledge%20Base/Data_Cleaning_SOP.md) – Zanim wrzucisz dane do AI.
        *   [🛡️ AI Validation Protocol](../Zasoby/AI%20&%20Business%20Integration/AI_Validation_Protocol.md) – Zanim wyślesz raport klientowi.
        *   [🏗️ Data Stack Selector](../Zasoby/Product%20Analytics%20Knowledge%20Base/Data_Stack_Selector.md) – Dobór narzędzi do skali.

### ⚔️ Analiza Rynku (Market Recon)
*   **Zadanie:** Sprawdzenie konkurencji i trendów.
*   **🤖 AI Action:** [Użyj AI Opportunity Scanner](../01.%20Product%20Management/AI%20Opportunity%20Scanner.md)
    *   *Tools:* **Brandwatch / Mention** (Analiza sentymentu).
*   **🧠 Human Knowledge:**
    *   Metody: [Analiza Konkurencji & Benchmarks](../02.%20Discovery/A.%20Research%20&%20Inputs/Analiza%20Konkurencji%20&%20Benchmarks.md)

---

## 🤖 Prompt Engineering Support
*   **Zadanie:** Optymalizacja pracy z AI przy dużej ilości danych (Wywiady, Raporty).
*   **🧠 Human Knowledge:**
    *   **Standard Wydajności:** [Context Efficiency Protocol (Token Management)](../Zasoby/AI-Native%20Architect/Prompt%20Engineering%20Guide/Context_Efficiency_Protocol.md)
    *   **Narzędzie Operacyjne:** [Context Injector Snippet (Manual RAG)](../Zasoby/AI-Native%20Architect/Prompt%20Engineering%20Guide/Context_Injector_Snippet.md) - Użyj tego szablonu do wklejania transkrypcji i danych.
    *   Przewodnik: [Prompt Engineering Guide](../Zasoby/AI-Native%20Architect/Prompt%20Engineering%20Guide/)

---

## 🛠️ Outputy Fazy Discovery
1.  **Project Context:** Wypełniony i zatwierdzony.
2.  **Lista Ryzyk:** Co może pójść nie tak? (Tech/Biznes).
3.  **Scope:** Wstępny zakres prac (zanim przejdziesz do Designu).

---

## 🧠 Common Sense (Banalne, ale Krytyczne)
> **Dla Agenta:** Nie wierz w słowa, wierz w czyny i liczby.

1.  **Talk to Humans:** AI może zanalizować 1000 wywiadów, ale nie zobaczy emocji w oczach klienta, gdy mówi o problemie. Idź porozmawiać.
2.  **The Mom Test:** Klienci kłamią, żeby być mili ("Świetny pomysł, na pewno bym kupił!"). Ignoruj komplementy, pytaj o przeszłe zachowania ("Kiedy ostatnio za to zapłaciłeś?").
3.  **Competitors Fallacy:** To, że konkurencja ma daną funkcję, nie znaczy, że ona działa. Może właśnie tracą na niej miliony. Nie kopiuj bez zrozumienia.
4.  **Data is History:** Dane mówią Ci co się stało, ale nie dlaczego. Analityka (ilość) musi iść w parze z Wywiadami (jakość).
