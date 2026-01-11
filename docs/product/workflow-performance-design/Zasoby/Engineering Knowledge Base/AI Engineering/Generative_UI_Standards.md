---
template_type: crew
---

# Generative UI Standards (AI-to-Interface)

> **Context:** Wyjście z paradygmatu "Chatbot" (Ściana tekstu) do "Dynamic Interface" (Komponenty Reacta na żądanie).
> **Target:** Frontend Developer / AI Engineer
> **Stack:** React, JSON Schema, Vercel AI SDK (RSC) / LangChain Tools.

---

## 1. The Core Philosophy

**"Don't tell me, show me."**
AI nie powinno opisywać pogody ("Jest 20 stopni"). AI powinno zwrócić komponent `<WeatherCard temp={20} />`.

### The Protocol (JSON-to-Component)
1.  **AI Side:** Model decyduje, że potrzebuje interfejsu i zwraca ustrukturyzowany JSON (via Tool Calling).
2.  **Mapping Layer:** Frontend mapuje nazwę narzędzia (np. `display_weather`) na komponent Reacta.
3.  **Render:** Użytkownik widzi interaktywny widget.

---

## 2. Defining The Contract (Tool Definitions)

Aby AI wiedziało, jakie klocki ma do dyspozycji, musisz zdefiniować je jako "Tools".

```typescript
// definition.ts
export const uiTools = {
  display_weather: {
    description: "Display a weather card for a specific location.",
    parameters: z.object({
      location: z.string(),
      temperature: z.number(),
      condition: z.enum(["sunny", "rainy", "cloudy"]),
    }),
  },
  show_stock_chart: {
    description: "Display an interactive stock chart.",
    parameters: z.object({
      symbol: z.string(),
      data_points: z.array(z.object({ x: z.string(), y: z.number() })),
    }),
  },
};
```

---

## 3. The Implementation (React / Vercel AI SDK)

```tsx
// ChatComponent.tsx
import { useChat } from 'ai/react';
import { WeatherCard } from './WeatherCard';
import { StockChart } from './StockChart';

export function Chat() {
  const { messages } = useChat();

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.content}
          
          {/* Render Tool Invocations as UI */}
          {m.toolInvocations?.map((tool) => {
            if (tool.toolName === 'display_weather') {
               // Render Component instead of text
               return <WeatherCard {...tool.args} />;
            }
            if (tool.toolName === 'show_stock_chart') {
               return <StockChart {...tool.args} />;
            }
            return null;
          })}
        </div>
      ))}
    </div>
  );
}
```

---

## 4. Design System for AI (Atomic AI)

AI nie jest dobrym designerem. Nie pozwalaj mu generować HTML/CSS (chyba że robisz v0.dev).
Pozwalaj mu **konfigurować** gotowe, piękne komponenty.

*   ✅ **DO:** AI wybiera `variant="destructive"` dla przycisku.
*   ❌ **DON'T:** AI pisze `style={{ color: 'red', border: '1px solid block' }}`.

**Zasada:** Sztywne komponenty, elastyczne dane.
