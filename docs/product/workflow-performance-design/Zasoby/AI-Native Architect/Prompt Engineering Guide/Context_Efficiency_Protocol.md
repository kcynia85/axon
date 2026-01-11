---
template_type: crew
---

# Context Efficiency Protocol (Token Window Management)

> **"Context is King, but too much Context is Noise."**

Ten dokument definiuje standardy zarządzania oknem kontekstowym (Token Window) w pracy z Agentami AI, aby uniknąć degradacji jakości odpowiedzi i zminimalizować koszty.

---

## 📉 Zjawisko: "Lost in the Middle"

Badania pokazują, że modele LLM mają tendencję do lepszego zapamiętywania i wykorzystywania informacji znajdujących się na **początku** i na **końcu** promptu. Informacje umieszczone w środku długiego kontekstu są często ignorowane lub "zapominane".

### Dlaczego to ważne?
Wrzucenie całej dokumentacji projektu "jak leci" do środka promptu może sprawić, że kluczowe reguły biznesowe zostaną pominięte, jeśli nie znajdują się na skrajach okna kontekstowego.

### 🛡️ Środki Zaradcze (Mitigacja)
1.  **Kanapka Kontekstowa (Context Sandwich):**
    *   **Góra (Start):** Kluczowe Instrukcje Systemowe, Rola, Cel.
    *   **Środek:** Dane, Dokumentacja, Logi, Brudnopis.
    *   **Dół (Koniec):** Przypomnienie kluczowych zasad (np. formatu JSON), Konkretne polecenie dla Agenta.
2.  **Refresher:** Przy bardzo długich konwersacjach, powtórz najważniejsze instrukcje w ostatnim prompcie użytkownika.

---

## ⚙️ Token Window Management Strategies

### 1. Kompresja i Selekcja
Zamiast wklejać pełne pliki kodu:
*   Używaj **szkieletów** (interfejsy, sygnatury funkcji) zamiast implementacji.
*   Wklejaj tylko pliki związane z bieżącym zadaniem (`@ActiveFile`).
*   Proś model o "podsumowanie ustaleń" co 5-10 tur rozmowy, aby wyczyścić historię i zacząć od nowa z syntezą.

### 2. Formowanie Danych (Data Shaping)
*   **Markdown Headers:** Używaj jasnej hierarchii (`#`, `##`), aby model rozumiał strukturę dokumentu.
*   **Delimiters:** Oddzielaj sekcje wyraźnymi znakami (np. `---`, `### INPUT DATA ###`), aby model wiedział, gdzie kończy się instrukcja a zaczynają dane.

### 3. Progressive Loading (Dla RAG/Context)
Nie ładuj wszystkiego naraz.
*   Krok 1: Zapytaj o strukturę/plan.
*   Krok 2: Dostarcz szczegóły tylko dla wybranego fragmentu planu.

---

## 📝 Actionable Checklist (Dla Agenta)

- [ ] **Sprawdź długość kontekstu:** Czy nie przekraczasz limitu modelu (np. 128k/1M)?
- [ ] **Zastosuj "Kanapkę":** Czy instrukcja "co mam zrobić" jest na samym końcu?
- [ ] **Oczyść środek:** Czy usunąłeś zbędne logi/komentarze z wklejanego kodu?
- [ ] **Unikaj "Lost in the Middle":** Czy najważniejsze reguły (np. "nie usuwaj komentarzy") są w System Prompcie lub na końcu inputu?
