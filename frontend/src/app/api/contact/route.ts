import { NextRequest, NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { checkRateLimit, getClientIp, RateLimits } from '@/lib/rate-limit';

/**
 * Contact Form API Route
 * POST /api/contact
 * 
 * Handles contact form submissions
 * 
 * Features:
 * - Zod validation
 * - Rate limiting (30 requests per hour per IP)
 * - Email to admin (TODO: implement with email service)
 * - Audit logging (TODO: implement)
 */
export async function POST(request: NextRequest) {
    try {
        // Rate limiting
        const ip = getClientIp(request.headers);
        const rateLimit = checkRateLimit(ip, RateLimits.MODERATE);

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
        const validatedData = contactSchema.parse(body);

        // TODO: Send email to admin
        // await sendContactNotification({
        //   name: validatedData.name,
        //   email: validatedData.email,
        //   subject: validatedData.subject,
        //   message: validatedData.message,
        // });

        // TODO: Log in audit table
        // await prisma.auditLog.create({
        //   data: {
        //     action: 'contact_form_submitted',
        //     details: JSON.stringify({ email: validatedData.email }),
        //     ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        //   },
        // });

        return NextResponse.json(
            {
                message: 'Message sent successfully. We will get back to you soon.',
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Contact form error:', error);

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
