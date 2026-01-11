---
template_type: crew
---

# 5 Poziomów Dojrzałości

<aside>

![Screenshot 2025-10-07 at 7.42.01 PM.png](5%20Poziom%C3%B3w%20Dojrza%C5%82o%C5%9Bci/Screenshot_2025-10-07_at_7.42.01_PM.png)

</aside>

## Poziom 1 — Pierwsze kroki

### **Case:** Wykorzystanie AI do szybkiej odpowiedzi na typowe pytania klientów

<aside>

- **Przykład:** Mały sklep odzieżowy online
- **Wdrożenie:** Wykorzystanie AI do szybkiej odpowiedzi na typowe pytania klientów
- **Technologia:** Gotowe narzędzie AI (np. Gemini)
- **Inwestycja:** Subskrypcja Gemini
- **Rezultat:** Redukcja czasu pracy działu obsługi klienta o 30-50%

| Lp. | Krok (Zadanie) | Uwagi / Struktura Prompta |
| --- | --- | --- |
| **1** | Stwórz plik z najczęstszymi pytaniami klientów: czas i opcje dostawy, politykę zwrotów, rozmiarówkę itp. | Możesz użyć Google Docs, Worda, albo nawet notatnik - AI sam przetworzy dane w dowolnym formacie. |
| **2** | Stwórz prompt dla AI: Opisz czym zajmuje się Twój biznes, jaką rolę ma "odgrywać" AI i w jakim formacie ma zwracać Ci odpowiedzi. 

Wklej plik z najczęstszymi pytaniami jako element kontekstu prompta.

 | **Struktura dobrego promptu:**
1. Cel
2. Format odpowiedzi od AI
3. Ostrzeżenia
4. Kontekst |
| **3** | Przetestuj odpowiedzi AI na kilku przypadkach. Jeśli trzeba, popraw prompt. | Czasem AI może źle zrozumieć kontekst, albo halucynować. W takich wypadkach warto upewnić się, że w prompcie uczulamy go na to. |
| **4** | Wklej maile od klientów bezpośrednio do AI i kopiuj jego odpowiedzi. | Po tygodniu policz ile czasu zaoszczędziłeś/aś :) |
</aside>

<aside>

```
**prompt:** 

#ASYSTENT OBSŁUGI KLIENTA - URBAN VIBES

## TWOJA ROLA
Jesteś asystentem obsługi klienta Urban Vibes, modnego sklepu odzieżowego w Warszawie. Odpowiadasz na maile klientów w sposób pomocny i przyjazny, zgodny z głosem marki.

## ZACHOWANIE
Odpowiadaj w swobodnym, ale profesjonalnym tonie
Bądź pomocny i szukaj rozwiązań
Trzymaj się ściśle polityki sklepu
Okazuj zrozumienie dla sytuacji klienta
## DANE SKLEPU
Nazwa: Urban Vibes
Adres: ul. Złota 59, 00-120 Warszawa
Godziny: Pon-Sob 10-21, Nd 10-20
Kontakt: contact@urbanvibes.pl, tel. 22 222 22 22

## ZASADY SKLEPU
Zwroty: 30 dni z paragonem
Dostawa: Darmowa od 200 zł
Wymiana rozmiaru: Możliwa w sklepie
Płatności: Karty, BLIK, PayPo
Aktualne promocje: [NIE WYMYŚLAJ - czekaj na informację]

## FORMAT ODPOWIEDZI
Przywitanie z imieniem klienta (jeśli podane)
Jasna odpowiedź na główne pytanie
Informacja o zasadach (jeśli potrzebna)
Pozytywne zakończenie
Podpis sklepu

## STYL I TON
Przyjazny i przystępny
Młodzieżowy i na czasie
Profesjonalny, ale nie formalny
Empatyczny i wyrozumiały

## CZEGO NIE ROBIĆ
Nie wymyślaj promocji ani zniżek
Nie obiecuj konkretnych dat dostawy
Nie zmieniaj zasad sklepu
Nie podawaj informacji spoza tej listy

## PRZYKŁADY DOBRYCH ODPOWIEDZI
"Cześć [Imię]! Dzięki za Twoją wiadomość..."
"Rozumiem Twoją sytuację..."
"Z przyjemnością pomogę..."

## FORMAT PODPISU
Zespół Urban Vibes
ul. Złota 59, 00-120 Warszawa
contact@urbanvibes.pl

## KONTEKST DODATKOWY
Urban Vibes to nowoczesny sklep ze streetwearem dla młodych dorosłych (18-35 lat). Skupiamy się na modnej, casualowej odzieży i stawiamy na świetną obsługę klienta.
```

