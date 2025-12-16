<!-- 
🤖 AI AGENT INSTRUCTION: ARCHITECT & ENGINEERING
Rola: Principal Software Architect & CTO.
Cel: Przetłumacz wymagania biznesowe (PRD) na kuloodporną specyfikację techniczną (Tech PRD).

🧠 PROCES REFLEKSJI (Wykonaj w "Myślach" przed generowaniem):
1. DRAFT: Zaproponuj stack technologiczny i schemat bazy danych dla wymagań z PRD.
2. 🛑 CRITIQUE (Krytyka): Przeprowadź "Devil's Advocate Session":
   - Gdzie ten system się załamie przy 10k użytkowników?
   - Czy proponowane rozwiązanie nie jest "over-engineered" dla fazy MVP?
   - Czy model danych obsłuży przyszłe Edge Case'y zidentyfikowane w "User Flows"?
3. REFINE: Uprość architekturę tam, gdzie to możliwe. Dodaj sekcję "Ryzyka Techniczne".
4. FINAL: Wygeneruj Tech PRD zgodny ze standardami projektu (Next.js/Supabase/itp.).

Wejście: "PRD.md", "User Flows & Logic.md", "Architecture Decision Record".
-->

# Technical Product Requirements Document (Tech PRD)

## 💡 Metodologia i Narzędzia
> *Materiały pomocnicze z biblioteki wiedzy:*
> *   [🌐 Globalne Zasady (GEMINI)](../../Zasoby/AI-Native%20Architect/Context%20Engine/GEMINI.md)
> *   [🏗️ Workflow Implementacji](../../Zasoby/AI-Native%20Architect/Workflow/Implementation%20Workflow.md)
> *   [🏛️ Wzorce Architektoniczne](../../Zasoby/Engineering%20Knowledge%20Base/Architecture%20Patterns/Architecture%20Patterns%201d1585629e4980eb97d7fb321c278ec9.md)

---

## 1. System Overview (Big Picture)
*   **Cel Techniczny:** (np. Skalowalne API dla mobile first)
*   **Stack:** Next.js 14, Supabase, Tailwind.

## 2. Model Danych (Schema Design)
*Definicja tabel i relacji. Użyj składni Prisma lub SQL.*

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  role      Role     @default(USER)
  orders    Order[]
}
```

## 3. API Contracts (Contract-First)
*Zdefiniuj wejście i wyjście ZANIM napiszesz logikę.*

```typescript
// Server Action: createOrder
interface CreateOrderInput {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: Address;
}

type CreateOrderResponse = 
  | { success: true; orderId: string }
  | { success: false; error: 'INVENTORY_ERROR' | 'PAYMENT_FAILED' };
```

## 4. Error Handling Strategy
*Standardyzacja błędów dla Agenta.*
*   **Auth:** 401 (Unauthorized) -> Redirect to Login.
*   **Validation:** 400 (Bad Request) -> Show Zod Error via Toast.
*   **Server:** 500 (Internal) -> Log to Sentry + Generic User Message.

## 5. Security & Performance
*   **RLS:** (Zasady dostępu do danych)
*   **Caching:** (Strategia: `revalidatePath` vs `unstable_cache`)
