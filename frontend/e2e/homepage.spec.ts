/**
 * E2E Tests - Homepage
 * 
 * Tests critical user flows on the homepage
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load homepage successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/AI Music Platform/i);
    });

    test('should display header navigation', async ({ page }) => {
        const header = page.locator('header');
        await expect(header).toBeVisible();
    });

    test('should display footer', async ({ page }) => {
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
    });

    test('should show cookie consent banner', async ({ page }) => {
        const cookieBanner = page.locator('[data-testid="cookie-consent"]');

        // Cookie banner should be visible if not previously accepted
        const isVisible = await cookieBanner.isVisible();

        if (isVisible) {
            // Test accept button
            const acceptButton = cookieBanner.locator('button:has-text("Accept")');
            await expect(acceptButton).toBeVisible();

            // Click accept
            await acceptButton.click();

            // Banner should disappear
            await expect(cookieBanner).not.toBeVisible();
        }
    });

    test('should navigate to privacy policy', async ({ page }) => {
        await page.click('a[href="/privacy"]');
        await expect(page).toHaveURL('/privacy');
        await expect(page.locator('h1')).toContainText('Privacy Policy');
    });

    test('should navigate to terms of service', async ({ page }) => {
        await page.click('a[href="/terms"]');
        await expect(page).toHaveURL('/terms');
        await expect(page.locator('h1')).toContainText('Terms of Service');
    });
});

test.describe('Contact Form', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should submit contact form successfully', async ({ page }) => {
        // Navigate to contact section or page
        // This assumes there's a contact form on the homepage
        // Adjust selectors based on actual implementation

        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('input[name="subject"]', 'Test Subject');
        await page.fill('textarea[name="message"]', 'This is a test message');

        await page.click('button[type="submit"]');

        // Wait for success message
        await expect(page.locator('text=Message sent successfully')).toBeVisible({
            timeout: 10000,
        });
    });

    test('should show validation errors for empty fields', async ({ page }) => {
        await page.click('button[type="submit"]');

        // Should show validation errors
        await expect(page.locator('text=required')).toBeVisible();
    });

    test('should validate email format', async ({ page }) => {
        await page.fill('input[name="email"]', 'invalid-email');
        await page.click('button[type="submit"]');

        await expect(page.locator('text=valid email')).toBeVisible();
    });
});

test.describe('Responsive Design', () => {
    test('should be mobile responsive', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Check that content is visible and properly formatted
        const header = page.locator('header');
        await expect(header).toBeVisible();

        // Mobile menu should be accessible
        const mobileMenu = page.locator('[data-testid="mobile-menu"]');
        if (await mobileMenu.isVisible()) {
            await mobileMenu.click();
            // Menu items should be visible
            await expect(page.locator('nav')).toBeVisible();
        }
    });

    test('should be tablet responsive', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.goto('/');

        const header = page.locator('header');
        await expect(header).toBeVisible();
    });
});
