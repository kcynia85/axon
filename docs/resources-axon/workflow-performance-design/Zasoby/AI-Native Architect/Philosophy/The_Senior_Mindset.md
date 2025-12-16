# The Senior Mindset (Philosophy of Engineering)

> **Context:** To, co odróżnia Seniora od Mid-a, to podejście do problemów, a nie tylko znajomość kodu.
> **Motto:** "Code is a liability, not an asset."

---

## 1. "Boring Technology" (Nudna Technologia)

**Zasada:** Innowacyjność ("Innovation Tokens") wydajemy tam, gdzie daje przewagę biznesową (AI), a nie na infrastrukturę.

*   **Praktyka:** Wybieramy sprawdzonego Postgresa (z wtyczką `pgvector`) zamiast eksperymentalnej bazy wektorowej w wersji alpha v0.1.
*   **Dlaczego:** Stabilna baza pozwala skupić się na niestabilnych modelach AI. Nie chcesz walczyć na dwóch frontach (Bugi bazy + Halucynacje AI).

---

## 2. Testing Trophy (Integration > Unit)

**Ewolucja:** Klasyczna piramida testów (dużo Unit, mało E2E) odchodzi do lamusa w erze Generative AI.

*   **Unit Tests:** AI pisze je świetnie i szybko. Są tanie, ale nie sprawdzają czy system działa jako całość.
*   **Integration Tests (The Trophy):** Tu skupia się Senior. Sprawdzamy, czy klocki wygenerowane przez AI pasują do siebie. Czy Agent A poprawnie przekazuje dane do Agenta B?
*   **Rola:** Senior pisze scenariusze integracyjne, AI wypełnia implementację unitów.

---

## 3. YAGNI (You Aren't Gonna Need It) - AI Edition

**Paradoks:** AI generuje kod tak łatwo, że łatwo o "Over-engineering" i dodawanie zbędnych abstrakcji ("na wszelki wypadek").

*   **Rola Architekta:** Bycie "Reduktorem". Aktywne usuwanie kodu.
*   **Prawda:** W świecie, gdzie kod jest darmowy, jego *utrzymanie* jest kosztem. Senior optymalizuje pod kątem łatwości usuwania kodu (deletability), a nie jego tworzenia.
*   **Zasada:** Lepszy jeden prosty plik 500 linii niż 20 plików po 20 linii z abstrakcyjnymi interfejsami, których nikt nie rozumie.

---

## 4. Mechanical Sympathy (Mechaniczna Empatia)

**Definicja:** Rozumienie, jak działa narzędzie "pod maską".

*   **W erze AI:** Rozumienie natury LLM. Senior wie, że LLM to nie "mózg", tylko "autouzupełnianie statystyczne".
*   **Implikacja w kodzie:**
    *   ❌ Nie proś AI o "obliczenie sumy faktury" (LLM słabo liczy).
    *   ✅ Poproś AI o "wygenerowanie kodu SQL/Python, który policzy sumę".
*   **Podział ról:** Używamy AI do **orkiestracji i kreatywności**, a deterministycznego kodu do **egzekucji i obliczeń**.

---

## 5. Dual Write Awareness (Świadomość Niespójności)

**Marker Seniora:** Rozumienie, że nie można po prostu zrobić `saveToDb()` i `publishToQueue()` w jednej funkcji bez zabezpieczeń.

*   **Problem:** AI często generuje taki naiwny kod. "Najpierw zapiszę, potem wyślę email". A co jak email rzuci błędem? Cofamy bazę? A co jak baza padnie po wysłaniu emaila?
*   **Rozwiązanie:** Wymuszanie wzorców takich jak **Transactional Outbox**. Senior widzi te problemy, zanim one wystąpią na produkcji. Model językowy uczył się na tutorialach (Happy Path), a nie na awariach produkcyjnych (Reality).
