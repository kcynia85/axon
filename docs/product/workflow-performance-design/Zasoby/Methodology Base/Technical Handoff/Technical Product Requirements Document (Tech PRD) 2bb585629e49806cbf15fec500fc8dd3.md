# Technical Product Requirements Document (Tech PRD)

### Kiedy pisać Tech PRD? (Matryca Decyzyjna)

<aside>

W inżynierii stosujemy podział na rozmiary (T-shirt sizing):

| Rozmiar Ficzera | Przykład | Dokumentacja (Tech PRD) |
| --- | --- | --- |
| **S (Small)** | Zmiana tekstu, dodanie pola w formularzu, poprawka UI. | **Brak / Ticket w Jira.** Wystarczy opis "Co zrobić". |
| **M (Medium)** | Nowy widok (Page), prosta integracja API, filtr na liście. | **"One-Pager".** Skrócona wersja Tech PRD (tylko cel i techniczny plan w punktach). |
| **L/XL (Large)** | Rejestracja, Koszyk, System Płatności, Algorytm. | **Pełny Tech PRD (DDD).** Tu wchodzi cała machina, którą zbudowaliśmy. |
</aside>

<aside>

```markdown
# 🛠️ Tech PRD: User Registration

<aside>
| Meta | Detale |
| --- | --- |
| **Status** | Draft / Ready |
| **Bounded Context** | Authentication |
| **Type** | Core |
| **Owner** | @Kamil |
| **Kontekst** | Tworzony przez PM lub analityka biznesowego z pomocą zespołu dev |
</aside>

---

## 1. 🎯 Strategic Discovery (DDD)

**Zanim dotkniesz klawiatury:**  
Czym naprawdę jest rejestracja użytkownika w naszym systemie? Chcemy, aby była bezpieczna, spójna i zgodna z zasadami domeny.  

### Ubiquitous Language (Słownik)

| Termin Biznesowy | Odpowiednik w Kodzie | Definicja / Uwagi |
| --- | --- | --- |
| Użytkownik | User | Osoba tworząca konto w systemie. Nie mylić z klientem w e-commerce. |
| Zarejestruj | registerUser | Operacja tworzenia nowego konta. |
| Aktywuj konto | activateUser | Potwierdzenie konta przez email. |
| Hasło | Password | Must meet security rules (min 8 chars, hashed with argon2). |
| Email | Email | Musi być unikalny i w poprawnym formacie. |

### Invarianty (Nienaruszalne Reguły)

- Email użytkownika musi być unikalny.  
- Hasło musi mieć minimum 8 znaków i być bezpiecznie haszowane.  
- Konto nie może być aktywne przed potwierdzeniem emailowym.  
- Wszystkie operacje domenowe muszą być implementowane jako czyste funkcje (pure functions).

---

## 2. 🎯 Cel

Celem ficzera **User Registration** jest umożliwienie nowym użytkownikom tworzenia konta w systemie w sposób bezpieczny i intuicyjny. System musi zapewnić walidację danych, bezpieczeństwo haseł oraz aktywację konta poprzez email.  

**Dlaczego to jest ważne:**  
- Umożliwia legalne i bezpieczne korzystanie z platformy.  
- Minimalizuje ryzyko nieprawidłowych danych i problemów z bezpieczeństwem.  
- Tworzy podstawę do dalszych funkcjonalności (logowanie, profile użytkowników, subskrypcje).

---

## 3. 👤 User Stories

- Jako nowy użytkownik, chcę podać email i hasło, aby zarejestrować konto w systemie.  
- Jako nowy użytkownik, chcę opcjonalnie podać imię i nazwisko, aby móc spersonalizować swoje konto.  
- Jako system, chcę weryfikować poprawność email i długość hasła, aby zapewnić bezpieczeństwo i spójność danych.  
- Jako system, chcę wysłać email aktywacyjny, aby użytkownik potwierdził swoją tożsamość.  

---

## 4. 🔹 Agregaty i Value Objects (DDD Narrative)

**Agregat: User**  
- **Pola:** id, email, password_hash, name (opcjonalne), is_active  
- **Value Objects:**  
  - **Email:** musi być w poprawnym formacie i unikalny  
  - **Password:** min. 8 znaków, haszowane algorytmem argon2  

**Zachowania domenowe (Domain Behaviors):**  
- **registerUser(email, password, name)** → tworzy nowego użytkownika i wysyła email aktywacyjny  
- **activateUser(userId, token)** → aktywuje konto po kliknięciu w link  
- **validateEmail(email)** → sprawdza poprawność email  
- **hashPassword(password)** → haszuje hasło i przechowuje w bezpieczny sposób  

**Invarianty:**  
- Email musi być unikalny i poprawny  
- Hasło musi spełniać wymagania długości i bezpieczeństwa  
- Konto nieaktywne do momentu potwierdzenia mailowego  

---

## 5. 🔹 Scenariusze użycia

### Przypadek główny:
1. Użytkownik otwiera formularz rejestracji.  
2. Wprowadza email, hasło i opcjonalnie imię/nazwisko.  
3. System weryfikuje poprawność danych.  
4. System zapisuje dane w bazie i haszuje hasło algorytmem argon2.  
5. System wysyła email aktywacyjny z linkiem.  
6. Użytkownik klika link aktywacyjny → konto zostaje aktywowane.

### Edge cases:
- Email już istnieje → komunikat „Email zajęty”.  
- Hasło krótsze niż 8 znaków → komunikat „Hasło za krótkie”.  
- Nieprawidłowy format email → komunikat „Nieprawidłowy email”.  
- Kliknięcie nieaktywnym lub przeterminowanym linkiem → komunikat „Link wygasł, wyślij nowy”.

---

## 6. 🏗️ System Design & Scale

Decyzje architektoniczne (zapisz jako ADR jeśli kluczowe).

### Database Strategy (Data Tier)

<aside>
- **Primary Data (SQL):** Users  
- **Flexible Data (JSONB/NoSQL):** niepotrzebne w tym ficzerze  
- **Relacje (N+1 Risk):** brak ryzykownych pętli, prosty insert/select
</aside>

### Sync vs Async Decision

<aside>
Czy operacja trwa dłużej niż 2-3 sekundy?

- **Synchronous (Server Action):** walidacja danych, zapis do bazy  
- **Asynchronous (Queue/Worker):** wysyłka emaila aktywacyjnego
</aside>

### Caching Strategy

<aside>
**Dynamic (no-store):** dane osobowe  
**Cached (force-cache):** brak  
**Revalidated (ISR):** brak
</aside>

---

## 7. 🔹 Workflow / Proces systemowy

```text
User Input → Validate Email & Password → Hash Password → Save to DB 
→ Send Activation Email → Await Activation → Account Active

```

```markdown
## 8. 🔹 Baza danych / Struktura danych

**Tabela Users:**

- `id` (UUID)  
- `email` (unique)  
- `password_hash`  
- `name` (optional)  
- `is_active` (boolean)  

---

## 9. ⚙️ Uwagi techniczne dla devów

- **Architektura:** Modular Monolith (Next.js)  
- **State:** funkcjonalny, immutable, brak klas  
- **Walidacja:** Zod strict (fail fast)  
- **Hasła:** argon2  
- **Asynchroniczne operacje:** wysyłka email aktywacyjnego  
- **Nazwy funkcji:** powinny odzwierciedlać **Ubiquitous Language**  

---

## 10. 💡 Dodatkowe uwagi

- Dokument służy **stakeholderom do zatwierdzenia**, a devom do zrozumienia wymagań funkcjonalnych i struktury domeny.  
- Każda reguła biznesowa musi być wymuszona w systemie (invariants).  
- Ten PRD może być później przekształcony w **PRP**, które jest atomiczne i gotowe do użycia przez LLM.
```

</aside>