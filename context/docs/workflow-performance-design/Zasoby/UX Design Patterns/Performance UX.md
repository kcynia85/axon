# Performance UX Patterns

> **Zasada:** Szybkość to "Feature". Odczuwalna wydajność (Perceived Performance) jest ważniejsza niż surowe milisekundy.

---

## 1. Perceived Performance (Odczuwalna wydajność)

### Zasada
Odczuwalna szybkość jest ważniejsza niż realna szybkość. Interfejs powinien natychmiast reagować wizualnie, nawet jeśli operacja backendowa trwa dłużej.

### Kiedy stosować
- Gdy backend ma opóźnienia lub duże obciążenie.
- Gdy ładowanie danych jest nieprzewidywalne.
- W interfejsach mobilnych, gdzie użytkownicy wymagają natychmiastowej reakcji.
- W aplikacjach z częstymi akcjami CRUD.
- W przepływach, gdzie bezczynność frustruje (formularze, koszyki zakupowe, feedy).

### Przykłady UI
- Kliknięcie „Like” powoduje natychmiastową zmianę stanu serca, a zapis na serwer idzie w tle.
- Po najechaniu na przycisk — mikroanimacja potwierdzająca „widzę Cię, działam”.
- Zamiast spinnnera na pełnym ekranie używasz skeletonów pozwalających ocenić strukturę contentu.
- Wyszukiwarka pokazuje „ładowanie wyników…” już po 100 ms, zanim pojawią się wyniki.

### Praktyki implementacyjne
- Stosuj skeletony zamiast spinnerów, aby od razu pokazać strukturę UI.
- Używaj Optimistic UI tam, gdzie ryzyko błędu jest niskie.
- Renderuj layout natychmiast — SSR, Server Components, streaming.
- Ogranicz liczbę zasobów blokujących render (fonty, CSS, JS).
- Podziel backendowe operacje na szybkie i wolne ścieżki (fast path).
- Emituj eventy loading state w warstwie API, by natychmiast zmieniać UI.
- Stosuj Scoped View Transitions, aby płynnie łączyć poprzedni i nowy stan UI.

---

## 2. Optimistic UI (Optymistyczny interfejs)

### Zasada
Interfejs zakłada, że akcja użytkownika się powiedzie — natychmiast pokazuje jej efekt, a dopiero potem wykonuje żądanie do serwera.

### Kiedy stosować
- Częste, powtarzalne akcje (like, follow, dodań do koszyka).
- Formularze z niskim ryzykiem błędu.
- Aplikacje społecznościowe i feedy.
- Systemy, gdzie szybkość reakcji buduje pozytywne emocje.

### Przykłady UI
- Po kliknięciu „Follow” przycisk natychmiast zmienia stan na „Following”, a request idzie w tle.
- Po wysłaniu wiadomości chat pokazuje ją od razu, a ewentualny błąd pojawia się później.
- „Dodano do koszyka” pojawia się natychmiast, nawet jeśli serwer jeszcze to zapisuje.

### Praktyki implementacyjne
- Korzystaj z bibliotek typu React Query, SWR, Zustand z optimistic updates.
- Aktualizuj lokalny stan natychmiast i odrocz zapis na serwer.
- Wysyłaj tzw. „mutation rollback” przy błędach zapisu.
- Komunikaty o błędach pokazuj dopiero po odpowiedzi backendu.
- Utrzymuj API o niskiej latencji dla operacji "optimistic".

---

## 3. Skeleton Screens & Shimmers

### Zasada
Zamiast pustych loaderów pokaż placeholdery przypominające finalny content (skeletony). Dają poczucie struktury i skracają odczuwalny czas oczekiwania.

### Kiedy stosować
- Listy, feedy, dashboardy.
- Karty z dynamiczną treścią (np. produkty, posty).
- Widoki, gdzie struktura jest powtarzalna.
- Każdy flow, gdzie spinner byłby zbyt „ciężki”.

### Przykłady UI
- Lista postów zaczyna od skeletonów kart, zanim dane się załadują.
- Profil użytkownika: avatar + placeholder nazwiska.
- Dashboard: skeleton wykresu + statystyk zanim pojawią się faktyczne wartości.
- Shimmer efekt (delikatny gradient) sugerujący „ładowanie”.

### Praktyki implementacyjne
- Twórz skeletony odwzorowujące dokładnie finalny layout.
- Dodawaj shimmer w sposób subtelny — delikatny gradient, niewielka animacja.
- Zastępuj spinner w pełnoekranowym widoku skeletonami.
- Dostosowuj skeletony do typu contentu: listy, karty, avatary, miniatury.
- Ukrywaj skeletony, gdy tylko pojawi się minimalny zestaw danych.

