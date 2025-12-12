# Studium przypadku PRD — „FoodWise” (Cross-Module)

### PRD

<aside>

```markdown

## 1. 🎯 Tło projektu

„FoodWise” to aplikacja mobilna pomagająca użytkownikom tworzyć szybkie, zdrowe i ekonomiczne plany posiłków oparte na produktach dostępnych w domu.

### Cele MVP
- Generowanie planu posiłków na 7 dni.
- Automatyczne tworzenie listy zakupów.
- Personalizacja pod preferencje dietetyczne.

### Stakeholderzy
- CEO  
- Head of Marketing  
- UX/UI Designer  
- Lead Engineer  
- Data Scientist  

---

## 2. 🔍 Problem i potrzeba

### Problem użytkownika
Użytkownicy nie wiedzą:
- co ugotować z produktów, które mają,
- jak gotować budżetowo i zdrowo,
- jak unikać marnowania jedzenia.

### Potrzeba biznesowa
Aplikacja ma łączyć prostotę obsługi z inteligentnym algorytmem generowania jadłospisu i list zakupów.

---

# 🧩 Zakres PRD

PRD podzielono na moduły odzwierciedlające proces w rzeczywistym projekcie.

---

# **Moduł A – Marketing, Storytelling, Content, UX Writing**

## 1. 🎤 Pozycjonowanie i komunikacja

### Storytelling (Struktura 3 aktów)
**Akt 1 – Problem:**  
Chaos w lodówce, brak pomysłów, presja czasu.

**Akt 2 – Konflikt:**  
Marnowanie jedzenia, frustracja, zamawianie drogich dań.

**Akt 3 – Rozwiązanie:**  
FoodWise generuje plan w 30 sekund, tworzy listę zakupów, pomaga podejmować zdrowe decyzje.

### Hasło główne
> „Planuj posiłki w 30 sekund. Jedz zdrowo. Oszczędzaj.”

### Tone of Voice
- przyjazny  
- motywujący  
- zero moralizowania  
- konkretny  

---

## 2. ✍️ UX Writing – przykłady

**Onboarding – ekran 1:**  
„Nie masz pomysłu na obiad? Pokaż, co masz w kuchni — resztę zrobimy za Ciebie.”

**CTA:**  
„Zacznij planować”

**Pusta lista zakupów:**  
„Twoja lista zakupów jest pusta. Dodaj produkty lub wygeneruj plan na 7 dni.”

**Podpowiedzi w UI:**
- „Wybierz preferencje dietetyczne”  
- „Zamień posiłek”  
- „Dodaj do listy zakupów”  

---

## 3. 📣 Materiały marketingowe (MVP)

### Landing Page – sekcje:
- Hero z claimem  
- Demo generatora jadłospisu  
- Opinie użytkowników  
- „Jak to działa?” (3 kroki)  
- CTA do pobrania aplikacji  

### Przykładowy social post
> „Twoja lodówka podpowie Ci, co ugotować. FoodWise zamienia produkty w szybkie, zdrowe pomysły na posiłki.”

---

# **Moduł B – UX/UI Design**

## 1. 🎨 User Flow

```
Onboarding  
→ Dodanie produktów z domu  
→ Preferencje dietetyczne  
→ Generowanie planu  
→ Podgląd posiłków  
→ Lista zakupów  
→ Edycja lub zamiana posiłków  
```

---

## 2. 🧭 Wireframes – opis koncepcyjny

### Ekran startowy
- Pole „Co masz w kuchni?”
- Szybkie tagi: makaron, ryż, jajka, pomidory.

### Generowanie planu
- Widok tygodnia (7 kart).
- Tap = szczegóły posiłku.
- Zamiana posiłku jednym kliknięciem.

### Lista zakupów
- Grupowanie kategorii (nabiał, warzywa, zboża).
- Check-boxy.
- Tryb offline.

---

## 3. 🎛️ Design System (MVP)

### Kolory
- **Primary:** #3FAF72  
- **Background:** #F5F6F5  
- **Accent:** #FFD26E  

### Komponenty
- Button primary/secondary  
- Karty posiłków  
- Karty produktów  
- Input + select  

---

# **Moduł C – Technologia i Coding**

## 1. 🛠️ Stack technologiczny

### Front (Mobile)
- React Native  
- Zustand  
- Expo  

### Back-end
- Node.js / Express  
- PostgreSQL  
- OpenAI Recommender API (logika planów posiłków)

### Infra
- Vercel (API)  
- Supabase (baza + auth)  

---

## 2. 📡 API – przykładowe endpointy

### POST `/api/generate-plan`

**Body:**
```json
{
  "products": ["jajka", "pomidory", "makaron"],
  "diet": "standard",
  "days": 7
}
```

**Response:**
```json
{
  "plan": [
    {
      "day": "Monday",
      "meals": [
        {
          "name": "Makaron z jajkiem i pomidorami",
          "ingredients": ["makaron", "jajka", "pomidory"],
          "time": 15
        }
      ]
    }
  ]
}
```

---

## 3. 🗂️ Architektura projektu

```
/src
 ├── components
 ├── screens
 ├── services
 │   ├── api.js
 │   ├── planGenerator.js
 ├── store
 │   ├── useProducts.js
 │   ├── useMealPlan.js
 └── utils
```

---

## 4. 🧪 Testy

### Unit tests
- Generator posiłków  
- Parser listy produktów  

### Integracyjne
- Łączenie preferencji dietetycznych z algorytmem  

### E2E (Detox)
- Onboarding  
- Generowanie planu  
- Lista zakupów  

---

# **Moduł D – Wymagania biznesowe**

## 1. KPI

- **Retention D7:** ≥ 25%  
- **Recipe swap engagement:** ≥ 40%  
- **Generowanie planu:** min. 1× / tydzień  
- **Konwersja landing → instalacja:** ≥ 3.5%  

---

## 2. Wymagania prawne i bezpieczeństwo

- Zgodność z GDPR  
- Brak danych wrażliwych  
- Możliwość anonimowego logowania  

---

# 4. Podsumowanie

Case study przedstawia realistyczny projekt aplikacji obejmujący:
- pełen moduł marketingowy,
- UX writing,
- proces UX/UI,
- rozwiązania techniczne i API,
- logikę biznesową i KPI.

Może służyć jako gotowy wzór PRD lub materiał edukacyjny.

```

</aside>