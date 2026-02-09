import { NextRequest, NextResponse } from 'next/server';

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// GET /api/separate/[jobId] - Proxy status check to FastAPI
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const { jobId } = await params;
    let token: string | null = null;

    // Only attempt auth if Clerk is configured
    if (isClerkConfigured) {
        const { auth } = await import('@clerk/nextjs/server');
        const { getToken } = await auth();
        token = await getToken();
    } else {
        // Dev mode - use a placeholder token
        token = 'dev_token_no_auth';
    }

    try {
        // Fetch status from the Python microservice - Use environment variable
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const fastapiResponse = await fetch(`${backendUrl}/status/${jobId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!fastapiResponse.ok) {
            if (fastapiResponse.status === 404) {
                return NextResponse.json({ error: 'Job not found' }, { status: 404 });
            }
            throw new Error('FastAPI status check failed');
        }

        const status = await fastapiResponse.json();

        // Return the jobId merged with the status from the backend
        return NextResponse.json({
            jobId,
            ...status
        });

    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
    }
}
