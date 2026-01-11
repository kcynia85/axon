---
template_type: crew
---

# Techniques

### Meta prompts

```markdown
Jako światowej klasy prompt engineer, pomożesz mi w modyfikacji mojego 
promptu. Za moment Ci go podam, więc przeczytaj go i powiedz "rozumiem." 
aby potwierdzić gotowość...
```

### Zero shot prompting

Tworzenie promptów bez użycia jakichkolwiek przykładów

```xml
SYSTEM

You're a task classifier. Since now, user's messages 
are his tasks descriptions. Scan them for any mention
of "daily win" phrase. Return "true or "false" depending
on this presence.
```

### One shot prompting

Tworzenie promptów z wykorzystaniem jednego przykładu

```xml
Answer yes or no

###
example
- Earth is flat?
- no

USER
- Banana is blue?

ASSISTANT
- No
```

### Few shot prompting

Tworzenie promptów na podstawie kilku przykładów rozwiązania podobnego problemu

```markdown
Przykład 1:
Tekst: "I can’t wait for the weekend!"
Emocja: Podekscytowanie

Przykład 2:
Tekst: "I feel so sad and lonely."
Emocja: Smutek

Tekst: "That was hilarious!"
Emocja:
```

### Leveling (3 Levels)

Inspiration

```
❌ Write a tagline for a new eco sneaker brand
✅ Draft a tagline for our eco-friendly sneakers emphasizing "comfort", 
"urban style", and "sustainability".
```

First Level: Open-ended inspiration

```
✅ Write a homepage headline for my eco-friendly brand.
```

Second level: Guided creativity

```
✅ Using Tagline A as a base, draft a headline for my eco-friendly brand.
```

Third level: Detailed blueprint

```
✅ Referring to Tagline A, B, and C, write a homepage headline emphasizing
sustainability, zero-waste, and community. Ensure it's short and engaging.
```

```xml
Please classify the user's recent message to eduweb/easy/other categories, 
based on its content, description and examples below.

Return single-line JSON with "category" property.

eduweb: online teaching or courses 
easy_: develpoment, online selling, e-commerce, subscriptions

u: fix bug in checkout
a: {"category": "easy"}
```

### Reflexion

<aside>

Technika umożliwiająca samodzielne weryfikowanie i poprawianie generowanych odpowiedzi przez model.

![Untitled](Techniques/Untitled.png)

```json
An additionally question after received answer:

1. Czy Twoja odpowiedź spełniła moje warunki?
```

</aside>

### Reverse engineering

![Untitled](Techniques/Untitled%201.png)

![Untitled](Techniques/Untitled%202.png)

### Prompt chaining

<aside>

- Wykorzystanie wyniku jednego prompta jako kontekstu w kolejnym poleceniu
- Pomaga modelowi rozwiązywać złożone problemy, dzielać je na mniejsze kroki
</aside>

<aside>

**Jak działa**

- Podziel zadanie na logiczne kroki
- Stwórz prompt dla każdego kroku
- Używaj kroków jako danych wejściowych do kolejnych promptów
</aside>

<aside>

**Jak efektywniej wykorzystać chain prompting?**

1. Używaj punktów kontrolnych
    
    Okresowo proś model o krótkie podsumowanie ogólnego celu
    
2. Pracuj nad podzadaniami
Podziel złożone zadania na mniejsze części. Traktuj każe podzadanie jako krótszy łańcuch, zanim przejdziesz do następnego kroku
3. Podsumuj i przekieruj
Jeśli model odbiega od celu, podsumuj kluczowe informacje i skieruj go z powrotem do głównego celu
</aside>

### Chain of Thought (CoT)

<aside>

Polega na tym, że w promptcie zachęcasz model do **„myślenia krok po kroku”** (np. *„Pokaż swoje rozumowanie krok po kroku”*).

```markdown
**Prompt:** Klient kupuje w sklepie internetowym 3 produkty:
- Koszulka: 80 zł
- Spodnie: 120 zł
- Buty: 200 zł

Łącznie klient dostaje rabat 10%. 
Koszt dostawy to 15 zł.

Oblicz całkowitą kwotę do zapłaty. Pomyśl krok po kroku.
```

</aside>