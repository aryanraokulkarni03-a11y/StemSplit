/**
 * Cache Control Utilities
 * 
 * Helpers for setting cache headers on API routes and pages
 * Optimizes performance and reduces server load
 */

/**
 * Cache durations (in seconds)
 */
export const CacheDuration = {
    NONE: 0,
    MINUTE: 60,
    FIVE_MINUTES: 5 * 60,
    FIFTEEN_MINUTES: 15 * 60,
    HOUR: 60 * 60,
    DAY: 24 * 60 * 60,
    WEEK: 7 * 24 * 60 * 60,
    MONTH: 30 * 24 * 60 * 60,
    YEAR: 365 * 24 * 60 * 60,
} as const;

/**
 * Cache strategies
 */
export const CacheStrategy = {
    /**
     * No caching - always fetch fresh data
     */
    NO_CACHE: 'no-cache, no-store, must-revalidate',

    /**
     * Cache but revalidate on every request
     */
    REVALIDATE: 'public, max-age=0, must-revalidate',

    /**
     * Cache for a short time (5 minutes)
     */
    SHORT: `public, max-age=${CacheDuration.FIVE_MINUTES}, s-maxage=${CacheDuration.FIVE_MINUTES}, stale-while-revalidate=${CacheDuration.HOUR}`,

    /**
     * Cache for a medium time (1 hour)
     */
    MEDIUM: `public, max-age=${CacheDuration.HOUR}, s-maxage=${CacheDuration.HOUR}, stale-while-revalidate=${CacheDuration.DAY}`,

    /**
     * Cache for a long time (1 day)
     */
    LONG: `public, max-age=${CacheDuration.DAY}, s-maxage=${CacheDuration.DAY}, stale-while-revalidate=${CacheDuration.WEEK}`,

    /**
     * Cache for a very long time (1 year) - for immutable assets
     */
    IMMUTABLE: `public, max-age=${CacheDuration.YEAR}, immutable`,
} as const;

/**
 * Generate Cache-Control header
 */
export function generateCacheControl({
    maxAge = CacheDuration.HOUR,
    sMaxAge,
    staleWhileRevalidate,
    staleIfError,
    isPublic = true,
    immutable = false,
    mustRevalidate = false,
}: {
    maxAge?: number;
    sMaxAge?: number;
    staleWhileRevalidate?: number;
    staleIfError?: number;
    isPublic?: boolean;
    immutable?: boolean;
    mustRevalidate?: boolean;
}): string {
    const directives: string[] = [];

    if (isPublic) {
        directives.push('public');
    } else {
        directives.push('private');
    }

    directives.push(`max-age=${maxAge}`);

    if (sMaxAge !== undefined) {
        directives.push(`s-maxage=${sMaxAge}`);
    }

    if (staleWhileRevalidate !== undefined) {
        directives.push(`stale-while-revalidate=${staleWhileRevalidate}`);
    }

    if (staleIfError !== undefined) {
        directives.push(`stale-if-error=${staleIfError}`);
    }

    if (immutable) {
        directives.push('immutable');
    }

    if (mustRevalidate) {
        directives.push('must-revalidate');
    }

    return directives.join(', ');
}

/**
 * Set cache headers on Response
 */
export function setCacheHeaders(
    headers: Headers,
    strategy: string = CacheStrategy.MEDIUM
): void {
    headers.set('Cache-Control', strategy);
}

/**
 * Recommended cache strategies for different content types
 */
export const CacheRecommendations = {
    /**
     * Static pages (legal, about, etc.)
     */
    STATIC_PAGE: CacheStrategy.LONG,

    /**
     * Dynamic pages (user dashboard, etc.)
     */
    DYNAMIC_PAGE: CacheStrategy.NO_CACHE,

    /**
     * API responses (user data, etc.)
     */
    API_RESPONSE: CacheStrategy.NO_CACHE,

    /**
     * Public API responses (public data)
     */
    PUBLIC_API: CacheStrategy.SHORT,

    /**
     * Images, fonts, CSS, JS
     */
    STATIC_ASSETS: CacheStrategy.IMMUTABLE,

    /**
     * Audio files (processed stems)
     */
    AUDIO_FILES: generateCacheControl({
        maxAge: CacheDuration.HOUR,
        sMaxAge: CacheDuration.HOUR,
        staleWhileRevalidate: CacheDuration.DAY,
    }),
} as const;
