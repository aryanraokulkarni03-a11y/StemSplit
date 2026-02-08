import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        service: 'Singscape',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        backend: {
            demucs: true,
            runtime: 'Python 3.9+',
        },
        features: {
            maxFileSize: '25MB',
            supportedFormats: ['MP3', 'WAV'],
            stems: ['vocals', 'drums', 'bass', 'other'],
        },
    });
}