---

## 4. Lazy & Deferred Loading

### Zasada
Ładuj tylko to, czego użytkownik potrzebuje w danym momencie. Resztę dociągaj dopiero gdy stanie się istotna (scroll, klik, interakcja, viewport).

### Kiedy stosować
- Obrazki, wideo, ciężkie komponenty.
- Długie listy, galerie, feedy.
- Sekcje widoku rzadko używane.
- Aplikacje SPA, które mają ograniczenia wydajnościowe.

### Przykłady UI
- Obrazy ładują się dopiero, gdy zbliżają się do viewportu.
- Komponent mapy ładuje się dopiero po kliknięciu „Pokaż na mapie”.
- Sekcja „Opinie” na dole landing page’a ładuje się dopiero po przewinięciu.
- W aplikacji: moduł płatności ładuje się tylko w flow płatności.

### Praktyki implementacyjne
- Stosuj IntersectionObserver do ładowania elementów w momencie pojawienia się w viewport.
- W React używaj `dynamic()` oraz `import()` do ciężkich modułów.
- Ładuj obrazy dopiero po pojawieniu się nad nimi w scrollu (`loading="lazy"` lub `next/image`).
- Nie importuj dużych bibliotek, dopóki użytkownik nie otworzy danego flow.
- Dziel bundle na małe paczki zgodnie z realnymi ścieżkami user flow.

---

## 5. Immediate Feedback Patterns

### Zasada
Każda akcja użytkownika powinna mieć natychmiastowy, wizualny sygnał: klik, zmiana stanu, mikroanimacja, dźwięk, wibracja.

### Kiedy stosować
- Przyciski, inputy, przełączniki.
- Formularze, płatności, koszyki.
- Wszędzie tam, gdzie „cisza” może być odebrana jako błąd.
- Gdy sieć może lagować lub backend bywa wolny.

### Przykłady UI
- Minimalny „ripple” po kliknięciu w przycisk (mobile/web).
- Input podświetla się natychmiast po focus.
- Checkbox zmienia stan od razu, niezależnie od odpowiedzi serwera.
- Kliknięty kafelek zmienia kolor w czasie <100ms.

### Praktyki implementacyjne
- Mikroanimacje (max 100–150 ms) na klik, hover, focus.
- W formularzach pokazuj natychmiast zmianę stanu, nawet przed walidacją.
- W mobile wykorzystuj haptics (krótkie wibracje).
- Zdarzenia UI wywołuj natychmiast — backend odpala się w tle.
- Dla akcji z opóźnieniem dodawaj “loading state” w przycisku.

---

## 6. Time to First Interaction (TTFI)

### Zasada
Strona lub aplikacja powinna umożliwiać pierwszą interakcję tak szybko, jak to możliwe — nawet jeśli nie wszystkie dane są jeszcze załadowane.

### Kiedy stosować
- Landing pages i onboardingi.
- Dashboardy, gdzie użytkownik chce działać od razu.
- Aplikacje SPA, które mogą blokować interakcje podczas hydratacji.
- Każdy widok, w którym pierwsza akcja użytkownika jest kluczowa.

### Przykłady UI
- Pole wyszukiwania jest aktywne już w pierwszej sekundzie, a wyniki dogrywają się później.
- Dashboard: menu boczne działa od razu, a widgety ładują dane w tle.
- Formularz dostępny do wypełnienia, mimo że „suggestions” ładują się później.
- Interfejs działa (scroll, klik), nawet jeśli część skryptów JS jeszcze dojeżdża.

### Praktyki implementacyjne
- Nadaj priorytet klikalnym elementom: przyciski, inputy, nawigacja.
- Lazy load wszystkiego poza elementami potrzebnymi do działania w pierwszych sekundach.
- W React/Next.js stosuj RSC, streaming i partial hydration.
- Zmniejsz rozmiar “critical JS” do absolutnego minimum.
- Upewnij się, że UI działa (scroll, klik) nawet w trakcie ładowania skryptów.

---

## 7. Reducing Cognitive Load Through Motion

### Zasada
Subtelne animacje i przejścia pomagają użytkownikowi zrozumieć, co właśnie się wydarzyło. Ruch może być informacją i zmniejszać obciążenie poznawcze.

### Kiedy stosować
- Zmiany stanu (otwarcie, zamknięcie, przełączenie).
- Przejścia między ekranami lub sekcjami.
- Kiedy UI manipuluje dużą ilością danych.
- W interakcjach typu drag & drop.

