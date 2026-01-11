---
template_type: crew
---

# Dostępność

> “Nasze projekty czynią ludzi niepełnosprawnymi” - Sarah Winters
> 

### **Różne typy niepełnosprawności**

<aside>
Definicja **Niepełnosprawności** wg WHO - konflikt między uwarunkowaniami zdrowotnymi osoby, a środowiskiem, włączając w to ograniczone wsparcie społeczne.

</aside>

### **Trzy kategorie doświadczanych barier**

<aside>

1. Trwałe
2. Tymczasowe: 
    - Złamana ręka,
    - Oczy zakropione atropiną,
    - Zapalenie krtani
3. Sytuacyjne: 
    - Ograniczenia kontekstowe (np. głośny bar),
    - Osoba opiekująca się noworodkiem, która może używać tylko jednej ręki,
    - Przeciążenie sensoryczne podczas wypadku

</aside>

### **Wymiary sprawności**

<aside>

- Fizyczne
- Poznawcze
- Emocjonalne
- Społeczne

</aside>

### **Czynniki wpływające na odcyfrowanie tekstu)**

<aside>

- Usunięcie rozpraszaczy (Skupienie)
- Odpowiednio sformatowany tekst (Odkodowanie tekstu )
- Użycie takich instrumentów tj. prosty czy inkluzywny język (Przetworzenie komunikatu)
- Usunięcie wieloznaczności i niejasności przekazu (Działanie na podstawie przekazu)

</aside>

### **Pytania podczas projektowania treści**

<aside>

- Czy informacja może być odebrana w skupieniu?
- Jak informacja zostanie odebrana i postrzegana różnymi zmysłami?
- Czy i jak szybko informacja zostanie zrozumiana?
- Jakie konkretne informacje będą pomocne przy podejmowaniu decyzji?
- Czy informacja jest wyczerpująca i czy będzie wspierać dalsze kroki osoby?

</aside>

### WCAG

<aside>

1. Treści  postrzegane zmysłami (głównie formatowanie tekstu
    1. Tekst pozbawiony błędów ortograficznych
    2. Dobra interpunkcja
    3. Nieumieszczanie tekstu na obrazie
    4. Tekstowy opis ilustracji ALTy
    5. Transkrypcja wideo i audio
    6. Odpowiednio hierarchia w tekście
    
2. Treści funkcjonalne
    1. Zrozumiałe tytułu lub śródtytuły
    2. Zrozumiałe linki
    3. Klarowne etykiety elementów UI
    4. Poprawnie oznaczone inputy w formularzu 
    5. Stonowane elementy dynamiczne
    6. Jednoznaczne oznaczenie stanu sytemu oraz ścieżki nawigacji np. breadcrumbs
    Jeśli formularz jest podzielony na etapy, dobrą praktyka jest umieszczenie informacji co czeka użytkownika po naciśnięciu przycisku “Dalej”
    7. Instrukcja dla osób kodujących, jaka powinna być kolejność nawigacji na klawiaturze
    wykorzystując atrybut **`*tabindex*`**
    
    ```html
    <button tabindex="1">Przycisk 2</button>
    <button tabindex="2">Przycisk 1</button>
    <button tabindex="3">Przycisk 3</button>
    ```
    

1. Zrozumiałe treści
2. Prosty język i zmniejszenie mglistości tekstu
3. Najważniejsze informacje podane są jako pierwsze w tekście lub w zdaniu
4. Logiczne układanie myśli. Jedna myśl - jedno zdanie, Jedna idea - Jeden akapit
5. Nietypowe, trudne lub branżowe słowa mają swoje definicje, wyjaśnienia bez googlowania
6. Skrótowce zawsze z wyjaśnieniem. Pełna nazwa najpierw, skrót w nawiasie
7. Brak idiomów i żargonu branżowego lub regionalnego
8. Oznaczony lub ustawiony  język dokumentu lub fragmentu za pomocą atrybutu **`*lang*`**

```html
<p>Here is some text in English. <span lang="fr">Voici du texte en français.</span></p>

```

h.  Dokładne i dopasowane do kontekstu instrukcje, etykiety, kominukaty

1. Konwersacyjna zasada grzeczności. Przewidywanie sytuacji stresujących i błędogennych.
2. Dodatkowe treści, pomagające uniknąć pomyłek np. podsumowanie procesów, listy krok po kroku, podpowiedzi informujące o konsekwencjach naciśnięcia przycisku

<aside>
**Neuroróżnorodność** uwzględnia różnice w sposobach przetwarzania informacji, które mogą być obserwowane między osobami o różnych typach neurologicznych, takich jak osoby z zaburzeniami ze spektrum autyzmu, ADHD, dysleksją, zaburzeniami nastroju.

</aside>

</aside>