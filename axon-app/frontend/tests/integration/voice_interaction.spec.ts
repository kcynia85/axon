import { test, expect } from '@playwright/test';

test.use({
  launchOptions: {
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
    ],
  },
});

test.describe('Space Canvas Voice Interaction', () => {
  test('Microphone STT integration updates chat input', async ({ page, context }) => {
    // Grant microphone permissions for the specific origin
    const origin = 'http://localhost:3000';
    await context.grantPermissions(['microphone'], { origin });

    // Mock the STT endpoint
    await page.route('**/api/v1/system/voice/stt', async route => {
      const json = { text: 'Test voice transcription successfully received' };
      await route.fulfill({ json, status: 200 });
    });

    // Navigate to a space
    await page.goto(`${origin}/spaces/b938779c-5d89-4bbd-a3a9-74489d46e45e`);

    // Mock MediaDevices and MediaRecorder
    await page.evaluate(() => {
      // Mock stream
      const mockStream = {
        getTracks: () => [{ stop: () => {} }],
        id: 'mock-stream'
      };
      
      // Mock getUserMedia
      navigator.mediaDevices.getUserMedia = async () => mockStream as any;

      // Mock MediaRecorder
      class MockMediaRecorder {
        onstop: any = null;
        ondataavailable: any = null;
        state = 'inactive';

        constructor(stream: any, options: any) {}

        start() {
          this.state = 'recording';
          // Simulate data
          if (this.ondataavailable) {
            this.ondataavailable({ data: new Blob(['fake audio data'], { type: 'audio/webm' }) });
          }
        }

        stop() {
          this.state = 'inactive';
          if (this.onstop) {
            this.onstop();
          }
        }

        static isTypeSupported(type: string) { return true; }
      }

      (window as any).MediaRecorder = MockMediaRecorder;
    });
    
    // Ensure the page loads
    await expect(page.getByRole('heading', { name: 'Demo Space' })).toBeVisible({ timeout: 15000 });

    // Try to find the MetaAgent panel voice button
    const voiceButton = page.locator('button[title="Voice Input"], button[title="Stop Recording"]');
    
    // If not visible, we need to click the orb
    if (!(await voiceButton.isVisible())) {
      // Find the generic button that is the orb (last generic button usually)
      // Playwright trick: wait for network idle to ensure orb is rendered
      await page.waitForLoadState('networkidle');
      
      // Let's just evaluate in page to click the orb, avoiding generic button ambiguity
      await page.evaluate(() => {
        // The orb is usually a button with a specific class or we can just find it
        // Or simply trigger the chat panel if we know the class
        const buttons = Array.from(document.querySelectorAll('button'));
        // Find the one that looks like an orb (fixed, bottom, right)
        const orb = buttons.find(b => b.className.includes('fixed bottom-8'));
        if (orb) {
            orb.click();
        }
      });
    }

    // Ensure the voice input button is visible
    await expect(voiceButton).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: 'test-results/before-click.png' });

    // Click the microphone to start recording
    console.log('Clicking voice button...');
    await voiceButton.click({ force: true });
    
    // Wait for the button state to change (look for red background or pulse)
    try {
        await page.waitForFunction(() => {
            const btn = document.querySelector('button[title="Stop Recording"]') || 
                        document.querySelector('button.bg-red-500');
            return btn !== null;
        }, { timeout: 8000 });
        console.log('Stop button detected!');
    } catch (e) {
        console.error('Stop state not detected. Current state:');
        await page.screenshot({ path: 'test-results/failure-state.png' });
        throw e;
    }

    // Since there's no actual human speaking, let's wait a short moment and stop recording
    await page.waitForTimeout(500);

    // Click to stop recording
    await stopButton.click();

    // Wait for STT mock response to be processed and input updated
    await expect(textArea).toHaveValue('Test voice transcription successfully received', { timeout: 10000 });
  });
});
