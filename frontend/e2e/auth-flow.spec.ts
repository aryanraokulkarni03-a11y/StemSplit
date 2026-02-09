import { test, expect } from '@playwright/test';

/**
 * Authentication Flow E2E Tests
 * Tests the complete user authentication journey
 */

test.describe('Authentication Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Start from the homepage
        await page.goto('/');
    });

    test.describe('Sign Up Flow', () => {
        test('should navigate to sign up page', async ({ page }) => {
            await page.click('a[href="/sign-up"]');
            await expect(page).toHaveURL('/sign-up');
            await expect(page.locator('h1')).toContainText('Sign Up');
        });

        test('should show validation errors for invalid inputs', async ({ page }) => {
            await page.goto('/sign-up');

            // Submit empty form
            await page.click('button[type="submit"]');

            // Check for validation errors
            await expect(page.locator('text=Name is required')).toBeVisible();
            await expect(page.locator('text=Email is required')).toBeVisible();
            await expect(page.locator('text=Password is required')).toBeVisible();
        });

        test('should show error for weak password', async ({ page }) => {
            await page.goto('/sign-up');

            await page.fill('input[name="name"]', 'Test User');
            await page.fill('input[name="email"]', 'test@example.com');
            await page.fill('input[name="password"]', 'weak');
            await page.fill('input[name="confirmPassword"]', 'weak');

            await page.click('button[type="submit"]');

            await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
        });

        test('should show error for mismatched passwords', async ({ page }) => {
            await page.goto('/sign-up');

            await page.fill('input[name="name"]', 'Test User');
            await page.fill('input[name="email"]', 'test@example.com');
            await page.fill('input[name="password"]', 'StrongPass123!');
            await page.fill('input[name="confirmPassword"]', 'DifferentPass123!');

            await page.click('button[type="submit"]');

            await expect(page.locator('text=Passwords do not match')).toBeVisible();
        });

        test('should successfully create account with valid data', async ({ page }) => {
            await page.goto('/sign-up');

            const timestamp = Date.now();
            await page.fill('input[name="name"]', 'Test User');
            await page.fill('input[name="email"]', `test${timestamp}@example.com`);
            await page.fill('input[name="password"]', 'StrongPass123!');
            await page.fill('input[name="confirmPassword"]', 'StrongPass123!');

            await page.click('button[type="submit"]');

            // Should redirect to dashboard or show success message
            await expect(page).toHaveURL(/\/(dashboard|sign-in)/);
        });
    });

    test.describe('Sign In Flow', () => {
        test('should navigate to sign in page', async ({ page }) => {
            await page.click('a[href="/sign-in"]');
            await expect(page).toHaveURL('/sign-in');
            await expect(page.locator('h1')).toContainText('Sign In');
        });

        test('should show validation errors for empty fields', async ({ page }) => {
            await page.goto('/sign-in');

            await page.click('button[type="submit"]');

            await expect(page.locator('text=Email is required')).toBeVisible();
            await expect(page.locator('text=Password is required')).toBeVisible();
        });

        test('should show error for invalid credentials', async ({ page }) => {
            await page.goto('/sign-in');

            await page.fill('input[name="email"]', 'nonexistent@example.com');
            await page.fill('input[name="password"]', 'WrongPassword123!');

            await page.click('button[type="submit"]');

            await expect(page.locator('text=Invalid credentials')).toBeVisible();
        });

        test('should successfully sign in with valid credentials', async ({ page }) => {
            // Note: This test requires a pre-existing test account
            await page.goto('/sign-in');

            await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
            await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'TestPass123!');

            await page.click('button[type="submit"]');

            // Should redirect to dashboard
            await expect(page).toHaveURL('/dashboard');
        });

        test('should show OAuth provider buttons', async ({ page }) => {
            await page.goto('/sign-in');

            await expect(page.locator('button:has-text("Continue with Google")')).toBeVisible();
            await expect(page.locator('button:has-text("Continue with GitHub")')).toBeVisible();
        });
    });

    test.describe('Forgot Password Flow', () => {
        test('should navigate to forgot password page', async ({ page }) => {
            await page.goto('/sign-in');
            await page.click('a[href="/forgot-password"]');
            await expect(page).toHaveURL('/forgot-password');
            await expect(page.locator('h1')).toContainText('Forgot Password');
        });

        test('should show validation error for invalid email', async ({ page }) => {
            await page.goto('/forgot-password');

            await page.fill('input[name="email"]', 'invalid-email');
            await page.click('button[type="submit"]');

            await expect(page.locator('text=Invalid email address')).toBeVisible();
        });

        test('should show success message for valid email', async ({ page }) => {
            await page.goto('/forgot-password');

            await page.fill('input[name="email"]', 'test@example.com');
            await page.click('button[type="submit"]');

            await expect(page.locator('text=Password reset email sent')).toBeVisible();
        });
    });

    test.describe('Dashboard Access', () => {
        test('should redirect unauthenticated users to sign in', async ({ page }) => {
            await page.goto('/dashboard');
            await expect(page).toHaveURL(/\/sign-in/);
        });

        test('should allow authenticated users to access dashboard', async ({ page }) => {
            // Sign in first
            await page.goto('/sign-in');
            await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
            await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'TestPass123!');
            await page.click('button[type="submit"]');

            // Access dashboard
            await page.goto('/dashboard');
            await expect(page).toHaveURL('/dashboard');
            await expect(page.locator('h1')).toContainText('Dashboard');
        });

        test('should show user profile information', async ({ page }) => {
            // Sign in first
            await page.goto('/sign-in');
            await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
            await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'TestPass123!');
            await page.click('button[type="submit"]');

            // Check profile
            await expect(page.locator('[data-testid="user-name"]')).toBeVisible();
            await expect(page.locator('[data-testid="user-email"]')).toBeVisible();
        });

        test('should allow user to sign out', async ({ page }) => {
            // Sign in first
            await page.goto('/sign-in');
            await page.fill('input[name="email"]', process.env.TEST_USER_EMAIL || 'test@example.com');
            await page.fill('input[name="password"]', process.env.TEST_USER_PASSWORD || 'TestPass123!');
            await page.click('button[type="submit"]');

            // Sign out
            await page.click('button:has-text("Sign Out")');
            await expect(page).toHaveURL('/');

            // Try to access dashboard again
            await page.goto('/dashboard');
            await expect(page).toHaveURL(/\/sign-in/);
        });
    });
});
