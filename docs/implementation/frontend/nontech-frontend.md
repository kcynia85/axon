# Axon Frontend — Przewodnik Użytkownika (Nietechniczny)

> **Rola:** Przegląd Funkcji i Widoków
> **Ostatnia aktualizacja:** 2026-02-24

Witaj w interfejsie Axona! To Twoje centrum dowodzenia. Oto co już działa i jak z tego korzystać.

---

## 📊 Dashboard (Pulpit)

To pierwsze miejsce, które widzisz po zalogowaniu.

### Co tu znajdziesz?
1.  **Lista Twoich Projektów:** Każdy projekt to osobna karta z nazwą, statusem i opisem.
2.  **Kategorie (Huby):** Projekty ułożone tematycznie (np. "CODING", "DESIGN").

---

## 💬 Czat z Agentem

Wchodząc w projekt, możesz otworzyć czat z zespołem AI.

### Co potrafi?
1.  **Myślenie na żywo:** Tekst pojawia się litera po literze. Widzisz wskaźnik "Agent is thinking..."
2.  **Kontekst Projektu:** Agent wie, w jakim projekcie pracujesz — nie musisz tego za każdym razem przypominać.

---

## 🧰 Workspaces — Twój Warsztat

To miejsce, gdzie konfigurujesz **komponenty wielokrotnego użytku** przed użyciem ich na Canvasie.

### Co tu znajdziesz?
1.  **Templates (Szablony SOP):**
    *   Definiujesz procedury operacyjne — co Agent ma zrobić krok po kroku.
    *   🆕 **Inputs & Outputs:** Możesz teraz określić, **czego template potrzebuje** (np. "brand_guidelines") i **co ma wyprodukować** (np. "competitors_report").
    *   Gdy template trafi na Canvas, automatycznie wie, jakie dane wejściowe potrzebuje i jakie produkty ma dostarczyć.
2.  **Agenci:** Lista skonfigurowanych agentów AI ze specjalizacjami.
3.  **Crews (Zespoły):** Grupy agentów skonfigurowane do współpracy.
4.  **Patterns:** Gotowe schematy grafów do ponownego użycia.
5.  **Services & Automations:** Integracje z zewnętrznymi narzędziami (w budowie).

---

## 🗺 Spaces — Canvas (Mapa Procesów)

Interaktywne płótno, na które przeciągasz komponenty z Warsztatu.

### Co tu znajdziesz?
1.  **Strefy (Zones):** Kolorowe obszary grupujące template'y wg fazy (np. "Discovery", "Design", "Delivery").
2.  **Template Node'y:** Gdy dodasz template na canvas, zobaczysz jego inspektor z zakładkami:
    *   📋 **Actions** — checklisty zadań do wykonania
    *   🔗 **Context** — wymagane dane wejściowe (zdefiniowane w Workspaces jako Inputs)
    *   📦 **Artefacts** — oczekiwane produkty (zdefiniowane w Workspaces jako Outputs)
3.  **Agent Node'y:** Agenci AI widoczni na mapie z podglądem statusu.
4.  **Crew Node'y:** Zespoły agentów z przepływem pracy.
5.  **Krawędzie (Edges):** Połączenia między node'ami pokazujące przepływ danych.

### Jak dodać element na Canvas?
*   **Drag & Drop:** Przeciągnij komponent z lewego sidebara na canvas.
*   **Kliknięcie:** Kliknij komponent w sidebarze — pojawi się automatycznie w odpowiedniej strefie.

---

## 📬 Inbox (Skrzynka odbiorcza)

System powiadomień informujący o ukończonych zadaniach i zmianach w projektach.

---

## ⚙️ Settings (Ustawienia)

Konfiguracja systemu AI:
*   **LLM Providers:** Podłączenie dostawców modeli (Google, OpenRouter, lokalne).
*   **Model Registry:** Lista dostępnych modeli i ich parametry.
*   **Knowledge Engine:** Konfiguracja embeddingów, strategii chunkingu, baz wektorowych.

---

## 🚧 Czego jeszcze brakuje? (Funkcje planowane)

1.  **Przeglądarka Wiedzy:** Wygodny widok do przeglądania dokumentów, które "przeczytał" Agent.
2.  **Edycja Template'ów:** Modyfikacja inputs/outputs po stworzeniu template.
3.  **Ustawienia Użytkownika:** Panel zmiany hasła, awatara, tryb ciemny/jasny.
4.  **Historia Czatów:** Przeglądanie starych rozmów z przeszłości.
5.  **Automatyzacje na żywo:** Automatyczne wyzwalanie procesów po spełnieniu warunków.