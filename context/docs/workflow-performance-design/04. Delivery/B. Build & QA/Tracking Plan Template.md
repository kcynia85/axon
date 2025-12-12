# Tracking Plan Template

> **Cel:** Ustanowienie "Single Source of Truth" dla analityki. Dokument dla Product Ownera i Developerów.
> **Standard:** Zgodny z zasadami [Data Quality & Governance](../../../Raw/Product-analytics/Product%20Analytics/Data%20Quality%20&%20Governance%201b3585629e49801fbd24c21639d9c60b.md).

---

## 1. Zasady Nazewnictwa (Naming Convention)
Aby zachować porządek w danych, stosujemy rygorystyczne zasady:
*   **Format:** `object_action` (Rzeczownik + Czasownik przeszły dokonany).
*   **Styl:** `snake_case` (małe litery, podkreślniki).
*   **Język:** Angielski (zawsze!).

**Przykłady:**
*   ✅ `button_clicked`, `account_created`, `checkout_completed`
*   ❌ `Click Button`, `UserSignUp`, `zlozone_zamowienie`

---

## 2. Tracking Sheet (Tabela Zdarzeń)

| Event Name | Trigger Description (Kiedy?) | Event Properties (Co przesyłamy?) | Priority | Status |
| :--- | :--- | :--- | :--- | :--- |
| `account_created` | Użytkownik pomyślnie wypełnił formularz rejestracji i kliknął "Załóż konto". | `method` (email/google/facebook), `source` (landing_page/invitation) | P0 (Must) | ⏳ To Do |
| `product_viewed` | Użytkownik wyświetlił stronę szczegółów produktu (PDP). | `product_id`, `product_name`, `category`, `price`, `stock_status` | P1 | ⏳ To Do |
| `add_to_cart_clicked` | Użytkownik kliknął przycisk "Dodaj do koszyka". | `product_id`, `quantity`, `price`, `cart_value_after` | P0 (Must) | ⏳ To Do |
| `checkout_started` | Użytkownik przeszedł do pierwszego kroku w koszyku. | `cart_value`, `total_items` | P1 | ⏳ To Do |
| `purchase_completed` | Wyświetlono ekran podziękowania (Success Page). | `order_id`, `revenue`, `tax`, `shipping`, `coupon_code` | P0 (Must) | ⏳ To Do |

---

## 3. User Identification (User Traits)
Dane o użytkowniku przesyłane raz (przy logowaniu/zmianie), a nie przy każdym zdarzeniu.

**Metoda:** `identify(user_id, traits)`

| Trait Name | Opis / Wartości | Przykład |
| :--- | :--- | :--- |
| `user_id` | Unikalne ID z bazy danych (niezmienne). | `"507f1f77bcf86cd799439011"` |
| `email` | Adres email. | `"jan@example.com"` |
| `plan_type` | Typ subskrypcji. | `"free"`, `"pro"`, `"enterprise"` |
| `created_at` | Data rejestracji (ISO 8601). | `"2025-10-25T14:30:00Z"` |
| `is_admin` | Czy ma uprawnienia administratora? | `true` / `false` |

---

## 4. QA Checklist (Dla Developera/QA)
Przed wdrożeniem na produkcję sprawdź:

*   [ ] **No Duplicates:** Czy zdarzenie `purchase_completed` nie odpala się 2 razy przy odświeżeniu strony?
*   [ ] **Data Types:** Czy `price` to liczba (`19.99`), a nie string (`"19.99"`)?
*   [ ] **Timing:** Czy zdarzenie wysyła się *po* walidacji formularza, a nie *przed* (przy błędzie walidacji nie chcemy eventu `account_created`)?
*   [ ] **Payload Size:** Czy nie przesyłamy zbędnych, gigantycznych obiektów JSON w properties?
*   [ ] **Privacy:** Czy NIE przesyłamy haseł ani danych karty kredytowej w properties?

---

### Narzędzia Debugowania
*   **Przeglądarka:** Network Tab -> Filtruj po nazwie narzędzia (np. "segment", "mixpanel", "ga4").
*   **Wtyczki:** Segment Inspector, Google Analytics Debugger.
