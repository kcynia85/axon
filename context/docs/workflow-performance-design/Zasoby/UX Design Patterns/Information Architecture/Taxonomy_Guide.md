# Taxonomy & Metadata Guide

> **Taksonomia:** To nie tylko "kategorie". To język, którym system "rozmawia" z użytkownikiem i bazą danych.

---

## 🏷️ 1. Co to jest Taksonomia?
Taksonomia to hierarchiczna struktura pojęć (kontrolowany słownik) używana do klasyfikacji treści.
*   **Struktura IA:** To mapa dla użytkownika (Menu).
*   **Taksonomia:** To mapa dla systemu (Tagi, Metadane, Relacje w bazie).

### Korzyści:
1.  **Wyszukiwalność:** Łączy synonimy (np. "Adidasy" = "Buty sportowe").
2.  **Powiązania:** Pozwala wyświetlić "Podobne produkty" (Relacja: Ta sama kategoria + Ten sam kolor).
3.  **Nawigacja Fasetowa:** Filtrowanie po wielu atrybutach naraz.

---

## 🛠️ 2. Tworzenie Taksonomii (Proces)

### Krok 1: Identyfikacja Pojęć (Harvesting)
Zbierz wszystkie terminy z:
*   Treści strony.
*   Zapytań w wyszukiwarce (Search Logs).
*   Rozmów z ekspertami.
*   Konkurencji.

### Krok 2: Ustalenie Hierarchii
*   Co jest kategorią nadrzędną (Parent)?
*   Co jest podkategorią (Child)?
*   Co jest tylko atrybutem (np. Kolor)?

### Krok 3: Kontrolowany Słownik (Preferred Terms)
Ustal, jak nazywamy rzeczy oficjalnie.
*   *Termin preferowany:* "Telefon komórkowy".
*   *Synonimy (Variant terms):* "Komórka", "Smartfon", "Fon".
*   *Zastosowanie:* Gdy user wpisze "Komórka", system szuka w "Telefon komórkowy".

---

## 🧬 3. Technical Implementation (Prisma / SQL)

Jak przenieść taksonomię na kod (Next.js/Prisma)?

```prisma
// 1. KATEGORIE (Hierarchiczne)
model Category {
  id        Int        @id @default(autoincrement())
  name      String     @unique
  slug      String     @unique
  parentId  Int?       // Relacja do samej siebie (Drzewo)
  parent    Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryHierarchy")
  products  Product[]
}

// 2. TAGI (Płaskie, Wiele-do-Wielu)
model Tag {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  products Product[]
}

// 3. ATRYBUTY (Fasety - JSON lub EAV)
// Wariant prosty (JSON w Postgresie)
model Product {
  // ... pola standardowe ...
  attributes Json?  // { "color": "red", "size": "XL", "material": "cotton" }
}
```

### Dynamiczne Filtrowanie (API Logic)
Budując API (np. w Next.js), filtry buduj dynamicznie na podstawie taksonomii, a nie "na sztywno" w kodzie.

---

## 🛡️ 4. Utrzymanie (Governance)
Taksonomia żyje.
*   **Przegląd roczny:** Czy pojawiły się nowe kategorie produktów?
*   **Analiza "Zero Results":** Czego ludzie szukają, a my nie mamy na to kategorii?
*   **Synonimy:** Dodawaj nowe potoczne określenia do słownika synonimów.
