# Aplikacja mobilna do rezerwacji zajęć fitness (Analiza)

<aside>

```markdown

### **Aplikacja mobilna do rezerwacji zajęć fitness**

#### **CZĘść 1: KONTEKST PRODUKTOWY**

**Problem:** Różna popularność różnorodnych zajęć fitness (pilates, joga, crossfit, taniec) prowadzonych przez niezależnych trenerów w różnych studiach po mieście. Tradycyjne karnety do pojedynczych siłowni nie odpowiadają na potrzeby użytkowników, którzy chcą elastyczności i możliwości próbowania różnych aktywności.

**Obecne Rozwiązania:** Aplikacje typu ClassPass mają szereg problemów:
*   Skomplikowany system kredytów i pakietów.
*   Brak przejrzystych informacji o trenerach i zajęciach.
*   Frustrująca rezerwacja z dużym wyprzedzeniem.
*   Nieprzewidywalna jakość studiów i instruktorów.
*   Trudności z odwoływaniem zajęć.
*   Brak możliwości budowania stałej rutyny treningowej.

**Opportunity (Szanse):** Stworzyć aplikację mobilną, która rozwiąże te problemy poprzez prostotę, przejrzystość i lepsze dopasowanie do realnych potrzeb użytkowników - od osób początkujących po doświadczonych sportowców szukających różnorodności.

**Główne Zadanie:** Przeanalizuj poniższe surowe dane z wywiadów z użytkownikami i przekształć je w zestaw konkretnych pomysłów na przepływy użytkownika w aplikacji mobilnej. Skup się na identyfikacji wzorców problemów i przekształć je w kompletne ścieżki użytkownika obejmujące po 3-4 ekrany.

---
#### **CZĘŚĆ 3: FORMAT WYJŚCIOWY**

**POMYSŁ NA USER FLOW #1**

1.  **Problem Użytkownika:** Jako użytkownik, czuję się niepewnie wybierając nowe zajęcia, ponieważ nie mam dostępu do wiarygodnych opinii i nie wiem, jaka jest faktyczna jakość instruktora oraz studia.
2.  **Pomysł na User Flow:** **"Transparentny Profil Trenera i Zajęć z Opiniami Społeczności"**
    *   **Ekran 1 (Lista zajęć):** Użytkownik przegląda listę dostępnych zajęć. Każda pozycja, oprócz nazwy i godziny, posiada wyraźnie widoczną średnią ocenę (np. 4.8 ★) oraz liczbę opinii (np. "120 opinii").
    *   **Ekran 2 (Szczegóły zajęć):** Po kliknięciu w zajęcia, użytkownik widzi szczegółowy opis, zdjęcia/wideo ze studia oraz wyróżnioną sekcję "O instruktorze" ze zdjęciem, imieniem i krótkim bio. Poniżej znajduje się podsumowanie ocen w kategoriach: "Atmosfera", "Intensywność", "Profesjonalizm instruktora".
    *   **Ekran 3 (Profil instruktora z opiniami):** Kliknięcie w profil instruktora przenosi do dedykowanego ekranu, gdzie można przeczytać jego pełną biografię, zobaczyć certyfikaty oraz przewinąć listę wszystkich opinii tekstowych pozostawionych przez użytkowników po jego zajęciach.
3.  **Uzasadnienie Biznesowe:** Budowanie zaufania poprzez transparentność i social proof. Użytkownicy chętniej rezerwują zajęcia (wyższa konwersja), mając pewność co do ich jakości. Zmniejsza to ryzyko negatywnych doświadczeń, które powodują rezygnację z aplikacji (churn).

**POMYSŁ NA USER FLOW #2**

1.  **Problem Użytkownika:** Jako użytkownik, frustruje mnie skomplikowany system płatności oparty na kredytach oraz nieelastyczne zasady rezerwacji i odwoływania zajęć.
2.  **Pomysł na User Flow:** **"Prosta Rezerwacja i Elastyczne Zarządzanie"**
    *   **Ekran 1 (Szczegóły zajęć):** Na ekranie szczegółów zajęć przycisk do rezerwacji ma jasny komunikat: "Zarezerwuj za 40 zł" (zamiast np. "Użyj 8 kredytów"). Pod przyciskiem znajduje się czytelna informacja: "Bezpłatne odwołanie do 24h przed zajęciami".
    *   **Ekran 2 (Potwierdzenie rezerwacji):** Po kliknięciu pojawia się ekran podsumowania z zapisaną metodą płatności (np. Apple Pay/Google Pay/karta). Użytkownik potwierdza rezerwację jednym kliknięciem lub przez uwierzytelnienie biometryczne.
    *   **Ekran 3 (Moje rezerwacje):** W dedykowanej zakładce "Moje rezerwacje" użytkownik widzi listę nadchodzących zajęć. Przy każdej pozycji znajduje się wyraźny przycisk "Zarządzaj rezerwacją", który pozwala w prosty sposób odwołać wizytę lub ją przełożyć (jeśli studio na to pozwala).
3.  **Uzasadnienie Biznesowe:** Obniżenie bariery wejścia i usunięcie frustracji związanej z płatnościami i rezerwacją. Przejrzystość cenowa i elastyczność zwiększają konwersję oraz satysfakcję użytkownika, co bezpośrednio przekłada się na wyższą retencję.

**POMYSŁ NA USER FLOW #3**

1.  **Problem Użytkownika:** Jako użytkownik, który znalazł ulubione zajęcia i trenerów, mam problem z budowaniem stałej rutyny, ponieważ aplikacja nie ułatwia mi regularnego zapisywania się na nie.
2.  **Pomysł na User Flow:** **"Kreator Tygodniowej Rutyny Treningowej"**
    *   **Ekran 1 (Profil trenera/zajęć):** Na ekranie ulubionego trenera lub zajęć, obok standardowych opcji, znajduje się przycisk "Dodaj do mojej rutyny".
    *   **Ekran 2 (Zakładka "Moja Rutyna"):** Użytkownik ma w aplikacji nową sekcję z widokiem kalendarza tygodniowego. Może tu umieszczać swoje ulubione zajęcia, tworząc idealny plan treningowy.
    *   **Ekran 3 (Powiadomienia i szybka rezerwacja):** Gdy studio opublikuje nowy grafik, użytkownik dostaje powiadomienie: "Grafik Twoich ulubionych zajęć Jogi z Asią jest już dostępny! Zarezerwuj miejsce na wtorek." Kliknięcie przenosi go bezpośrednio do rezerwacji.
3.  **Uzasadnienie Biznesowe:** Zwiększenie zaangażowania i budowanie nawyku korzystania z aplikacji. Użytkownik, który stworzy swoją rutynę, będzie wracał do aplikacji regularnie, co drastycznie zwiększa jego długoterminową wartość (LTV) i częstotliwość rezerwacji.

---
#### **CZĘŚĆ 4: DANE WEJŚCIOWE (PRZYKŁADOWE)**

**SUROWE DANE Z BADAŃ:**
*   **Użytkownik A:** "Raz poszłam na crossfit z nowej apki i to była porażka. Trener był niemiły, a w opisie nic o tym nie było. Straciłam pieniądze i zapał. Teraz boję się próbować nowych miejsc."
*   **Użytkownik B:** "Nienawidzę tych systemów z kredytami. Nigdy nie wiem, ile tak naprawdę płacę za zajęcia, a na koniec miesiąca okazuje się, że kredyty mi wygasły. Chcę po prostu zapłacić i iść."
*   **Użytkownik C:** "Znalazłam świetne zajęcia pilates, ale grafik pojawia się nieregularnie i najlepsze miejsca znikają w 10 minut. Zanim się zorientuję, że mogę się zapisać, jest już za późno."
```

</aside>