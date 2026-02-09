import { test, expect } from '@playwright/test';

/**
 * Audio Demo E2E Tests
 * Tests the interactive audio player and demo functionality
 */

test.describe('Audio Demo', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Scroll to demo section
        await page.locator('[data-section="interactive-demo"]').scrollIntoViewIfNeeded();
    });

    test.describe('Audio Player Controls', () => {
        test('should display audio player component', async ({ page }) => {
            await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();
        });

        test('should have play/pause button', async ({ page }) => {
            const playButton = page.locator('button[aria-label*="Play"]');
            await expect(playButton).toBeVisible();
        });

        test('should toggle play/pause on button click', async ({ page }) => {
            const playButton = page.locator('button[aria-label*="Play"]');

            // Click play
            await playButton.click();
            await expect(page.locator('button[aria-label*="Pause"]')).toBeVisible();

            // Click pause
            await playButton.click();
            await expect(page.locator('button[aria-label*="Play"]')).toBeVisible();
        });

        test('should display time progress', async ({ page }) => {
            await expect(page.locator('[data-testid="current-time"]')).toBeVisible();
            await expect(page.locator('[data-testid="duration"]')).toBeVisible();
        });

        test('should have volume controls', async ({ page }) => {
            await expect(page.locator('input[aria-label*="Vocal volume"]')).toBeVisible();
            await expect(page.locator('input[aria-label*="Instrumental volume"]')).toBeVisible();
        });

        test('should adjust volume when slider is moved', async ({ page }) => {
            const volumeSlider = page.locator('input[aria-label*="Vocal volume"]');

            // Get initial value
            const initialValue = await volumeSlider.inputValue();

            // Change volume
            await volumeSlider.fill('50');

            // Verify change
            const newValue = await volumeSlider.inputValue();
            expect(newValue).not.toBe(initialValue);
        });

        test('should have playback speed control', async ({ page }) => {
            const speedControl = page.locator('[data-testid="playback-speed"]');
            await expect(speedControl).toBeVisible();
        });

        test('should change playback speed', async ({ page }) => {
            const speedControl = page.locator('select[aria-label*="Playback speed"]');

            // Change speed
            await speedControl.selectOption('1.5');

            // Verify selection
            await expect(speedControl).toHaveValue('1.5');
        });

        test('should have seek bar', async ({ page }) => {
            const seekBar = page.locator('input[type="range"][aria-label*="Seek"]');
            await expect(seekBar).toBeVisible();
        });
    });

    test.describe('Waveform Visualization', () => {
        test('should display waveform component', async ({ page }) => {
            await expect(page.locator('[data-testid="waveform"]')).toBeVisible();
        });

        test('should render waveform canvas', async ({ page }) => {
            const canvas = page.locator('canvas');
            await expect(canvas).toBeVisible();
        });

        test('should seek on waveform click', async ({ page }) => {
            const waveform = page.locator('[data-testid="waveform"]');

            // Click on waveform
            await waveform.click({ position: { x: 100, y: 50 } });

            // Verify time changed (current time should be > 0)
            const currentTime = page.locator('[data-testid="current-time"]');
            await expect(currentTime).not.toHaveText('0:00');
        });
    });

    test.describe('Lyric Display', () => {
        test('should display lyric component', async ({ page }) => {
            await expect(page.locator('[data-testid="lyric-display"]')).toBeVisible();
        });

        test('should show lyric lines', async ({ page }) => {
            const lyricLines = page.locator('[data-lyric-line]');
            await expect(lyricLines.first()).toBeVisible();
        });

        test('should highlight current lyric line', async ({ page }) => {
            // Start playback
            await page.click('button[aria-label*="Play"]');

            // Wait for first line to be highlighted
            await page.waitForTimeout(1000);

            const activeLine = page.locator('[data-lyric-line].active');
            await expect(activeLine).toBeVisible();
        });

        test('should seek on lyric line click', async ({ page }) => {
            const lyricLine = page.locator('[data-lyric-line]').nth(2);

            // Click on third lyric line
            await lyricLine.click();

            // Verify time changed
            const currentTime = page.locator('[data-testid="current-time"]');
            await expect(currentTime).not.toHaveText('0:00');
        });

        test('should toggle translation', async ({ page }) => {
            const translationToggle = page.locator('button:has-text("Show Translation")');

            if (await translationToggle.isVisible()) {
                await translationToggle.click();
                await expect(page.locator('[data-translation]')).toBeVisible();
            }
        });

        test('should auto-scroll to active lyric', async ({ page }) => {
            // Start playback
            await page.click('button[aria-label*="Play"]');

            // Wait for scrolling
            await page.waitForTimeout(2000);

            // Active line should be in viewport
            const activeLine = page.locator('[data-lyric-line].active');
            await expect(activeLine).toBeInViewport();
        });
    });

    test.describe('Device Router', () => {
        test('should display device router component', async ({ page }) => {
            await expect(page.locator('[data-testid="device-router"]')).toBeVisible();
        });

        test('should show available devices', async ({ page }) => {
            await expect(page.locator('[data-device]')).toHaveCount(3); // Headphones, Speakers, Bluetooth
        });

        test('should toggle device routing', async ({ page }) => {
            const deviceToggle = page.locator('[data-device="headphones"] input[type="checkbox"]').first();

            // Toggle on
            await deviceToggle.check();
            await expect(deviceToggle).toBeChecked();

            // Toggle off
            await deviceToggle.uncheck();
            await expect(deviceToggle).not.toBeChecked();
        });

        test('should show routing visualization', async ({ page }) => {
            // Enable routing for a device
            await page.locator('[data-device="headphones"] input[type="checkbox"]').first().check();

            // Verify routing indicator
            await expect(page.locator('[data-routing-active]')).toBeVisible();
        });
    });

    test.describe('Responsive Behavior', () => {
        test('should adapt layout on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });

            // Components should still be visible
            await expect(page.locator('[data-testid="audio-player"]')).toBeVisible();
            await expect(page.locator('[data-testid="waveform"]')).toBeVisible();
        });

        test('should stack components vertically on mobile', async ({ page }) => {
            await page.setViewportSize({ width: 375, height: 667 });

            const demoSection = page.locator('[data-section="interactive-demo"]');
            const boundingBox = await demoSection.boundingBox();

            // Height should be greater than width (vertical layout)
            expect(boundingBox?.height).toBeGreaterThan(boundingBox?.width || 0);
        });

        test('should maintain functionality on tablet', async ({ page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });

            // Play button should work
            await page.click('button[aria-label*="Play"]');
            await expect(page.locator('button[aria-label*="Pause"]')).toBeVisible();
        });
    });

    test.describe('Accessibility', () => {
        test('should have proper ARIA labels', async ({ page }) => {
            await expect(page.locator('button[aria-label*="Play"]')).toBeVisible();
            await expect(page.locator('input[aria-label*="volume"]')).toHaveCount(2);
        });

        test('should be keyboard navigable', async ({ page }) => {
            // Tab to play button
            await page.keyboard.press('Tab');
            await page.keyboard.press('Tab');

            // Press Enter to play
            await page.keyboard.press('Enter');

            // Verify playback started
            await expect(page.locator('button[aria-label*="Pause"]')).toBeVisible();
        });

        test('should have focus indicators', async ({ page }) => {
            await page.keyboard.press('Tab');

            const focusedElement = page.locator(':focus');
            await expect(focusedElement).toBeVisible();
        });
    });

    test.describe('Error Handling', () => {
        test('should show error message if audio fails to load', async ({ page }) => {
            // Mock failed audio load
            await page.route('**/demo/*.mp3', route => route.abort());

            await page.reload();
            await page.locator('[data-section="interactive-demo"]').scrollIntoViewIfNeeded();

            // Should show error state
            await expect(page.locator('text=Failed to load audio')).toBeVisible();
        });

        test('should disable controls when audio is not loaded', async ({ page }) => {
            await page.route('**/demo/*.mp3', route => route.abort());

            await page.reload();
            await page.locator('[data-section="interactive-demo"]').scrollIntoViewIfNeeded();

            // Play button should be disabled
            const playButton = page.locator('button[aria-label*="Play"]');
            await expect(playButton).toBeDisabled();
        });
    });
});
