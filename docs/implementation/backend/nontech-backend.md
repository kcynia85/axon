# Axon Backend — Przegląd Systemu (Dokumentacja Nietechniczna)

> **Rola:** Przewodnik Użytkownika & Logika Biznesowa
> **Zakres:** Co system potrafi dzisiaj, a czego jeszcze się uczy.
> **Ostatnia aktualizacja:** 2026-02-24

## 🤖 Mózg Systemu (Co już działa?)

Backend to silnik, który napędza Axona. To tutaj żyje "Sztuczna Inteligencja". Oto kluczowe mechanizmy, które są już zaimplementowane.

### 1. Zespół Agentów (Twoi Wirtualni Pracownicy)
Nie rozmawiasz z jednym, nudnym botem. Masz do dyspozycji zespół specjalistów. Każdy z nich ma inną "osobowość" i zestaw umiejętności:

*   **MANAGER:** Twój Project Manager. Pomaga zacząć projekt, pilnuje celów i dba o porządek.
*   **RESEARCHER (Badacz):** Szperacz. Przeszuka Twoje dokumenty, żeby znaleźć odpowiedź na trudne pytania techniczne.
*   **BUILDER (Budowniczy):** Programista. Wygeneruje dla Ciebie fragmenty kodu lub strukturę plików.
*   **WRITER (Pisarz):** Copywriter. Pomoże napisać dokumentację albo post na bloga.

### 2. Pamięć Projektowa (System RAG)
To jest "supermoc" Axona. Zwykły ChatGPT często zmyśla, bo nie zna Twojej firmy. Axon jest **Uziemiony (Grounded)**.
*   **Jak to działa?** Zanim Agent odpowie, "biegnie" do Twojej bazy wiedzy, czyta odpowiednie pliki i odpowiada na podstawie faktów.
*   **Efekt:** Mniej bajkopisarstwa, więcej konkretów dotyczących Twojego projektu.

### 3. Myślenie na żywo (Streaming)
Nie musisz czekać 30 sekund na odpowiedź. Widzisz, jak Agent "pisze" do Ciebie znak po znaku. To daje poczucie naturalnej rozmowy.

### 4. Warsztaty (Workspaces) — NOWE 🆕
System konfiguracji reusable komponentów:

*   **Templates (SOP):** Definiujesz procedury operacyjne z konkretnymi wejściami i wyjściami.
    *   Np. Template "PRD" wymaga wejścia "brand_guidelines" i produkuje wyjście "competitors_report".
    *   Te wejścia/wyjścia są **deterministyczne** — gdy template trafia na Canvas, automatycznie wie czego potrzebuje i co ma dostarczyć.
*   **Patterns:** Gotowe schematy grafów do ponownego użycia (np. "Discovery Pipeline").
*   **Crews:** Zespoły Agentów skonfigurowane do współpracy (Sequential / Parallel / Hierarchical).

### 5. Przestrzenie (Spaces)
Twoje interaktywne płótno do wizualizacji procesów. Backend przechowuje graf (node'y, krawędzie, strefy) i udostępnia go frontendowi.

### 6. Skrzynka odbiorcza (Inbox)
System powiadomień — informuje Cię o ukończonych zadaniach, zmianach w projektach itp.

---

## 🚧 Czego jeszcze brakuje? (Ograniczenia Wersji Alpha)

Aplikacja jest funkcjonalna, ale pewne zaawansowane funkcje są jeszcze w budowie:

1.  **"Rozmowy w kuchni" (Multi-Agent Conversation):**
    *   *Teraz:* Ty rozmawiasz z Agentem.
    *   *W planach:* Agenci rozmawiający ze sobą. Np. Manager prosi Researchera o dane, a potem Buildera o kod, a Ty tylko akceptujesz wynik.
2.  **Długotrwała Pamięć Operacyjna:**
    *   *Teraz:* Jeśli zamkniesz przeglądarkę w połowie generowania długiego zadania, proces może zostać przerwany.
    *   *W planach:* System, który pracuje w tle nawet jak śpisz (tzw. Durable Execution).
3.  **Połączenie ze Światem (Internet & GitHub):**
    *   *Teraz:* Agent widzi tylko to, co mu wgrasz.
    *   *W planach:* Agent, który sam przeszuka Google albo zrobi `git pull` z Twojego repozytorium.
4.  **Automatyzacje i Serwisy:**
    *   *Teraz:* Zdefiniowane w strukturze, ale jeszcze bez pełnej funkcjonalności.
    *   *W planach:* Integracja z zewnętrznymi narzędziami (Slack, Jira, Email) i automatyczne wyzwalanie procesów.