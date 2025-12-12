# Checkout

<aside>

Strona kasy (checkout) to końcowy etap zakupów online, gdzie:

- Użytkownicy wprowadzają dane do wysyłki i płatności
- Potwierdzają zamówienie

Dobrze zaprojektowana strona kasy zwiększa konwersję, podczas gdy skomplikowana może prowadzić do porzucenia koszyka. Kluczem jest prostota i minimalizacja obciążenia poznawczego użytkownika.

</aside>

### **Display a progress tracker**

<aside>

❌

![image - 2025-03-12T002330.668.jpeg](Checkout/image_-_2025-03-12T002330.668.jpeg)

✅

![image - 2025-03-12T002334.490.jpeg](Checkout/image_-_2025-03-12T002334.490.jpeg)

Niezależnie od tego, czy proces zakupowy jest na jednej czy wielu stronach, ważne jest pokazanie użytkownikom postępu. Można to zrobić na dwa sposoby:

- Pasek postępu - pokazuje ile kroków zostało wykonanych i ile jeszcze pozostało
- Menu akordeonowe - wszystkie kroki na jednej stronie, użytkownik przewija w dół po wykonaniu każdego z nich

Podzielenie formularza na mniejsze części ułatwia jego wypełnienie i zmniejsza obciążenie poznawcze.

</aside>

### **Remove distractions**

<aside>

❌

![image - 2025-03-12T002341.499.jpeg](Checkout/image_-_2025-03-12T002341.499.jpeg)

✅

![image - 2025-03-12T002348.559.jpeg](Checkout/image_-_2025-03-12T002348.559.jpeg)

Celem każdej strony kasy jest finalizacja zakupu. Wszystko, co odwraca od tego uwagę użytkownika, jest zbędne - włączając w to górne menu nawigacyjne i stopki z linkami.

Aby zminimalizować rozproszenie uwagi:

- Ogranicz linki do minimum (zostaw tylko niezbędne, np. pomoc klienta)
- Umożliw modyfikację zamówienia bezpośrednio na stronie kasy
- Usuń reklamy i wyskakujące okienka
- Zamiast linków promocyjnych, użyj kodów do skopiowania

</aside>

### **Single-name vs separate name fields**

<aside>

Separate

![image - 2025-03-12T002359.295.jpeg](Checkout/image_-_2025-03-12T002359.295.jpeg)

Single

![image - 2025-03-12T002405.211.jpeg](Checkout/image_-_2025-03-12T002405.211.jpeg)

Czy używać pojedynczego pola "Imię i nazwisko" czy osobnych pól w procesie zakupowym?
To zależy od kontekstu:

Pojedyncze pole "Imię i nazwisko":

- Lepsze w kontekście międzynarodowym (np. w Japonii, Korei nazwisko jest przed imieniem)
- Przyspiesza wypełnianie formularza
- Zmniejsza ryzyko błędów na urządzeniach mobilnych

Osobne pola:

- Umożliwiają bardziej spersonalizowaną komunikację marketingową
- Wymagane w niektórych branżach (medyczna, rządowa, finansowa)
- Mogą być niezbędne ze względów technicznych (API)
</aside>

### **Ensure address hierarchy**

<aside>

❌

![image - 2025-03-12T002410.357.jpeg](Checkout/image_-_2025-03-12T002410.357.jpeg)

✅

![image - 2025-03-12T002413.757.jpeg](Checkout/image_-_2025-03-12T002413.757.jpeg)

W przypadku wysyłki międzynarodowej lub krajowej, kraj/województwo powinny być pierwszymi polami w formularzu. Pozwala to na:

- Dostosowanie pozostałych pól do wybranego regionu
- Wyświetlenie odpowiednich formatów adresów
- Pokazanie właściwych walut i jednostek miar

**Wskazówka!** Pamiętaj o dostosowaniu formatów numerów telefonów i adresów do wybranego kraju.

</aside>

### **Write clear error messages**

<aside>

❌

![image - 2025-03-12T002418.800.jpeg](Checkout/image_-_2025-03-12T002418.800.jpeg)

✅

![image - 2025-03-12T002422.809.jpeg](Checkout/image_-_2025-03-12T002422.809.jpeg)

Błędy są nieuniknione w każdym produkcie. Najważniejsze jest, jak pomagamy użytkownikom je naprawić. Komunikaty o błędach powinny być:

- Jasne i zwięzłe
- Uprzejme i konstruktywne
- Precyzyjne i zrozumiałe

W przypadku błędów użytkownika (np. błędny kod pocztowy), należy unikać obwiniania i jasno wskazać sposób naprawy. Warto też zadbać o czytelne etykiety formularzy i teksty przycisków, by zapobiegać błędom.

**Wskazówka!** Używaj języka przyjaznego dla użytkownika i zawsze wskazuj rozwiązanie problemu.

</aside>

### **Provide inline validation**

<aside>

❌

![image - 2025-03-12T002427.664.jpeg](Checkout/image_-_2025-03-12T002427.664.jpeg)

✅

![image - 2025-03-12T002433.254.jpeg](Checkout/image_-_2025-03-12T002433.254.jpeg)

Walidacja w czasie rzeczywistym jest kluczowa dla dobrego UX formularza:

- Sprawdzaj poprawność danych na bieżąco, nie czekaj do wysłania formularza
- Pokazuj zarówno błędy jak i poprawnie wypełnione pola
- Walidację uruchamiaj gdy użytkownik opuści pole (nie podczas wpisywania)

**Wskazówka!** Używaj kontrastowych kolorów (czerwony dla błędów, zielony dla poprawnych danych) oraz odpowiednich ikon.

