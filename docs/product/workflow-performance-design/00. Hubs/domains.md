---
template_type: crew
---

# 🌐 Domains & Roles Reference

> **Context:** Mapa ról (Personas) i domen (Bounded Contexts) obsługiwanych przez system Workflow Performance Design.
> **Użycie:** Wybierz rolę z listy, aby nadać odpowiedni kontekst Agentowi AI na początku zadania.

---

## 👑 Role Meta & Zarządcze (The Kernel)
*Te role zarządzają procesem, jakością i architekturą całego systemu.*

1.  **AI System Architect (Polyglot Engineer)**
    *   *Źródło:* `Coding_Hub` / `AI_System_Architect_Persona`
    *   *Misja:* Budowa skalowalnych systemów, DDD, standardy inżynierskie, bezpieczeństwo.
2.  **Boss Architect (SOP Designer)**
    *   *Źródło:* `Boss_Architect_Prompt`
    *   *Misja:* Zamiana ogólnych celów biznesowych w atomowe procedury (SOP) dla "Workerów".
3.  **Performance Product Architect (Operator)**
    *   *Źródło:* `README`
    *   *Misja:* Solopreneur zarządzający całą "fabryką", łączący wszystkie domeny.

---

## 💻 Delivery Domain (Coding)
*Hub: [Coding_Hub](Coding_Hub.md) - Wytwarzanie oprogramowania.*

4.  **Senior Developer**
    *   *Zadania:* Implementacja ficzerów, refactoring, bugfixy zgodnie z SOLID i Clean Code.
5.  **QA Engineer / AI Auditor**
    *   *Zadania:* Code Review, audyty bezpieczeństwa (OWASP), testy E2E, "LLM-as-a-Judge".
6.  **AI Engineer**
    *   *Zadania:* Projektowanie systemów RAG, agentów, dostrajanie promptów (Model Router, Vector DB).

---

## 🎨 Design Domain
*Hub: [Design_Hub](Design_Hub.md) - UX, UI i interakcja.*

7.  **UX Researcher / Strateg**
    *   *Zadania:* Tworzenie person JTBD, mapowanie Customer Journey, Storyboardy.
8.  **UI Designer**
    *   *Zadania:* Systemy designu, "Generative UI" (Contract-First), dostępność (A11y).
9.  **UX Auditor**
    *   *Zadania:* Audyty heurystyczne (Nielsen), weryfikacja behawioralna.

---

## 📈 Growth & Market Domain
*Hub: [Marketing_Hub](Marketing_Hub.md) - Wzrost i analityka.*

10. **Marketing Strategist**
    *   *Zadania:* Kampanie launchowe, lejki sprzedażowe (AIDA), pozycjonowanie marki.
11. **Email Marketing Specialist**
    *   *Zadania:* Sekwencje automation, psychologia sprzedaży w mailach.
12. **Data Analyst / CRO Specialist**
    *   *Zadania:* Analiza metryk (LTV, CAC), optymalizacja konwersji, testy A/B.

---

## ✍️ Writing Domain
*Hub: [Writing_Hub](Writing_Hub.md) - Treści i komunikacja.*

13. **Copywriter (Sales & Storyteller)**
    *   *Zadania:* Landing page copy, oferty handlowe, storytelling (Podróż Bohatera).
14. **Content Marketer**
    *   *Zadania:* Blogi SEO, posty na LinkedIn (wirusowe), scenariusze wideo.
15. **UX Writer**
    *   *Zadania:* Microcopy, komunikaty błędów, onboarding.

---

## 🔍 Discovery Domain
*Hub: [Discovery_Hub](Discovery_Hub.md) - Zrozumienie problemu.*

16. **Product Discovery Lead**
    *   *Zadania:* Analiza konkurencji, walidacja hipotez (Smoke Testy), definicja wizji produktu.
