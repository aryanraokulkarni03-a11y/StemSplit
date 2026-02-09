/**
 * Integration Tests for Contact API Route
 */

import { POST } from '../../contact/route';
import { NextRequest } from 'next/server';

// Mock dependencies
jest.mock('@/lib/rate-limit', () => ({
    checkRateLimit: jest.fn(() => ({
        allowed: true,
        remaining: 29,
        resetIn: 3600,
        limit: 30,
    })),
    getClientIp: jest.fn(() => '127.0.0.1'),
    RateLimits: {
        MODERATE: { maxRequests: 30, windowMs: 3600000 },
    },
}));

jest.mock('resend', () => ({
    Resend: jest.fn().mockImplementation(() => ({
        emails: {
            send: jest.fn().mockResolvedValue({ id: 'test-email-id' }),
        },
    })),
}));

describe('POST /api/contact', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send contact email successfully', async () => {
        const request = new NextRequest('http://localhost:3000/api/contact', {
            method: 'POST',
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com',
                subject: 'Test Subject',
                message: 'Test message',
            }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.message).toBe('Message sent successfully');
    });

    it('should validate required fields', async () => {
        const request = new NextRequest('http://localhost:3000/api/contact', {
            method: 'POST',
            body: JSON.stringify({
                name: 'John Doe',
                // Missing email, subject, message
            }),
        });

        const response = await POST(request);

        expect(response.status).toBe(400);
    });

    it('should validate email format', async () => {
        const request = new NextRequest('http://localhost:3000/api/contact', {
            method: 'POST',
            body: JSON.stringify({
                name: 'John Doe',
                email: 'invalid-email',
                subject: 'Test',
                message: 'Test',
            }),
        });

        const response = await POST(request);

        expect(response.status).toBe(400);
    });

    it('should enforce rate limiting', async () => {
        const { checkRateLimit } = require('@/lib/rate-limit');
        checkRateLimit.mockReturnValueOnce({
            allowed: false,
            remaining: 0,
            resetIn: 3600,
            limit: 30,
        });

        const request = new NextRequest('http://localhost:3000/api/contact', {
            method: 'POST',
            body: JSON.stringify({
                name: 'John Doe',
                email: 'john@example.com',
                subject: 'Test',
                message: 'Test',
            }),
        });

        const response = await POST(request);

        expect(response.status).toBe(429);
    });
});