</aside>

### **Enable autofill**

<aside>

❌

![image - 2025-03-12T002443.410.jpeg](Checkout/image_-_2025-03-12T002443.410.jpeg)

✅

![image - 2025-03-12T002446.998.jpeg](Checkout/image_-_2025-03-12T002446.998.jpeg)

Autouzupełnianie danych to kluczowy element wygodnego procesu zakupowego:

- Włącz autouzupełnianie dla podstawowych pól (imię, adres, email, telefon)
- Pozwól na zapisywanie danych kart płatniczych w przeglądarce
- Umożliw skanowanie kart kredytowych
- Zezwól na autouzupełnianie kodów OTP podczas płatności

Pamiętaj o bezpieczeństwie - używaj szyfrowania danych i zabezpieczeń biometrycznych (odcisk palca, skan twarzy) na urządzeniach mobilnych.

</aside>

### **Allow guest checkout**

<aside>

❌

![image - 2025-03-12T002452.958.jpeg](Checkout/image_-_2025-03-12T002452.958.jpeg)

✅

![image - 2025-03-12T002456.891.jpeg](Checkout/image_-_2025-03-12T002456.891.jpeg)

Badania pokazują, że wymuszanie rejestracji konta może zniechęcać użytkowników. Lepiej umożliwić zakupy bez rejestracji:

- Opcja "zakupy bez rejestracji" powinna być dobrze widoczna
- Warto zaoferować szybką rejestrację przez media społecznościowe

</aside>

### **Summarize the order details**

<aside>

❌

![image - 2025-03-12T002501.300.jpeg](Checkout/image_-_2025-03-12T002501.300.jpeg)

✅

![image - 2025-03-12T002504.434.jpeg](Checkout/image_-_2025-03-12T002504.434.jpeg)

Dodaj sekcję podsumowania zamówienia zawierającą:

- Zdjęcia produktów
- Ilości i ceny jednostkowe
- Koszty dostawy i podatki
- Szacowany czas dostawy

Pokazanie pełnego rozbicia kosztów zwiększa zaufanie użytkowników do sklepu.

</aside>

### **Allow different payment options**

<aside>

❌

![image - 2025-03-12T002514.770.jpeg](Checkout/image_-_2025-03-12T002514.770.jpeg)

✅

![image - 2025-03-12T002518.193.jpeg](Checkout/image_-_2025-03-12T002518.193.jpeg)

Według badań Baymard Institute, 9% użytkowników porzuca zakupy przez brak wygodnych metod płatności. Dlatego ważne jest:

- Zapewnienie łatwego i bezpiecznego procesu płatności
- Oferowanie najpopularniejszych metod płatności
- Stopniowe rozszerzanie opcji płatności wraz z rozwojem biznesu
</aside>

### **Simplify card number input**

<aside>

❌

![image - 2025-03-12T002532.284.jpeg](Checkout/image_-_2025-03-12T002532.284.jpeg)

✅

![image - 2025-03-12T002535.823.jpeg](Checkout/image_-_2025-03-12T002535.823.jpeg)

Podczas zbierania danych karty płatniczej:

- Używaj maski wprowadzania dla numeru karty (automatyczne formatowanie odstępów)
- Pobieraj odpowiednią walutę na podstawie wybranego kraju
- Automatycznie wykrywaj typ karty na podstawie pierwszych czterech cyfr

</aside>

### **Add visual signs of security**

<aside>

❌

![image - 2025-03-12T002541.072.jpeg](Checkout/image_-_2025-03-12T002541.072.jpeg)

✅

![image - 2025-03-12T002544.681.jpeg](Checkout/image_-_2025-03-12T002544.681.jpeg)

Chociaż większość użytkowników ocenia bezpieczeństwo strony intuicyjnie, projektanci mogą wzmocnić poczucie zaufania poprzez:

- **Certyfikaty bezpieczeństwa:** Symbole SSL od zaufanych dostawców oraz znaki jakości (np. Google Trusted Store) potwierdzające wiarygodność sklepu
- **Protokół HTTPS i kłódka:** Szyfrowana komunikacja oraz widoczny symbol kłódki w przeglądarce zwiększają poczucie bezpieczeństwa u użytkowników

</aside>

### **Provide order confirmation after payment**

<aside>

❌

![image - 2025-03-12T002553.443.jpeg](Checkout/image_-_2025-03-12T002553.443.jpeg)

✅

![image - 2025-03-12T002556.573.jpeg](Checkout/image_-_2025-03-12T002556.573.jpeg)

Nie pozostawiaj klientów w niepewności po złożeniu zamówienia. Potwierdź jego otrzymanie ekranem potwierdzenia oraz szczegółowym emailem zawierającym:

- Podsumowanie zamówienia i koszty
- Przewidywaną datę dostawy
- Link do śledzenia przesyłki
- Dane kontaktowe do obsługi klienta

**Wskazówka!** Optymalizacja procesu zakupowego to ciągły proces. Testuj rozwiązania z docelowymi użytkownikami i wprowadzaj ulepszenia na podstawie ich opinii.

</aside>

**References**

- [Error Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/) | Nielsen Norman Group
- [How to Report Errors in Forms: 10 Design Guidelines](https://www.nngroup.com/articles/errors-forms-design-guidelines/) | Nielsen Norman Group
- [Checkout Optimization: 5 Ways to Minimize Form Fields in Checkout](https://baymard.com/blog/checkout-flow-average-form-fields) | Baymard Institute
- [How Users Perceive Security During the Checkout Flow (Incl. New ‘Trust Seal’ Study 2022)](https://baymard.com/blog/perceived-security-of-payment-form) | Baymard Institute