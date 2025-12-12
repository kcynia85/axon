# Figma Dev Mode MCP Hub

> **Cel:** Most między Designem a Kodem. Instrukcja dla Agenta AI (Cursor/Windsurf), jak tłumaczyć design z Figmy na kod produkcyjny przy użyciu MCP Server.

---

## 🚀 Quick Start (Dla Agenta)

**Jesteś Developerem używającym Figma MCP Server.** Twoim zadaniem jest pobranie specyfikacji z Figmy i wdrożenie jej w kodzie, ściśle przestrzegając poniższych reguł.

### 1. Pobieranie Danych (Tools)
Używaj narzędzi MCP w tej kolejności:
1.  **`get_file`** -> Aby zrozumieć strukturę pliku i nazwy stron.
2.  **`search_nodes`** -> Aby znaleźć konkretny ekran/komponent po nazwie (np. "Checkout Form").
3.  **`get_node`** -> Aby pobrać szczegóły (wymiary, autolayout, dzieci).
4.  **`get_code`** -> Aby uzyskać wstępny snippet (React/Tailwind).
5.  **`get_annotations`** -> SPRAWDŹ CZY SĄ ADNOTACJE! To są instrukcje od Designera (zachowanie, animacje).

### 2. Implementacja (Rules)

#### A. Struktura i Komponenty
*   **Mapowanie:** Jeśli widzisz warstwę `Button`, użyj naszego komponentu `<Button>` z `src/ui/components`. Nie twórz nowego `div`a.
*   **Layout:** Używaj komponentów layoutowych (`<Flex>`, `<Grid>`, `<Section>`) lub klas Tailwind (`flex`, `grid`). Nie pisz custom CSS dla layoutu.
*   **Semantyka:** Tagi HTML mają znaczenie. `Frame` to często `<section>` lub `<article>`, nie zawsze `<div>`.

#### B. Design Tokens (Zmienne)
*   **ZAKAZ HARDCODOWANIA:** Nigdy nie pisz `#FFFFFF` ani `16px`.
*   **Użyj Zmiennych:**
    *   Kolor: `var(--color-text-primary)` (lub odpowiednik Tailwind: `text-primary`).
    *   Odstępy: `var(--space-4)` (lub `p-4`).
    *   Radius: `var(--radius-md)` (lub `rounded-md`).

#### C. Dane i Logika
*   **Placeholdery:** Jeśli w Figmie jest "Jan Kowalski", w kodzie użyj `{user.name}` lub propsa.
*   **Obrazy:** Nie generuj placeholderów SVG. Użyj komponentu `<Image>` z source'm.

---

## 🧠 Wiedza dla Człowieka (Best Practices)

### Jak przygotować plik w Figmie? (Dla Designera)
1.  **Auto Layout:** To podstawa. Jeśli coś nie ma Auto Layoutu, AI zgaduje pozycje (często błędnie).
2.  **Nazewnictwo:** Nazywaj warstwy tak, jak chcesz mieć nazwane komponenty w kodzie (np. `ProductCard`, a nie `Frame 432`).
3.  **Adnotacje:** Używaj Dev Mode Annotations do opisywania zachowań (np. "Po kliknięciu otwórz modal").
4.  **Zmienne:** Podepnij kolory i fonty pod Variables.

### Narzędzia MCP (Cheat Sheet)
| Tool | Co robi? |
| --- | --- |
| `get_node` | Pobiera parametry węzła (width, height, padding, fills). |
| `get_code` | Generuje surowy kod (React/HTML) dla zaznaczenia. |
| `get_variables` | Zwraca mapę tokenów (np. kolorów). |
| `get_annotations` | Pobiera instrukcje od designera. |

---

## 🔧 Konfiguracja Agenta (Cursor Rules)

Wklej to do `.cursorrules` w swoim projekcie:

```json
{
  "description": "Figma Dev Mode MCP rules",
  "globs": ["**"],
  "alwaysApply": true,
  "important": [
    "Use Figma MCP tools to extract design data.",
    "Map Figma layers to existing project components (src/components).",
    "Use Tailwind classes mapped from Figma Variables (never hardcode hex codes).",
    "Respect Dev Mode Annotations as strict implementation requirements."
  ]
}
```

---

## 🧠 Common Sense (Banalne, ale Krytyczne)
> **Dla Agenta:** Figma to mapa, nie terytorium.

1.  **Talk to Designer:** Jeśli widzisz padding `13.5px`, to prawdopodobnie błąd "przesunięcia myszką". Zapytaj lub zaokrąglij do `16px` (zgodnie z siatką 8px). Nie wdrażaj błędów.
2.  **Responsive Reality:** Figma pokazuje statyczny obrazek (np. 1440px). Twoim zadaniem jest sprawić, żeby to działało płynnie od 320px do 2560px. Jeśli coś się nie mieści na laptopie – popraw to w kodzie.
3.  **Assets:** Nie eksportuj ikon jako PNG. Zawsze używaj SVG dla skalowalności.
4.  **States:** Figma często pokazuje tylko stan "Default". Pamiętaj o `:hover`, `:active`, `:focus` i `:disabled`.
