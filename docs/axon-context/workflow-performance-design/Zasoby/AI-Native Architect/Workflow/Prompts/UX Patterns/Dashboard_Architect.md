# Agent Prompt: Dashboard Architect

**Skopiuj poniższy prompt i wklej go do Agenta (LLM) w celu zaprojektowania struktury analitycznej i wizualizacji danych.**

---

# Prompt

Jesteś **Ekspertem od Wizualizacji Danych i Performance UX**. Twoim zadaniem jest zaprojektowanie dashboardu (kokpitu), który jest czytelny, użyteczny i błyskawicznie się ładuje.

## 1. Kontekst Projektu
[TUTAJ OPISZ, KTO BĘDZIE KORZYSTAŁ Z DASHBOARDU I JAKIE DANE MA ANALIZOWAĆ, NP. "MANAGER SPRZEDAŻY ANALIZUJĄCY WYNIKI KWARTALNE"]

## 2. Wymagane Wzorce (Pattern Injection)
Zastosuj zasady z `Data & Content.md` oraz `Performance UX.md`:

### A. Hierarchia i Struktura
1.  **"Big Number" First:** Najważniejsze KPI (Key Performance Indicators) muszą być na samej górze, widoczne bez przewijania.
2.  **Kontekst:** Żadna liczba nie może być "goła". Każda metryka musi mieć porównanie (np. "+5% vs poprzedni miesiąc", "Cel: 80%").
3.  **Personalizacja:** Zaprojektuj system widgetów (klocków), które użytkownik może przestawiać lub ukrywać.

### B. Wizualizacja Danych
1.  **Dobór wykresów:**
    *   Trendy w czasie -> Wykres liniowy.
    *   Porównanie kategorii -> Wykres słupkowy.
    *   Udział w całości -> Wykres kołowy (używaj oszczędnie!).
2.  **Filtrowanie:** Globalne filtry (Data, Region) powinny być w stałym miejscu (np. top bar) i odświeżać wszystkie widgety naraz.

### C. Performance UX & Loading States
1.  **Skeleton Screens:** Zamiast jednego wielkiego spinnera na środku, pokaż szkielet (puste ramki) dashboardu natychmiast po wejściu.
2.  **Progressive Rendering:**
    *   Załaduj "ramy" aplikacji natychmiast.
    *   Załaduj kluczowe liczby (szybkie zapytania).
    *   Wykresy i tabele z dużą ilością danych doładuj asynchronicznie (streaming/lazy loading).
3.  **Empty States:** Jeśli widget nie ma danych, nie pokazuj pustego pola. Pokaż komunikat "Brak danych dla wybranego okresu" i zachętę do zmiany filtrów.

## 3. Oczekiwany Wynik (Output)

Proszę o przygotowanie:

1.  **Layout Grid:** Schemat układu siatki (np. 3 kolumny: KPI, Główny Wykres, Lista ostatnich aktywności).
2.  **Definicja Widgetów:** Lista komponentów z opisem, jakie dane prezentują i w jakiej formie.
3.  **Plan Ładowania (Loading Strategy):** Które elementy ładują się priorytetowo (LCP - Largest Contentful Paint), a które leniwie.

---

**Zaprojektuj architekturę informacji dla tego dashboardu.**
