import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export const runtime = 'nodejs';

// Stem types available for separation
const STEM_TYPES = ['vocals', 'drums', 'bass', 'other'] as const;
type StemType = typeof STEM_TYPES[number];

interface SeparationRequest {
    fileId?: string;
    fileName: string;
    stems?: StemType[];
}

interface StemStatus {
    name: StemType;
    status: 'pending' | 'processing' | 'complete' | 'error';
    progress: number;
}

// POST /api/separate - Initiate REAL stem separation using Demucs
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as SeparationRequest;

        if (!body.fileName) {
            return NextResponse.json({ error: 'fileName is required' }, { status: 400 });
        }

        // Generate job ID and paths
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const outputDir = path.join(process.cwd(), 'public', 'separated', jobId);

        // Input file path (Assumes file was uploaded to public/uploads)
        // TODO: In Phase 2.1, ensure upload endpoint saves here or use absolute path from upload response
        const inputFilePath = path.join(process.cwd(), 'public', 'uploads', body.fileName);

        console.log(`[API] Starting Demucs job ${jobId} for file ${inputFilePath}`);

        // Spawn Python process DETACHED so it survives the request
        const pythonScript = path.join(process.cwd(), 'backend', 'python', 'worker.py');

        // We use 'python' assuming it's in PATH. If using venv, might need absolute path to venv/Scripts/python
        const pythonProcess = spawn('python', [
            pythonScript,
            '--input', inputFilePath,
            '--out', outputDir
        ], {
            detached: true,
            stdio: 'ignore' // Ignore stdio to allow unref
        });

        // Unreference the child process so the parent node process can exit independently
        // This is critical for Vercel/Next.js to not hold the request open
        pythonProcess.unref();

        return NextResponse.json({
            success: true,
            jobId,
            statusEndpoint: `/api/separate/${jobId}`,
            message: 'Separation job started in background.',
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
