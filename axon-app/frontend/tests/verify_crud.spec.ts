import { test, expect } from '@playwright/test';

test.describe('CRUD Verification: Service, Automation, Archetype', () => {
  const BASE_URL = 'http://localhost:3000';
  const WS_ID = 'ws-product';

  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
  });

  test('1. Service CRUD & Draft Persistence', async ({ page }) => {
    const serviceName = `Test Service ${Date.now()}`;
    const studioUrl = `${BASE_URL}/workspaces/${WS_ID}/services/studio`;

    await page.goto(studioUrl);
    
    // 1.1 Fill partially and check draft
    await page.getByLabel(/Service Name/i).fill(serviceName);
    await page.getByLabel(/Connection URL/i).fill('https://test.service.com');
    await page.getByLabel(/Service Name/i).blur();

    // Reload and verify draft
    await page.reload();
    await expect(page.getByLabel(/Service Name/i)).toHaveValue(serviceName);

    // 1.2 Complete and Submit
    await page.getByLabel(/Business Context/i).fill('Test description for service');
    
    // Intercept POST
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/resources/services') && req.method() === 'POST', { timeout: 10000 }),
      page.getByRole('button', { name: /Zapisz Usługę/i }).click()
    ]);

    const postData = JSON.parse(request.postData() || '{}');
    expect(postData.service_name).toBe(serviceName);
    
    // 1.3 Verify Redirection
    await expect(page).toHaveURL(new RegExp(`/workspaces/${WS_ID}/services$`));
  });

  test('2. Automation CRUD & Draft Persistence', async ({ page }) => {
    const automationName = `Test Automation ${Date.now()}`;
    const studioUrl = `${BASE_URL}/workspaces/${WS_ID}/automations/studio`;

    await page.goto(studioUrl);
    
    // 2.1 Fill Definition
    await page.getByLabel(/Automation Name/i).fill(automationName);
    await page.getByLabel(/Opis semantyczny/i).fill('Test automation semantic description');
    
    // 2.2 Fill Connection
    await page.getByLabel(/Adres URL \(Webhook\)/i).fill('https://n8n.test.com/webhook');

    // Intercept POST
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/resources/automations') && req.method() === 'POST', { timeout: 10000 }),
      page.getByRole('button', { name: /Zapisz Automatyzację/i }).click()
    ]);

    const postData = JSON.parse(request.postData() || '{}');
    expect(postData.automation_name).toBe(automationName);
    
    await expect(page).toHaveURL(new RegExp(`/workspaces/${WS_ID}/automations$`));
  });

  test('3. Archetype CRUD & Draft Persistence', async ({ page }) => {
    const archetypeName = `Test Archetype ${Date.now()}`;
    const studioUrl = `${BASE_URL}/resources/archetypes/studio`;

    await page.goto(studioUrl);
    
    // 3.1 Fill Required Fields
    await page.getByLabel(/Archetype Name/i).fill(archetypeName);
    await page.getByLabel(/Rola/i).fill('Test Role');
    await page.getByLabel(/Cel/i).fill('Test Goal');
    await page.getByLabel(/Backstory/i).fill('Test Backstory');

    // Intercept POST
    const [request] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/resources/prompts') && req.method() === 'POST', { timeout: 10000 }),
      page.getByRole('button', { name: /Zapisz Archetyp/i }).click()
    ]);

    const postData = JSON.parse(request.postData() || '{}');
    expect(postData.archetype_name).toBe(archetypeName); 
    
    await expect(page).toHaveURL(new RegExp('/resources/prompts$'));
    
    // 3.2 Verify Deletion
    const card = page.locator('[data-slot="card"]', { hasText: archetypeName });
    await card.hover();
    await card.getByRole('button', { name: /Delete|Usuń/i }).first().click();
    
    // Confirm in modal
    await page.getByRole('button', { name: /Confirm Deletion/i }).click();
    
    // Success toast check
    await expect(page.getByText(/Archetyp usunięty/i)).toBeVisible();
  });
});
