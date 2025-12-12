# IA Audit & Content Inventory Protocol

> **Cel:** Zrozumienie "co my tu mamy" i "czy to ma sens".
> **Output:** Arkusz Content Inventory + Raport ROT.

---

## 📋 1. Content Inventory (Inwentaryzacja)

Zanim zaczniesz projektować nową strukturę, musisz wiedzieć, co masz w starej.

### Narzędzia:
*   **Screaming Frog SEO Spider:** Do wyciągnięcia wszystkich URLi.
*   **Google Sheets / Airtable:** Do analizy.

### Atrybuty do zebrania (Kolumny w Arkuszu):
1.  **ID:** Unikalny numer (np. 1.0, 1.1).
2.  **Page Title:** Tytuł strony.
3.  **URL:** Adres.
4.  **Content Type:** (Artykuł, Produkt, Landing Page, PDF).
5.  **Topic/Tag:** O czym to jest?
6.  **Owner:** Kto za to odpowiada?
7.  **ROT Score:** (Keep, Update, Delete).

---

## 🗑️ 2. Analiza ROT (Keep / Kill)

Każdy URL oceń wg kryteriów ROT:
*   **R (Redundant):** Nadmiarowe. Czy mamy 3 artykuły o tym samym? -> **Consolidate**.
*   **O (Outdated):** Przestarzałe. Czy to news z 2018 roku? -> **Update** lub **Archive**.
*   **T (Trivial):** Banalne. Czy to strona, która ma 5 wyświetleń rocznie i nic nie wnosi? -> **Delete**.

<details>
<summary>🤖 <b>Prompt: Analiza ROT dla listy URLi</b></summary>

> "Mam listę tytułów podstron ze sklepu/bloga. Przeanalizuj je pod kątem ROT (Redundant, Outdated, Trivial).
> Wskaż grupy tematów, które się powtarzają i można je połączyć w jeden duży 'Pillar Page'.
> Zidentyfikuj tematy, które brzmią na nieaktualne (np. daty sprzed 2 lat, stare technologie)."
</details>

---

## 🔍 3. Audyt Jakościowy (Heurystyki IA)

Przejdź przez kluczowe ścieżki i sprawdź:

### Lista Kontrolna (Audit Checklist):
- [ ] **Etykiety:** Czy są spójne? (Nie mieszaj pytań "Jak kupić?" z rzeczownikami "Oferta").
- [ ] **Głębokość:** Czy dotarcie do treści wymaga >3 kliknięć?
- [ ] **Polihierarchia:** Czy ten sam produkt jest w logicznych kategoriach? (np. "Pomidor" w Warzywach i Owoce?).
- [ ] **Nagłówki:** Czy H1/H2 jasno opisują sekcję?
- [ ] **Nawigacja:** Czy widać "Gdzie jestem"? (Breadcrumbs, Active State w menu).

---

## 🧪 4. Tree Testing (Walidacja Struktury)

Nie zgaduj. Sprawdź.

### Kiedy robić?
*   Przed kodowaniem (na etapie Excela/Miro).
*   Przy redesignie menu.

### Metryki Sukcesu:
1.  **Success Rate:** % użytkowników, którzy trafili do dobrej kategorii.
2.  **Directness:** % użytkowników, którzy nie cofali się w menu.
3.  **Time on Task:** Czas znalezienia.

👉 **Szczegóły w pliku:** `Navigation_Testing_SOP.md` (w folderze Design).
