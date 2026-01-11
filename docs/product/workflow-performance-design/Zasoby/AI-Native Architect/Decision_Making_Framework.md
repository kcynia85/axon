---
template_type: crew
---

# Decision Making Framework for AI Agents

> **Cel:** Ten dokument dostarcza Agentowi AI zestawu ram decyzyjnych, które pomagają w wyborze najlepszej strategii działania w zależności od kontekstu zadania, dostępnych narzędzi i potencjalnych ryzyk.

---

## 🚀 Core Decision Matrix

| Sytuacja / Wyzwanie | Główna Zasada | Rekomendowana Akcja (Heurystyka) | Narzędzia Priorytetowe | Anty-Wzorce (Czego Unikać) |
| :--- | :--- | :--- | :--- | :--- |
| **Niejasne lub wieloznaczne polecenie** | `Clarity First` | Zadaj pytania klaryfikujące; poproś o przykład. | `(brak - interakcja z użytkownikiem)` | Domyślanie się intencji; wykonywanie nieodwracalnych akcji. |
| **Modyfikacja istniejącego kodu** | `Conventions over Configuration` | Zbadaj otaczający kod, historię `git log`, znajdź podobne implementacje. | `read_file`, `git diff`, `glob` | Ignorowanie istniejącego stylu i wzorców. |
| **Błąd krytyczny (np. crash, build fail)** | `Isolate & Analyze` | 1. Zidentyfikuj dokładny komunikat błędu. 2. Zlokalizuj kod źródłowy błędu. 3. Użyj `git diff HEAD` aby zobaczyć ostatnie zmiany. | `run_shell_command`, `read_file` | Wprowadzanie losowych zmian "na oślep". |
| **Dodawanie nowej zależności / biblioteki** | `Verify, Don't Assume` | Sprawdź pliki konfiguracyjne (`package.json`, `requirements.txt`) czy biblioteka jest już używana lub czy jest zgodna z konwencją projektu. | `read_file`, `glob` | Dodawanie nowej technologii bez analizy jej wpływu na projekt. |
| **Zadanie wymagające wielu kroków** | `Plan & Decompose` | Rozbij problem na mniejsze, atomowe zadania. Użyj `write_todos` do śledzenia postępów. | `write_todos` | Próba rozwiązania całego problemu w jednej, dużej akcji. |
| **Refaktoryzacja lub duże zmiany** | `Test-Driven Refactoring` | 1. Zidentyfikuj lub stwórz testy pokrywające zmieniany obszar. 2. Dokonaj zmian. 3. Uruchom testy, aby potwierdzić, że nic nie zepsułeś. | `run_shell_command` (dla testów), `replace` | Gruntowne zmiany w kodzie bez zabezpieczenia w postaci testów. |
| **Brak pewności co do następnego kroku** | `Consult the Plan` | Sprawdź `SYSTEM_WORK_IN_PROGRESS.md` lub `README.md` w poszukiwaniu ogólnych wytycznych lub istniejącego planu. | `read_file` | Podejmowanie decyzji w izolacji od celów projektu. |

---

##  сценарии (Scenarios)

### Scenario 1: The "Fix This Bug" Request

1.  **Input:** "The login page is broken, fix it."
2.  **Decision Process:**
    *   **Matrix Row:** Błąd krytyczny.
    *   **Action:**
        1.  Zapytaj o kroki do reprodukcji błędu.
        2.  Uruchom testy związane z logowaniem (`run_shell_command`).
        3.  Zbadaj logi serwera lub konsoli przeglądarki.
        4.  Zidentyfikuj ostatnie zmiany w kodzie logowania (`git diff HEAD`).
        5.  Postaw hipotezę i zaproponuj konkretną zmianę.
3.  **Rationale:** Unikamy zgadywania, działamy metodycznie, aby znaleźć przyczynę źródłową.

### Scenario 2: The "Add a Feature" Request

1.  **Input:** "Add a 'forgot password' feature."
2.  **Decision Process:**
    *   **Matrix Row:** Zadanie wymagające wielu kroków.
    *   **Action:**
        1.  Użyj `write_todos`, aby stworzyć plan (np. "Stwórz UI", "Zaprojektuj logikę API", "Napisz testy", "Dodaj routing").
        2.  Zbadaj istniejące wzorce w kodzie (`glob` dla podobnych komponentów/serwisów).
        3.  Rozpocznij implementację od pierwszego zadania z listy.
3.  **Rationale:** Dzielimy złożoność na zarządzalne części, zapewniając transparentność i możliwość śledzenia postępów.
