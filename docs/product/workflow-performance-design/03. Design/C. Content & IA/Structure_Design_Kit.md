---
template_type: crew
target_workspace: Design
---

# Structure Design Kit (Action-First)

> **Cel:** Zaprojektowanie "kręgosłupa" serwisu, który wytrzyma skalowanie.
> **Output:** Sitemap (Drzewo Kategorii) + Logika Filtrowania.

---

## 🌳 Krok 1: Wybór Modelu Struktury (Decision Framework)

Wybierz właściwy schemat dla Twojego projektu:

| Typ Projektu | Rekomendowany Schemat | Dlaczego? |
| --- | --- | --- |
| **E-commerce (Duży)** | **Hierarchiczny + Fasetowy** | Katalog drzewiasty (Kategorie) + Filtry (Cena, Marka). |
| **SaaS / Web App** | **Zadaniowy (Task-Based)** | Menu to czynności: "Utwórz projekt", "Raporty", "Ustawienia". |
| **Blog / News** | **Tematyczny + Czasowy** | Kategorie (Sport, Tech) + Archiwum dat. |
| **Mała Wizytówka** | **Płaski (Flat)** | Wszystko dostępne z poziomu 1-2 kliknięć. |

---

## 🏗️ Krok 2: Drzewo Kategorii (Draft)

Nie rysuj od razu. Wypisz w liście punktowanej.
Zasada: **Szeroko i płytko** > Wąsko i głęboko.

<details>
<summary>🤖 <b>Prompt: Generowanie Struktury (E-commerce)</b></summary>

> "Jestem sklepem z [Branża, np. Elektronika]. Mam asortyment: [Wymień 5-10 głównych produktów].
> Stwórz propozycję Drzewa Kategorii (3 poziomy zagłębienia).
> 1. Główne Kategorie (L1) - max 7.
> 2. Podkategorie (L2).
> 3. Atrybuty do filtrowania (Fasety) dla każdej głównej kategorii (np. Rozmiar, Moc, Kolor).
>
> Zadbaj o SEO friendly URL slugs (np. /laptopy-gamingowe)."
</details>

---

## 🧬 Krok 3: Model Danych (Technical Handoff)

Architektura Informacji musi być zrozumiała dla Developera i Bazy Danych.
Jeśli używasz **Next.js / SQL**, zdefiniuj relacje.

### Wzorzec: Relacja Produkt-Kategoria (Prisma Schema)
Kopiuj do `schema.prisma` lub dokumentacji technicznej.

```prisma
// Model: Produkt może mieć jedną markę, jedną główną kategorię, ale wiele tagów.
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  slug        String   @unique // SEO URL
  price       Float
  
  // Relacje
  category    Category @relation(fields: [categoryId], references: [id])
  categoryId  Int
  
  brand       Brand    @relation(fields: [brandId], references: [id])
  brandId     Int
  
  tags        Tag[]    // Relacja wiele-do-wielu dla elastyczności
  
  attributes  Json?    // Elastyczne atrybuty (np. Rozmiar: XL, Kolor: Red)
}

model Category {
  id        Int       @id @default(autoincrement())
  name      String
  parentId  Int?      // Obsługa podkategorii (Drzewo)
  products  Product[]
}
```

---

## 🕷️ Krok 4: SEO & URL Structure

Zaprojektuj strukturę linków. To jest Twoja "mapa drogowa" dla Google.

*   **Zła struktura:** `sklep.pl/p/12345`
*   **Dobra struktura:** `sklep.pl/kategoria/podkategoria/nazwa-produktu-id`

**Checklista SEO:**
- [ ] Słowa kluczowe w URL (np. `/buty-biegowe` zamiast `/obuwie-sportowe-kat1`).
- [ ] Płaska struktura (im bliżej domeny głównej, tym lepiej).
- [ ] Canonical Tags (dla filtrów, żeby nie duplikować treści `?kolor=czerwony`).

---

## 🧪 Krok 5: Walidacja (Tree Testing)
*Czy to w ogóle działa?*

Zanim wdrożysz, zrób **Paper Prototype Test**.
1.  Wypisz strukturę na kartce.
2.  Daj zadanie znajomemu: *"Znajdź bezprzewodowe słuchawki douszne do 200 zł"*.
3.  Patrz, gdzie szuka. Jeśli błądzi > Zmień etykiety.

👉 **[Przejdź do Navigation Testing SOP](Navigation_Testing_SOP.md)** po pełną procedurę.
