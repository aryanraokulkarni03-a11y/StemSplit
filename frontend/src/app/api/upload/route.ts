import { NextRequest, NextResponse } from 'next/server';
import { FILE_CONSTRAINTS } from '@/types/audio';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs'; // Use Node.js runtime for compatibility with fileops

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

        // Normalize filename: remove spaces and special characters but keep extension
        const rawName = file.name;
        const ext = path.extname(rawName);
        const nameWithoutExt = path.basename(rawName, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const safeName = `${nameWithoutExt}${ext}`;

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

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Save file to disk
        const filePath = path.join(uploadsDir, safeName);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        console.log(`[API] File saved successfully: ${filePath}`);

        return NextResponse.json({
            success: true,
            file: {
                name: safeName,
                size: file.size,
                type: file.type,
                path: filePath
            },
            message: 'File uploaded and saved successfully.',
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
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) {
            throw new Error('Backend URL not configured');
        }

        const response = await fetch(`${backendUrl}/upload/constraints`);
        if (!response.ok) {
            throw new Error('Failed to fetch constraints from backend');
        }

        const constraints = await response.json();

        return NextResponse.json({
            constraints: {
                maxSize: constraints.maxFileSize,
                maxSizeFormatted: `${constraints.maxFileSizeMB}MB`,
                acceptedTypes: constraints.acceptedTypes,
                acceptedExtensions: constraints.acceptedExtensions,
            },
            endpoints: {
                upload: 'POST /api/upload',
                separate: 'POST /api/separate',
                health: 'GET /api/health',
                backendConstraints: 'GET /upload/constraints',
            }
        });
    } catch (error) {
        console.error('Failed to fetch backend constraints:', error);
        
        // Fallback to frontend constraints
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
                backendConstraints: 'GET /upload/constraints',
            }
        });
    }
}
