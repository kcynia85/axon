import { test, expect } from '@playwright/test';

test('reproduce infinite loop on reflexion toggle', async ({ page }) => {
  await page.goto('http://localhost:3000/workspaces/ws-product/agents/studio');
  
  // Fill Agent Name to ensure we are ready
  await page.getByRole('textbox', { name: 'Agent Name' }).fill('Test Agent');
  
  // Click Reflexion Mode
  const reflexionToggle = page.locator('div').filter({ hasText: /^Reflexion ModeAgent will self-correct before responding$/ }).first();
  await reflexionToggle.click();
  
  // Check if error occurred
  const errorHeading = page.getByRole('heading', { name: /Application error/ });
  if (await errorHeading.isVisible()) {
    console.log("LOOP DETECTED!");
  } else {
    console.log("NO LOOP");
  }
});
