import { test, expect } from '@playwright/test';

test.describe('Space Canvas Persistence Verification', () => {
  
  test('should persist nodes after page reload', async ({ page }) => {
    // 1. Navigate to Spaces
    await page.goto('http://localhost:3000/spaces');
    
    // Select the first space
    const spaceCard = page.locator('a[href*="/spaces/"]').first();
    await expect(spaceCard).toBeVisible({ timeout: 15000 });
    
    // Get space ID for logging or direct navigation if needed
    const href = await spaceCard.getAttribute('href');
    console.log(`Testing persistence for space: ${href}`);
    
    await spaceCard.click();
    
    // Wait for Canvas to load
    await page.locator('.react-flow__renderer').waitFor({ timeout: 10000 });

    // 2. Add a component to the canvas
    const discoveryUnit = page.locator('button:has-text("Discovery")').first();
    await expect(discoveryUnit).toBeVisible();
    await discoveryUnit.click();
    
    const agentItem = page.locator('div:has-text("Quality Assurance Specialist")').filter({ has: page.locator('button') }).first();
    await expect(agentItem).toBeVisible();
    
    const plusButton = agentItem.locator('button').first();
    await plusButton.click();

    // 3. Verify node appeared on canvas
    const nodeSelector = '.react-flow__node-agent';
    await expect(page.locator(nodeSelector)).toBeVisible({ timeout: 10000 });
    
    // 4. Wait for auto-save to trigger (debounce is 1.5s)
    // We look for the "Saved" indicator in the top right
    const savedIndicator = page.locator('span:has-text("Saved")');
    await expect(savedIndicator).toBeVisible({ timeout: 10000 });
    
    console.log("Canvas change saved to backend.");

    // 5. Reload the page
    await page.reload();
    await page.locator('.react-flow__renderer').waitFor({ timeout: 10000 });

    // 6. Verification: Node should still be present on canvas
    await expect(page.locator(nodeSelector)).toBeVisible({ timeout: 15000 });
    
    console.log("Persistence verified successfully! Node survived page reload.");
  });
});
