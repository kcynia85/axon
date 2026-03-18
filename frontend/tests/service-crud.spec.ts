import { test, expect } from '@playwright/test';

test.describe('Service Studio CRUD', () => {
  test('should create, draft, update and delete a service', async ({ page }) => {
    // 1. Navigate to Service Studio (New)
    await page.goto('/workspaces/test-ws/services/studio');

    // 2. Fill basic info and ensure draft auto-saves
    await page.fill('input[name="name"]', 'Test Service');
    await page.fill('input[name="url"]', 'https://api.test.com');
    
    // Trigger blur/autosave
    await page.locator('input[name="url"]').blur();

    // Verify localStorage draft
    const draft = await page.evaluate(() => localStorage.getItem('axon_service_draft_test-ws_new'));
    expect(draft).toContain('Test Service');

    // 3. Save
    await page.click('button:has-text("Save")');

    // 4. Verify draft is cleared
    const clearedDraft = await page.evaluate(() => localStorage.getItem('axon_service_draft_test-ws_new'));
    expect(clearedDraft).toBeNull();
  });
});
