# 🧠 PDR (Product Decision Record) - Axon

> **Kontekst:** Rejestr kluczowych decyzji strategicznych dla projektu Axon.
> **Metodologia:** [Product Decision Record](../01.%20Product%20Management/Product%20Decision%20Record%20(PDR).md)

---

## [PDR-001] Wybór Architektury "AI-Native OS"
*   **Data:** 2025-12-06
*   **Kontekst:** Potrzeba stworzenia środowiska pracy dla jednoosobowej agencji, która chce skalować operacje bez zatrudniania ludzi.
*   **Opcje:**
    1.  **Tradycyjny SaaS:** CRUD, sztywne formularze, AI jako "dodatek" (copilot).
    2.  **AI-Native OS (Axon):** AI jako główny interfejs (CUI), "Invisible Governance", struktura oparta na Agentach ADK.
*   **Decyzja:** Wybór **AI-Native OS**.
*   **Uzasadnienie:** W modelu solopreneur wąskim gardłem jest context-switching. Tylko pełna delegacja do Agentów (autonomicznych) realnie odciąży twórcę.
*   **Konsekwencje:** Wyższy koszt wdrożenia (RAG, Vector DB), ale drastycznie niższy koszt operacyjny w przyszłości.

## [PDR-002] Przesunięcie Grywalizacji do Backlogu (Scope Cut)
*   **Data:** 2025-12-12
*   **Kontekst:** Złożoność MVP rośnie. Moduł grywalizacji (Streaks, Avatars) wymaga dużej ilości pracy frontendowej i logiki biznesowej, która nie jest krytyczna dla "Core Value" (dowożenia pracy).
*   **Opcje:**
    1.  Dowieźć słabą grywalizację w MVP.
    2.  Opóźnić MVP o 3 tygodnie, by dowieźć pełną grywalizację.
    3.  Usunąć z MVP, przenieść do "Post-MVP".
*   **Decyzja:** **Usunięcie z MVP (Opcja 3).**
*   **Uzasadnienie:** Zgodnie z zasadą "Ruthless Prioritization", grywalizacja to "Nice to have". Klient zapłaci za Agenta, który robi research, a nie za to, że ma ładny avatar.
*   **Konsekwencje:** Mniejsza lepkość (retencja) w pierwszej fazie, ale szybsze Time-to-Market.

## [PDR-003] Zmiana Architektury Informacji na "Task-Based"
*   **Data:** 2025-12-12
*   **Kontekst:** Poprzednia struktura folderowa ("Hubs") była kopią struktury dyskowej i wymuszała na użytkowniku ręczne nawigowanie po "biurokracji".
*   **Decyzja:** Wdrożenie płaskiej struktury **Task-Based** (`/workspace`, `/inbox`, `/brain`).
*   **Uzasadnienie:** Użytkownik wchodzi do aplikacji, żeby wykonać zadanie (np. "Zrób Research"), a nie przeglądać foldery. "Invisible Governance" ukrywa złożoność.
*   **Konsekwencje:** Konieczność przebudowy routingu w Next.js i logiki "Shadow Mode" dla Agentów.
