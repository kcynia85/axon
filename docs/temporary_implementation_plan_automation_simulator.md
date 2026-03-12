# Plan Implementacji: Symulator Połączeń Automatyzacji (Automation Simulator)

## 1. Analiza i Lokalizacja w Architekturze
Makieta z FigJam przedstawia panel z danymi testowymi dla konkretnego zapytania. Zgodnie z wytycznymi, komponent ma zostać umieszczony w prawej kolumnie w **Automation Studio**. 

Obecnie w `frontend/src/modules/studio/features/automation-studio/ui/AutomationStudio.tsx` prawa kolumna (`poster` w `StudioLayout`) jest zajmowana przez komponent `AutomationLivePoster`. Nowy symulator w pełni zastąpi ten komponent lub będzie z nim dzielić przestrzeń, pełniąc rolę w pełni funkcjonalnego widgetu, który na żywo reaguje na schemat kontekstu zdefiniowany w formularzu (zmienne w `dataInterface.context`).

## 2. Architektura Komponentu
Stworzymy nowy komponent: `AutomationSimulatorPanel`. Będzie on "czystym" widokiem (zgodnie z *Pure View principle* i wytycznymi standardów), operującym wyłącznie na danych pobranych z globalnego formularza (przez `react-hook-form`).

**Ścieżka:**
`frontend/src/modules/studio/features/automation-studio/ui/components/AutomationSimulatorPanel.tsx`

**Spójność UI (Dark Mode & Typografia):**
Zamiast białego tła z FigJam (które pełni rolę schematu/wireframe'u), panel symulatora przyjmie estetykę Axon Studio (czarne tło, bordery `zinc-800`, typografia mono dla metadanych).

## 3. Szczegółowy Plan Implementacji

### Etap A: Zarządzanie Stanem i Typy
Zgodnie z konwencją *Zero useEffect* oraz *Immutability*:
1. **Pobieranie Konfiguracji z Formularza:**
   Użyjemy `useFormContext<AutomationFormData>()` do obserwowania (`watch`) pól:
   - Zmienne wejściowe: `dataInterface.context`
   - Cel żądania: `connection.url`, `connection.method`
2. **Lokalny Stan Symulatora:**
   Użyjemy wbudowanego hooka `useState` dla stanów przejściowych (nie mają wpływu na faktyczne dane konfiguracji zapisywane do bazy).
   - `testInputValues`: Obiekt mapujący nazwę zmiennej na jej podaną w symulatorze wartość (np. `{ "file_url": "https://faktura.pdf" }`).
   - `testStatus`: Unia typów dla statusu żądania (`"idle" | "running" | "success" | "error"`).
   - `testResponse`: Obiekt trzymający wyniki (`statusCode`, `durationMs`).

### Etap B: Interfejs Użytkownika (UI)
Korzystając z wylistowanych przez Ciebie komponentów z `@/shared/ui/form/`:

1. **Główny Kontener:**
   Użyjemy `div` z odpowiednimi paddingami i klasami `flex flex-col`, który dopasuje się do prawej kolumny. Zastosujemy typografię i strukturę podobną do podanego schematu FigJam.
2. **Sekcja "Dane Testowe (Input)":**
   - Wygenerowana dynamicznie na podstawie tablicy `dataInterface.context`.
   - Iterujemy po zmiennych, dla każdej renderując tytuł zmiennej i komponent `<FormTextField />` z pakietu współdzielonego formularza.
   - Do obsługi wpisywanych danych napiszemy handler aktualizujący `testInputValues`.
3. **Akcja "Wykonaj Test":**
   - Przycisk z `lucide-react` spinnerem przy stanie ładowania.
4. **Sekcja "Otrzymana odpowiedź (Output)":**
   - Wyświetlana warunkowo (gdy `testStatus` jest `success` lub `error`).
   - Typografia mono (`font-mono text-zinc-400` oraz kolory `text-green-500` / `text-red-500`).

### Etap C: Przebieg Akcji (Brak `useEffect`)
Wszystkie efekty uboczne umieszczone będą w handlerze przycisku:

```typescript
const handleExecuteTest = async () => {
    if (!url || testStatus === "running") return;
    
    setTestStatus("running");
    const startTime = performance.now();
    
    try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const endTime = performance.now();
        setTestResponse({
            statusCode: 200,
            statusText: "OK",
            durationMs: Math.round(endTime - startTime)
        });
        setTestStatus("success");
    } catch (error) {
        setTestStatus("error");
    }
};
```

## 4. Sprawdzenie Zgodności z Wytycznymi (Checklist)
- [x] **Readability over cleverness**: Nazwy funkcji (np. `handleExecuteTest`), typów (`TestResponseContext`) i zmiennych pełne (bez skrótów typu `req`, `res`, `ctx`).
- [x] **TypeScript Only & No Any**: W pełni otypowane argumenty i stan, wykorzystanie zdefiniowanego już typu `AutomationFormData`.
- [x] **Zero useEffect**: Wywołanie API odbywa się bezpośrednio na interakcję użytkownika wewnątrz asynchronicznej funkcji `handleExecuteTest`. Nie ma nasłuchiwania na zmianę stanu ładowania.
- [x] **Component-first**: Czysta prezentacyjna odpowiedzialność.
- [x] **Wykorzystanie Shared UI**: Do layoutu i pól inputu wykorzystane zostaną `FormTextField`, `FormHeading` z gotowej ścieżki `@frontend/src/shared/ui/form/`.

## 5. Integracja
Podmiana referencji w `frontend/src/modules/studio/features/automation-studio/ui/AutomationStudio.tsx` z `AutomationLivePoster` na `AutomationSimulatorPanel`.
