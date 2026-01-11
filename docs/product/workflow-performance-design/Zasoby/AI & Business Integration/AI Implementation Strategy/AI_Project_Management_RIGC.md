---
template_type: crew
---

# AI Project Management Framework (RIGC)

> **Status:** Strategic Tool
> **Context:** Framework for evaluating the viability of AI projects before investment.
> **Source:** Adapted from `Raw/AI-Business/.../Zarządzanie projektem AI ML 289...md`

---

## 🎯 RIGC Framework
Czy Twój pomysł na AI ma sens biznesowy? Sprawdź 4 wymiary:

### 1. Relevant (Istotność)
*   **Pytanie:** Czy projekt wspiera kluczowe cele strategiczne firmy?
*   **Przykład:**
    *   ✅ Chatbot w Telecomie (Cel: Redukcja kosztów obsługi).
    *   ❌ Generowanie obrazków w księgowości (Cel: Brak jasnego powiązania).

### 2. Impactful (Wpływ)
*   **Pytanie:** Czy możemy zmierzyć potencjalny zysk lub oszczędność? (ROI).
*   **Metryka:** Czas, Pieniądze, Konwersja, Retencja.

### 3. Grounded in Data (Dane)
*   **Pytanie:** Czy mamy dane do wytrenowania/zasilenia modelu?
*   **Checklista Danych:**
    *   [ ] **Relewantne:** Czy faktycznie opisują problem?
    *   [ ] **Opisane (Labeled):** Czy wiemy, co jest czym (np. czy to zdjęcie to "but" czy "spodnie")?
    *   [ ] **Kompletne:** Brak dziur w historii.
    *   [ ] **Zróżnicowane:** Unikamy biasu (np. dane tylko z jednego miesiąca).

### 4. Compatible (Kompatybilność)
*   **Pytanie:** Czy to zadziała z naszym obecnym stackiem technologicznym i procesami?
*   **Ryzyko:** "Wdrożyliśmy super AI, ale nikt go nie używa, bo nie integruje się z naszym CRM".

---

## 🚦 Reguła 3 Kciuków (Kiedy AI jest potrzebne?)

Stosuj AI tylko wtedy, gdy problem spełnia te warunki. Jeśli nie - użyj tradycyjnego kodu (if/else).

1.  **Personalizacja > Customizacja:** System ma się sam dostosować do użytkownika (nie użytkownik konfiguruje system).
2.  **Wzorce > Reguły:** Problem jest zbyt złożony na proste reguły logiczne (np. rozpoznawanie mowy, rekomendacje filmów).
3.  **Powtarzalność:** Mamy tysiące powtórzeń tego samego zadania (skala).

---

## 📉 Cykl Życia Projektu AI (Od Hipotezy do Produkcji)

1.  **Definicja Problemu:** Co nas boli? (np. "30% zwrotów").
2.  **Weryfikacja Deterministyczna (Bez AI):** Czy możemy to rozwiązać Excelem? (np. "Nie pozwól na zwrot po 30 dniach").
3.  **MVM (Minimum Viable Model):** Prosty model (np. regresja liniowa) na próbce danych.
4.  **Siatka Bezpieczeństwa (MTB):** Macierz Tolerancji na Błąd. Co się stanie, jak AI się pomyli? (Human-in-the-loop).
5.  **Produkcja & Monitoring:** Śledzenie Precision/Recall (nie tylko Accuracy!).

### 📊 Metryki Sukcesu
*   **Unikaj:** Samego "Accuracy" (Może być mylące przy niezbalansowanych danych).
*   **Stosuj:** Precision (Ile wskazań było trafnych?) i Recall (Ile trafnych przypadków wykryliśmy?).
