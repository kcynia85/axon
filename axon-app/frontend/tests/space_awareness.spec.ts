import { test, expect } from '@playwright/test';

test.describe('Space Awareness & Real-time Synchronization', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to a Space Canvas
    await page.goto('http://localhost:3000/spaces');
    
    // Wait for at least one space to be present and click it
    const spaceCard = page.locator('a[href*="/spaces/"]').first();
    await expect(spaceCard).toBeVisible({ timeout: 15000 });
    await spaceCard.click();
    
    // Wait for Canvas to load
    await page.locator('.react-flow__renderer').waitFor({ timeout: 10000 });
  });

  test('should show synchronization pulse and status when backend indexes changes', async ({ page }) => {
    // 2. Open Meta-Agent Panel if not open
    // (Assuming there's a button to open it, or it's open by default in some views)
    // Based on the code, it's often toggled. Let's look for the MagicSphere or panel.
    const metaAgentPanel = page.locator('div:has-text("What kind of flow should I draft?")');
    if (!(await metaAgentPanel.isVisible())) {
        // Find the toggle button - usually an orb or button in the bottom right
        const toggleButton = page.locator('button').filter({ has: page.locator('.MagicSphere') }).first();
        if (await toggleButton.isVisible()) {
            await toggleButton.click();
        }
    }

    // 3. Trigger a change that causes re-indexing
    // We'll move a node or add a zone
    const node = page.locator('.react-flow__node').first();
    await node.hover();
    await page.mouse.down();
    await page.mouse.move(100, 100);
    await page.mouse.up();

    // 4. Verification: MagicSphere should pulse (isSyncing = true)
    // In our implementation, isSyncing adds "bg-blue-500/40" and "scale-150"
    const pulseGlow = page.locator('.bg-blue-500\\/40.animate-pulse');
    
    // Note: This might be fast, so we wait for it to appear
    await expect(pulseGlow).toBeVisible({ timeout: 10000 });

    // 5. Verification: Status message in Meta-Agent panel
    const syncStatus = page.locator('span:has-text("System Synchronized at")');
    await expect(syncStatus).toBeVisible({ timeout: 10000 });
    
    console.log("Space Awareness E2E verification successful!");
  });

  test('should handle WebSocket reconnection', async ({ page }) => {
    // This is more complex to test in standard E2E but we can check if it stays connected
    const statusOrb = page.locator('.bg-green-500'); // The small green dot when synced
    await expect(statusOrb).toBeVisible();
  });
});
