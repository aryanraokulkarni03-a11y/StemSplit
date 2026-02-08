import { NextRequest, NextResponse } from 'next/server';
import { FILE_CONSTRAINTS } from '@/types/audio';

export const runtime = 'edge'; // Enable edge runtime for better performance

// POST /api/upload - Validate and prepare audio file for processing
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided', code: 'MISSING_FILE' },
                { status: 400 }
            );
        }

        // Validate file type
        const isValidType = FILE_CONSTRAINTS.acceptedTypes.includes(file.type) ||
            FILE_CONSTRAINTS.acceptedExtensions.some(ext =>
                file.name.toLowerCase().endsWith(ext)
            );

        if (!isValidType) {
            return NextResponse.json(
                {
                    error: 'Invalid file type. Please upload MP3 or WAV file.',
                    code: 'INVALID_TYPE',
                    accepted: FILE_CONSTRAINTS.acceptedExtensions
                },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > FILE_CONSTRAINTS.maxSize) {
            return NextResponse.json(
                {
                    error: `File too large. Maximum size is ${FILE_CONSTRAINTS.maxSize / (1024 * 1024)}MB`,
                    code: 'FILE_TOO_LARGE',
                    maxSize: FILE_CONSTRAINTS.maxSize,
                    fileSize: file.size
                },
                { status: 400 }
            );
        }

        // For MVP: return validation success
        // In production: would upload to storage (S3, Cloudflare R2, etc.)
        return NextResponse.json({
            success: true,
            file: {
                name: file.name,
                size: file.size,
                type: file.type,
            },
            message: 'File validated successfully. Ready for processing.',
            processingEndpoint: '/api/separate',
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process upload',
                code: 'UPLOAD_ERROR'
            },
            { status: 500 }
        );
    }
}

// GET /api/upload - Return upload constraints
export async function GET() {
    return NextResponse.json({
        constraints: {
            maxSize: FILE_CONSTRAINTS.maxSize,
            maxSizeFormatted: `${FILE_CONSTRAINTS.maxSize / (1024 * 1024)}MB`,
            acceptedTypes: FILE_CONSTRAINTS.acceptedTypes,
            acceptedExtensions: FILE_CONSTRAINTS.acceptedExtensions,
        },
        endpoints: {
            upload: 'POST /api/upload',
            separate: 'POST /api/separate',
            health: 'GET /api/health',
        }
    });
}
