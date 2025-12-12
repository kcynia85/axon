# Use Case: Testy użyteczności

### **Projekt: Strona internetowa dla rezerwacji wizyt lekarskich**

**Cel projektu:**

Zweryfikować, czy strona jest intuicyjna i pozwala użytkownikom szybko i bezproblemowo zarezerwować wizytę u lekarza.

---

### **Scenariusz testów użyteczności**

### **1. Uczestnik:**

- **Imię:** Michał
- **Wiek:** 35 lat
- **Zawód:** Inżynier
- **Doświadczenie technologiczne:** Średnio zaawansowane, korzysta z internetu głównie na laptopie.

---

### **2. Zadania testowe**

Uczestnik otrzymuje prototyp strony internetowej i wykonuje poniższe zadania.

Każde zadanie jest obserwowane, a tester notuje czas realizacji, trudności i reakcje użytkownika.

---

### **Zadanie 1: Znajdź lekarza kardiologa w swojej okolicy**

- **Czas realizacji:** 2 minuty.
- **Zachowanie:** Michał otwiera stronę, używa wyszukiwarki, ale wpisuje „lekarz” zamiast „kardiolog”.
- **Komentarz:**„Nie byłem pewien, czy mogę wpisać nazwę specjalizacji, czy muszę najpierw wybrać kategorię. Szkoda, że wyszukiwarka nie podpowiada.”

**Wnioski:**

- Dodanie podpowiedzi w wyszukiwarce może ułatwić proces.
- Trzeba wyraźniej zaznaczyć możliwość wyszukiwania po specjalizacji.

---

### **Zadanie 2: Zarezerwuj wizytę u wybranego lekarza na przyszły tydzień**

- **Czas realizacji:** 4 minuty.
- **Zachowanie:** Michał znajduje lekarza, ale ma trudności z wyborem dostępnego terminu, ponieważ kalendarz wymaga przewijania do odpowiedniej daty.
- **Komentarz:**„Kalendarz jest trochę niewygodny. Musiałem długo szukać terminu, a potem kliknąłem w zły dzień i musiałem zaczynać od nowa.”

**Wnioski:**

- Można dodać opcję filtrowania dostępnych terminów po dniach tygodnia lub godzinach.
- Kalendarz wymaga bardziej intuicyjnego interfejsu.

---

### **Zadanie 3: Dodaj wizytę do swojego kalendarza Google**

- **Czas realizacji:** 1 minuta.
- **Zachowanie:** Michał znajduje przycisk „Dodaj do kalendarza”, ale po kliknięciu widzi mało czytelny formularz.
- **Komentarz:**„Nie wiedziałem, czy kliknięcie automatycznie doda wizytę, czy muszę coś jeszcze wpisać. Formularz wygląda na zbędny.”

**Wnioski:**

- Uprościć proces dodawania wizyty do kalendarza.
- Przycisk powinien działać automatycznie, a dodatkowe opcje mogą być dostępne opcjonalnie.

---

### **Zadanie 4: Znajdź sekcję z opiniami pacjentów o lekarzu**

- **Czas realizacji:** 3 minuty.
- **Zachowanie:** Michał przewija stronę profilu lekarza i znajduje opinie, ale przyznaje, że musiał ich szukać.
- **Komentarz:**„Opinie powinny być bardziej widoczne. Musiałem przejrzeć całą stronę, żeby je znaleźć.”

**Wnioski:**

- Sekcja z opiniami powinna być lepiej widoczna na stronie profilu lekarza (np. zakładka lub większy nagłówek).

---

### **Podsumowanie wyników testów**

1. **Problemy:**
    - Niejasna wyszukiwarka (brak podpowiedzi).
    - Mało intuicyjny kalendarz do rezerwacji wizyt.
    - Zbyt skomplikowany proces dodawania wizyt do kalendarza Google.
    - Opinie użytkowników są trudne do znalezienia.
2. **Rekomendacje:**
    - Dodać inteligentne podpowiedzi w wyszukiwarce.
    - Poprawić interfejs kalendarza, np. umożliwić wybór najbliższych dostępnych terminów.
    - Uprościć integrację z kalendarzem Google, eliminując zbędne kroki.
    - Wyeksponować sekcję z opiniami pacjentów na stronie profilu lekarza.

---

### **Efekt testów:**

Po zakończeniu testów zespół projektowy wprowadził zmiany:

- Zmodernizowano wyszukiwarkę, dodając funkcję autouzupełniania.
- Wprowadzono filtr czasu w kalendarzu, by szybciej znaleźć wolne terminy.
- Przycisk „Dodaj do kalendarza” działa teraz automatycznie.
- Sekcję opinii przeniesiono na początek strony profilu lekarza.