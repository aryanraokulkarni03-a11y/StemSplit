/**
 * Test Utilities
 * 
 * Helper functions and utilities for testing
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Custom render function with providers
 */
export function renderWithProviders(
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>
) {
    // TODO: Add providers as needed (e.g., ClerkProvider, QueryClientProvider)
    // const Wrapper = ({ children }: { children: React.ReactNode }) => {
    //   return (
    //     <ClerkProvider>
    //       <QueryClientProvider client={queryClient}>
    //         {children}
    //       </QueryClientProvider>
    //     </ClerkProvider>
    //   );
    // };

    return render(ui, { ...options });
}

/**
 * Mock fetch responses
 */
export function mockFetch(data: any, status = 200) {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: status >= 200 && status < 300,
            status,
            json: async () => data,
            text: async () => JSON.stringify(data),
            headers: new Headers(),
        } as Response)
    );
}

/**
 * Mock fetch error
 */
export function mockFetchError(error: string) {
    global.fetch = jest.fn(() => Promise.reject(new Error(error)));
}

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Create mock file
 */
export function createMockFile(
    name: string,
    size: number,
    type: string
): File {
    const blob = new Blob(['a'.repeat(size)], { type });
    return new File([blob], name, { type });
}

/**
 * Mock local storage
 */
export const mockLocalStorage = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

/**
 * Mock session storage
 */
export const mockSessionStorage = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, 'sessionStorage', {
    value: mockSessionStorage,
});

/**
 * Mock Google Analytics
 */
export function mockGoogleAnalytics() {
    (window as any).gtag = jest.fn();
}

/**
 * Assert analytics event was called
 */
export function expectAnalyticsEvent(
    action: string,
    params?: Record<string, any>
) {
    expect((window as any).gtag).toHaveBeenCalledWith(
        'event',
        action,
        expect.objectContaining(params || {})
    );
}

// Re-export everything from Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