### Przykłady UI
- Karta rozwija się płynnie, sugerując, skąd pochodzi content.
- Po dodaniu elementu do listy — subtelne „wślizgnięcie się” na swoje miejsce.
- Przejście do koszyka ma krótką animację 150 ms, budując kontekst zmiany.

### Praktyki implementacyjne
- Krótkie przejścia 120–200 ms pomagające zrozumieć zmianę kontekstu.
- Animacje oparte na CSS (wydajniejsze niż JS).
- Przesuwanie elementów zamiast nagłych zmian (fade + movement).
- Stosuj easing: ease-out i ease-in-out dla naturalnego ruchu.
- Animacje zawsze wspierają treść — nigdy jej nie przesłaniają.

---

## 8. Progressive Rendering & Streaming

### Zasada
Najpierw wyświetl najbardziej kluczowe elementy widoku, a mniej istotne dociągaj stopniowo (progressive rendering) lub strumieniowo (streaming SSR).

### Kiedy stosować
- Strony o dużej ilości danych (analytics, listy produktów).
- Widoki, które mogą wczytywać się długo.
- Aplikacje SSR, szczególnie Next.js z server components.
- Landing pages, gdzie first paint jest niezwykle ważny.

### Przykłady UI
- Dashboard pokazuje układ kart, ale dane w kartach dojeżdżają po kolei.
- Blog wczytuje tytuł i lead natychmiast, a zdjęcia i treść doczytują się w tle.
- Next.js: streamowanie sekcji hero jako pierwszej, a resztę w strumieniu.

### Praktyki implementacyjne
- W Next.js używaj Server Components + Suspense i streaming.
- Dostarczaj HTML w strumieniu, zaczynając od kluczowych elementów strony (hero, tytuły, układ).
- Renderuj skeletony dla ciężkich sekcji, zanim pojawią się dane.
- Dziel komponenty na mniejsze, aby szybciej wystartować rendering.
- W API umożliwiaj zwracanie częściowych odpowiedzi, jeśli to możliwe.

---

## 9. Responsiveness in Forms & Inputs

### Zasada
Inputy i formularze muszą reagować natychmiast — UI nie może czekać na backend, walidacje, ani przetwarzanie danych.

### Kiedy stosować
- Rejestracja, logowanie, onboardingi.
- Formularze z wielu kroków.
- Płatności online.
- Flowy o wysokim stresie dla użytkownika.

### Przykłady UI
- Input natychmiast podświetla błędne pole, a walidacja serwera pojawia się później.
- Po kliknięciu „Wyślij” przycisk zmienia stan na „Wysyłanie…”, bez zamrożenia UI.
- W formularzu płatności pola reagują od razu na focus/blur.

### Praktyki implementacyjne
- Instant feedback: focus/blur, stan błędu, walidacja wstępna.
- Oddziel walidację frontendową (natychmiastową) od backendowej (opóźnionej).
- Blokuj tylko te pola, które faktycznie muszą czekać na serwer.
- Stosuj postępowe mini-animacje (np. “sending…”).
- Optymalizuj kolejność ładowania skryptów związanych z formularzem.

---
## Źródła (Grounding)
*   [Perceived Performance](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Perceived%20Performance%202bd585629e4980039e7ae1dfe7d47f68.md)
*   [Optimistic UI](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Optimistic%20UI%202bd585629e4980a68703ccb5466ed77c.md)
*   [Skeleton Screens & Shimmers](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Skeleton%20Screens%20&%20Shimmers%202bd585629e49803da7aefddc2e9b4f82.md)
*   [Lazy & Deferred Loading Patterns](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Lazy%20&%20Deferred%20Loading%20Patterns%202bd585629e49800b885bec6ea5f85562.md)
*   [Immediate Feedback Patterns](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Immediate%20Feedback%20Patterns%202bd585629e49803eb752e170df981e8b.md)
*   [Time to First Interaction](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Time%20to%20First%20Interaction%202bd585629e4980efbd47fc548a7930a8.md)
*   [Reducing Cognitive Load Through Motion](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Reducing%20Cognitive%20Load%20Through%20Motion%202bd585629e49809f9b63ce3af9af9f00.md)
*   [Progressive Rendering & Streaming](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Progressive%20Rendering%20&%20Streaming%20(dla%20SPA%20SSR)%202bd585629e49806194a3d94948dffdc6.md)
*   [Responsiveness in Forms & Inputs](../../Raw/wzorce-projektowe-ux/Wzorce%20projektowe%20UX/Responsiveness%20in%20Forms%20&%20Inputs%202bd585629e498084a904e853dc86ca01.md)