# Plan: Dodanie Checkboxa do wyboru narzędzi w Studio

Ten plan opisuje modyfikację komponentu `InternalSkillsModal` w celu dodania checkboxa po lewej stronie karty narzędzia, umożliwiającego wybór funkcji dla agenta, zgodnie z wzorcem z formularza Studio.

## Cel
Usprawnienie interfejsu Studio poprzez dodanie wizualnego wskaźnika (checkboxa) obok każdego narzędzia w modalnym oknie wyboru funkcji wewnętrznych.

## Kroki implementacji

### 1. Modyfikacja `InternalSkillsModal.tsx`
Zaktualizujemy plik `axon-app/frontend/src/modules/studio/features/agent-studio/ui/components/InternalSkillsModal.tsx`.

**Zmiany:**
1.  Import komponentu `Checkbox` z `@/shared/ui/ui/Checkbox`.
2.  Dodanie checkboxa wewnątrz pętli renderującej `filteredSkills.map`.
3.  Checkbox zostanie umieszczony po lewej stronie treści karty (przed nazwą i opisem).
4.  Podpięcie zdarzenia `onCheckedChange` do logiki `onAddFunction` / `onRemoveFunction`.
5.  (Opcjonalnie) Usunięcie lub ukrycie starego przycisku "Add/Added" po prawej stronie, aby uniknąć duplikacji akcji, lub pozostawienie go jako dodatkowej opcji. Zgodnie z sugestią użytkownika ("powinien być checkbox po lewej stronie karty"), checkbox staje się głównym kontrolerem.

### 2. Szczegóły kodu (Szkic zmian)

```tsx
// Import Checkbox
import { Checkbox } from "@/shared/ui/ui/Checkbox";

// ... wewnątrz mapowania filteredSkills:
<div
    key={fn.id}
    className={cn(
        "group relative flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer", // dodano gap-4 i cursor-pointer
        fn.isAdded
            ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
            : "bg-zinc-900/30 border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-900/50"
    )}
    onClick={() => fn.isAdded ? onRemoveFunction(fn.id) : onAddFunction(fn.id)} // cała karta klikalna
>
    {/* Checkbox po lewej stronie */}
    <div className="pt-0.5 shrink-0">
        <Checkbox 
            checked={fn.isAdded} 
            onCheckedChange={() => {}} // obsłużone przez onClick karty
            className="w-5 h-5 rounded-md border-zinc-700 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
    </div>

    <div className="flex-1 min-w-0">
        {/* Treść (nazwa, opis) - bez zmian w strukturze, tylko układ flex */}
        <div className="flex items-center gap-2 mb-1.5">
            <h4 className={cn(
                "text-sm font-semibold truncate",
                fn.isAdded ? "text-primary" : "text-zinc-200" // zmiana koloru przy zaznaczeniu
            )}>
                {fn.name}
            </h4>
            {fn.category && (
                <Badge variant="secondary" className="...">
                    {fn.category}
                </Badge>
            )}
        </div>
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {fn.desc}
        </p>
    </div>
    
    {/* Stary przycisk zostanie usunięty lub zamieniony na subtelniejszy wskaźnik */}
</div>
```

## Weryfikacja
1.  Otwarcie Studio -> Edycja Agenta -> Custom Functions.
2.  Sprawdzenie czy checkbox pojawia się po lewej stronie każdej karty.
3.  Kliknięcie w checkbox lub kartę powinno zaznaczać/odznaczać narzędzie.
4.  Sprawdzenie czy stan jest poprawnie przekazywany do agenta (czy narzędzie zostaje dodane do listy "Added Functions").
