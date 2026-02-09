import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * Export User Data API Route
 * GET /api/user/export
 * 
 * GDPR Compliance: Right to Data Portability
 * 
 * Exports all user data in JSON format
 * Requires authentication
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;

        // Fetch all user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
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

        // Fetch related data
        const demoRequests = await prisma.demoRequest.findMany({
            where: { email: user.email },
            select: {
                id: true,
                name: true,
                email: true,
                company: true,
                message: true,
                status: true,
                createdAt: true,
            },
        });

        // Compile all user data
        const userData = {
            profile: user,
            demoRequests,
            exportedAt: new Date().toISOString(),
        };

        // Return as downloadable JSON
        return new NextResponse(JSON.stringify(userData, null, 2), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Content-Disposition': `attachment; filename="user-data-${userId}.json"`,
            },
        });
    } catch (error) {
        console.error('Export user data error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
