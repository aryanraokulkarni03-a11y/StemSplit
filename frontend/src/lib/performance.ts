/**
 * Performance Monitoring Utilities
 * 
 * Web Vitals tracking and performance metrics
 * Integrates with Vercel Analytics and custom analytics
 */

// Type definitions for global window extensions
declare global {
    interface Window {
        gtag?: (command: string, eventName: string, params?: Record<string, any>) => void;
        va?: (command: string, eventName: string, params?: Record<string, any>) => void;
    }
}

/**
 * Web Vitals metrics
 */
export interface WebVitalsMetric {
    id: string;
    name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    navigationType: 'navigate' | 'reload' | 'back-forward' | 'prerender';
}

/**
 * Performance thresholds (Core Web Vitals)
 */
export const PerformanceThresholds = {
    // Largest Contentful Paint (LCP)
    LCP: {
        GOOD: 2500, // ms
        NEEDS_IMPROVEMENT: 4000, // ms
    },
    // First Input Delay (FID)
    FID: {
        GOOD: 100, // ms
        NEEDS_IMPROVEMENT: 300, // ms
    },
    // Cumulative Layout Shift (CLS)
    CLS: {
        GOOD: 0.1,
        NEEDS_IMPROVEMENT: 0.25,
    },
    // First Contentful Paint (FCP)
    FCP: {
        GOOD: 1800, // ms
        NEEDS_IMPROVEMENT: 3000, // ms
    },
    // Interaction to Next Paint (INP)
    INP: {
        GOOD: 200, // ms
        NEEDS_IMPROVEMENT: 500, // ms
    },
    // Time to First Byte (TTFB)
    TTFB: {
        GOOD: 800, // ms
        NEEDS_IMPROVEMENT: 1800, // ms
    },
} as const;

/**
 * Get rating for a metric
 */
export function getMetricRating(
    name: WebVitalsMetric['name'],
    value: number
): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = PerformanceThresholds[name];

    if (value <= thresholds.GOOD) {
        return 'good';
    } else if (value <= thresholds.NEEDS_IMPROVEMENT) {
        return 'needs-improvement';
    } else {
        return 'poor';
    }
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: WebVitalsMetric) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
        console.log('[Web Vitals]', {
            name: metric.name,
            value: Math.round(metric.value),
            rating: metric.rating,
        });
    }

    // Send to Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
            value: Math.round(metric.value),
            ...(metric.id && { metric_id: metric.id }),
            ...(metric.value !== undefined && { metric_value: metric.value }),
            ...(metric.delta !== undefined && { metric_delta: metric.delta }),
            ...(metric.rating && { metric_rating: metric.rating }),
        });
    }

    // Send to Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
        window.va('track', metric.name, {
            value: metric.value,
            rating: metric.rating,
        });
    }

    // TODO: Send to custom analytics endpoint
    // fetch('/api/analytics/web-vitals', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    //   headers: { 'Content-Type': 'application/json' },
    // });
}

/**
 * Performance marks for custom measurements
 */
export const PerformanceMark = {
    /**
     * Mark the start of an operation
     */
    start(name: string) {
        if (typeof window !== 'undefined' && window.performance) {
            performance.mark(`${name}-start`);
        }
    },

    /**
     * Mark end of an operation and measure duration
     */
    end(name: string) {
        if (typeof window !== 'undefined' && window.performance) {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);

            const measures = performance.getEntriesByName(name);
            if (measures.length > 0) {
                const measure = measures[0];
                console.log(`[Performance] ${name}: ${Math.round(measure.duration)}ms`);
            }
        }
    },

    /**
     * Clear marks and measures
     */
    clear(name: string) {
        if (typeof window !== 'undefined' && window.performance) {
            performance.clearMarks(`${name}-start`);
            performance.clearMarks(`${name}-end`);
            performance.clearMeasures(name);
        }
    },
} as const;

/**
 * Resource timing helper
 */
export function getResourceTiming(resourceUrl: string) {
    if (typeof window === 'undefined' || !window.performance) {
        return null;
    }

    const resources = performance.getEntriesByType('resource');
    const resource = resources.find((r): r is PerformanceResourceTiming => 
        'name' in r && 'transferSize' in r && r.name.includes(resourceUrl)
    );

    if (!resource) {
        return null;
    }

    return {
        url: resource.name,
        duration: Math.round(resource.duration),
        size: resource.transferSize,
        cached: resource.transferSize === 0,
        protocol: 'nextHopProtocol' in resource ? resource.nextHopProtocol : 'unknown',
    };
}
