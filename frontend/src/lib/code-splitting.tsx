/**
 * Code Splitting and Dynamic Imports
 * 
 * Utilities for lazy loading components and reducing bundle size
 */

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/**
 * Loading component for dynamic imports
 */
export function LoadingSpinner() {
    return (
        <div className="loading-spinner" role="status" aria-label="Loading">
            <div className="spinner"></div>
        </div>
    );
}

/**
 * Error fallback component
 */
export function ErrorFallback({ error }: { error: Error }) {
    return (
        <div className="error-fallback" role="alert">
            <h2>Something went wrong</h2>
            <p>{error.message}</p>
        </div>
    );
}

/**
 * Dynamic import with loading state
 */
export function createDynamicComponent<P = Record<string, unknown>>(
    importFn: () => Promise<{ default: ComponentType<P> }>,
    options?: {
        loading?: () => JSX.Element;
        ssr?: boolean;
    }
) {
    return dynamic(importFn, {
        loading: options?.loading || LoadingSpinner,
        ssr: options?.ssr ?? true,
    });
}

/**
 * Preload a dynamic component
 */
export function preloadComponent(
    importFn: () => Promise<unknown>
): void {
    // Trigger the import but don't wait for it
    importFn().catch((error) => {
        console.error('Failed to preload component:', error);
    });
}

/**
 * Route-based code splitting
 * 
 * Example usage:
 * const DashboardPage = createDynamicRoute(() => import('./dashboard/page'))
 */
export function createDynamicRoute<P = Record<string, unknown>>(
    importFn: () => Promise<{ default: ComponentType<P> }>
) {
    return dynamic(importFn, {
        loading: LoadingSpinner,
        ssr: true,
    });
}

/**
 * Prefetch routes on hover/focus
 */
export function usePrefetch() {
    if (typeof window === 'undefined') return { prefetchRoute: () => { } };

    const prefetchRoute = (href: string) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    };

    return { prefetchRoute };
}
