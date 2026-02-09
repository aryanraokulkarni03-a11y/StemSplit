
import { test, expect } from '@playwright/test';
import path from 'path';

// Define constraints
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

test.describe('Singscape E2E Tests', () => {

    test('TC001: Valid audio file upload via drag-and-drop', async ({ page }) => {
        // Navigate to homepage
        await page.goto('http://localhost:3000');
        await expect(page).toHaveTitle(/Singscape/);

        // Prepare a mock file
        const buffer = Buffer.from('mock audio content');
        const file = {
            name: 'test-song.mp3',
            mimeType: 'audio/mpeg',
            buffer,
        };

        // Trigger upload (since drag-and-drop is hard to simulate perfectly, we use setInputFiles on the hidden input)
        // The FileUpload component likely has an input[type="file"]
        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles({
            name: 'test-song.mp3',
            mimeType: 'audio/mpeg',
            buffer: Buffer.alloc(1024 * 1024 * 5) // 5MB mock file
        });

        // Assertion: Check if we moved to processing or if file info is shown
        // Depending on implementation, it might auto-navigate or show a "Process" button
        // Assuming auto-navigate to /process based on previous code reviews
        await expect(page).toHaveURL(/.*process/);
    });

    test('TC004: Reject audio files exceeding 25MB', async ({ page }) => {
        await page.goto('http://localhost:3000');

        // Create a large buffer > 25MB
        const largeBuffer = Buffer.alloc(MAX_FILE_SIZE + 1024); // 25MB + 1KB

        const fileInput = page.locator('input[type="file"]');
        await fileInput.setInputFiles({
            name: 'large-song.mp3',
            mimeType: 'audio/mpeg',
            buffer: largeBuffer
        });

        // Assertion: Error message should appear
        await expect(page.locator('text=File too large')).toBeVisible();
        // Should NOT navigate
        await expect(page).toHaveURL('http://localhost:3000/');
    });

    test('TC015: Critical user journey - Happy path', async ({ page }) => {
        await page.goto('http://localhost:3000');

        // 1. Upload
        await page.locator('input[type="file"]').setInputFiles({
            name: 'happy-path.mp3',
            mimeType: 'audio/mpeg',
            buffer: Buffer.alloc(1024 * 1024 * 2) // 2MB
        });

        // 2. Processing Page
        await expect(page).toHaveURL(/.*process/);

        // Check for status messages
        await expect(page.locator('text=Separating vocals')).toBeVisible({ timeout: 10000 });

        // 3. Wait for completion (backend mock delays might be needed or handled)
        // The mock /api/separate returns a job that should complete
        // We expect eventual navigation to /results
        await expect(page).toHaveURL(/.*results/, { timeout: 60000 });

        // 4. Results Page
        // Check for stem players
        await expect(page.locator('text=VOCALS')).toBeVisible();
        await expect(page.locator('text=DRUMS')).toBeVisible();
        await expect(page.locator('text=BASS')).toBeVisible();
        await expect(page.locator('text=OTHER')).toBeVisible();

        // Check Download All button
        await expect(page.locator('button:has-text("Download All")')).toBeVisible();
    });

    test('TC012: API Health Check', async ({ request }) => {
        const response = await request.get('http://localhost:3000/api/health');
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.service).toBe('Singscape');
        expect(body.features.maxFileSize).toBe('25MB');
    });

});
