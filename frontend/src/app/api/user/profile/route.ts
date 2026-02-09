import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { profileUpdateSchema } from '@/lib/validations';

/**
 * User Profile API Route
 * GET /api/user/profile - Fetch user profile
 * PATCH /api/user/profile - Update user profile
 * 
 * Requires authentication
 */

// GET - Fetch user profile
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: (session.user as any).id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ user }, { status: 200 });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH - Update user profile
export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate input
        const validatedData = profileUpdateSchema.parse(body);

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: (session.user as any).id },
            data: {
                name: validatedData.name,
                // Add other updatable fields here
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(
            {
                message: 'Profile updated successfully',
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Update profile error:', error);

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
