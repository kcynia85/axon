# Axon Backend — Przegląd Systemu (Dokumentacja Nietechniczna)

> **Rola:** Przewodnik Użytkownika & Logika Biznesowa
> **Zakres:** Co system potrafi dzisiaj, a czego jeszcze się uczy.
> **Ostatnia aktualizacja:** 2026-03-01

## 🤖 Mózg Systemu (Co już działa?)

Backend to silnik, który napędza Axona. To tutaj żyje "Sztuczna Inteligencja". Oto kluczowe mechanizmy, które są już zaimplementowane.

### 1. Zespół Agentów (Twoi Wirtualni Pracownicy)
Nie rozmawiasz z jednym, nudnym botem. Masz do dyspozycji zespół specjalistów (Manager, Researcher, Builder, Writer). Każdy z nich ma inną "osobowość" i zestaw umiejętności.

### 2. Pamięć Projektowa (System RAG + Cytaty)
To jest "supermoc" Axona. System jest **Uziemiony (Grounded)**.
*   **Jak to działa?** Zanim Agent odpowie, przeszukuje Twoją bazę wiedzy.
*   **Nowość:** Agent dołącza teraz **cytaty i źródła** do swoich odpowiedzi, więc zawsze wiesz, na którym dokumencie się oparł.

### 3. Praca w tle (Durable Execution — Wdrożone ⚡)
Axon nie boi się już zamknięcia karty w przeglądarce.
*   **Mechanizm:** Wykorzystujemy system **Inngest**. Gdy zlecasz agentowi trudne zadanie, silnik wysyła je do pracy w tle. Wynik pojawi się w Twojej skrzynce odbiorczej (Inbox), nawet jeśli Ty w tym czasie nie będziesz przy komputerze.

### 4. Warsztaty (Workspaces)
Twój centralny magazyn komponentów:
*   **Templates (SOP):** Procedury operacyjne z "wejściami" (czego Agent potrzebuje) i "wyjściami" (co ma dostarczyć).
*   **Crews:** Gotowe zespoły agentów skonfigurowane do współpracy (sekwencyjnej lub równoległej).

### 5. Przestrzenie (Spaces)
Twoje interaktywne płótno (Canvas). To tutaj wizualizujesz procesy, łączysz agentów z narzędziami i widzisz postępy prac w czasie rzeczywistym.

---

## 🚧 Czego jeszcze brakuje? (Ograniczenia Wersji Alpha)

Aplikacja jest funkcjonalna, ale pewne zaawansowane funkcje są jeszcze w fazie rozwoju:

1.  **"Rozmowy w kuchni" (Pełna Multi-Agent Orchestration):**
    *   *Teraz:* Agenci pracują głównie na Twoje bezpośrednie zlecenie.
    *   *W planach:* Pełna autonomia, gdzie Agenci sami decydują o przekazaniu sobie zadań bez Twojej ingerencji.
2.  **Połączenie ze Światem (Internet & GitHub):**
    *   *Teraz:* Agent widzi głównie to, co mu wgrasz do bazy wiedzy.
    *   *W planach:* Bezpośrednia integracja z Twoim repozytorium GitHub (możliwość robienia commitów) oraz przeglądanie żywego internetu.
3.  **Pełne Automatyzacje (Webhooks):**
    *   *Teraz:* Mamy strukturę pod automatyzacje (np. n8n, Zapier).
    *   *W planach:* Pełna stabilność wyzwalaczy zewnętrznych, które automatycznie "budzą" agentów, gdy coś zmieni się w Twoich zewnętrznych narzędziach.