+ 📁 Plik z najczęstszymi pytaniami jako element kontekstu prompta.

</aside>

### AI Konsumencki i Firmowy

<aside>

| ASPEKT | AI KONSUMENCKIE | AI DLA BIZNESU |
| --- | --- | --- |
| **Przykłady** | • ChatGPT 4o
• Gemini 2.5 Flash
• Claude Pro | • Google Workspace AI
• Microsoft 365 Copilot
• Slack AI |
| **Bezpieczeństwo** | • Prompty widoczne dla dostawcy
• Standardowe warunki użycia
• Brak kontroli nad danymi | • Integracja z polityką bezpieczeństwa firmy
• Możliwa umowa NDA
• Kontrola nad danymi firmowymi |
| **Integracja** | • Osobna strona/aplikacja
• Ręczne kopiowanie treści
• Brak dostępu do dokumentów firmowych | • Działa w dokumentach firmowych
• Integracja z mailem służbowym
• Dostęp do firmowych danych |
| **Zastosowanie** | • Dobre do testów
• Osobiste projekty
• Nauka możliwości AI | • Praca zespołowa
• Dokumenty firmowe |
</aside>

## Poziom 2 — Podstawowa automatyzacja

### Case: AI w kategoryzacji produktów e-commerce

<aside>

- **Przykład:** Średni sklep internetowy z różnorodnym asortymentem
- **Wdrożenie:** Automatyczne tagowanie i kategoryzacja produktów za pomocą AI
- **Technologia:** API dostępnych modeli (Vision API, Gemini)

**Inwestycja:**

- Koszt API: ~500-1000 zł miesięcznie
- Minimalne koszty infrastruktury

**Rezultat:** Automatyczna kategoryzacja produktów

- Redukcja czasu kategoryzacji o 70-80%
- Poprawa jakości wyszukiwania w sklepie

| Lp. | Opis kroku |
| --- | --- |
| 1 | Znajdź dokumentację techniczną Twojej platformy oraz rozwiązania, z którego chcesz skorzystać, np.: 
- Platforma sklepowa Shopify 
- Vertex AI od Google Cloud |
| 2 | Wklej dokumentację obu tych aplikacji do swojego LLMa i napisz prompt z prośbą o przygotowanie instrukcji jak je ze sobą połączyć |
| 3 | Poproś LLMa, żeby rozbił problem na możliwie najmniejsze kroki – zaoszczędzisz w ten sposób tokeny i zmniejszysz ryzyko błędu |
| 4 | Postępuj zgodnie z instrukcjami LLMa i testuj na każdym kroku, jeśli to możliwe |
</aside>

<aside>

Polecane narzędzie do integracji lowcode:
https://replit.com/

</aside>

### **Pamiętajcie o kilku kluczowych zasadach przy przechodzeniu na Poziom 2**

<aside>

1. Zacznijcie od jednego, dobrze zdefiniowanego procesu
2. Upewnijcie się, że macie dostęp do odpowiedniej jakości danych
3. Zainwestujcie w monitoring i system alertów
4. Zachowajcie możliwość ludzkiej interwencji
5. Systematycznie mierzcie ROI
</aside>

## Poziom 3 — Integracja AI

