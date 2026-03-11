# Plan Implementacji: Modal "Internal Skills" (Custom Functions)

## 1. Analiza UX / UI (na podstawie makiety FigJam)

Z przesłanego ekranu wynika, że docelowy interfejs to Modal (Okno Dialogowe) służący do przeszukiwania i dodawania "Custom Functions" (Umiejętności Wewnętrznych).

**Struktura wizualna Modala:**
1. **Header (Nagłówek):** 
   - Tytuł: "Wybierz Umiejętność (Internal Skills)"
   - Akcja zamknięcia: "Zamknij" (zwykle ikona `X` lub przycisk).
2. **Top Bar (Narzędzia wyszukiwania i filtrowania):**
   - **Search Bar:** Pełnowymiarowe pole wyszukiwania po nazwie lub opisie.
   - **Filters:** Komponent filtrowania (kategorie, np. "Sprzedaż", "Prawne", "AI Utils").
3. **Lista dostępnych umiejętności (Skills List):**
   - Prezentacja w formie pionowej listy wierszy/kart. 
   - **Składowe pojedynczego wiersza:**
     - **Tytuł:** Nazwa funkcji (np. `lead_scoring`, `validate_pesel`).
     - **Opis:** Skrócony tekst wyjaśniający działanie (np. "Oblicza potencjał leada na podstawie...").
     - **Kategoria:** Informacja o typie funkcji (np. "Kategoria: Sprzedaż").
     - **Akcja:** Przycisk główny `+ Dodaj Funkcje` do powiązania elementu z formularzem.

**Trigger (Przycisk otwierający):** 
Przerywany obszar (dashed area) wielkości obecnych elementów formularza (np. `FormCheckbox`) pełniący rolę akcji `+ Add`. Kliknięcie w niego otwiera modal.

---

## 2. Architektura i zgodność ze standardami

Implementacja opiera się na zasadach projektowych zdefiniowanych w `00_coding_standards.md` oraz `stack_react_nextjs.md`:
- **Pure View principle:** Komponenty UI służą tylko do renderowania, logika wyciągnięta do hooków (`useInternalSkillsModal`).
- **Zero useEffect:** Zmiany stanu (otwarcie modala, dodanie skilla, wyszukiwanie) obsługiwane wyłącznie przez event handlery. Brak synchronizacji poprzez useEffect.
- **Functional-first & Immutability:** Użycie niemutowalnych metod na tablicach przy zaznaczaniu funkcji. Typowanie ścisłe.
- **Wykorzystanie istniejących komponentów:** Integracja gotowych komponentów formularza i UI (np. `Dialog` z Radix UI, `SearchInput`, `FilterBigMenu`).

---

## 3. Checklista Implementacji

- [x] **Krok 1: Aktualizacja modelu danych (Constants)**
  - [x] Rozszerzyć obiekty w `CUSTOM_FUNCTIONS` (w pliku `agent-studio.constants.ts` lub podobnym) o pole `category` (np. "Sprzedaż", "Prawne", "AI Utils", "Internal").
  - [x] Upewnić się, że typy (interfaces/types) poprawnie uwzględniają nowe pole.

- [x] **Krok 2: Przygotowanie komponentu Add Trigger (Dashed Button)**
  - [x] Stworzyć przycisk z w klasach Tailwind `border-dashed`, `border-2`, mający wymiary i paddingi identyczne jak `FormCheckbox`.
  - [x] Osadzić przycisk na dole sekcji "Custom Functions" w pliku `SkillsSection.tsx`.

- [x] **Krok 3: Budowa komponentu `InternalSkillsModal` (UI)**
  - [x] Stworzyć plik `InternalSkillsModal.tsx` w warstwie prezentacji funkcji Agent Studio.
  - [x] Wykorzystać `Dialog` (Radix UI) do osadzenia struktury modala.
  - [x] Dodać nagłówek z tytułem "Wybierz Umiejętność (Internal Skills)".
  - [x] Osadzić wbudowany komponent `SearchInput` oraz podpiąć stan lokalny wyszukiwarki.
  - [x] Osadzić wbudowany komponent filtrów (np. `FilterBigMenu` lub uproszczony `FilterBar`) i zasilić go listą unikalnych kategorii z `CUSTOM_FUNCTIONS`.
  - [x] Zaprojektować i zakodować wygląd pojedynczego wiersza umiejętności (Tytuł, opis, kategoria, przycisk `+ Dodaj Funkcje`).
  - [x] Zapewnić obsługę ScrollArea dla długich list wyników.

- [x] **Krok 4: Logika Modala (Custom Hook `useInternalSkillsModal`)**
  - [x] Stworzyć hook zarządzający stanem modala (wyszukiwana fraza, zaznaczone filtry kategorii).
  - [x] Zaimplementować funkcję filtrującą `CUSTOM_FUNCTIONS` na podstawie frazy (search) i wybranych kategorii (filters).
  - [x] Hook powinien eksponować wyliczoną tablicę `filteredFunctions`.

- [x] **Krok 5: Integracja Modala z sekcją `SkillsSection.tsx`**
  - [x] Wstrzyknąć stan `isOpen` i `setIsOpen` na poziomie `SkillsSection.tsx` (lub lokalnym komponencie owijającym modal i trigger).
  - [x] Opiąć przycisk "Dodaj Funkcje" wewnątrz modala handlerem wywołującym modyfikację stanu RHF (`field.onChange`), dodaniem ID do formularza oraz wywołaniem `syncDraft()`.
  - [x] Dodać logikę w modalu uniemożliwiającą dodanie (lub zmieniającą stan na "Dodano") tych funkcji, które są już obecne w `field.value`.

- [x] **Krok 6: Testy i weryfikacja (QA)**
  - [x] Zweryfikować renderowanie (Dark/Light mode).
  - [x] Sprawdzić czy responsywność modala (Scroll) działa prawidłowo przy wielu funkcjach.
  - [x] Przetestować przepływ dodawania funkcji -> poprawne odzwierciedlenie na liście zaznaczonych funkcji w widoku formularza -> poprawne zamknięcie modala (jeśli taki będzie docelowy UX, alternatywnie modal może nie zamykać się od razu).

