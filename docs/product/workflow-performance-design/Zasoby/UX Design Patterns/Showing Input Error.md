---
template_type: flow
---

# Showing Input Error

### **Zapobiegaj błędom od samego początku**

<aside>

❌

![image - 2025-03-12T010424.625.jpeg](Showing%20Input%20Error/image_-_2025-03-12T010424.625.jpeg)

✅

![image - 2025-03-12T010430.116.jpeg](Showing%20Input%20Error/image_-_2025-03-12T010430.116.jpeg)

Strategie zapobiegania błędom przy wprowadzaniu danych:

- **Ograniczenia:** Wyświetlanie odpowiedniej klawiatury (np. numerycznej dla numeru telefonu).
- **Elastyczne formatowanie:** Automatyczne formatowanie danych podczas wpisywania zamiast wymuszania konkretnego formatu.
- **Zmniejszenie obciążenia poznawczego:** Np. automatyczne wykrywanie kodów SMS zamiast ręcznego przepisywania.
- **Jasne instrukcje:** Zwięzłe i przejrzyste etykiety oraz wskazówki w formularzach.
</aside>

### **Keep the input in default state**

<aside>

![image - 2025-03-12T010435.638.jpeg](Showing%20Input%20Error/image_-_2025-03-12T010435.638.jpeg)

- Błędy w polach formularza powinny być dobrze widoczne, ale dopiero po wprowadzeniu danych przez użytkownika. Walidacja powinna odbywać się na bieżąco, gdy użytkownik kończy wpisywanie informacji w dane pole.
- Używaj walidacji w czasie rzeczywistym, aby potwierdzić poprawność wprowadzonych danych. To pomoże użytkownikom uniknąć niepewności przy wypełnianiu złożonych formularzy.
</aside>

### **Provide input masks to avoid errors**

<aside>

❌

![image - 2025-03-12T010446.118.jpeg](Showing%20Input%20Error/image_-_2025-03-12T010446.118.jpeg)

✅

![image - 2025-03-12T010449.943.jpeg](Showing%20Input%20Error/image_-_2025-03-12T010449.943.jpeg)

- Placeholdery (tekst zastępczy w polach formularza) mają ułatwiać wprowadzanie danych, ale często są mylone z już wypełnionymi polami. Co więcej, znikają po kliknięciu w pole, co może dezorientować użytkowników.
- Lepszym rozwiązaniem są maski wprowadzania, które automatycznie formatują dane (np. numery telefonu czy daty) podczas wpisywania. Zmniejsza to ryzyko błędów i ułatwia użytkownikom pracę.
</aside>

### **Signal error after loss of focus**

<aside>

❌

![image - 2025-03-12T010504.223.jpeg](Showing%20Input%20Error/image_-_2025-03-12T010504.223.jpeg)

✅

![image - 2025-03-12T010508.686.jpeg](Showing%20Input%20Error/image_-_2025-03-12T010508.686.jpeg)

- Po opuszczeniu pola wprowadzania system rozpoczyna walidację. W przypadku błędu wyświetl obok pola jasny komunikat z instrukcją poprawy.
- Ze względu na dostępność, komunikat o błędzie powinien być oznaczony odpowiednią ikoną.
</aside>

### **Meaningful error messages**

<aside>

❌

![image - 2025-03-12T010512.595.jpeg](Showing%20Input%20Error/image_-_2025-03-12T010512.595.jpeg)

✅

![image - 2025-03-12T010516.840.jpeg](Showing%20Input%20Error/image_-_2025-03-12T010516.840.jpeg)

Nawet przy najlepszych zabezpieczeniach, błędy przy wprowadzaniu danych się zdarzają. Ważne jest, by komunikaty o błędach były pomocne i zrozumiałe.

- **Prosty język:** Unikaj żargonu technicznego i strony biernej.
- **Zwięzłość:** Komunikat powinien być krótki i konkretny.
- **Precyzja:** Wskaż dokładnie, gdzie wystąpił błąd i jak go naprawić.
- **Uprzejmość:** Nie obwiniaj użytkownika, skup się na rozwiązaniu problemu.
</aside>

### **Return to default state upon reattempt**

<aside>

![image - 2025-03-12T010520.794.jpeg](Showing%20Input%20Error/image_-_2025-03-12T010520.794.jpeg)

Gdy użytkownik zauważy błąd i zrozumie jak go naprawić, powinien móc ponownie skupić się na polu wprowadzania. Po powrocie do pola, komunikat o błędzie powinien zniknąć, a pole wrócić do stanu domyślnego. W razie potrzeby dodaj pomocnicze wskazówki (np. wymagania dotyczące hasła), aby ułatwić poprawne wprowadzenie danych.

</aside>

### References

[Preventing User Errors: Avoiding Unconscious Slips](https://www.nngroup.com/articles/slips/?lm=error-message-guidelines&amp;pt=article) | Nielsen Norman Group

[How to Report Errors in Forms: 10 Design Guidelines](https://www.nngroup.com/articles/errors-forms-design-guidelines/) | Nielsen Norman Group

[Placeholders in Form Fields Are Harmful](https://www.nngroup.com/articles/form-design-placeholders/) | Nielsen Norman Group

[How to Make Your Copy More Readable: Make Sentences Shorter – PRsay](http://prsay.prsa.org/2009/01/14/how-to-make-your-copy-more-readable-make-sentences-shorter/)