import { test, expect } from '@playwright/test';

test.describe('Router Studio Data Flow & UI Verification', () => {
  const BASE_URL = 'http://localhost:3000';

  test('should verify LLMRouterCard UI cleanup and SidePeek content', async ({ page }) => {
    // Navigate to LLM Routers settings
    await page.goto(`${BASE_URL}/settings/llms/routers`);
    
    // 1. Verify LLMRouterCard UI
    const firstCard = page.locator('[data-slot="card"]').first();
    await expect(firstCard).toBeVisible();
    
    // Check that specific elements are GONE from the card based on recent edits
    // [1] Remove strategy badge/label (QUALITY OPTIMIZED etc)
    const strategyBadge = firstCard.locator('span:has-text("Quality Optimized"), span:has-text("Fallback"), span:has-text("Load Balancer")');
    // Note: In the latest edit, we ADDED a badge back under the title in the Card.
    // Let's check if it exists but matches the new style (simple badge)
    await expect(firstCard.locator('[data-slot="badge"]')).toBeVisible();

    // [5] "SZCZEGÓŁY KONFIGURACJI" should be gone from Card
    await expect(page.locator('text=SZCZEGÓŁY KONFIGURACJI')).not.toBeVisible();

    // 2. Open SidePeek
    await firstCard.click();
    const sidePeek = page.locator('[data-slot="sheet-content"]');
    await expect(sidePeek).toBeVisible();

    // [2] Performance section ("Wydajność") should be gone
    await expect(sidePeek.locator('h4:has-text("Wydajność")')).not.toBeVisible();
    await expect(sidePeek.locator('text=Średni czas odpowiedzi')).not.toBeVisible();

    // [3] Header should be "Łańcuch Priorytetów" and NO icon
    const chainHeader = sidePeek.locator('h4:has-text("Łańcuch Priorytetów")');
    await expect(chainHeader).toBeVisible();
    // Check if Network icon is gone (Network icon usually has 'lucide-network' class or similar)
    await expect(chainHeader.locator('svg')).not.toBeVisible();

    // 3. Verify Router Studio Hydration (Data Flow)
    // Click "Konfiguruj" in SidePeek footer
    const configureButton = sidePeek.locator('button:has-text("Konfiguruj")');
    await expect(configureButton).toBeVisible();
    await configureButton.click();

    // Wait for Studio to load
    await expect(page).toHaveURL(/.*\/settings\/llms\/routers\/.*/);
    
    // Check if form is hydrated (Name field should not be empty)
    const nameInput = page.locator('input[name="name"]');
    await expect(nameInput).not.toHaveValue('');
    
    // Check if priority chain is visible
    const chainItems = page.locator('text=Step 1'); // Assuming Studio shows steps
    // Or just check if there are model selectors
    await expect(page.locator('button:has-text("OpenAI"), button:has-text("Anthropic"), button:has-text("GPT")').first()).toBeVisible();
  });
});
