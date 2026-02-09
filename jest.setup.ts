/**
 * Jest Setup File
 * 
 * Global test setup and configuration
 */

import '@testing-library/jest-dom';

// Mock environment variables
process.env.NEXT_PUBLIC_SITE_URL = 'https://aimusicplatform.com';
process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = 'G-TEST123';
process.env.NEXT_PUBLIC_BACKEND_URL = 'http://localhost:8000';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    takeRecords() {
        return [];
    }
    unobserve() { }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    unobserve() { }
} as any;

// Suppress console errors in tests (optional)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };
