# Plan Testów E2E: Przepływ Narzędzi (Tool Flow)

Ten dokument opisuje strategię testową dla pełnego cyklu życia narzędzi w ekosystemie Axon — od definicji w `axon-tools` po wykorzystanie w `axon-app`.

## Cel Testów
Weryfikacja, czy nowo dodana funkcja poprawnie przechodzi przez wszystkie warstwy systemu:
1.  **Kod źródłowy** (Parsing & Metadata)
2.  **Synchronizacja** (Transport & Storage)
3.  **Biblioteka Studio** (UI & Hydration)
4.  **Konfiguracja Agenta** (Auto-mapping Context/Artefacts)
5.  **Przeglądarka Zasobów** (Display & Pagination)

## Scenariusze Testowe

### 1. Test Integracji Backendowej (`tests/backend/verify_tool_sync.py`)
*   **Krok**: Wyślij żądanie synchronizacji dla nowego pliku `test_flow_tool.py`.
*   **Oczekiwania**:
    *   Kod 200 z endpointu `/sync-remote`.
    *   Plik fizycznie obecny w `axon-app/backend/app/tools/`.
    *   Wpis w DB posiada poprawne `tool_function_name` i `tool_display_name`.
    *   `tool_input_schema` zawiera wszystkie parametry z typami.
    *   `tool_keywords` zawiera dokładnie te tagi, które zdefiniowano w kodzie.

### 2. Test UI Studio (Playwright: `tests/e2e/tool_studio_flow.spec.ts`)
*   **Krok**: Otwórz Studio Agenta i przejdź do sekcji Skills.
*   **Oczekiwania**:
    *   Narzędzie jest widoczne w modalu "Select from library".
    *   Opis narzędzia jest ucięty do 50 znaków (jeśli był dłuższy).
    *   Zaznaczenie narzędzia dodaje je do listy "Added Tools".
    *   **CRITICAL**: Sekcja "Context" automatycznie wypełnia się parametrami wejściowymi narzędzia.
    *   **CRITICAL**: Sekcja "Artefacts" automatycznie zyskuje pole `{name}_output`.

### 3. Test Przeglądarki Zasobów (Playwright: `tests/e2e/tool_browser_flow.spec.ts`)
*   **Krok**: Przejdź do `/resources/tools`.
*   **Oczekiwania**:
    *   Grid wyświetla 3 karty w rzędzie (na dużym ekranie).
    *   Karta narzędzia wyświetla maksymalnie 2 tagi (hashtagi).
    *   Kliknięcie w kartę otwiera Sidepeek z pełnym opisem i schematami I/O.
    *   Jeśli narzędzi jest > 12, widoczna jest paginacja.

## Implementacja Testów

### A. Skrypt weryfikujący synchronizację (Python)
**Plik:** `axon-app/backend/verify_e2e_tool_sync.py`
```python
import asyncio
import httpx
import os
import sys
from pathlib import Path

# Setup paths
BACKEND_DIR = Path(__file__).parent
sys.path.append(str(BACKEND_DIR))

from app.shared.infrastructure.database import AsyncSessionLocal
from app.modules.resources.infrastructure.tables import InternalToolTable
from sqlalchemy import select

TOOL_CODE = """
from . import tool
from typing import Dict, Any

@tool("E2E Test Flow Tool", keywords=["test", "e2e", "flow"])
def e2e_flow_test_function(test_param: str, test_value: int = 10) -> Dict[str, Any]:
    \"\"\"
    A tool designed specifically for testing the end-to-end tool flow.
    Args:
        test_param: A string parameter for testing.
        test_value: An integer parameter for testing.
    \"\"\"
    return {"status": "ok", "param": test_param, "value": test_value}
"""

async def verify_sync():
    print("🚀 Starting Backend E2E Sync Verification...")
    url = "http://127.0.0.1:8000/resources/internal-tools/sync-remote"
    file_name = "e2e_flow_tool.py"
    
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json={
            "file_name": file_name,
            "file_content": TOOL_CODE,
            "author": "e2e-tester"
        }, timeout=10.0)
        if r.status_code != 200: return False

    async with AsyncSessionLocal() as session:
        stmt = select(InternalToolTable).where(InternalToolTable.tool_function_name == "e2e_flow_test_function")
        result = await session.execute(stmt)
        tool = result.scalar_one_or_none()
        if not tool: return False
        
        # Weryfikacja metadanych
        if not all(k in tool.tool_keywords for k in ["test", "e2e", "flow"]): return False
        if "test_param" not in tool.tool_input_schema.get("properties", {}): return False
        
    print("🎉 BACKEND E2E SYNC VERIFIED!")
    return True

if __name__ == "__main__":
    asyncio.run(verify_sync())
```

### B. Test automatyczny Playwright (TypeScript)
**Plik:** `axon-app/frontend/tests/tool_lifecycle.spec.ts`
```typescript
import { test, expect } from '@playwright/test';

test.describe('Tool Lifecycle Flow', () => {
  test('should flow tool through library, studio and resources', async ({ page }) => {
    // 1. Otwarcie Studio i sprawdzenie biblioteki
    await page.goto('/workspaces/default/agents/studio/new');
    await page.click('text=Select from library');
    
    // Sprawdzenie czy nowe narzędzie E2E jest widoczne
    const toolCard = page.locator('text=E2E Test Flow Tool');
    await expect(toolCard).toBeVisible();
    
    // Weryfikacja tagów (hashtags)
    await expect(page.locator('text=#test')).toBeVisible();
    await expect(page.locator('text=#e2e')).toBeVisible();
    
    // 2. Dodanie narzędzia i sprawdzenie auto-mappingu
    await toolCard.click();
    await page.click('button[aria-label="Close"]'); // Zamknij modal jeśli nie zamknął się sam
    
    // Sprawdzenie sekcji Context (Inputs)
    await page.click('text=Context');
    await expect(page.locator('input[value="test_param"]')).toBeVisible();
    await expect(page.locator('input[value="test_value"]')).toBeVisible();
    
    // Sprawdzenie sekcji Artefacts (Outputs)
    await page.click('text=Artefacts');
    await expect(page.locator('input[value="e2e_flow_test_function_output"]')).toBeVisible();
    
    // 3. Sprawdzenie w Przeglądarce Zasobów
    await page.goto('/resources/tools');
    
    // Sprawdzenie czy karta narzędzia jest w gridzie 3-kolumnowym (layout check)
    const grid = page.locator('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    await expect(grid).toBeVisible();
    
    // Sprawdzenie opisu i tagów na głównej liście
    const resourceCard = page.locator('div:has-text("E2E Test Flow Tool")');
    await expect(resourceCard).toBeVisible();
    
    // Sidepeek test
    await resourceCard.click();
    await expect(page.locator('h4:has-text("Keywords")')).toBeVisible();
    await expect(page.locator('h4:has-text("Context")')).toBeVisible();
    await expect(page.locator('h4:has-text("Artefacts")')).toBeVisible();
  });
});
```

## Procedura Uruchomienia
1.  Uruchomienie backendu i frontendu `axon-app`.
2.  Uruchomienie skryptu Python do weryfikacji warstwy danych.
3.  Uruchomienie testów Playwright do weryfikacji warstwy UI.
