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

// POST /api/separate - Initiate stem separation (MVP: returns mock job)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json() as SeparationRequest;

        if (!body.fileName) {
            return NextResponse.json(
                { error: 'fileName is required', code: 'MISSING_FILENAME' },
                { status: 400 }
            );
        }

        // Determine which stems to extract
        const requestedStems = body.stems || STEM_TYPES;
        const invalidStems = requestedStems.filter(s => !STEM_TYPES.includes(s as StemType));

        if (invalidStems.length > 0) {
            return NextResponse.json(
                {
                    error: `Invalid stem types: ${invalidStems.join(', ')}`,
                    code: 'INVALID_STEMS',
                    validStems: STEM_TYPES
                },
                { status: 400 }
            );
        }

        // Generate job ID and output path
        const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const outputDir = path.join(process.cwd(), 'public', 'separated', jobId);
        // Ensure absolute path for input file (assuming it was uploaded and saved temp)
        // For MVP, since we don't have a real DB/file store yet, we assume the file is in a temp dir
        // In a real app, 'fileName' would be a key to a stored file.
        // Here we mock the input path for demonstration:
        const inputFilePath = path.join(process.cwd(), 'public', 'uploads', body.fileName);

        // Spawn Python process
        const pythonProcess = spawn('python', [
            'backend/python/processor.py',
            inputFilePath,
            outputDir,
            '--stems', '4'
        ]);

        // Monitor process (Basic fire-and-forget for this endpoint, real status checked via /api/status/:id)
        pythonProcess.stdout.on('data', (data) => {
            console.log(`[Demucs stdout]: ${data}`);
            // In a real app, parse this JSON and update DB status
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`[Demucs stderr]: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`Demucs process exited with code ${code}`);
        });

        // Initialize stem statuses
        const stemStatuses: StemStatus[] = requestedStems.map(stem => ({
            name: stem as StemType,
            status: 'pending',
            progress: 0
        }));

        return NextResponse.json({
            success: true,
            jobId,
            fileName: body.fileName,
            stems: stemStatuses,
            estimatedTime: requestedStems.length * 30,
            statusEndpoint: `/api/separate/${jobId}`,
            message: 'Separation job started on backend.',
        });

    } catch (error) {
        console.error('Separation error:', error);
        return NextResponse.json(
            {
                error: 'Failed to initiate separation',
                code: 'SEPARATION_ERROR'
            },
            { status: 500 }
        );
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
