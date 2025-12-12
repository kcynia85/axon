# Aplikacja do planowania podróży grupowych "TripSync"

<aside>

```markdown
### **Aplikacja do planowania podróży grupowych "TripSync"**

#### **CZĘŚĆ 1: KONTEKST PRODUKTOWY**

**Problem:** Planowanie podróży z grupą znajomych jest chaotyczne. Dyskusje toczą się w wielu kanałach (Messenger, WhatsApp, email), propozycje lotów i hoteli giną w natłoku wiadomości, a wspólne podejmowanie decyzji jest trudne i prowadzi do frustracji.

**Obecne Rozwiązania:** Używanie wielu niespecjalistycznych narzędzi: komunikatorów do dyskusji, Google Docs/Sheets do tworzenia planów, ankiet Doodle do ustalania terminów. Ich wady to:
*   Fragmentacja informacji – wszystko jest w innym miejscu.
*   Brak centralnego źródła prawdy o planie podróży.
*   Trudności w wizualizacji planu i podejmowaniu decyzji w sposób zorganizowany.

**Opportunity (Szanse):** Stworzenie aplikacji "wszystko w jednym" dla grupowego planowania podróży, która łączy w sobie komunikację, tworzenie planu podróży, głosowanie nad opcjami (loty, hotele, atrakcje) i przechowywanie wszystkich rezerwacji w jednym, dostępnym dla wszystkich miejscu.

**Główne Zadanie:** Przeanalizuj poniższe surowe dane z wywiadów i przekształć je w pomysły na przepływy, które rozwiążą kluczowe problemy związane z chaosem komunikacyjnym i decyzyjnym w grupie.

---
#### **CZĘŚĆ 3: FORMAT WYJŚCIOWY**

**POMYSŁ NA USER FLOW #1**

1.  **Problem Użytkownika:** Propozycje lotów i noclegów wysyłane w chaotycznym czacie grupowym szybko giną i trudno je porównać.
2.  **Pomysł na User Flow:** **"Głosowanie nad Opcjami Podróży"**
    *   **Ekran 1 (Dodawanie propozycji):** Użytkownik wkleja link do lotu lub hotelu. Aplikacja automatycznie zaciąga kluczowe dane (cena, godziny, nazwa) i tworzy estetyczną "kartę" propozycji w dedykowanej sekcji "Loty do omówienia".
    *   **Ekran 2 (Widok porównania i głosowania):** Wszyscy uczestnicy wyjazdu widzą listę kart z propozycjami. Mogą je posortować np. po cenie. Pod każdą opcją widoczne są awatary osób, które zagłosowały "za".
    *   **Ekran 3 (Zatwierdzenie opcji):** Gdy większość zagłosuje na jedną opcję, organizator otrzymuje powiadomienie i może jednym kliknięciem "zatwierdzić" ją jako ostateczny wybór, co przenosi ją do głównego planu podróży.
3.  **Uzasadnienie Biznesowe:** Rozwiązuje główny problem chaosu decyzyjnego, co stanowi podstawową wartość aplikacji. Przejrzysty i angażujący proces głosowania zwiększa zaangażowanie wszystkich uczestników i przyspiesza proces planowania, co bezpośrednio wpływa na satysfakcję i chęć ponownego użycia aplikacji.

**POMYSŁ NA USER FLOW #2**

1.  **Problem Użytkownika:** Uczestnicy wyjazdu nie wiedzą, jaki jest aktualny, ostateczny plan podróży, bo ustalenia są rozproszone po wielu wiadomościach.
2.  **Pomysł na User Flow:** **"Współdzielony, Wizualny Plan Podróży"**
    *   **Ekran 1 (Widok osi czasu):** Główny ekran podróży to wizualna oś czasu, podzielona na dni. Każdy dzień to "kafelek" z podsumowaniem (np. "Przylot i zwiedzanie Starego Miasta").
    *   **Ekran 2 (Szczegóły dnia):** Użytkownik klika na dany dzień, aby zobaczyć szczegółową listę planów w porządku chronologicznym (np. 10:00 - Lot, 14:00 - Zameldowanie w hotelu, 16:00 - Wizyta w muzeum). Każdy element zawiera adres, numer rezerwacji i przypisane osoby.
    *   **Ekran 3 (Dodawanie nowego elementu):** Każdy uczestnik może kliknąć "+" na osi czasu, aby dodać nową propozycję atrakcji lub punktu w planie, który następnie jest widoczny dla wszystkich.
3.  **Uzasadnienie Biznesowe:** Tworzy centralne źródło prawdy ("single source of truth"), co sprawia, że aplikacja jest niezbędna dla grupy w trakcie całego procesu – od planowania aż po sam wyjazd. Zwiększa to retencję i sprawia, że aplikacja staje się domyślnym narzędziem dla przyszłych wyjazdów tej samej grupy.

**POMYSŁ NA USER FLOW #3**

1.  **Problem Użytkownika:** Po podróży trudno jest rozliczyć wspólne wydatki, a śledzenie "kto komu ile jest winien" jest skomplikowane i niezręczne.
2.  **Pomysł na User Flow:** **"Proste Rozliczanie Wydatków Grupowych"**
    *   **Ekran 1 (Dodawanie wydatku):** W trakcie wyjazdu każdy uczestnik może wejść w sekcję "Wydatki" i szybko dodać nowy koszt, np. "Obiad w restauracji", wpisać kwotę, wybrać, kto za niego zapłacił i kogo on dotyczył (domyślnie wszystkich).
    *   **Ekran 2 (Dashboard wydatków):** Główny ekran wydatków pokazuje proste podsumowanie w czasie rzeczywistym: "Całkowity koszt wyjazdu" oraz "Twoje saldo: +30 zł" lub "Jesteś winien 50 zł".
    *   **Ekran 3 (Finalne rozliczenie):** Na koniec wyjazdu aplikacja generuje finalne podsumowanie z najprostszymi możliwymi przelewami do wykonania (np. "Ania płaci Tomkowi 80 zł" zamiast 5 mniejszych transakcji), co rozwiązuje wszystkie długi.
3.  **Uzasadnienie Biznesowe:** Rozszerza użyteczność aplikacji poza samo planowanie, obejmując również etap realizacji i podsumowania podróży. Rozwiązanie problemu finansów jest tak dużym ułatwieniem, że może stać się kluczowym powodem, dla którego użytkownicy polecają aplikację innym.

---
#### **CZĘŚĆ 4: DANE WEJŚCIOWE (PRZYKŁADOWE)**

**SUROWE DANE Z BADAŃ:**
*   **Użytkownik A:** "Planowanie wyjazdu na Messengerze to koszmar. Ktoś wrzuca 10 linków do hoteli, potem jest 100 wiadomości o czymś innym i nikt już nie pamięta, o czym rozmawialiśmy."
*   **Użytkownik B:** "Zawsze jest jedna osoba, która musi wszystko spinać w jakimś Google Docu, ale i tak połowa grupy go nie czyta i ciągle pyta na czacie 'to gdzie teraz idziemy?'."
*   **Użytkownik C:** "Najgorsze jest rozliczanie się po powrocie. Śledzenie paragonów, przypominanie o przelewach... Zawsze jest niezręcznie i ktoś czuje się pokrzywdzony."
```

</aside>