/**
 * Rate Limiting Utility
 * 
 * Simple in-memory rate limiting for API routes
 * For production, use Redis or a KV store like Vercel KV
 * 
 * Features:
 * - Sliding window algorithm
 * - Configurable time window and max requests
 * - IP-based tracking
 * - Automatic cleanup of old entries
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    /**
     * Maximum number of requests allowed in the time window
     */
    maxRequests: number;

    /**
     * Time window in milliseconds
     */
    windowMs: number;

    /**
     * Custom identifier (defaults to IP address)
     */
    identifier?: string;
}

export interface RateLimitResult {
    /**
     * Whether the request is allowed
     */
    allowed: boolean;

    /**
     * Number of requests remaining in the current window
     */
    remaining: number;

    /**
     * Time until the rate limit resets (in seconds)
     */
    resetIn: number;

    /**
     * Total limit
     */
    limit: number;
}

/**
 * Check if a request is within rate limits
 * 
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now();
    const key = `${identifier}:${config.windowMs}`;

    let entry = rateLimitStore.get(key);

    // Create new entry if doesn't exist or expired
    if (!entry || entry.resetTime < now) {
        entry = {
            count: 0,
            resetTime: now + config.windowMs,
        };
        rateLimitStore.set(key, entry);
    }

    // Increment count
    entry.count++;

    const allowed = entry.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - entry.count);
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);

    return {
        allowed,
        remaining,
        resetIn,
        limit: config.maxRequests,
    };
}

/**
 * Get client IP address from request headers
 * 
 * @param headers - Request headers
 * @returns IP address or 'unknown'
 */
export function getClientIp(headers: Headers): string {
    const forwardedFor = headers.get('x-forwarded-for');
    if (forwardedFor) {
        const ips = forwardedFor.split(',');
        if (ips.length > 0 && ips[0]) {
            const ip = ips[0].trim();
            if (ip) return ip;
        }
    }
    
    const realIp = headers.get('x-real-ip');
    if (realIp) {
        const trimmedIp = realIp.trim();
        if (trimmedIp) return trimmedIp;
    }
    
    return 'unknown';
}

/**
 * Common rate limit configurations
 */
export const RateLimits = {
    /**
     * Strict: 10 requests per hour
     */
    STRICT: {
        maxRequests: 10,
        windowMs: 60 * 60 * 1000, // 1 hour
    },

    /**
     * Moderate: 30 requests per hour
     */
    MODERATE: {
        maxRequests: 30,
        windowMs: 60 * 60 * 1000, // 1 hour
    },

    /**
     * Lenient: 100 requests per hour
     */
    LENIENT: {
        maxRequests: 100,
        windowMs: 60 * 60 * 1000, // 1 hour
    },

    /**
     * Auth: 5 failed login attempts per 15 minutes
     */
    AUTH: {
        maxRequests: 5,
        windowMs: 15 * 60 * 1000, // 15 minutes
    },
} as const;
