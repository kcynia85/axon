import { test, expect } from '@playwright/test';

test.describe('Axon CRUD Verification', () => {
  const BASE_URL = 'http://localhost:3000';

  test('1. Workspaces & Navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/workspaces`);
    
    // Verify that the workspaces list contains expected items
    await expect(page.getByText('Product Management')).toBeVisible();
    await expect(page.getByText('Discovery')).toBeVisible();
    await expect(page.getByText('Design')).toBeVisible();

    // Navigate to Product Management
    await page.getByText('Product Management').click();
    
    // Verify redirection
    await expect(page).toHaveURL(/\/workspaces\/ws-product/);
    await expect(page.getByRole('heading', { name: 'Product Management' })).toBeVisible();
  });

  test('2. Agents CRUD (Studio)', async ({ page }) => {
    const testAgentName = `QA Agent ${Date.now()}`;
    
    // Create Agent
    await page.goto(`${BASE_URL}/workspaces/ws-product/agents/studio`);
    
    // Wait for form to be ready
    await page.getByPlaceholder('Agent Name').fill(testAgentName);
    await page.getByPlaceholder('Agent Role').fill('Verification Specialist');
    await page.getByPlaceholder('Agent Goal').fill('Ensure the system works correctly.');
    
    // Capture network request
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/agents/') && req.method() === 'POST'),
      page.getByRole('button', { name: /Save|Create|Utwórz/i }).first().click()
    ]);
    
    console.log(`AGENT_CREATE_POST_URL: ${request.url()}`);
    console.log(`AGENT_CREATE_POST_DATA: ${request.postData()}`);
    
    // Verify redirection to agents list
    await expect(page).toHaveURL(/\/workspaces\/ws-product\/agents$/);
    await expect(page.getByText(testAgentName)).toBeVisible();
  });

  test('3. Services & Archetypes Navigation', async ({ page }) => {
    // Navigate to Service Studio
    await page.goto(`${BASE_URL}/workspaces/ws-product/services/studio`);
    await expect(page.getByText(/Service|Serwis/i)).toBeVisible();

    // Navigate to Archetype Studio
    await page.goto(`${BASE_URL}/workspaces/ws-product/archetypes/studio`);
    await expect(page.getByText(/Archetype|Archetyp/i)).toBeVisible();
  });
});
