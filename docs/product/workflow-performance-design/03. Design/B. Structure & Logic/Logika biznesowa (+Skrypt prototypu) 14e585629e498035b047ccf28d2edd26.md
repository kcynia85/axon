---
template_type: crew
target_workspace: Design
---

# Logika biznesowa (+Skrypt prototypu)

### **Zasady działania procesów**

<aside>

Jakie reguły muszą zostać spełnione w określonych scenariuszach?

Kod rabatowy musi być ważny przez 30 dni od daty wygenerowania.

Co się dzieje, jeśli reguły nie są spełnione?

Jeśli kod rabatowy wygasł, system odrzuca go i wyświetla komunikat błędu.

</aside>

### **Walidacja danych**

<aside>

Jakie dane są wymagane, aby proces mógł się odbyć?

Email użytkownika musi być poprawnie sformatowany, zanim będzie można go zarejestrować.

Jakie warunki muszą spełniać dane?

Minimalna kwota zamówienia, aby użyć kodu rabatowego, wynosi 50 zł.

</aside>

### **Zależności między procesami**

<aside>

Jak różne procesy wpływają na siebie nawzajem?

Jeśli zamówienie zostało anulowane, kod rabatowy użyty w zamówieniu zostaje przywrócony do puli.

</aside>

### **Obsługa wyjątków**

<aside>

Jak system ma reagować na nietypowe lub błędne sytuacje?

Jeśli kod rabatowy jest używany wielokrotnie w tym samym zamówieniu, system blokuje transakcję.

</aside>

### **Reguły biznesowe a użytkownicy**

<aside>

Jakie zasady odnoszą się do użytkowników i ich interakcji z systemem?

Nowi użytkownicy otrzymują automatycznie kod rabatowy na 10% zniżki przy pierwszym zakupie.

</aside>

### **Priorytety i hierarchie**

<aside>

Co ma pierwszeństwo w działaniu systemu?

Jeśli jednocześnie jest aktywna promocja i kod rabatowy, promocja jest stosowana w pierwszej kolejności.

</aside>

### **Mechanizmy powiązane z domeną biznesową**

<aside>

Jak specyfika branży wpływa na procesy?

**W e-commerce:** Zamówienia powyżej 200 zł kwalifikują się do darmowej wysyłki.

**W bankowości:** Użytkownicy muszą przejść weryfikację tożsamości przed aktywacją konta.

</aside>

### **8. Metryki i dane wyjściowe**

<aside>

Jakie dane lub wyniki są generowane w wyniku procesu?

Każda transakcja zapisywana jest w systemie księgowym i przypisana do użytkownika.

</aside>

[Why](Logika%20biznesowa%20(+Skrypt%20prototypu)/Why%2014e585629e49809d9f8fcb6f37151d4d.md)