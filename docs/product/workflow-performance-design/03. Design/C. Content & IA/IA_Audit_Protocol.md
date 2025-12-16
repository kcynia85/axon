# IA Audit & Design Protocol (Action-First)

> **Cel:** Diagnostyka i naprawa struktury informacji na stronie.
> **Standard:** [IA Fundamentals](../../Zasoby/UX%20Design%20Patterns/Information%20Architecture/IA_Fundamentals.md)

---

## 🧹 Krok 1: Inwentaryzacja i ROT Analysis
*Zanim dodasz nowe, posprzątaj stare.*

- [ ] **Pobierz URLe:** Użyj *Screaming Frog* lub wyeksportuj mapę strony.
- [ ] **Utwórz Arkusz:** Kolumny: `URL`, `Tytuł`, `Kategoria`, `Status`.
- [ ] **Ocena ROT (Keep/Kill):** Oznacz każdą stronę.
    - [ ] **Redundant (Nadmiarowe):** Czy mamy to 2 razy? -> *Połącz*.
    - [ ] **Outdated (Przestarzałe):** Stare dane? -> *Aktualizuj/Archiwizuj*.
    - [ ] **Trivial (Banalne):** Nikogo to nie obchodzi? -> *Usuń*.

<details>
<summary>🤖 <b>Prompt: Analiza ROT</b></summary>

> "Mam listę tytułów podstron. Przeanalizuj je pod kątem duplikatów i potencjalnie przestarzałych treści.
> Wskaż kandydatów do usunięcia lub połączenia (Consolidation).
> Cel: Odchudzenie serwisu o 30%."
</details>

👉 **Więcej teorii:** [IA Audit Resource](../../Zasoby/UX%20Design%20Patterns/Information%20Architecture/IA_Audit_Protocol_Resource.md)

---

## 🏗️ Krok 2: Projektowanie Struktury (Tree Design)
*Układamy klocki na nowo.*

- [ ] **Wybierz Schemat:**
    - [ ] **Tematyczny** (E-commerce standard).
    - [ ] **Zadaniowy** (Aplikacje/Usługi).
    - [ ] **Odbiorcy** (B2B/B2C osobno).
    - *Potrzebujesz pomocy?* Sprawdź [Organization Schemes](../../Zasoby/UX%20Design%20Patterns/Information%20Architecture/Organization_Schemes.md).

- [ ] **Draft Drzewa:** Wypisz główne kategorie (L1) i podkategorie (L2).
- [ ] **Test Głębokosci:** Max 3 kliknięcia do produktu?

<details>
<summary>🤖 <b>Prompt: Generowanie Drzewa Kategorii</b></summary>

> "Działasz jako Architekt Informacji.
> Dla sklepu z branży [Branża] stwórz propozycję drzewa kategorii (3 poziomy).
> Wykorzystaj schemat hybrydowy (Tematyczny w menu + Zadaniowy w profilu).
> Zadbaj o jasne, unikalne etykiety (Labels)."
</details>

---

## 🏷️ Krok 3: Taksonomia i Etykiety
*Jak to nazwać, żeby ludzie zrozumieli?*

- [ ] **Język Użytkownika:** Czy używamy słów z Search Logs? (np. "Komórka" vs "Telefon mobilny").
- [ ] **Spójność:** Czy w menu są same rzeczowniki? (Unikaj mieszania z pytaniami "Jak kupić?").
- [ ] **Definicja Tagów:** Jakie atrybuty (Fasety) będą służyć do filtrowania? (Kolor, Rozmiar, Cena).

👉 **Tech-Check:** [Prisma Schema & Taxonomy Guide](../../Zasoby/UX%20Design%20Patterns/Information%20Architecture/Taxonomy_Guide.md)

---

## 🧪 Krok 4: Walidacja (Tree Testing)
*Sprawdzam, czy to działa.*

- [ ] **Przygotuj 3 zadania:** Np. "Znajdź politykę zwrotów".
- [ ] **Test Korytarzowy:** Pokaż drzewo 3 osobom.
- [ ] **Analiza:** Czy trafili za 1. razem? (First Click Testing).

👉 **Pełna procedura:** [Navigation Testing SOP](Navigation_Testing_SOP.md)
