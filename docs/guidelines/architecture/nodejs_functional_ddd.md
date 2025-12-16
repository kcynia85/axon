# Node.js (Express/Fastify) — Functional DDD

Dla backendów bez "magii" Next.js, stosujemy jawną warstwę **Interfejsu**.

## 📂 Project Structure

```text
src/
├── main.ts                # 🚀 Entry Point (App Setup, Middlewares)
├── modules/               # 🧠 Bounded Contexts
│   ├── sales/
│   │   ├── domain/        # ✅ Czysta logika (Entities, Pure Functions)
│   │   ├── infrastructure/# 🔌 Baza danych (Repos), Adaptery
│   │   ├── application/   # 🎬 Use Cases (Services) - Orkiestracja
│   │   ├── interface/     # 🌐 API Layer (Routers, Controllers, DTOs)
│   │   └── index.ts       # Public Module API
└── shared/                # 🧱 Kernel (Middleware, Utils, Shared Domain)
```

## 🔑 Key Principles

1.  **Warstwa `interface/`**: Odbiera request, waliduje (DTO), woła `application`. Nie zawiera logiki biznesowej.
2.  **Use Cases (`application/`)**: Odpowiednik "Server Actions". Funkcje `async` nieświadome HTTP (brak `req`, `res`).
3.  **Zasada Izolacji Frameworka**: Logika w `domain/` jest **agnostyczna**. Migracja z Next.js na Express wymaga tylko wymiany warstwy wejścia (`app` -> `interface`), a domena pozostaje nienaruszona.

