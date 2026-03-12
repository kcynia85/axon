# Plan Implementacji: Service Studio

## 🔍 Analiza widoku z FigJam (New/Edit External Service)

Formularz jest logicznie podzielony na 4 kroki, które idealnie mapują się na sekcje wykorzystywane w `StudioLayout` (identycznie jak w `AgentStudio` i `CrewStudio`):

1. **Krok 1: Podstawowe informacje (Basic Info)**
   - **Name:** Zwykłe pole tekstowe (`FormTextField`).
   - **Link:** Pole tekstowe na URL (`FormTextField`).
   - **Business Context:** Większe pole opisowe (`FormTextarea`).
   - **Keywords:** Mechanizm tagów (`FormTagInput`).
2. **Krok 2: Categories**
   - Możliwość wyboru wielu kategorii (np. Utility, GenAI). Wykorzystanie listy `FormCheckbox`.
3. **Krok 3: Capabilities**
   - Dynamiczna lista możliwości danego serwisu (np. *Text-to-Speech*, *Voice Cloning*).
   - Każdy element posiada Tytuł, Opis oraz przycisk usunięcia `[ Usuń ]`.
   - **AI Hint ("Importuj z URL / Docs"):** W tym miejscu obok przycisku "+ Dodaj Capability" powinna pojawić się opcja pozwalająca na import i wygenerowanie capabilities na podstawie linku.
4. **Krok 4: Dostępność (Availability)**
   - Ustawienia widoczności dla poszczególnych domen (Globalne, Product Management, Discovery, itd.). Zastosowanie `FormCheckbox`.

Akcje: **Zapisz Serwis** (zapis) oraz **Anuluj** (wyjście).

---

## 📋 Szczegółowy plan implementacji

### 1. Architektura plików i katalogów
```text
frontend/src/modules/studio/features/service-studio/
├── application/
│   └── useServiceForm.ts                 # Hook dla react-hook-form (walidacja, inicjalizacja)
├── types/
│   ├── service-schema.ts                 # Schemat Zod (stan formularza)
│   └── sections.constants.ts             # Definicja kroków nawigacji
└── ui/
    ├── ServiceStudio.tsx                 # Główny kontener wiążący StudioLayout
    ├── components/
    │   ├── ServiceStudioSectionNav.tsx   # Nawigacja lewego panelu
    │   └── ServiceLivePoster.tsx         # Podgląd rejestrowanego serwisu na żywo (prawy panel)
    └── sections/
        ├── ServiceBasicInfoSection.tsx   # Name, Link, Context, Keywords
        ├── ServiceCategoriesSection.tsx  # Wybór kategorii (Utility, GenAI)
        ├── ServiceCapabilitiesSection.tsx# Zarządzanie możliwościami i import AI
        └── ServiceAvailabilitySection.tsx# Uprawnienia domen
```

### 2. Model Danych (Zod) - `service-schema.ts`
Implementacja w pełni oparta na typowaniu TypeScript:
- Utworzenie schematu `ServiceStudioSchema` za pomocą Zod dla zapewnienia *Strict Mode*.
- Pola: `name` (string), `url` (string), `business_context` (string), `keywords` (string[]), `categories` (string[]), `capabilities` (tablica obiektów: `{ name, description }`), `availability` (string[]).

### 3. Logika aplikacji - `useServiceForm.ts`
- Inicjalizacja `react-hook-form` wraz z `@hookform/resolvers/zod`.
- Zwracanie instancji `form` oraz funkcji obsługujących wysyłkę (`handleSubmit`).
- Dodanie metod pomocniczych do zarządzania listą *Capabilities* (korzystając z `useFieldArray`).

### 4. Budowa widoków sekcji (Pure View Principle)
Każda sekcja dziedziczy styl z komponentów z `@/shared/ui/form/*`:
- **`ServiceBasicInfoSection`**: Złożony z `<FormSection id="basic-info">`, wewnątrz `<FormItemField>` dla każdego atrybutu. Zastosowanie `<FormTextField>`, `<FormTextarea>` oraz `<FormTagInput>`.
- **`ServiceCategoriesSection`**: Mapowanie predefiniowanej listy kategorii na komponenty `<FormCheckbox>` ułożone pionowo.
- **`ServiceCapabilitiesSection`**: Będzie zawierać akcje "+ Dodaj Capability" oraz "Importuj z URL". Lista capability będzie renderowana w formie kart / kafelków z ikoną usuwania (ikona `Trash2` z Lucide).
- **`ServiceAvailabilitySection`**: Analogiczna implementacja do kategorii (korzystając z `<FormCheckbox>`) określająca dostępność w obszarach roboczych.

### 5. Integracja w głównym layoucie - `ServiceStudio.tsx`
- Zastosowanie `FormProvider`.
- Zastosowanie wspólnego `<StudioLayout>` (analogicznie do `AgentStudio` i `CrewStudio`):
  - `navigator={...}`: `ServiceStudioSectionNav`.
  - `canvas={...}`: Formularz z czterema sekcjami (`<ServiceBasicInfoSection />` itd.).
  - `poster={...}`: `ServiceLivePoster`, renderujący kartę zewnętrznej usługi reagującą na zmiany.
  - `footer={...}`: Przycisk `Cancel` oraz `<ActionButton label="Zapisz Serwis" />`.

### 6. Integracja punktu wejścia: `/resources/services`
Obsługa kliknięcia **"+ Register Service"**:
- W edycji pliku `frontend/src/app/(main)/resources/services/page.tsx`:
  - Kontrolowanie stanu lokalnego (np. `isStudioOpen`) pozwalającego na przełączenie widoku między `ServicesBrowser` a `ServiceStudio`.
  - Po otwarciu Studio, przejmuje ono cały ekran od krawędzi do krawędzi (jak w innych modułach Studio).

---

## 🛠 Wytyczne pod kodowanie (podsumowanie wg standardów)
- Komponenty korzystają wyłącznie z `Tailwind CSS`.
- Zależności stanu formularza trzymane są blisko widoku (nie uciekają do globalnego stanu).
- Event handlery wywoływane są bez `useEffect`.
- Czystość CSS (klasy `.group`, `hover:`, `focus-within:` itp.).
- Nazewnictwo utrzymane według DDD: `Service` -> `Capability`.