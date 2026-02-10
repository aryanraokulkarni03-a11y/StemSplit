import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { z } from 'zod';
import { sendPasswordResetEmail } from '@/lib/email';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

/**
 * Forgot Password API Route
 * POST /api/auth/forgot-password
 * 
 * Generates password reset token and sends email
 * 
 * Features:
 * - Email validation
 * - Token generation (secure random)
 * - Token expiration (1 hour)
 * - Email with reset link (TODO: implement email service)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const { email } = forgotPasswordSchema.parse(body);

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success (security: don't reveal if email exists)
        if (!user) {
            return NextResponse.json(
                { message: 'If an account exists, a password reset link has been sent.' },
                { status: 200 }
            );
        }

        // Generate secure token
        const token = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Delete any existing tokens for this user
        await prisma.verificationToken.deleteMany({
            where: {
                identifier: email,
            },
        });

        // Create new token
        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token,
                expires,
            },
        });

        // Send email with reset link (best-effort; do not fail request on email error)
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
        try {
            await sendPasswordResetEmail(email, user.name || 'User', resetUrl);
        } catch (emailError) {
            console.error('Password reset email failed:', emailError);
        }

        return NextResponse.json(
            { message: 'If an account exists, a password reset link has been sent.' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Forgot password error:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
