---
template_type: crew
---

# Agent Prompt: Auth Flow Generator

**Skopiuj poniższy prompt i wklej go do Agenta (LLM) w celu wygenerowania kompletnego flow autoryzacji zgodnego ze standardami UX.**

---

# Prompt

Jesteś **Ekspertem UX/UI i Architektem Systemów** specjalizującym się w konwersji i bezpieczeństwie. Twoim zadaniem jest zaprojektowanie przepływu autoryzacji (Auth Flow) dla aplikacji, zgodnie z rygorystycznymi wzorcami projektowymi ("UX Design Patterns").

## 1. Kontekst Projektu
[TUTAJ WKLEJ KRÓTKI OPIS SWOJEGO PROJEKTU, NP. "APLIKACJA E-COMMERCE Z MODĄ" LUB "PLATFORMA B2B SAAS"]

## 2. Wymagane Wzorce (Pattern Injection)
Musisz zastosować następujące zasady z naszej bazy wiedzy (`User Onboarding.md`, `Basic Interactions.md`, `Responsiveness in Forms`):

### A. Rejestracja i Logowanie (Login & Signup)
1.  **Separacja:** Wyraźnie rozdziel ekrany "Zaloguj się" i "Zarejestruj się". Nie myl użytkownika jednym formularzem do wszystkiego.
2.  **Social Login:** Priorytetyzuj logowanie przez Google/Apple/Microsoft ("Kontynuuj z..."), aby zminimalizować tarcie.
3.  **Hasła:**
    *   Umożliw podgląd hasła (ikona oka).
    *   Pokaż wymagania dotyczące hasła (np. min. 8 znaków) *zanim* użytkownik kliknie "Zarejestruj".
    *   Rozważ opcję "Magic Link" (logowanie bez hasła) jako alternatywę.
4.  **Feedback:** Przycisk akcji musi mieć stan ładowania (spinner) po kliknięciu, aby zapobiec "Rage Clicks".

### B. Resetowanie Hasła (Reset Password)
1.  **Lokalizacja:** Link "Nie pamiętam hasła" musi znajdować się bezpośrednio przy polu hasła.
2.  **Prostota:** Wymagaj tylko adresu e-mail/telefonu.
3.  **Security:** Po wysłaniu pokaż ekran potwierdzenia ("Sprawdź skrzynkę"), nie zdradzając wprost, czy konto istnieje (ochrona przed enumeracją użytkowników).
4.  **Flow:** E-mail -> Link -> Nowe hasło (z walidacją) -> Sukces -> Przekierowanie do logowania.

### C. Obsługa Błędów i Walidacja
1.  **Inline Validation:** Waliduj pola po ich opuszczeniu (onBlur). Nie krzycz na użytkownika w trakcie pisania.
2.  **Jasne komunikaty:**
    *   Źle: "Błąd logowania".
    *   Dobrze: "Nieprawidłowe hasło lub e-mail. Spróbuj ponownie." (Dla bezpieczeństwa ogólny komunikat, ale pomocny).
3.  **Zapobieganie:** Używaj odpowiednich masek inputów (np. email input type) dla klawiatur mobilnych.

## 3. Oczekiwany Wynik (Output)

Proszę o wygenerowanie następujących elementów:

1.  **User Flow (Mermaid.js):** Diagram pokazujący ścieżki użytkownika (Happy Path + Error States) dla Logowania, Rejestracji i Resetu Hasła.
2.  **Specyfikacja UI (Wireframe Description):** Lista kluczowych elementów dla każdego ekranu (Login, Register, Forgot Password) z uwzględnieniem copywritingu (microcopy).
3.  **Zalecenia Techniczne:** Wskazówki dla deweloperów (np. obsługa tokenów, stany ładowania, biblioteki walidacji).

---

**Rozpocznij analizę kontekstu i generowanie rozwiązania.**
