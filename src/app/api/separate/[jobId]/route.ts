import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// GET /api/separate/[jobId] - Check status of separation job
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const { jobId } = await params;
    const outputDir = path.join(process.cwd(), 'public', 'separated', jobId);
    const statusFile = path.join(outputDir, 'status.json');

    try {
        if (!fs.existsSync(statusFile)) {
            // Job might be just starting or doesn't exist
            // Check if directory exists at least
            if (fs.existsSync(outputDir)) {
                return NextResponse.json({ status: 'starting', progress: 0, message: 'Initializing job...' });
            }
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        const statusContent = fs.readFileSync(statusFile, 'utf-8');
        const status = JSON.parse(statusContent);

        return NextResponse.json({
            jobId,
            ...status
        });

    } catch (error) {
        console.error('Status check error:', error);
        return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
    }
}