### Case: AI w obsłudze klienta dużej sieci hoteli

<aside>

**Przykład:** Wdrożenie AI w obsłudze klienta

**Wdrożenie:** AI jako co-pilot agenta obsługi klienta

- Automatyzacja konwersacji z klientem
- Predykcyjne modele ułatwiające podejmowanie decyzji np. o zwrotach

**Technologia:** Zaawansowane modele NLP i machine learning

- Przetwarzanie języka naturalnego
- Predykcja zwrotów i goodwill gestures
- Modele rekomendacyjne

**Inwestycja:**

- Rozwój własnych modeli AI i integracja z CRM
- Zespół data science
- Infrastruktura obliczeniowa
- Koszt: dziesiątki tysięcy zł miesięcznie

**Rezultat:** Poprawa wydajności obsługi klienta o 15-20%

- Jeden agent jest w stanie obsłużyć kilku klientów naraz
- Krótszy proces decyzyjny przy wydawaniu zwrotów
- Automatyzacja typowych wniosków klientów
</aside>

## Poziom 4 — Zaawansowane wdrożenia

### Case: Allegro

<aside>

![Screenshot 2025-10-07 at 10.53.08 PM.png](5%20Poziom%C3%B3w%20Dojrza%C5%82o%C5%9Bci/Screenshot_2025-10-07_at_10.53.08_PM.png)

</aside>

<aside>

Inne przykłady zastosowań

**Systemy Rekomendacyjne**

- Personalizacja produktów na stronie głównej
- Rekomendacje "Kupujący często wybierają"
- Przewidywanie zainteresowań użytkownika
- Dynamiczne dostosowanie kolejności wyświetlania produktów

**Analityka Sprzedażowa**

- Przewidywanie popytu na produkty
- Optymalizacja cen
- Analiza sezonowości sprzedaży
- Identyfikacja trendów rynkowych
</aside>

### Szacunkowe koszty wdrożenia AI

<aside>

**Struktura Zespołów**

- **Zespół Machine Learning Research:** 10-15 osób
    - Seniorzy, badacze AI
    - Koszt: 250 000 - 500 000 zł miesięcznie
- **Zespół Data Science:** 15-20 osób
    - Analitycy, inżynierowie danych
    - Koszt: 300 000 - 600 000 zł miesięcznie
- **Zespół Implementacji AI:** 10-15 osób
    - Deweloperzy, specjaliści od integracji
    - Koszt: 250 000 - 450 000 zł miesięcznie

**Infrastruktura i Koszty Dodatkowe**

- Infrastruktura chmurowa: 100 000 - 300 000 zł miesięcznie
- Licencje i narzędzia: 50 000 - 150 000 zł miesięcznie
- Szkolenia i rozwój: 30 000 - 80 000 zł miesięcznie

**Całkowity koszt miesięczny:**

**Minimum:** ~930 000 zł

**Maksimum:** ~2 080 000 zł

</aside>

## Poziom 5 — AI-First

### Case: Netflix

<aside>

![Na podstawie danych, Netflix wyświetla miniaturę według preferencji. 
Profile Type: Horror lover → Wersja mroczna
Profile Type: Relations → Wersja z grupą przyjaciół](5%20Poziom%C3%B3w%20Dojrza%C5%82o%C5%9Bci/Screenshot_2025-10-07_at_11.09.30_PM.png)

Na podstawie danych, Netflix wyświetla miniaturę według preferencji. 
Profile Type: Horror lover → Wersja mroczna
Profile Type: Relations → Wersja z grupą przyjaciół

![Automatyzacja wyboru najlepszych kadrów dla personalizacji 
1. Każdy film i serial jest przetwarzany w celu wyboru najlepszych kadrów. 
2. Do każdego kadru przypisuje takie atrybuty jak emocje, atmosfera i tematyka
3. Później te atrybuty są używane do personalizacji](5%20Poziom%C3%B3w%20Dojrza%C5%82o%C5%9Bci/Screenshot_2025-10-07_at_11.09.57_PM.png)

