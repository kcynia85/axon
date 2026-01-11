---
template_type: crew
---

# Pozycjonowanie sklepu

## Ogólnie o pozycjonowaniu

<aside>

- Często lepiej szukać nisz i słów kluczowych, które mają kilkaset lub kilka tysięcy zapytań.
- **Konwersja.** Mniej popularne słowa kluczowe często generują większą liczbę konwersji.
- Pomimo dobrego wypozycjonowania produktu, konkurencja może oferować szybszą dostawę i lepsze ceny.
- Na początku skup się na towarach, których obecnie masz najwięcej w magazynie.
- **Long-tail głupcze!**
</aside>

## Skuteczne pozycjonowanie e-sklepu

### Pozycjonowanie produktów sezonowych

<aside>

- Strategiczne myślenie na kilka miesięcy przed sezonem.
- Dla konkurencyjnych usług lokalnych to nawet 8 miesięcy
</aside>

### Pozycjonowanie na frazy SEO

https://alsoasked.com/

https://answerthepublic.com/

<aside>

- Treści informacyjne i edukacyjne powiązane z produktami
    
    "jak wybrać idealny materac dla zdrowego snu"
    
    "porównanie rodzajów filtrów do wody pitnej"
    
    "najlepsze ćwiczenia na płaski brzuch w domu"
    
</aside>

### Jak zadbać o indeksację podstron

<aside>

- Unikatowość i wysoka jakość treści.
    1. Oryginalne opisy produktów, odpowiadające na potrzeby klientów
    2. Naprawdę jakościowe artykuły 
- Regularne audyty techniczne
    1. Nieprawidłowe przekierowania
    2. Błędy w pliku robots.txt
    3. Długi czas ładowania strony
- Eliminowanie duplikatów treści
- Szybkie ładowanie i RWS
</aside>

## Voice Search — Optymalizacja pod wyszukiwanie głosowe

<aside>

- Analiza fraz kluczowych odpowiadających intencji użytkownika
- Przydatne, kompleksowe treści bez lania wody
- Przyjazny UX
- Logiczne linkowanie wewnętrzne
- Szybkość działania witryny
- Zwroty “Jak…” “Gdzie…” “Kiedy…”
</aside>

<aside>

**🗣️ Zoptymalizowanie nagłówków pod naturalne zwroty**

❌ “Pizza przepis”

❌ “Przepis na pizzę”

✅ “Jak upiec dobrą pizzę”

✅ “Jak zrobić dobrą pizzę w domu”

✅ “Przepis na dobrą

</aside>

## Pozycja zerowa

### Tekstowo / Semantycznie

<aside>

- Wysoka jakość contentu
- Prosty język
- Przejrzysta struktura treści (H1, H2, H3…)
</aside>

### [Schema.org](http://Schema.org) Uzupełnienie danych strukturalnych

[**Bylines & meta information**](https://www.notion.so/Bylines-meta-information-156585629e49807288affff434d4cf0c?pvs=21) 

<aside>

- Bardziej informacyjne wyniki, które zachęcają do kliknięcia
- Lepsza interpretacja treści przez wyszukiwarki
- Ułatwienie indeksowania i kategoryzacji wyszukiwania
- Potencjalnie wyższe wyniki w wyszukiwarce
- Możliwość wyświetlenia dodatkowych informacji o produkcie bezpośrednio w wynikach wyszukiwania
</aside>

<aside>

**Przykładowe znaczniki**

- Product
- AggregateRating
- Review
- BreadcrumbsList
- Organization
</aside>

<aside>

**Rodzaje danych strukturalnych**

JSON-LD

Produkt & Recenzja

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Buty do biegania XYZ",
  "image": "https://example.com/buty.jpg",
  "description": "Buty do biegania z najlepszą amortyzacją.",
  "sku": "12345",
  "mpn": "98765",
  "brand": {
    "@type": "Brand",
    "name": "SportShoes"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/buty-do-biegania",
    "priceCurrency": "PLN",
    "price": "299.99",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "89"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Jan Kowalski"
      },
      "datePublished": "2024-10-10",
      "reviewBody": "Bardzo wygodne i wytrzymałe buty do biegania.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    }
  ]
}
</script>

```

Artykuł

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Jak trafić do Featured Snippet",
  "author": {
    "@type": "Person",
    "name": "Jan Kowalski"
  },
  "datePublished": "2024-11-11",
  "publisher": {
    "@type": "Organization",
    "name": "Przykładowy Wydawca",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
</script>
```

</aside>

<aside>

**Microdata w HTML**

Produkt & Recenzja

