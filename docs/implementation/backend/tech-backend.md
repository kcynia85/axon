# Axon Backend — Dokumentacja Techniczna

> **Rola:** Przewodnik Developera & Architektura
> **Stack:** Python 3.10+, FastAPI, SQLAlchemy (Async), Google GenAI

Hej! 👋 Jeśli zaczynasz pracę z backendem Axona, ten dokument jest dla Ciebie. Pomyśl o nim jak o mapie do "kuchni" naszej restauracji. Nie musisz wiedzieć wszystkiego od razu, ale warto wiedzieć, gdzie leżą noże, a gdzie trzymamy zapasy.

---

## 🏗 Architektura: Modularny Monolit

Wyobraź sobie, że budujemy dom. Zamiast wrzucać wszystkie meble, rury i kable do jednego wielkiego wora (co nazywamy "Spaghetti Code"), dzielimy dom na **pokoje**.

W naszym systemie te pokoje to **Moduły** (`backend/app/modules/`). Każdy moduł odpowiada za jedną konkretną rzecz i ma swoje własne "ściany".

### Główne Pokoje (Moduły):

1.  **`agents`** (`/modules/agents`)
    *   **Co robi:** To "Mózg". Tutaj żyją nasi Agenci AI. Decydują, co odpowiedzieć użytkownikowi.
    *   **Metofora:** Szef kuchni, który przyjmuje zamówienie i zarządza przygotowaniem dania.
2.  **`knowledge`** (`/modules/knowledge`)
    *   **Co robi:** To "Biblioteka". Tutaj system szuka informacji (RAG). Przechowuje dokumenty i wspomnienia.
    *   **Metofora:** Bibliotekarz, który na hasło "przepis na pizzę" biegnie do regału i przynosi odpowiednią książkę.
3.  **`projects`** (`/modules/projects`)
    *   **Co robi:** To "Kartoteka". Zarządza Twoimi projektami, plikami i ustawieniami.
4.  **`shared`** (`/app/shared`)
    *   **Co robi:** To "Fundamenty". Rzeczy wspólne dla wszystkich: połączenie z bazą danych, konfiguracja, narzędzia.

### Dlaczego tak? (DDD - Domain Driven Design)
Staramy się, aby nasz kod mówił językiem biznesu. Jeśli w rozmowie z klientem pada hasło "Sesja Czatu", to w kodzie szukamy klasy `ChatSession`, a nie `TableX123`.

---

## 🛠 Nasz Stack Technologiczny (Narzędzia)

*   **Język: Python 3.10+** – Nasz język urzędowy. Czytelny i potężny.
*   **Kelner: FastAPI** – To on przyjmuje zamówienia (requesty HTTP) od klienta (Frontend) i zanosi je do kuchni. Jest niesamowicie szybki.
*   **Magazynier: SQLAlchemy (Async)** – Odpowiada za układanie danych na półkach (w bazie danych Postgres/Supabase). Wersja "Async" oznacza, że nie czeka bezczynnie, aż baza odpisze, tylko w międzyczasie robi inne rzeczy.
*   **Geniusz: Google GenAI** – Nasz model językowy (LLM), który generuje odpowiedzi.

### Przykład Kodu (Jak to wygląda w praktyce?)

Oto jak wygląda prosty "endpoint" (okienko do składania zamówień) w FastAPI:

```python
# app/modules/projects/routes/project_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.shared.infrastructure.database import get_db

router = APIRouter()

# 1. Dekorator mówi: "To jest adres /projects"
@router.get("/")
# 2. Funkcja asynchroniczna (nie blokuje kolejki)
async def list_projects(
    db: AsyncSession = Depends(get_db) # 3. Wstrzykiwanie zależności (daj mi dostęp do bazy)
):
    # Tutaj dzieje się magia (logika biznesowa)
    projects = await service.get_all_projects(db)
    return projects
```

---

## 🚧 Co jeszcze przed nami? (Backlog Techniczny)

Aplikacja działa, ale to dopiero fundamenty. Oto co musimy jeszcze dobudować:

1.  **Durable Execution (Inngest):**
    *   *Problem:* Teraz, jeśli Agent myśli bardzo długo (np. pisze książkę), a serwer się zrestartuje, praca przepada.
    *   *Plan:* Chcemy użyć narzędzia Inngest, które działa jak "zapis gry". Nawet jak wyłączysz prąd, Agent wznowi pracę tam, gdzie skończył.
2.  **Integracja z GitHubem:**
    *   *Cel:* Żeby Agent mógł sam robić `git commit` i poprawiać Twój kod w repozytorium.
3.  **Testy E2E (End-to-End):**
    *   *Cel:* Automatyczne roboty, które przeklikują całą aplikację przed każdym wydaniem, żeby upewnić się, że nic nie zepsuliśmy.

