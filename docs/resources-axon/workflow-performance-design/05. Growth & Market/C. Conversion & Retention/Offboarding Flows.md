# Offboarding Flows (Procesy Rezygnacji)

> **Cel:** Zatrzymanie użytkownika w momencie rezygnacji (Win-back) lub zebranie wartościowego feedbacku.
> **Filozofia:** "Anulowanie to nie koniec relacji. To zmiana statusu."

---

## 1. The "Save" Flow (UX Pattern)

Zamiast natychmiastowego przycisku "Usuń konto", zastosuj 3-stopniowy lejek obronny.

### Krok 1: Walidacja Decyzji & Feedback
**UI:** Modal / Ekran
**Copy:** "Przykro nam, że odchodzisz. Czy możesz nam powiedzieć dlaczego? Pomoże nam to ulepszyć produkt."
**Opcje (Radio Buttons):**
1.  Za drogo / Nie stać mnie. -> [Idź do Ścieżki A]
2.  Brakujące funkcje. -> [Idź do Ścieżki B]
3.  Nie używam tego wystarczająco często. -> [Idź do Ścieżki C]
4.  Przechodzę do konkurencji. -> [Idź do Feedbacku Otwartego]
5.  Problemy techniczne / Błędy. -> [Idź do Support Ticket]

### Krok 2: Oferta Ratunkowa (The Offer)
Wyświetlana dynamicznie na podstawie odpowiedzi z Kroku 1.

**Ścieżka A (Cena):**
*   **Propozycja:** "Rozumiemy. Co powiesz na **50% zniżki na kolejne 3 miesiące**? Pozwoli Ci to zostać z nami taniej."
*   **CTA:** [Zostań za -50%] vs [Kontynuuj anulowanie]

**Ścieżka B (Funkcje) / C (Częstotliwość):**
*   **Propozycja:** "Nie trać swoich danych. Zamiast usuwać konto, **zawieś subskrypcję (Pause)**. Twoje dane będą bezpieczne, a Ty nie płacisz, dopóki nie wrócisz."
*   **CTA:** [Zawieś konto (Pause)] vs [Kontynuuj anulowanie]

### Krok 3: Finalizacja i Offboarding
Jeśli użytkownik nadal chce odejść - pozwól mu na to z klasą.
**Copy:** "Twoja subskrypcja wygaśnie [Data]. Twoje dane będą dostępne do tego czasu. Zawsze możesz do nas wrócić."
**CTA:** [Reaktywuj Subskrypcję] (Widoczne do ostatniego dnia).

---

## 2. Dunning Emails (Odzyskiwanie Płatności)

Gdy karta płatnicza zostanie odrzucona (Involuntary Churn).

### Mail 1: Dzień 0 (Zaraz po błędzie)
**Temat:** Ups! Mały problem z Twoją płatnością 💳
**Treść:**
"Cześć [Imię],
Twój bank właśnie odrzucił płatność za [Produkt]. To się zdarza (często to kwestia limitów lub daty ważności).
Twoje konto jest aktywne jeszcze przez 3 dni, ale zaktualizuj dane, żeby nie stracić dostępu do [Kluczowa Wartość].
[Zaktualizuj Kartę →]"

### Mail 2: Dzień 3 (Ostrzeżenie)
**Temat:** Twoje konto zostanie wstrzymane jutro
**Treść:**
"Cześć [Imię],
To tylko przypomnienie. Jutro nie będziemy mogli przedłużyć Twojej subskrypcji.
Nie chcemy, żebyś stracił dostęp do swoich projektów.
[Napraw płatność tutaj →]"

### Mail 3: Dzień 7 (Po wygaśnięciu - Win-back)
**Temat:** Tęsknimy! Wróć do nas
**Treść:**
"Twoje konto zostało zawieszone, ale Twoje dane są bezpieczne przez kolejne 30 dni.
Kiedy będziesz gotowy, czekamy na Ciebie.
[Wznów subskrypcję →]"

---

## 3. Win-Back Email (Dla "martwych dusz")
Dla użytkowników, którzy sami odeszli 30+ dni temu.

**Zasada:** Nie pisz "Wróć". Pisz "Zobacz co nowego".

**Temat:** Naprawiliśmy to, co Cię denerwowało 🛠️
**Treść:**
"Cześć [Imię],
Minęło trochę czasu! Kiedy byłeś z nami ostatnio, brakowało nam [Funkcja X] i [Funkcja Y].
Wzięliśmy to sobie do serca. Właśnie wdrożyliśmy [Funkcja X].
Chcesz zobaczyć jak to działa?
[Zobacz Nowości →]
PS. Tutaj kod na -20% na powrót: WELCOMEBACK"
