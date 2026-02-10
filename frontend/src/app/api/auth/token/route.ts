import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Create a simple token for API calls using user data
        const tokenData = {
            sub: session.user?.id || session.user?.email,
            email: session.user?.email,
            name: session.user?.name,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiry
        };

        // Simple base64 encoding (you can upgrade to proper JWT later)
        const apiToken = Buffer.from(JSON.stringify(tokenData)).toString('base64');

        return NextResponse.json({
            user: session.user,
            accessToken: apiToken,
        });
    } catch (error) {
        console.error('Session API error:', error);
        return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
    }
}