# TypeScript Guidelines

## Strict Mode
Zawsze włączone `strict: true`. Żadnego `any`.

## Types vs Interfaces
*   Używaj `type` dla unii i prostych aliasów.
*   Używaj `interface` dla obiektów, które mogą być rozszerzane.

## Generics
Stosuj, gdy tworzysz reużywalne komponenty lub funkcje (np. `useFetch<T>`).

## Zod (Runtime Validation)
Wszystkie dane z zewnątrz (API, Formularze) muszą być parsowane przez Zod.
```typescript
const UserSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'user'])
});
```
