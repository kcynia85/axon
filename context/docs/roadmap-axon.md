# 🗺️ Roadmap (Axon)

> **Strategia:** Ruthless Prioritization (Bezwzględna Priorytetyzacja).
> **Metodologia:** [Roadmap Template](../01.%20Product%20Management/Roadmap.md)

---

## ⛔ Anti-Goals (Czego NIE robimy w Q1)
*   ❌ **Grywalizacja (Streaks/Avatars):** Przesunięte do Q2.
*   ❌ **Aplikacja Mobilna:** Tylko Responsive Web.
*   ❌ **Integracje zewnętrzne (Jira/Slack):** Tylko natywne narzędzia (Notion opcjonalnie).
*   ❌ **Multi-user (Teams):** System jednoosobowy (Single Player Mode).

---

## ☠️ Kill Gates (Walidacja Przetrwania)
*Jeśli nie osiągniemy tych kamieni milowych, projekt wymaga Pivotu.*

1.  **Gate 1 (MVP Alpha):** System potrafi poprawnie odpowiedzieć na pytanie z bazy wiedzy (RAG) i wygenerować plik Markdown w Inboxie.
    *   *Deadline:* Tydzień 2.
2.  **Gate 2 (Usability):** Użytkownik jest w stanie przejść proces "Od pomysłu do Planu" w <15 minut bez błędu krytycznego.
    *   *Deadline:* Tydzień 4.

---

## 🟢 Now (Sprint 1-2: Foundation)
*Cel: Postawienie infrastruktury i "Mózgu".*

*   [ ] **Infrastruktura:** Setup Next.js, FastAPI, Supabase (Vector).
*   [ ] **Knowledge Ingestion:** Skrypt importujący pliki `.md` z `00. Hubs` do wektorów.
*   [ ] **Core Agent:** Podstawowa pętla agenta (Chat -> RAG -> Response).
*   [ ] **UI Skeleton:** Layout aplikacji (Sidebar, Chat, Right Panel).

## 🟡 Next (Sprint 3-4: The Trio)
*Cel: Specjalizacja ról.*

*   [ ] **Role:** Implementacja System Instructions dla Managera, Researchera, Buildera.
*   [ ] **Tools:** Implementacja narzędzi: `search_web`, `read_file`, `save_artifact`.
*   [ ] **Artifact Panel:** Renderowanie Markdown/Code w panelu bocznym.

## 🔴 Later (Q2+: Expansion)
*Cel: "Sticky" features.*

*   [ ] **Gamification Hub:** XP, Leveling.
*   [ ] **Voice Mode:** Rozmowa głosowa z Managerem.
*   [ ] **Multi-modal Input:** Analiza screenshotów UI.
