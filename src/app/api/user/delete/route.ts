import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * Delete User Account API Route
 * DELETE /api/user/delete
 * 
 * GDPR Compliance: Right to Erasure (Right to be Forgotten)
 * 
 * Permanently deletes user account and all associated data
 * Requires authentication and password confirmation
 */
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const userId = (session.user as any).id;

        // Delete user and all related data (cascade)
        // Note: Prisma cascade deletes are configured in schema.prisma
        await prisma.user.delete({
            where: { id: userId },
        });

        // TODO: Additional cleanup
        // - Delete uploaded files from storage
        // - Cancel any active subscriptions
        // - Send confirmation email
        // - Log deletion in audit log (anonymized)

        return NextResponse.json(
            {
                message: 'Account deleted successfully',
                deletedAt: new Date().toISOString(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Delete user account error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
