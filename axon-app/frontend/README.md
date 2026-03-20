# Axon Frontend

The frontend interface for RAGAS Axon, built with Next.js 16 and Vercel AI SDK.

## 🛠 Tech Stack
*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Shadcn/UI
*   **AI Integration:** Vercel AI SDK (React Server Components + StreamUI)
*   **Testing:** Vitest + React Testing Library

## 📂 Structure
The codebase follows a **Modular Monolith** pattern:
```text
src/
├── app/                  # Next.js Routing (Dumb Containers)
├── modules/              # Vertical Slices (Feature Logic)
│   ├── agents/           # Chat & Orchestration UI
│   ├── projects/         # Project Management UI
│   └── knowledge/        # RAG & Knowledge Browser
├── shared/               # Shared Kernel
│   ├── ui/               # Reusable Components (Shadcn)
│   ├── lib/              # Utilities
│   └── domain/           # Shared Types/DTOs
```

## 🚀 Commands

### Development
```bash
npm run dev
```

### Testing
```bash
npm run test      # Run unit tests
npm run test:ui   # Open Vitest UI
```

### Linting
```bash
npm run lint
```