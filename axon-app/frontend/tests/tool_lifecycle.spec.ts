import { test, expect } from '@playwright/test';

test.describe('Tool Lifecycle Flow', () => {
  test('should flow tool through library, studio and resources', async ({ page }) => {
    // 1. Otwarcie Studio i sprawdzenie biblioteki
    // Zakładamy, że testowy tool został już zsynchronizowany przez skrypt Python
    await page.goto('/workspaces/default/agents/studio/new');
    
    // Kliknięcie w przycisk otwierający bibliotekę
    await page.click('text=Select from library');
    
    // Sprawdzenie czy nowe narzędzie E2E jest widoczne w modalu
    const toolCard = page.locator('div:has-text("E2E Test Flow Tool")').last();
    await expect(toolCard).toBeVisible();
    
    // Weryfikacja tagów (hashtags) w modalu
    await expect(page.locator('text=#test')).toBeVisible();
    await expect(page.locator('text=#e2e')).toBeVisible();
    
    // 2. Dodanie narzędzia i sprawdzenie auto-mappingu
    await toolCard.click();
    // Modal powinien się zamknąć lub klikamy X
    const closeBtn = page.locator('button:has(svg.lucide-x)');
    if (await closeBtn.isVisible()) {
        await closeBtn.click();
    }
    
    // Sprawdzenie czy narzędzie pojawiło się na liście "Tools" w Studio
    await expect(page.locator('h5:has-text("E2E Test Flow Tool")')).toBeVisible();
    
    // Sprawdzenie automatycznej synchronizacji z Context (Inputs)
    // Przewijamy do sekcji Context
    await page.locator('#CONTEXT').scrollIntoViewIfNeeded();
    await expect(page.locator('input[value="test_param"]')).toBeVisible();
    await expect(page.locator('input[value="test_value"]')).toBeVisible();
    
    // Sprawdzenie automatycznej synchronizacji z Artefacts (Outputs)
    await page.locator('#ARTEFACTS').scrollIntoViewIfNeeded();
    await expect(page.locator('input[value="e2e_flow_test_function_output"]')).toBeVisible();
    
    // 3. Sprawdzenie w Przeglądarce Zasobów
    await page.goto('/resources/tools');
    
    // Sprawdzenie czy karta narzędzia jest w gridzie 3-kolumnowym
    const grid = page.locator('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    await expect(grid).toBeVisible();
    
    // Sprawdzenie opisu (powinien być ucięty do 50 znaków)
    const truncatedDesc = "A tool designed specifically for testing the end...";
    await expect(page.locator(`text=${truncatedDesc}`)).toBeVisible();
    
    // Otwarcie Sidepeek i weryfikacja szczegółów
    const resourceCard = page.locator('div:has-text("E2E Test Flow Tool")').first();
    await resourceCard.click();
    
    await expect(page.locator('h4:has-text("Keywords")')).toBeVisible();
    await expect(page.locator('h4:has-text("Context")')).toBeVisible();
    await expect(page.locator('h4:has-text("Artefacts")')).toBeVisible();
    
    // Sprawdzenie czy w Sidepeek są tagi
    await expect(page.locator('text=#test')).toBeVisible();
  });
});
