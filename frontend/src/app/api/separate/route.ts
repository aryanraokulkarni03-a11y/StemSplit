import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export const runtime = 'nodejs';

// Stem types available for separation
const STEM_TYPES = ['vocals', 'no_vocals'] as const;
type StemType = typeof STEM_TYPES[number];

interface SeparationRequest {
    fileId?: string;
    fileName: string;
    stems?: StemType[];
}

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// POST /api/separate - Initiate REAL stem separation using Demucs
export async function POST(request: NextRequest) {
    try {
        let token: string | null = null;

        // Only attempt auth if Clerk is configured
        if (isClerkConfigured) {
            const { auth } = await import('@clerk/nextjs/server');
            const { getToken } = await auth();
            token = await getToken();

            if (!token) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
        } else {
            // Dev mode - use a placeholder token
            token = 'dev_token_no_auth';
        }

        const body = await request.json() as SeparationRequest;

        if (!body.fileName) {
            return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
        }

        // Generate job ID and paths
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const outputDir = path.join(process.cwd(), 'public', 'separated', jobId);

        // Input file path
        const inputFilePath = path.join(process.cwd(), 'public', 'uploads', body.fileName);

        console.log(`[API] Triggering FastAPI job for file ${inputFilePath}`);

        // Proxy to FastAPI Backend - Use private server-side environment variable
        // BACKEND_URL is server-only and not exposed to client bundle
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
        const fastapiResponse = await fetch(`${backendUrl}/separate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                input_path: inputFilePath,
                output_dir: outputDir
            })
        });

        if (!fastapiResponse.ok) {
            const errorText = await fastapiResponse.text();
            console.error('[API] FastAPI error:', errorText);
            throw new Error(`FastAPI backend failed: ${errorText}`);
        }

        const { job_id } = await fastapiResponse.json();

        return NextResponse.json({
            success: true,
            jobId: job_id,
            statusEndpoint: `/api/separate/${job_id}`,
            message: 'Separation job started on AI microservice.',
        });

    } catch (error) {
        console.error('Separation error:', error);
        return NextResponse.json({ error: 'Failed to initiate separation' }, { status: 500 });
    }
}

// GET /api/separate - Return API documentation
export async function GET() {
    return NextResponse.json({
        description: 'Audio stem separation endpoint',
        method: 'POST',
        body: {
            fileName: 'string (required) - Name of the uploaded file',
            fileId: 'string (optional) - ID from upload endpoint',
            stems: 'string[] (optional) - Specific stems to extract',
        },
        availableStems: STEM_TYPES,
        responseFields: {
            jobId: 'Unique job identifier',
            stems: 'Array of stem statuses',
            estimatedTime: 'Estimated processing time in seconds',
            statusEndpoint: 'Endpoint to check job status',
        },
        relatedEndpoints: {
            upload: 'POST /api/upload - Upload audio file first',
            health: 'GET /api/health - Check service status',
        }
    });
}