Automatyzacja wyboru najlepszych kadrów dla personalizacji 
1. Każdy film i serial jest przetwarzany w celu wyboru najlepszych kadrów. 
2. Do każdego kadru przypisuje takie atrybuty jak emocje, atmosfera i tematyka
3. Później te atrybuty są używane do personalizacji

</aside>

### Case: Cleo AI

<aside>

**Przykład:** Cleo - inteligentny asystent finansowy

**Wdrożenie:** AI jako kluczowy element usługi bankowej

- Conversational AI
- Analityka wydatków
- Personalizowane porady finansowe

**Technologia:** Zaawansowane modele NLP i machine learning

- Przetwarzanie języka naturalnego
- Analiza wzorców wydatkowych
- Predykcyjne modele finansowe
</aside>

## Jak określić poziom

### Poziom 1

<aside>

Checklista

- [ ]  Masz mniej niż 50 zapytań dziennie do obsłużenia
- [ ]  Odpowiedzi nie muszą być natychmiastowe (możesz poczekać kilka minut)
- [ ]  Masz małą firmę/zespół (1-5 osób)
- [ ]  Nie masz programisty w zespole
- [ ]  Chcesz przetestować AI przed większą inwestycją
- [ ]  Treść zapytań często się zmienia i wymaga ludzkiej weryfikacji
- [ ]  Twój budżet na AI jest poniżej 1000 zł miesięcznie
- [ ]  Nie potrzebujesz integracji z innymi systemami
</aside>

### Poziom 2

<aside>

Checklista

- [ ]  Obsługujesz ponad 50 zapytań dziennie
- [ ]  Potrzebujesz natychmiastowych odpowiedzi
- [ ]  Masz średnią/dużą firmę
- [ ]  Masz dostęp do programistów
- [ ]  Chcesz zautomatyzować powtarzalne procesy
- [ ]  Pytania i odpowiedzi mają stały format
- [ ]  Masz budżet powyżej 1000 zł miesięcznie na AI
- [ ]  Potrzebujesz integracji z istniejącymi systemami (np. CRM, e-commerce)
- [ ]  Zależy Ci na skalowalności rozwiązania
- [ ]  Potrzebujesz monitorować i analizować wyniki
</aside>

<aside>

Wskazówki — Przechodź do Poziomu 2, gdy zobaczysz że:

- Tracisz za dużo czasu na ręczną pracę
- Potrzebujesz szybszej obsługi
- Masz powtarzalne procesy
- Twoja skala działania rośnie
</aside>

## Kiedy nie wdrażać AI

<aside>

Czerwone flagi

❌ Nie masz określonego konkretnego problemu do rozwiązania

❌ Nie masz zdefiniowanych procesów w firmie

❌ Nie masz osoby odpowiedzialnej za projekt AI

❌ Nie masz podstawowej dokumentacji/procedur

❌ Twoje dane są bardzo wrażliwe lub poufne

❌ Nie masz budżetu na testy i rozwój

</aside>

## Jak zaplanować wdrożenie

<aside>

Audyt aktualnych możliwości

- Zidentyfikuj powtarzalne procesy
- Zbadaj dostępne dane
- Oceń potencjał automatyzacji

Wybór pierwszego projektu

- Start od niskobudżetowego rozwiązania (np. Gemini)
- Koncentracja na procesach o wysokim potencjale zwrotu
- Minimalne ryzyko

Budowa kompetencji

- Szkolenia dla zespołu
- Zatrudnienie specjalistów
- Współpraca z ekspertami AI

Stopniowa implementacja

- Projekty pilotażowe
- Analiza rezultatów
- Iteracyjne doskonalenie

Długoterminowa strategia

- Określ cel transformacji AI
- Stwórz mapę drogową
- Przewiduj ewolucję technologii
</aside>