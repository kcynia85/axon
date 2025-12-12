# 🛠️ Tech PRD: [Nazwa Ficzera]

## 1. 🎯 Strategic Discovery (DDD)

**Zanim dotkniesz klawiatury:**
Czym naprawdę jest ten ficzer w naszym systemie? Chcemy, aby był spójny i zgodny z zasadami domeny.

### Ubiquitous Language (Słownik)

| Termin Biznesowy | Odpowiednik w Kodzie | Definicja / Uwagi |
| --- | --- | --- |
| [Termin PL] | `[Termin ENG]` | [Definicja] |
| [Termin PL] | `[Termin ENG]` | [Definicja] |

### Invarianty (Nienaruszalne Reguły)

- [Reguła 1]
- [Reguła 2]
- Wszystkie operacje domenowe muszą być implementowane jako czyste funkcje (pure functions).

---

## 2. 🎯 Cel

Celem ficzera **[Nazwa Ficzera]** jest [krótki opis celu].

**Dlaczego to jest ważne:**
- [Powód 1]
- [Powód 2]
- [Powód 3]

---

## 3. 👤 User Stories

- Jako [Aktor], chcę [Akcja], aby [Rezultat].
- Jako [Aktor], chcę [Akcja], aby [Rezultat].
- Jako System, chcę [Walidacja], aby [Bezpieczeństwo/Spójność].

---

## 4. 🔹 Agregaty i Value Objects (DDD Narrative)

**Agregat: [Nazwa]**
- **Pola:** id, [pole 1], [pole 2], ...
- **Value Objects:**
  - **[Nazwa VO]:** [reguła walidacji]
  - **[Nazwa VO]:** [reguła walidacji]

**Zachowania domenowe (Domain Behaviors):**
- **[funkcja](args)** → [opis co robi i co zwraca]
- **[funkcja](args)** → [opis]

**Invarianty Agregatu:**
- [Reguła specyficzna dla tego obiektu]
- [Reguła specyficzna dla tego obiektu]

---

## 5. 🔹 Scenariusze użycia

### Przypadek główny (Happy Path):
1. Użytkownik...
2. System...
3. System...
4. Wynik...

### Edge cases (Błędy i wyjątki):
- [Sytuacja A] → komunikat „[Treść błędu]”.
- [Sytuacja B] → komunikat „[Treść błędu]”.

---

## 6. 🏗️ System Design & Scale

Decyzje architektoniczne (zapisz jako ADR jeśli kluczowe).

### Database Strategy (Data Tier)

<aside>
- **Primary Data (SQL):** [Tabele]
- **Flexible Data (JSONB/NoSQL):** [Czy potrzebne?]
- **Relacje (N+1 Risk):** [Ocena ryzyka]
</aside>

### Sync vs Async Decision

<aside>
🧠 **Reguła Kciuka (Rule of Thumb):**

Zadaj pytanie: **"Czy użytkownik musi czekać na wynik tej operacji, patrząc na kręcące się kółeczko?"**

- **TAK (Musi wiedzieć natychmiast):** Wybierz **Synchronous** (Request/Response).
  - Np. Logowanie, Dodanie do koszyka, Prosty CRUD.
- **NIE (Może dostać powiadomienie):** Wybierz **Asynchronous** (Background Job/Queue).
  - Np. Import danych, Generowanie AI, Raporty.
- **NIE WIEM (5-10s):**
  - Małe ryzyko błędu -> Sync (`useOptimistic`).
  - Duże ryzyko (AI/Integracje) -> Async Queue.
</aside>

### Caching Strategy

<aside>
**Dynamic (no-store):** [Dane zmienne]
**Cached (force-cache):** [Dane statyczne]
**Revalidated (ISR):** [Dane odświeżane co X]
</aside>

---

## 7. 🔹 Workflow / Proces systemowy

```text
Input → Step 1 → Step 2 → Step 3 → Output
```