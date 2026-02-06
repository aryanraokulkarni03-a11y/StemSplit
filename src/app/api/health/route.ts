import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        service: 'stemsplit-app',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        features: {
            clientSideProcessing: true,
            onnxRuntime: false, // Will be true post-MVP
            maxFileSize: '10MB',
            supportedFormats: ['MP3', 'WAV'],
            stems: ['vocals', 'drums', 'bass', 'other'],
        },
    });
}