```html
<div itemscope itemtype="https://schema.org/Product">
  <h2 itemprop="name">Buty do biegania XYZ</h2>
  <img itemprop="image" src="https://example.com/buty.jpg" alt="Buty do biegania XYZ" />
  <p itemprop="description">Buty do biegania z najlepszą amortyzacją.</p>
  <span itemprop="sku">12345</span>
  
  <div itemprop="brand" itemscope itemtype="https://schema.org/Brand">
    <span itemprop="name">SportShoes</span>
  </div>

  <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
    <link itemprop="url" href="https://example.com/buty-do-biegania" />
    <span itemprop="priceCurrency" content="PLN">PLN</span>
    <span itemprop="price" content="299.99">299.99</span>
    <link itemprop="availability" href="https://schema.org/InStock" />
    <link itemprop="itemCondition" href="https://schema.org/NewCondition" />
  </div>

  <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
    <span itemprop="ratingValue">4.5</span> na podstawie <span itemprop="reviewCount">89</span> recenzji.
  </div>

  <div itemprop="review" itemscope itemtype="https://schema.org/Review">
    <span itemprop="author" itemscope itemtype="https://schema.org/Person">
      <span itemprop="name">Jan Kowalski</span>
    </span>
    <meta itemprop="datePublished" content="2024-10-10" />
    <p itemprop="reviewBody">Bardzo wygodne i wytrzymałe buty do biegania.</p>
    <div itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
      <span itemprop="ratingValue">5</span> na <span itemprop="bestRating">5</span>
    </div>
  </div>
</div>

```

Artykuł

```html
	<article itemscope itemtype="https://schema.org/Article">
  <h1 itemprop="headline">Jak trafić do Featured Snippet</h1>
  <span itemprop="author">Jan Kowalski</span>
  <meta itemprop="datePublished" content="2024-11-11" />
  <div itemprop="publisher" itemscope itemtype="https://schema.org/Organization">
    <span itemprop="name">Przykładowy Wydawca</span>
    <img itemprop="logo" src="https://example.com/logo.png" alt="Logo" />
  </div>
</article>
```

</aside>

<aside>

**Open Graph (OG)**

https://ogp.me/

</aside>

## Wyszukiwania lokalne

<aside>

- Prawidłowe wypełnienie wizytówki
- Tworzenie treści które:
    1. Odnoszących się do miasta + charakteru branży
    2. Zoptymalizowane są pod frazy kluczowe miasta
        
        ❌ “Restauracja Białystok”
        
        ✅ “Znajdź mi dobre restauracje w Białymstoku”
        
</aside>

## SXO (SEO+UX)

<aside>

- Zwiększenie zaangażowania - wydłuża czas spędzony na stronie
- Redukuje współczynnik odrzuceń - pozytywny sygnał dla wyszukiwarek
- Poprawia wskaźnik konwersji - ułatwienie procesu zakupowego
- Buduje zaufanie i lojalność klientów - zwiększając współczynnik LTV
- Wspiera pozycjonowanie długiego ogona - lepsze dopasowanie treści do intencji użytkownika
- Poprawia wyniki Core Web Vitals - istotny wskaźnik rankingowy
- Ułatwia odkrywanie produktów - zwiększenie średniej wartości koszyka
- Wspiera budowanie marki - pozytywne doświadczenie zakupowe
- Zmniejsza liczbę porzuconych koszyków - przez intuicyjny proces checkoutu
</aside>

## 10 Przykazań SEO

<aside>

1. Szybkie wczytywanie strony
2. Unikatowe i wartościowe treści
3. Optymalizacja pod mobile
4. Przygotowanie strategii SEO już na etapie projektowania e-sklepu
    1. Przyjazna struktura SEO pod adresy URL
    2. Logiczna struktura kategorii i podstron
    3. Narzędzie Google Search Console
5. Wdrożenie znaczników Schema [[Schema.org](http://Schema.org) Uzupełnienie danych strukturalnych](https://www.notion.so/Schema-org-Uzupe-nienie-danych-strukturalnych-13b585629e4980ea91ffe35f22f0e8db?pvs=21) 
6. Regularne audyty
7. Dbanie o indeksacje podstron [Jak zadbać o indeksację podstron](https://www.notion.so/Jak-zadba-o-indeksacj-podstron-13b585629e4980319710d79c73eefd1b?pvs=21) 
8. Optymalizacja obrazów
    1. Nowe formaty: WebP, AVIF, JPEG XL
    2. Alty i dobre praktyki
9. Optymalizowanie stron kategorii
    1. Dodanie opisów wyjaśniających specyfikę danej kategorii
    2. Porady dotyczące wyboru produktów
    3. Informacje o najnowszych trendach
    4. Wykorzystanie fraz z długiego ogona
    5. Filtry i sortowanie
10. Zadbaj o SXO (SEO + UX) [SXO (SEO+UX)](https://www.notion.so/SXO-SEO-UX-13b585629e49800b9fc0e43922ed4e61?pvs=21) 
</aside>

### Techniczne SEO

[Screaming Frog SEO Spider Website Crawler](https://www.screamingfrog.co.uk/seo-spider/)

<aside>

- Wyszukiwanie stron 404
- Problemy z indeksacją
- Duplikaty treści
- Brakujące tagi meta
</aside>

## Media relations

<aside>

- Tworzenie i dystrybucja informacji prasowych
- Nawiązywanie i utrzymywanie kontaktów z dziennikarzami
- Monitorowanie obecności marki zarówno w internecie, jak i mediach społecznościowych
</aside>