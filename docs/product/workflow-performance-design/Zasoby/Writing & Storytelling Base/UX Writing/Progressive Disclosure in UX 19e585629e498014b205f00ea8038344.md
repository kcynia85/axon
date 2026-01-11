---
template_type: crew
---

# Progressive Disclosure in UX

<aside>

Interfejsy użytkownika muszą równoważyć ilość prezentowanych informacji. [Progressive disclosure](https://app.uxcel.com/glossary/progressive-disclosure) (stopniowe ujawnianie) to technika pokazująca tylko kluczowe elementy na początku, z opcją dostępu do bardziej szczegółowych informacji.

Jak w cebuli, głębsza [zawartość](https://app.uxcel.com/glossary/content) pojawia się gdy użytkownik jest gotowy, co upraszcza interfejs. Umiejętne wykorzystanie tej techniki pomaga tworzyć przejrzyste i intuicyjne rozwiązania.

</aside>

### **Czym jest Progressive Disclosure?**

<aside>

![image - 2025-03-13T002406.224.jpeg](Progressive%20Disclosure%20in%20UX/image_-_2025-03-13T002406.224.jpeg)

Użytkownicy chcą mieć wybór, ale cenią też prostotę. Stopniowe ujawnianie rozwiązuje ten problem, pokazując najpierw podstawowe funkcje, a dodatkowe opcje udostępniając na żądanie. Przykładowo, strona Ustawień może zaczynać od kluczowych opcji (konto, wygląd, bezpieczeństwo), a bardziej zaawansowane ustawienia ukrywać za przyciskiem "Ustawienia zaawansowane". Dzięki temu interfejs pozostaje przejrzysty, a użytkownicy mają dostęp do potrzebnych funkcji.

</aside>

### **Znaczenie Progressive Disclosure**

<aside>

**Oto główne korzyści stopniowego ujawniania:**

- Pomaga nowym użytkownikom skupić się na najważniejszych elementach
- Zwiększa czytelność i efektywnie wykorzystuje przestrzeń
- Pokazuje tylko istotne funkcje, ukrywając rzadziej używane
- Redukuje obciążenie poznawcze ([cognitive load](https://app.uxcel.com/glossary/cognitiveload))
- Ułatwia naukę interfejsu
- Minimalizuje przypadkowe [błędy](https://app.uxcel.com/glossary/errors)

Główne wyzwania to: ryzyko błędnych założeń bez odpowiednich [badań użytkowników](https://app.uxcel.com/glossary/user-research)[[1]](https://app.uxcel.com/#anchor-1) oraz możliwość zbyt głębokiego ukrycia zaawansowanych opcji. Rozwiązaniem jest stosowanie jasnych [etykiet](https://app.uxcel.com/glossary/labels) i [przycisków](https://app.uxcel.com/glossary/buttons) typu "Zaawansowane" czy "Zobacz więcej".

</aside>

### **Kiedy stosować stopniowe ujawnianie**

<aside>

❌

![image - 2025-03-13T002422.533.jpeg](Progressive%20Disclosure%20in%20UX/image_-_2025-03-13T002422.533.jpeg)

✅

![image - 2025-03-13T002426.529.jpeg](Progressive%20Disclosure%20in%20UX/image_-_2025-03-13T002426.529.jpeg)

**Kiedy warto stosować stopniowe ujawnianie?**

- Na stronach z dużą ilością treści, jak sklepy e-commerce.
- W aplikacjach z wieloma funkcjami, które mogłyby przytłoczyć nowych użytkowników.

Nie mylmy tego z ujawnianiem etapowym. W stopniowym ujawnianiu funkcje mają różne priorytety, podczas gdy w etapowym są równie ważne i pokazywane w ustalonej kolejności, jak w kreatorach konfiguracji.

**Ujawnianie etapowe (sekwencyjne):**

1. Kreator zakładania konta bankowego - przeprowadza przez kolejne, równie ważne kroki: dane osobowe, wybór typu konta, ustawienia zabezpieczeń
2. Proces rezerwacji biletu lotniczego - wybór trasy, daty, miejsca, dodatkowych usług, płatność
3. Konfigurator nowego samochodu - wybór modelu, silnika, koloru, wyposażenia, finansowania

**Ujawnianie stopniowe (progressive):**

1. Sklep e-commerce - pokazuje podstawowe informacje o produkcie, z opcją rozwinięcia szczegółowej specyfikacji i recenzji
2. Aplikacja do edycji zdjęć - prezentuje podstawowe narzędzia, ukrywając zaawansowane filtry i efekty w dodatkowym menu
3. Panel administracyjny - wyświetla najczęściej używane ustawienia, z przyciskiem "Zaawansowane" dla rzadziej używanych opcji

</aside>

### **Primary features**

<aside>

![image - 2025-03-13T002436.384.jpeg](Progressive%20Disclosure%20in%20UX/image_-_2025-03-13T002436.384.jpeg)

Najczęściej używane funkcje to funkcje podstawowe (primary features). Początkowy poziom musi być prosty i klarowny - zbyt wiele opcji może zniechęcić użytkowników na starcie.

Jak wybrać funkcje do początkowego poziomu? Opieraj się na danych z badań. Dla nowego produktu analizuj wyniki badań użytkowników (wywiady, ankiety, testy). Dla istniejącego - sprawdzaj analitykę strony i testy użyteczności, by zrozumieć preferencje użytkowników.

</aside>

### **Secondary features**

<aside>

❌

![image - 2025-03-13T002442.819.jpeg](Progressive%20Disclosure%20in%20UX/image_-_2025-03-13T002442.819.jpeg)

✅

![image - 2025-03-13T002447.057.jpeg](Progressive%20Disclosure%20in%20UX/image_-_2025-03-13T002447.057.jpeg)

Granica między funkcjami podstawowymi a dodatkowymi musi być wyraźna, a przejście między poziomami intuicyjne.

**Jak to osiągnąć:**

- Stosuj opisowe etykiety w [linkach](https://app.uxcel.com/glossary/links) i przyciskach. "Ustawienia zaawansowane" działa lepiej niż niejasne "Dowiedz się więcej", bo jasno informuje o zawartości i korzyściach z [interakcji](https://app.uxcel.com/glossary/interaction).
- Zadbaj o widoczność i klikalność elementów prowadzących do funkcji dodatkowych. [Link](https://app.uxcel.com/glossary/hyperlink) do zaawansowanych opcji powinien być łatwy do znalezienia.

</aside>

### **Multiple levels of progressive disclosure**

<aside>

![image - 2025-03-13T002450.903.jpeg](Progressive%20Disclosure%20in%20UX/image_-_2025-03-13T002450.903.jpeg)

Ile poziomów stopniowego ujawniania jest akceptowalnych?

Interfejsy z więcej niż dwoma poziomami mają niską [użyteczność](https://app.uxcel.com/glossary/usability), gdyż użytkownicy gubią się między poziomami złożoności.

Jak tego uniknąć?

- **Przemyśl funkcje.** Dobre [sortowanie](https://app.uxcel.com/glossary/sorting) i grupowanie ułatwi nawigację. Obserwuj, czy użytkownicy rozumieją różnice między poziomami.
- **Ogranicz do 2 poziomów.** Więcej poziomów może dezorientować użytkowników nadmiarem opcji zaawansowanych.

Jeśli musisz dodać więcej poziomów, zadbaj o jasne etykiety. Unikaj niejednoznacznych przycisków jak "Zobacz więcej" - w złożonym interfejsie będą frustrować użytkowników.

</aside>

### **Progressive disclosure in onboarding**

<aside>

❌

![image - 2025-03-13T002501.102.jpeg](Progressive%20Disclosure%20in%20UX/image_-_2025-03-13T002501.102.jpeg)

✅

![image - 2025-03-13T002503.943.jpeg](Progressive%20Disclosure%20in%20UX/image_-_2025-03-13T002503.943.jpeg)

Wdrażanie użytkowników to proces zapoznawania ich z nowym produktem. Kluczem do sukcesu jest stopniowe wprowadzanie funkcji. Oto jak wykorzystać stopniowe ujawnianie w procesie wdrażania:

- **Skup się na podstawowych potrzebach.** Pokaż najpierw główne funkcje, a dodatkowe opcje udostępniaj na życzenie.
- **Analizuj zachowania.** Badaj pierwsze dni użytkowania, aby zidentyfikować najważniejsze funkcje i odpowiednio je wyeksponować.
- **Dostosuj do użytkowników.** Uwzględnij zarówno osoby lubiące eksplorację, jak i te preferujące prostą ścieżkę do celu.
- **Bądź zwięzły.** Skup się na kluczowych elementach i twórz krótkie opisy.
- **Ogranicz kroki.** Wystarczy 4-5 jasnych etapów wdrożenia.
- **Używaj prostego języka.** Komunikuj się w sposób zrozumiały dla użytkowników.

</aside>

### **Other progressive disclosure examples**

<aside>

![image - 2025-03-13T002509.329.jpeg](Progressive%20Disclosure%20in%20UX/image_-_2025-03-13T002509.329.jpeg)

Stopniowe ujawnianie występuje w różnych formach:

- **Podglądy treści:** Na blogach i portalach - pokazują fragment, by użytkownik mógł zdecydować o dalszej lekturze.
- **Akordeony:** W centrach pomocy i FAQ - ukrywają sekcje istotne dla konkretnych grup.
- **Menu rozwijane:** Oszczędzają miejsce na złożonych stronach.
- **Karuzele:** W e-commerce pokazują polecane produkty bez przeładowania strony.
- **Menu hamburgerowe:** Ukrywa rzadziej używane opcje nawigacji.
- **Leniwe ładowanie:** Ładuje treść stopniowo podczas przewijania.

</aside>

### **Testing progressive disclosure with users**

<aside>

Jakie metody testowania pomogą ocenić efektywność stopniowego ujawniania?

- **Moderowane i niemoderowane testy użyteczności:** Obserwacja użytkowników wykonujących zadania w naturalnym środowisku lub warunkach laboratoryjnych. Moderator identyfikuje obszary wymagające poprawy.
- **Wywiad kontekstowy:** Połączenie wywiadu i obserwacji użytkowników podczas korzystania z produktu w naturalnym środowisku. Pozwala porównać co użytkownicy *mówią* z tym co *robią*.
- **Testy A/B:** Porównanie różnych wersji interfejsu pod kątem efektywności.[[3]](https://app.uxcel.com/#anchor-3)

Alternatywne metody to testy partyzanckie, nagrywanie sesji, wywiady telefoniczne i sortowanie kart.

</aside>

### **References**

- [Progressive Disclosure](https://www.interaction-design.org/literature/book/the-glossary-of-human-computer-interaction/progressive-disclosure)  | The Interaction Design Foundation
- [Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/)  | Nielsen Norman Group
- [The Top 7 Usability Testing Methods | Adobe XD Ideas](https://xd.adobe.com/ideas/process/user-testing/top-7-usability-testing-methods/)  | Ideas