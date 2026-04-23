import { test, expect } from '@playwright/test';

test.describe('Meta-Agent Full E2E Lifecycle', () => {
  const origin = 'http://localhost:3000';
  const spaceId = 'b938779c-5d89-4bbd-a3a9-74489d46e45e';

  test.beforeEach(async ({ context }) => {
    // Grant permissions for all tests in this suite
    await context.grantPermissions(['microphone'], { origin });
  });

  test('Step 1: Configure Meta-Agent in Studio', async ({ page }) => {
    // Navigate directly to Meta-Agent Studio
    await page.goto(`${origin}/settings/system/meta-agent/studio`);
    
    // Ensure Studio loads
    await expect(page.getByText('Meta-Agent Studio')).toBeVisible({ timeout: 15000 });

    // 1. Update Core Identity
    const systemPrompt = page.locator('textarea[name="meta_agent_system_prompt"]');
    await systemPrompt.clear();
    await systemPrompt.fill('You are a specialized test architect for Axon E2E tests.');

    // 2. Navigate to Voice & Speech section via sidebar
    await page.getByRole('button', { name: 'Voice & Speech' }).click();
    await expect(page.getByText('Select the engine responsible')).toBeVisible();

    // 3. Change Voice Provider to ElevenLabs
    const providerSelect = page.locator('text=Select provider...');
    await providerSelect.click();
    await page.getByRole('button', { name: 'ElevenLabs' }).click();

    // 4. Adjust ElevenLabs specific settings (Stability and Speed)
    // Find the Stability slider - searching for the label and then the slider sibling
    const stabilitySlider = page.locator('span:has-text("Stability")').locator('xpath=..').locator('input[type="range"]');
    // Using evaluate to change value as range inputs can be tricky with Playwright's drag
    await stabilitySlider.evaluate((el: HTMLInputElement) => el.value = "0.8");
    await stabilitySlider.dispatchEvent('change');

    // 5. Save settings
    await page.getByRole('button', { name: 'Save Changes' }).click();

    // 6. Verify success toast
    await expect(page.locator('text=Meta-Agent and Voice configuration updated successfully')).toBeVisible();
  });

  test('Step 2: Interact with Meta-Agent in Space Canvas (Text)', async ({ page }) => {
    // Navigate to the Demo Space
    await page.goto(`${origin}/spaces/${spaceId}`);
    await expect(page.getByRole('heading', { name: 'Demo Space' })).toBeVisible({ timeout: 15000 });

    // Open Meta-Agent Panel if not open
    const voiceButton = page.locator('button[title="Voice Input"]');
    if (!(await voiceButton.isVisible())) {
       // Click the Magic Orb
       await page.evaluate(() => {
          const orb = Array.from(document.querySelectorAll('button')).find(b => b.className.includes('fixed bottom-8'));
          if (orb) orb.click();
       });
    }

    // Submit a query
    const textArea = page.locator('textarea[placeholder="Describe the flow, agent, or crew..."]');
    await textArea.fill('Create a simple data analyst agent in the discovery zone');
    await page.locator('button:has(svg.lucide-arrow-up)').click();

    // Verify generating state
    await expect(page.locator('text=Generating draft flow...')).toBeVisible();

    // Wait for proposal (mock or real depending on backend availability, assuming real for full E2E)
    // We expect the proposal UI to appear
    await expect(page.locator('text=Proposed Flow')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('text=DISCOVERY Zone')).toBeVisible();
  });

  test('Step 3: Verify Voice Interaction Selected State & STT', async ({ page }) => {
    await page.goto(`${origin}/spaces/${spaceId}`);
    
    // Mock MediaDevices and MediaRecorder
    await page.evaluate(() => {
      const mockStream = { getTracks: () => [{ stop: () => {} }], id: 'mock-stream' };
      navigator.mediaDevices.getUserMedia = async () => mockStream as any;
      class MockMediaRecorder {
        onstop: any = null; ondataavailable: any = null; state = 'inactive';
        constructor(stream: any, options: any) {}
        start() { 
            this.state = 'recording'; 
            if (this.ondataavailable) this.ondataavailable({ data: new Blob(['fake'], { type: 'audio/webm' }) });
        }
        stop() { this.state = 'inactive'; if (this.onstop) this.onstop(); }
        static isTypeSupported(type: string) { return true; }
      }
      (window as any).MediaRecorder = MockMediaRecorder;
    });

    // Mock STT API
    await page.route('**/system/voice/stt', async route => {
      await route.fulfill({ json: { text: 'E2E Voice Test Result' }, status: 200 });
    });

    // Open Panel
    const voiceButton = page.locator('button[title="Voice Input"]');
    if (!(await voiceButton.isVisible())) {
       await page.evaluate(() => {
          const orb = Array.from(document.querySelectorAll('button')).find(b => b.className.includes('fixed bottom-8'));
          if (orb) orb.click();
       });
    }

    // 1. Verify idle state colors (subtle)
    await expect(voiceButton).toHaveClass(/bg-white\/5/);

    // 2. Click Mic and verify "Selected" state (White/Black)
    await voiceButton.click();
    await expect(voiceButton).toHaveClass(/bg-white/);
    await expect(voiceButton).toHaveClass(/text-black/);
    await expect(voiceButton).toHaveClass(/shadow/); // Glow effect

    // 3. Stop recording
    await voiceButton.click();

    // 4. Verify transcription result populated
    const textArea = page.locator('textarea[placeholder="Describe the flow, agent, or crew..."]');
    await expect(textArea).toHaveValue('E2E Voice Test Result', { timeout: 10000 });
  });
});
