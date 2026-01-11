---
template_type: crew
---

# Studium przypadku PRD — „Szybka Rejestracja w Aplikacji Fitness” (Single-Module → UX)

### **Kontekst**

Firma FitLife zauważyła spadek aktywacji nowych użytkowników. 62% osób, które instalują aplikację, nie kończy rejestracji. Zespół decyduje się przebudować proces onboarding → rejestracja.

PRD ma odpowiedzieć na pytanie: **Jak zaprojektować szybszą, bardziej intuicyjną i przyjazną rejestrację?**

---

# 1. **Wizja i cel biznesowy**

### Wizja

Stworzyć błyskawiczną rejestrację, która usuwa tarcie, skraca czas pierwszego uruchomienia i zwiększa odsetek osób, które przechodzą do pierwszego treningu.

### Cel biznesowy

- Zwiększyć aktywację (new user activation rate) z **38% → 55%** w ciągu 3 miesięcy.
- Skrócić średni czas rejestracji o 40%.
- Zmniejszyć liczbę porzuconych procesów rejestracji o 50%.

---

# 2. **Insight z badań**

Zespół zebrał dane z:

- 12 wywiadów z nowymi użytkownikami,
- analizy funnelu,
- opinii ze wsparcia,
- podglądu w Session Replay.

### Najważniejsze odkrycia

- Użytkownicy nie chcą wypełniać 8 pól na starcie.
- 74% osób nie rozumie, dlaczego musi podać wagę *już przy rejestracji*.
- Użytkownicy chcą „log in with Google/Apple”, bo „chcę mieć to z głowy”.
- Ekrany są długie, skomplikowane, bez podpowiedzi.

**Insight:**

Użytkownik chce wejść do aplikacji jak na TikToka: *szybko, łatwo, bez blokad*.

---

# 3. **Zakres i ograniczenia**

### Zakres projektu

- przebudowa ekranu rejestracji,
- dodanie „Continue with Google” i „Continue with Apple”,
- uproszczenie formularzy,
- przeniesienie danych zdrowotnych na późniejsze etapy.

### Ograniczenia:

- Brak możliwości usunięcia podania wieku — wymagane prawnie (fitness dla +16).
- Integracja z Apple ID wymaga certyfikacji (czas).
- Backend obsłuży tylko 3 dodatkowe pola poza e-mailem.

---

# 4. **User flow — jak wygląda nowa rejestracja**

### **Stary flow**

Onboarding → formularz (8 pól) → potwierdzenie e-mail → wybór celu → start

### **Nowy flow**

1. Użytkownik otwiera aplikację.
2. Ekran:
    - „Kontynuuj z Apple / Google / e-mailem”.
3. Jeśli e-mail → tylko 2 pola:
    - e-mail
    - hasło
4. Wiek pobierany z promptu po rejestracji (osobny krok).
5. Po wejściu do aplikacji dopiero pojawia się onboarding fitness.
6. Użytkownik może zacząć trening w 15 sekund.

---

# 5. **Scenariusze i edge cases**

### Scenariusz 1:

Użytkownik wybiera Google → loguje się → trafia do Home → wyświetla się paskowy banner: „Uzupełnij swój cel treningowy”.

### Scenariusz 2:

Użytkownik podaje e-mail → hasło → aplikacja wykrywa konto → pokazuje ekran logowania zamiast błędu.

### Edge cases:

- E-mail w użyciu → wyświetl komunikat z CTA: „Zaloguj się”.
- Apple ID brak zgody na e-mail → tworzymy konto z adresem losowym (relay).
- Po 3 nieudanych próbach → captcha.

---

# 6. **KPI i metryki sukcesu**

- **Activation rate**: liczba osób, które zaczęły pierwszy trening.
- **Registration funnel completion** (nowy vs. stary).
- **Czas rejestracji** — telemetry.
- **% rejestracji przez Google/Apple**.
- **Drop-off rate** na każdym kroku.

Cel:

→ aktywacja +17 p.p.

→ formularz skrócony o 43% czasu.

---

# 7. **Wymagania funkcjonalne (wycinek)**

### F1. Logowanie społecznościowe

- obsługa Google OAuth 2.0
- obsługa Apple Sign-in
- fallback: rejestracja e-mailowa

### F2. Uproszczony formularz

- maks. 2 pola wejściowe
- walidacja w czasie rzeczywistym

### F3. Odsunięcie danych zdrowotnych

- dodatkowy onboarding jako osobny komponent, uruchamiany po treningu lub po 24h.

---

# 8. **Benchmark – jak robią to inni**

- Strava — 1 krok, logowanie Apple/Google na starcie.
- Calm — minimalna liczba pól, dane osobiste pobierane później.
- Duolingo — „start first, register later”.

---

# 9. **Backlog wysokopoziomowy**

| Pozycja | Wartość | Priorytet |
| --- | --- | --- |
| Integracja Google | największa redukcja tarcia | P1 |
| Integracja Apple | wymóg App Store | P1 |
| Nowy formularz | skraca czas o 40% | P1 |
| Nowy flow onboarding | poprawia aktywację | P2 |
| Banner „Uzupełnij dane” | zachęca do danych fitness | P3 |

---

# ✨ **Efekt końcowy PRD – decyzja produktowa**

Po opracowaniu PRD zespół decyduje:

**„Wprowadzamy uproszczoną ścieżkę rejestracji, przenosimy dane fitness na później oraz wdrażamy logowanie social. Celem jest maksymalne skrócenie czasu pierwszego wejścia do aplikacji.”**