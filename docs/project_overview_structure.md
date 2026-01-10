# 🗺️ Mapa Projektu Axon

## 🚀 Co robi ta aplikacja? (Stan na Grudzień 2025)

**Axon** to inteligentne centrum zarządzania projektami, napędzane przez AI. To nie jest zwykła lista zadań – to system, który rozumie kontekst Twojej pracy.

### Kluczowe Funkcje:
1.  **Dashboard Projektowy:** Zarządzanie projektami, kategoryzacja (Hubs) i śledzenie statusu.
2.  **Inteligentny Czat (RAG):** Możesz rozmawiać z "Wirtualnym Zespołem" (Manager, Researcher). Agent nie zgaduje – przeszukuje Twoje dokumenty (Baza Wiedzy), zanim odpowie.
3.  **Generowanie Artefaktów:** Agent potrafi tworzyć notatki i pliki, które zapisują się w projekcie.
4.  **Streaming na Żywo:** Odpowiedzi AI pojawiają się w czasie rzeczywistym (Server-Sent Events), dając poczucie płynnej rozmowy.

---

## 📂 Struktura Folderów (Drzewo)

Poniżej znajdziesz wyjaśnienie, co znajduje się w kluczowych katalogach.

```text
.
├── backend/                        # [MÓZG] Serwer API, AI i Baza Danych (Python/FastAPI)
│   ├── app/
│   │   ├── api/                    # Routing (Endpointy HTTP, np. /chat, /projects)
│   │   ├── modules/                # MODUŁY BIZNESOWE (Serca logiki)
│   │   │   ├── agents/             # Logika AI: Orkiestrator, Prompty, Streaming
│   │   │   ├── knowledge/          # System RAG: Wyszukiwanie wektorowe, Baza Wiedzy
│   │   │   └── projects/           # Projekty: CRUD, Pliki, Artefakty
│   │   └── shared/                 # INFRASTRUKTURA: Baza danych, Config, Logi
│   ├── migrations/                 # Wersjonowanie bazy danych (Alembic)
│   └── tests/                      # Testy automatyczne (Pytest)
│
├── frontend/                       # [TWARZ] Interfejs Użytkownika (Next.js/React)
│   ├── src/
│   │   ├── app/                    # ROUTING: Struktura stron (np. /dashboard, /projects/[id])
│   │   ├── modules/                # VERTICAL SLICES: Funkcje podzielone na biznes
│   │   │   ├── agents/             # Komponenty czatu (ChatSessionView)
│   │   │   ├── projects/           # Widoki projektów (ProjectList, Details)
│   │   │   └── ...
│   │   └── shared/                 # BIBLIOTEKA UI: Przyciski, Inputy (Shadcn/UI), Hooki
│   ├── public/                     # Obrazki, ikony, fonty
│   └── ...
│
├── docs/                           # [INSTRUKCJE] Dokumentacja projektu
│   ├── guidelines/                 # Zasady kodowania, standardy, architektura
│   ├── implementation/             # Szczegółowe opisy dla Frontend/Backend
│   └── ...
│
├── data/                           # Dane lokalne (np. pliki MinIO/S3 przy dewelopmencie)
└── knowledge/                      # Pliki źródłowe dla bazy wiedzy AI (Markdowny, PDFy)
```

## 🛠 Kluczowe Technologie

*   **Backend:** Python 3.11, FastAPI, SQLAlchemy (Async), LangChain/Google GenAI.
*   **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS.
*   **Baza Danych:** PostgreSQL (z rozszerzeniem `pgvector` do AI).
