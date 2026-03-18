import { test, expect } from '@playwright/test';

test.describe('Axon Template CRUD Verification', () => {
  const BASE_URL = 'http://localhost:3000';
  const WORKSPACE_ID = 'ws-discovery';
  const TEST_TEMPLATE_NAME = `QA Template ${Date.now()}`;

  test('Template CRUD Cycle (Markdown-based)', async ({ page }) => {
    // 1. Inicjalizacja: Przejście do studia tworzenia szablonu
    await page.goto(`${BASE_URL}/workspaces/${WORKSPACE_ID}/templates/studio`);
    
    // 2. Wypełnienie podstawowych danych (DefinitionSection)
    await page.getByPlaceholder(/Template Name/i).fill(TEST_TEMPLATE_NAME);
    await page.getByPlaceholder(/Describe the purpose/i).fill('This is a test template for QA verification.');
    
    // 3. Wypełnienie instrukcji (InstructionSection - Markdown)
    // To pole powinno automatycznie wygenerować checklist_items w bazie
    const markdownContent = '# Main Task 1\nDescription for Task 1\n- [ ] Subtask 1.1\n- [ ] Subtask 1.2\n\n# Main Task 2\n- [ ] Subtask 2.1';
    await page.getByPlaceholder(/# Step 1: Research/i).fill(markdownContent);

    // 4. Zapisanie szablonu
    const saveButton = page.getByRole('button', { name: /Save Template|Utwórz/i });
    
    // Przechwycenie żądania POST
    const [createRequest] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/templates') && req.method() === 'POST'),
      saveButton.click()
    ]);
    
    const postData = JSON.parse(createRequest.postData() || '{}');
    console.log(`TEMPLATE_CREATE_POST_DATA: ${JSON.stringify(postData, null, 2)}`);
    
    // Weryfikacja czy checklist_items zostały wygenerowane
    expect(postData.template_checklist_items).toBeDefined();
    expect(postData.template_checklist_items.length).toBe(2);
    expect(postData.template_checklist_items[0].label).toBe('Main Task 1');
    expect(postData.template_checklist_items[0].subactions.length).toBe(2);

    // 5. Weryfikacja na liście (Read)
    await expect(page).toHaveURL(new RegExp(`/workspaces/${WORKSPACE_ID}/templates$`));
    await expect(page.getByText(TEST_TEMPLATE_NAME)).toBeVisible();

    // 6. Otwarcie Sidepeeka i weryfikacja danych (Read)
    await page.locator('div').filter({ hasText: TEST_TEMPLATE_NAME }).getByRole('button').filter({ hasText: /Edit/i }).click();
    
    const sidePeek = page.locator('[role="dialog"]'); 
    await expect(sidePeek.getByText(TEST_TEMPLATE_NAME)).toBeVisible();
    await expect(sidePeek.getByText('Main Task 1')).toBeVisible();
    await expect(sidePeek.getByText('Subtask 1.1')).toBeVisible();
    await expect(sidePeek.getByText('Subtask 1.2')).toBeVisible();
    await expect(sidePeek.getByText('Main Task 2')).toBeVisible();

    // 7. Edycja (Update)
    await sidePeek.getByRole('button', { name: /Edytuj Template/i }).click();
    await expect(page).toHaveURL(new RegExp(`/workspaces/${WORKSPACE_ID}/templates/studio/`));
    
    const newName = `${TEST_TEMPLATE_NAME} UPDATED`;
    await page.getByPlaceholder(/Template Name/i).fill(newName);
    
    // Zmiana markdownu
    const updatedMarkdown = '# Updated Task\n- [x] Completed item';
    await page.getByPlaceholder(/# Step 1: Research/i).fill(updatedMarkdown);
    
    // Przechwycenie żądania PUT
    const [updateRequest] = await Promise.all([
      page.waitForRequest(req => req.url().includes('/templates/') && req.method() === 'PUT'),
      page.getByRole('button', { name: /Update Template/i }).click()
    ]);

    const putData = JSON.parse(updateRequest.postData() || '{}');
    expect(putData.template_checklist_items[0].label).toBe('Updated Task');
    expect(putData.template_checklist_items[0].subactions[0].isCompleted).toBe(true);

    // 8. Weryfikacja po aktualizacji
    await expect(page).toHaveURL(new RegExp(`/workspaces/${WORKSPACE_ID}/templates$`));
    await expect(page.getByText(newName)).toBeVisible();

    // 9. Usuwanie (Delete)
    await page.locator('div').filter({ hasText: newName }).getByRole('button').filter({ hasText: /Edit/i }).click();
    page.on('dialog', dialog => dialog.accept());
    
    await Promise.all([
      page.waitForRequest(req => req.url().includes('/templates/') && req.method() === 'DELETE'),
      page.getByRole('button', { name: /Usuń Template/i }).click()
    ]);

    // 10. Finalna weryfikacja
    await expect(page.getByText(newName)).not.toBeVisible();
  });
});
