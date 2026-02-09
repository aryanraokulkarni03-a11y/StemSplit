import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { demoRequestSchema } from '@/lib/validations';
import { checkRateLimit, getClientIp, RateLimits } from '@/lib/rate-limit';

/**
 * Demo Request API Route
 * POST /api/demo-request
 * 
 * Handles demo request form submissions
 * 
 * Features:
 * - Zod validation
 * - Rate limiting (10 requests per hour per IP)
 * - Save to database
 * - Email confirmation (TODO: implement with email service)
 */
export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = getClientIp(request.headers);
        const rateLimit = checkRateLimit(ip, RateLimits.STRICT);

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: 'Too many requests. Please try again later.',
                    resetIn: rateLimit.resetIn,
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': rateLimit.limit.toString(),
                        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
                        'X-RateLimit-Reset': rateLimit.resetIn.toString(),
                    },
                }
            );
        }

        const body = await request.json();

        // Validate input
        const validatedData = demoRequestSchema.parse(body);

        // Check for duplicate requests (same email within 24 hours)
        const existingRequest = await prisma.demoRequest.findFirst({
            where: {
                email: validatedData.email,
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                },
            },
        });

        if (existingRequest) {
            return NextResponse.json(
                { error: 'You have already submitted a demo request. Please check your email.' },
                { status: 429 }
            );
        }

        // Create demo request
        const demoRequest = await prisma.demoRequest.create({
            data: {
                name: validatedData.name,
                email: validatedData.email,
                company: validatedData.company || '',
                message: validatedData.message || '',
                status: 'pending',
            },
        });

        // TODO: Send confirmation email
        // await sendDemoConfirmationEmail(demoRequest.email, demoRequest.name);

        return NextResponse.json(
            {
                message: 'Demo request submitted successfully',
                id: demoRequest.id,
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Demo request error:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid input data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
