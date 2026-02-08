import { NextRequest, NextResponse } from 'next/server';

interface StemStatus {
    name: 'vocals' | 'drums' | 'bass' | 'other';
    status: 'pending' | 'processing' | 'complete' | 'error';
    progress: number;
}

// GET /api/separate/[jobId] - Check status of separation job
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const { jobId } = await params;

    // TODO: In production, query database or cache for actual job status
    // For now, return mock data for MVP
    // In a real implementation:
    // - Store job status in Redis/Database
    // - Update status from Python process via IPC/polling
    // - Return actual progress values

    return NextResponse.json({
        jobId,
        status: 'processing' as const,
        progress: 45,
        message: 'Separating vocals...',
        estimatedTimeRemaining: 60,
        stems: [
            { name: 'vocals', status: 'processing', progress: 60 },
            { name: 'drums', status: 'pending', progress: 0 },
            { name: 'bass', status: 'pending', progress: 0 },
            { name: 'other', status: 'pending', progress: 0 },
        ] as StemStatus[]
    });
}
