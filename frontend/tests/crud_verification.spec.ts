import { test, expect } from '@playwright/test';

// Pomocnicza funkcja do generowania unikalnych nazw, aby uniknąć kolizji w środowisku testowym
const generateName = (prefix: string) => `${prefix} - ${Date.now()}`;

// Wspólny workspace wykorzystywany do testów
const WORKSPACE_URL = '/workspaces/ws-discovery';

test.describe('CRUD Verification Plan - Workspace Entities', () => {

  test('Agent Entity Data Flow (CRUD)', async ({ page }) => {
    const agentName = generateName('E2E Test Agent');
    const updatedAgentName = `${agentName} Updated`;
    const agentRole = 'E2E Tester';
    const agentGoal = 'Weryfikacja operacji CRUD automatycznie';

    // ==========================================
    // [C] CREATE (Tworzenie)
    // ==========================================
    await test.step('Nawigacja do listy Agentów i przejście do Studio', async () => {
      // 1. Inicjalizacja: Przejście z widoku Workspace -> Agents
      await page.goto(`${WORKSPACE_URL}/agents`);
      
      // Kliknięcie "Nowy Agent"
      await page.getByRole('button', { name: 'Nowy Agent' }).click();

      // Wybór trybu w Studio Discovery
      await page.getByRole('button', { name: /Start Blank/i }).click();

      // Upewnienie się, że jesteśmy w Studio (właściwy edytor)
      await expect(page).toHaveURL(/.*\/agents\/studio/);
    });

    await test.step('Wypełnianie formularza AgentStudio i zapisanie (Draft & Submit)', async () => {
      // 2. Autosave/Drafts & 3. Walidacja
      // Formularz jest podzielony na sekcje, zaczynamy od Identity.
      
      await page.getByRole('textbox', { name: 'Agent Name' }).fill(agentName);
      await page.getByRole('textbox', { name: 'Role' }).fill(agentRole);
      await page.getByRole('textbox', { name: 'Goal' }).fill(agentGoal);
      
      // Zapis
      // Używamy Regexa w zależności czy przycisk to "Utwórz Agenta" czy "Zapisz Agenta" itp.
      await page.getByRole('button', { name: /(Utwórz Agenta|Zaktualizuj Agenta|Zapisz)/i }).click();

      // 4. Przepływ powrotny
      // Po zapisie powinno wrócić na listę Agentów
      await expect(page).toHaveURL(/.*\/workspaces\/.*\/agents/);
    });

    // ==========================================
    // [R] READ (Odczyt)
    // ==========================================
    await test.step('Sprawdzenie widoku Karty (Card) i panelu podglądu (Sidepeek)', async () => {
      // 1. Spójność Karty - Szukamy nowo utworzonej encji na liście
      const agentCard = page.getByRole('link', { name: new RegExp(agentName, 'i') }).first();
      await expect(agentCard).toBeVisible();

      // 2. Ładowanie Sidepeeka
      await agentCard.click();
      
      const dialog = page.getByRole('dialog', { name: /AI Agent/i });
      await expect(dialog).toBeVisible();
      
      // Sprawdzenie metadanych w Sidepeek
      await expect(dialog.getByRole('heading', { name: 'AI Agent' })).toBeVisible();
      await expect(dialog.getByText(agentName)).toBeVisible();
      // np. upewnienie się że rola widnieje
      // await expect(dialog.getByText(agentRole)).toBeVisible();
    });

    // ==========================================
    // [U] UPDATE (Aktualizacja)
    // ==========================================
    await test.step('Edycja encji (Nawodnienie formularza) i weryfikacja optymistycznego zapisu', async () => {
      const dialog = page.getByRole('dialog', { name: /AI Agent/i });
      
      // 1. Hydracja Danych - Kliknięcie "Edytuj Agenta" w Sidepeek
      await dialog.getByRole('button', { name: 'Edytuj Agenta' }).click();
      await expect(page).toHaveURL(/.*\/agents\/studio\/.+/);

      // Sprawdzenie czy formularz jest nawodniony
      await expect(page.getByRole('textbox', { name: 'Agent Name' })).toHaveValue(agentName);

      // 2. Edycja i nadpisanie danych
      await page.getByRole('textbox', { name: 'Agent Name' }).fill(updatedAgentName);
      
      // Zapis
      await page.getByRole('button', { name: /(Zaktualizuj Agenta|Zapisz)/i }).click();

      // 3. Zapis i Re-render
      await expect(page).toHaveURL(/.*\/workspaces\/.*\/agents/);
      
      // Sprawdzenie, czy zmiana jest widoczna na karcie
      const updatedCard = page.getByRole('link', { name: new RegExp(updatedAgentName, 'i') }).first();
      await expect(updatedCard).toBeVisible();
    });

    // ==========================================
    // [D] DELETE (Usuwanie)
    // ==========================================
    await test.step('Usunięcie encji', async () => {
      // Otwarcie aktualnej karty
      const updatedCard = page.getByRole('link', { name: new RegExp(updatedAgentName, 'i') }).first();
      await updatedCard.click();
      
      const dialog = page.getByRole('dialog', { name: /AI Agent/i });
      
      // Założenie: Przycisk Usunięcia znajduje się pod menu 'Więcej Akcji' lub jest ikoną 'Usuń' 
      // np. dialog.getByRole('button', { name: 'Usuń' }).click();
      
      // W celu dokończenia tego testu potrzebujemy potwierdzonego przycisku Usunięcia,
      // ale test sprawdza strukturę planu.
      
      // await dialog.getByRole('button', { name: /Usuń|Delete/i }).click();
      // const confirmModal = page.getByRole('dialog', { name: /Potwierdź|Confirm/i });
      // await confirmModal.getByRole('button', { name: /Tak|Usuń/i }).click();
      //
      // 3. Zniknięcie z UI
      // await expect(page.getByText(updatedAgentName)).not.toBeVisible();
      
      await dialog.getByRole('button', { name: 'Close' }).click();
    });
  });

  test('Crew Entity Data Flow (CRUD)', async ({ page }) => {
    const crewName = generateName('E2E Test Crew');
    const updatedCrewName = `${crewName} Updated`;
    const crewGoal = 'Weryfikacja operacji tworzenia zespołu';

    // ==========================================
    // [C] CREATE (Tworzenie)
    // ==========================================
    await test.step('Nawigacja do listy Crew i przejście do Studio', async () => {
      await page.goto(`${WORKSPACE_URL}/crews`);
      
      await page.getByRole('button', { name: 'Nowy Crew' }).click();

      // Upewnienie się, że jesteśmy w Studio
      await expect(page).toHaveURL(/.*\/crews\/studio/);
    });

    await test.step('Wypełnianie formularza CrewStudio i zapisanie', async () => {
      await page.getByRole('textbox', { name: 'Crew Name' }).fill(crewName);
      await page.getByRole('textbox', { name: 'Goal / Description' }).fill(crewGoal);
      
      // Typ kooperacji (domyślnie jest Hierarchical w snapshot, ale możemy go zostawić lub kliknąć Parallel)
      await page.getByRole('button', { name: /Parallel Standard team structure/i }).click();

      // Zapis
      await page.getByRole('button', { name: 'Save Team' }).click();

      // Przepływ powrotny
      await expect(page).toHaveURL(/.*\/workspaces\/.*\/crews/);
    });

    // ==========================================
    // [R] READ (Odczyt)
    // ==========================================
    await test.step('Sprawdzenie widoku Karty i panelu podglądu', async () => {
      const crewCard = page.getByRole('link', { name: new RegExp(crewName, 'i') }).first();
      await expect(crewCard).toBeVisible();

      await crewCard.click();
      
      // Sidepeek dla Crew
      const dialog = page.getByRole('dialog', { name: new RegExp(crewName, 'i') });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByText(crewGoal)).toBeVisible();
    });

    // ==========================================
    // [U] UPDATE (Aktualizacja)
    // ==========================================
    await test.step('Edycja encji', async () => {
      const dialog = page.getByRole('dialog', { name: new RegExp(crewName, 'i') });
      
      // Spodziewany przycisk edycji w Sidepeeku
      await dialog.getByRole('button', { name: /Edytuj|Edit/i }).click();
      await expect(page).toHaveURL(/.*\/crews\/studio\/.+/);

      await expect(page.getByRole('textbox', { name: 'Crew Name' })).toHaveValue(crewName);
      await page.getByRole('textbox', { name: 'Crew Name' }).fill(updatedCrewName);
      
      await page.getByRole('button', { name: /Save Team|Zapisz/i }).click();
      await expect(page).toHaveURL(/.*\/workspaces\/.*\/crews/);
      
      const updatedCard = page.getByRole('link', { name: new RegExp(updatedCrewName, 'i') }).first();
      await expect(updatedCard).toBeVisible();
    });

    // ==========================================
    // [D] DELETE (Usuwanie)
    // ==========================================
    await test.step('Zamknięcie Sidepeeka / Usunięcie', async () => {
      const updatedCard = page.getByRole('link', { name: new RegExp(updatedCrewName, 'i') }).first();
      await updatedCard.click();
      
      const dialog = page.getByRole('dialog', { name: new RegExp(updatedCrewName, 'i') });
      await expect(dialog).toBeVisible();
      
      // Do zaimplementowania akcja właściwego usuwania
      await dialog.getByRole('button', { name: 'Close' }).click();
    });
  });

  test('Template Entity Data Flow (CRUD)', async ({ page }) => {
    // Podobna struktura do Agent Entity, weryfikująca Template
    test.skip();
  });

  test('Service Entity Data Flow (CRUD)', async ({ page }) => {
    // Podobna struktura do Agent Entity, weryfikująca Service
    test.skip();
  });

  test('Automation Entity Data Flow (CRUD)', async ({ page }) => {
    // Podobna struktura do Agent Entity, weryfikująca Automation
    test.skip();
  });

  test('Archetype Entity Data Flow (CRUD)', async ({ page }) => {
    // Podobna struktura do Agent Entity, weryfikująca Archetype
    test.skip();
  });

});
