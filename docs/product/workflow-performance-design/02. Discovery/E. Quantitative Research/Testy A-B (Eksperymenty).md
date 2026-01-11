---
template_type: crew
target_workspace: Discovery
---

# Testy A/B (Eksperymenty)

> **Cel:** Naukowa weryfikacja hipotez. Koniec ze zgadywaniem.
> **Hierarchia Dowodów:** Eksperyment > Analityka > Opinia Eksperta > Intuicja.

---

## 1. Formularz Testu A/B (Szablon)

Zanim odpalisz test, wypełnij tę kartę. To Twoja "polisa ubezpieczeniowa" przed błędnymi wnioskami.

| Element | Opis / Wartość |
| :--- | :--- |
| **Hipoteza** | **Jeśli** [Zmienimy X] <br> **To** [Metryka Y wzrośnie o Z%] <br> **Ponieważ** [Uzasadnienie psychologiczne/dane] |
| **Metryka Sukcesu (KPI)** | Np. Conversion Rate, Revenue per User, Add to Cart Rate. |
| **Grupa Badawcza** | Np. Nowi użytkownicy Mobile z Polski. |
| **Wielkość Próby** | Użyj kalkulatora (np. Optimizely). Ile osób na wariant? |
| **Czas Trwania** | Min. 1-2 pełne cykle biznesowe (tygodnie). Uwaga na sezony! |

### Przykłady Hipotez
1.  **Bundle Feature:** *Jeśli dodamy opcję "Kup w zestawie", to AOV wzrośnie o 1%, ponieważ ludzie lubią gotowe rozwiązania (Bundle Bias).*
2.  **Social Proof:** *Jeśli dodamy "X osób ogląda ten produkt", to Konwersja wzrośnie o 3%, ponieważ uruchomi to efekt owczego pędu (Social Proof).*
3.  **Defaults:** *Jeśli domyślnie zaznaczymy PayPal, to CR wzrośnie o 2%, ponieważ oszczędza to zasoby poznawcze.*

---

## 2. Priorytetyzacja (Model PIE)

Masz 10 pomysłów na testy? Wybierz jeden używając PIE (ocena 1-10):

1.  **P (Potential):** Jak duży wzrost może to dać? (Zmiana buttona = mały, Zmiana checkoutu = duży).
2.  **I (Importance):** Jak ważna jest ta strona? (Strona Główna = duża, "O nas" = mała).
3.  **E (Ease):** Jak łatwo to wdrożyć? (Zmiana tekstu = 10, Nowa funkcja = 2).

*Średnia z tych ocen pokaże Ci, co robić najpierw.*

---

## 3. Analiza Wyników (Czy to działa?)

### Kluczowe pojęcia
*   **Istotność Statystyczna (Confidence):** Celujemy w **95%** (p < 0.05). Oznacza to, że na 95% wynik nie jest dziełem przypadku.
*   **Moc Testu (Power):** Zdolność wykrycia zmiany. Standard to **80%**.

### Decyzja (Wstępna)
| Wynik | Akcja |
| :--- | :--- |
| **Wygrywa B (Confidence > 95%)** | Wdrażamy na 100%. Świętujemy. |
| **Remis / Brak istotności** | Nie wdrażamy (szkoda kosztów utrzymania kodu). Uczymy się - dlaczego nie zadziałało? |
| **Przegrywa B** | Wracamy do grupy kontrolnej A. Analizujemy błąd w hipotezie. |

---

## 4. Zalecenia i Następne Kroki (Recommendations)

Sama liczba to za mało. Musisz zdecydować co dalej, patrząc na szerszy kontekst (koszty, ryzyko).

| Scenariusz | Rekomendacja / Akcja |
| :--- | :--- |
| **Wynik pozytywny, ale drogie wdrożenie** | Jeśli koszt techniczny jest wysoki, a zysk niewielki: Zrób rollout na 50% użytkowników i monitoruj przez kolejny miesiąc. |
| **Confidence 85-90% (Blisko)** | Jeśli trend jest silny, ale brakuje pewności: Przedłuż test o tydzień lub zwiększ próbę badawczą. |
| **Wzrost KPI, ale spadek innych** | Jeśli konwersja rośnie, ale AOV spada: Analizuj wpływ na przychód całkowity. Nie optymalizuj jednej metryki kosztem biznesu. |
| **Segmentacja (Ukryte skarby)** | Sprawdź wyniki w podgrupach. Może zmiana działa świetnie na Mobile, ale psuje Desktop? |

### Lista Kontrolna Decyzji
1.  [ ] Czy koszt wdrożenia (Dev + Utrzymanie) zwraca się w zysku z optymalizacji?
2.  [ ] Czy wynik jest stabilny w czasie (nie był to "pik nowości")?
3.  [ ] Czy sprawdziłem segmenty (Mobile vs Desktop, New vs Returning)?
4.  [ ] Czy warto przeprowadzić badania jakościowe (IDI), żeby zrozumieć *dlaczego* tak się stało?

---

## ⚠️ Pułapki (Watch out!)
1.  **Zbyt krótki czas:** Testowanie przez 2 dni (pomija weekendy).
2.  **Zbyt wiele zmian:** Zmieniasz nagłówek, kolor i zdjęcie naraz. Nie wiesz, co zadziałało.
3.  **Zatrzymywanie za wcześnie:** "O, wariant B prowadzi po godzinie! Kończymy!". To błąd (Peeking).
4.  **Szum (Test A/A):** Warto czasem puścić test A/A (identyczne wersje), żeby sprawdzić, czy narzędzie nie kłamie.

---

## 🔗 Narzędzia
*   **Kalkulator Próby:** [Optimizely Sample Size Calculator](https://www.optimizely.com/sample-size-calculator/)
*   **Kalkulator Wyników:** [AB Test Guide (Bayesian)](https://abtestguide.com/bayesian/)
