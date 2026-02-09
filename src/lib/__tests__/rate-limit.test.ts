/**
 * Unit Tests for Rate Limiting
 */

import {
    checkRateLimit,
    getClientIp,
    RateLimits,
} from '../rate-limit';

describe('Rate Limiting', () => {
    beforeEach(() => {
        // Clear rate limit store before each test
        jest.clearAllMocks();
    });

    describe('checkRateLimit', () => {
        it('should allow requests within limit', () => {
            const result = checkRateLimit('test-ip', RateLimits.STRICT);

            expect(result.allowed).toBe(true);
            expect(result.remaining).toBe(RateLimits.STRICT.maxRequests - 1);
            expect(result.limit).toBe(RateLimits.STRICT.maxRequests);
        });

        it('should block requests exceeding limit', () => {
            const identifier = 'test-ip-2';
            const config = RateLimits.STRICT;

            // Make requests up to the limit
            for (let i = 0; i < config.maxRequests; i++) {
                checkRateLimit(identifier, config);
            }

            // Next request should be blocked
            const result = checkRateLimit(identifier, config);

            expect(result.allowed).toBe(false);
            expect(result.remaining).toBe(0);
        });

        it('should reset after time window', async () => {
            const identifier = 'test-ip-3';
            const config = { maxRequests: 2, windowMs: 100 }; // 100ms window

            // Use up the limit
            checkRateLimit(identifier, config);
            checkRateLimit(identifier, config);

            // Should be blocked
            let result = checkRateLimit(identifier, config);
            expect(result.allowed).toBe(false);

            // Wait for window to expire
            await new Promise((resolve) => setTimeout(resolve, 150));

            // Should be allowed again
            result = checkRateLimit(identifier, config);
            expect(result.allowed).toBe(true);
        });

        it('should track different identifiers separately', () => {
            const result1 = checkRateLimit('ip-1', RateLimits.STRICT);
            const result2 = checkRateLimit('ip-2', RateLimits.STRICT);

            expect(result1.allowed).toBe(true);
            expect(result2.allowed).toBe(true);
            expect(result1.remaining).toBe(result2.remaining);
        });
    });

    describe('getClientIp', () => {
        it('should extract IP from x-forwarded-for header', () => {
            const headers = new Headers({
                'x-forwarded-for': '192.168.1.1, 10.0.0.1',
            });

            const ip = getClientIp(headers);

            expect(ip).toBe('192.168.1.1');
        });

        it('should extract IP from x-real-ip header', () => {
            const headers = new Headers({
                'x-real-ip': '192.168.1.2',
            });

            const ip = getClientIp(headers);

            expect(ip).toBe('192.168.1.2');
        });

        it('should return unknown if no IP headers', () => {
            const headers = new Headers();

            const ip = getClientIp(headers);

            expect(ip).toBe('unknown');
        });

        it('should prioritize x-forwarded-for over x-real-ip', () => {
            const headers = new Headers({
                'x-forwarded-for': '192.168.1.1',
                'x-real-ip': '192.168.1.2',
            });

            const ip = getClientIp(headers);

            expect(ip).toBe('192.168.1.1');
        });
    });

    describe('RateLimits presets', () => {
        it('should have STRICT preset', () => {
            expect(RateLimits.STRICT).toBeDefined();
            expect(RateLimits.STRICT.maxRequests).toBe(10);
            expect(RateLimits.STRICT.windowMs).toBe(3600000); // 1 hour
        });

        it('should have MODERATE preset', () => {
            expect(RateLimits.MODERATE).toBeDefined();
            expect(RateLimits.MODERATE.maxRequests).toBe(30);
        });

        it('should have LENIENT preset', () => {
            expect(RateLimits.LENIENT).toBeDefined();
            expect(RateLimits.LENIENT.maxRequests).toBe(100);
        });

        it('should have AUTH preset', () => {
            expect(RateLimits.AUTH).toBeDefined();
            expect(RateLimits.AUTH.maxRequests).toBe(5);
            expect(RateLimits.AUTH.windowMs).toBe(900000); // 15 minutes
        });
    });
});
