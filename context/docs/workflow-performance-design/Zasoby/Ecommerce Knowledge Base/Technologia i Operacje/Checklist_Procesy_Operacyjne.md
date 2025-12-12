# Checklist: Procesy Operacyjne E-commerce (Action-First)

> **Cel:** Uporządkowanie rutynowych działań w e-commerce. Oparte na analizie procesów: Obsługa Klienta, Zarządzanie Produktem, Zarządzanie Sprzedażą.

---

## 📦 Zarządzanie Produktem (PIM & Stock)

### 🆕 Dodawanie Nowego Produktu (New Arrival)
- [ ] **Dane Podstawowe:** Nazwa, SKU, EAN, VAT, Kategoria.
- [ ] **Media:** Zdjęcia (Packshot, Lifestyle), Wideo.
- [ ] **Opis (SEO & UX):** Krótki opis, Długi opis (Język Korzyści), Cechy, Specyfikacja.
- [ ] **Cena:** Cena netto/brutto, Cena promocyjna (opcjonalnie), Marża.
- [ ] **Atrybuty:** Rozmiar, Kolor, Warianty.
- [ ] **Publikacja:** Status (Aktywny/Szkic), Widoczność w kanałach (Sklep, Allegro, Meta).

### 🔄 Aktualizacja Stanów (Inventory Sync)
- [ ] Sprawdzenie stanów magazynowych (ERP vs Sklep).
- [ ] Aktualizacja dostępności (In Stock / Out of Stock / Backorder).
- [ ] Weryfikacja cenników (Marża minimalna).

---

## 🛒 Zarządzanie Sprzedażą (Order Processing)

### 📥 Nowe Zamówienie
- [ ] **Weryfikacja Płatności:** Czy opłacone? (Tak -> Realizacja / Nie -> Przypomnienie).
- [ ] **Weryfikacja Danych:** Adres dostawy, NIP (B2B), Uwagi klienta.
- [ ] **Fakturowanie:** Generowanie FV/Paragonu.

### 📦 Pakowanie i Wysyłka (Fulfillment)
- [ ] Pobranie listu przewozowego (Integracja Kurier).
- [ ] Kompletacja towaru (Picking).
- [ ] Pakowanie (Packing) + Inserty marketingowe (Ulotka, Kod rabatowy).
- [ ] Zmiana statusu: "Wysłane" + Numer śledzenia.

### ↩️ Zwroty i Reklamacje (RMA)
- [ ] Rejestracja zgłoszenia w systemie.
- [ ] Weryfikacja stanu zwróconego towaru.
- [ ] Decyzja: Zwrot środków / Wymiana / Naprawa.
- [ ] Korekta FV.

---

## 📞 Obsługa Klienta (Customer Service)

### 💬 Zapytania (Pre-sales & Post-sales)
- [ ] Kanały: Email, Telefon, Chat, Social Media.
- [ ] SLA: Czas odpowiedzi < 4h (robocze).
- [ ] Baza Wiedzy: Wykorzystanie gotowych szablonów odpowiedzi (FAQ).

### 🤝 Budowanie Relacji (CRM)
- [ ] Segmentacja klientów (VIP, Nowy, Powracający).
- [ ] Zbieranie Feedbacku (Ankiety po zakupie).
- [ ] Rozwiązywanie sporów (Win-Win).

---

## ⚙️ Automatyzacja (Tech Stack)
*Zalecane obszary do automatyzacji w celu oszczędności czasu.*

- [ ] **E-mail Transactional:** Automatyczne powiadomienia o statusie zamówienia.
- [ ] **Inventory:** Synchronizacja stanów w czasie rzeczywistym (Sklep <-> Allegro <-> ERP).
- [ ] **Invoicing:** Automatyczna wysyłka faktur po opłaceniu zamówienia.
- [ ] **Marketing Automation:** Ratowanie porzuconych koszyków, E-maile powitalne.
