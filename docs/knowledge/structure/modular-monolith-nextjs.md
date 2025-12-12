# Modular Monolith (Next.js)

## 📂 Folder Structure Rules
1. **Modules First:** All business logic resides in `src/modules/[context]/`.
2. **Layer Isolation:**
   - `domain/`: Pure TS, Zod schemas, Business Rules. NO imports from `infra` or `app`.
   - `infrastructure/`: Database access (Repositories) & 3rd party APIs.
   - `application/`: Server Actions & Background Jobs. Orchestrates Domain + Infra.
3. **Public API:** Cross-module communication MUST go through the `index.ts` barrel file. Never import deeply from another module (e.g. `../sales/domain/logic`).
4. **UI:** `src/app` should contain "Dumb Components" only. Logic is imported from `modules`.

## 📁 Project Structure

```text
/
├── public/
├── src/
│   ├── app/                   # WARSTWA PREZENTACJI (Next.js App Router)
│   │   ├── (public)/          # Landing pages, marketing
│   │   ├── (dashboard)/       # Aplikacja właściwa (auth protected)
│   │   │   └── orders/
│   │   │       └── page.tsx   # "Dumb UI" - tylko wyświetla dane
│   │   └── api/               # Webhooki i endpointy API
│   │
│   ├── modules/               # WARSTWA DOMENOWA (Serce systemu)
│   │   ├── sales/             # [Bounded Context 1] - Np. Sprzedaż
│   │   │   ├── domain/        # 🧠 Czysta logika (Zero zależności od DB/Next)
│   │   │   │   ├── types.ts   # Zod Schemas, Types (Entities, VOs)
│   │   │   │   ├── logic.ts   # Pure Functions (Invarianty, Obliczenia)
│   │   │   │   └── events.ts  # Definicje zdarzeń (np. OrderPlaced)
│   │   │   │
│   │   │   ├── infrastructure/# 🔌 Dostęp do danych i świata zewn.
│   │   │   │   ├── repo.ts    # Repository Pattern (DB calls)
│   │   │   │   ├── mapper.ts  # Mapowanie DB Model <-> Domena
│   │   │   │   └── adapter.ts # Adapter do zewnętrznych API (np. Płatności)
│   │   │   │
│   │   │   ├── application/   # 🎬 Orkiestracja (Use Cases)
│   │   │   │   ├── actions.ts # Server Actions (walidacja + wywołanie logiki)
│   │   │   │   └── jobs.ts    # Background Jobs (Async workflows)
│   │   │   │
│   │   │   └── index.ts       # 🚪 Public API (Tylko to eksportujemy!)
│   │   │
│   │   ├── inventory/         # [Bounded Context 2]
│   │   │   └── ... (ta sama struktura)
│   │   │
│   │   └── users/             # [Bounded Context 3]
│   │       └── ...
│   │
│   └── shared/                # KERNEL / GENERIC (Wspólne klocki)
│       ├── components/        # UI Kit (Button, Input)
│       ├── lib/               # Utils (cn, formatDate)
│       └── infrastructure/    # Globalne klienty (db-client, logger)
│
├── .env
├── next.config.js
└── package.json
```
