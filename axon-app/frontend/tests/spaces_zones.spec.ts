import { test, expect } from '@playwright/test';

test.describe('Space Canvas Zones Verification', () => {
  
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to Spaces
    await page.goto('http://localhost:3000/spaces');
    
    // Wait for at least one space to be present
    const spaceCard = page.locator('a[href*="/spaces/"]').first();
    await expect(spaceCard).toBeVisible({ timeout: 15000 });
    await spaceCard.click();
    
    // Wait for Canvas
    await page.locator('.react-flow__renderer').waitFor({ timeout: 10000 });
  });

  test('should create a zone and component via PLUS button', async ({ page }) => {
    // 2. Select Workspace Unit in sidebar
    const discoveryUnit = page.locator('button:has-text("Discovery")').first();
    await expect(discoveryUnit).toBeVisible();
    await discoveryUnit.click();
    
    // 3. Find the PLUS button for a component
    const agentItem = page.locator('div:has-text("Quality Assurance Specialist")').filter({ has: page.locator('button') }).first();
    await expect(agentItem).toBeVisible();
    
    const plusButton = agentItem.locator('button').first();
    await plusButton.click();

    // 4. Verification: Zone should be created automatically with correct label
    const zoneNode = page.locator('.react-flow__node-zone');
    await expect(zoneNode).toBeVisible({ timeout: 10000 });
    
    const zoneLabel = page.locator('.node-zone-label');
    await expect(zoneLabel).toContainText('DISCOVERY');
    
    console.log("Plus button functionality verified successfully!");
  });

  test('should create a zone via Drag and Drop', async ({ page }) => {
    // 2. Select Workspace Unit
    const discoveryUnit = page.locator('button:has-text("Discovery")').first();
    await discoveryUnit.click();
    
    // 3. Perform Drag and Drop simulation
    const draggableItem = page.locator('div[draggable="true"]').first();
    const itemName = await draggableItem.locator('span.flex-1').textContent();

    const canvas = page.locator('.react-flow__pane');
    const canvasBounds = await canvas.boundingBox();
    if (!canvasBounds) throw new Error("Canvas not found");
    
    const dropX = canvasBounds.x + canvasBounds.width / 2;
    const dropY = canvasBounds.y + canvasBounds.height / 2;

    await page.evaluate(({ itemName, dropX, dropY }) => {
      const items = Array.from(document.querySelectorAll('div[draggable="true"]'));
      const element = items.find(el => el.textContent?.includes(itemName || ""));
      if (!element) throw new Error(`Could not find draggable item for ${itemName}`);
      
      const dataTransfer = new DataTransfer();
      dataTransfer.setData('application/reactflow', 'entity');
      dataTransfer.setData('application/axon-data', JSON.stringify({
          id: 'e2e-drag-id',
          label: itemName,
          type: 'agent',
          zoneColor: 'purple',
          workspaceId: 'discovery' // <--- Teraz przekazujemy workspaceId
      }));
      
      element.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
      document.querySelector('.react-flow__pane')?.dispatchEvent(new DragEvent('drop', {
        bubbles: true, cancelable: true, clientX: dropX, clientY: dropY, dataTransfer
      }));
    }, { itemName, dropX, dropY });

    // 5. Verification: Zone should be created with DISCOVERY label
    const zoneLabel = page.locator('.node-zone-label');
    await expect(zoneLabel).toBeVisible({ timeout: 10000 });
    await expect(zoneLabel).toContainText('DISCOVERY');
    
    console.log("Drag and Drop functionality verified successfully!");
  });
});
