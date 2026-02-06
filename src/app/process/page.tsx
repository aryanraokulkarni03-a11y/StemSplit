'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Music2, AlertCircle, ArrowLeft } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProcessingStatus, StemResult, STEM_CONFIG } from '@/types/audio';
import { audioBufferToWav } from '@/lib/audio-utils';

export default function ProcessPage() {
    const router = useRouter();
    const [status, setStatus] = useState<ProcessingStatus>({
        stage: 'idle',
        progress: 0,
        message: 'Initializing...',
    });
    const [error, setError] = useState<string | null>(null);

    const processAudio = useCallback(async () => {
        try {
            // Get file info from sessionStorage
            const fileInfoStr = sessionStorage.getItem('audioFile');

            if (!fileInfoStr) {
                setError('No audio file found. Please upload a file first.');
                return;
            }

            setStatus({
                stage: 'loading-model',
                progress: 5,
                message: 'Loading AI model...',
                estimatedTimeRemaining: 120,
            });

            // Simulate model loading
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStatus({
                stage: 'processing',
                progress: 15,
                message: 'Preparing audio...',
                estimatedTimeRemaining: 100,
            });

            // For MVP demo, we'll simulate processing
            // In production, this would load the actual file and process with ONNX

            // Simulate the separation process
            const stemNames = ['vocals', 'drums', 'bass', 'other'];
            const results: StemResult[] = [];

            for (let i = 0; i < stemNames.length; i++) {
                const stemName = stemNames[i] as keyof typeof STEM_CONFIG;
                const baseProgress = 15 + (i * 20);

                setStatus({
                    stage: 'processing',
                    progress: baseProgress,
                    message: `Extracting ${STEM_CONFIG[stemName].label}...`,
                    estimatedTimeRemaining: 80 - (i * 20),
                });

                // Simulate processing time
                await new Promise(resolve => setTimeout(resolve, 1500));

                setStatus({
                    stage: 'processing',
                    progress: baseProgress + 15,
                    message: `${STEM_CONFIG[stemName].label} extracted`,
                    estimatedTimeRemaining: 60 - (i * 15),
                });

                // Create demo audio blob (in production, this would be actual separated audio)
                // For demo, we'll create a silent placeholder
                const sampleRate = 44100;
                const duration = 10; // 10 seconds demo
                const audioContext = new AudioContext();
                const buffer = audioContext.createBuffer(2, sampleRate * duration, sampleRate);

                // Add some simple audio data for demo
                for (let channel = 0; channel < 2; channel++) {
                    const channelData = buffer.getChannelData(channel);
                    for (let j = 0; j < channelData.length; j++) {
                        // Generate a simple tone for demo purposes
                        const freq = { vocals: 440, drums: 220, bass: 110, other: 330 }[stemName] || 440;
                        channelData[j] = Math.sin(2 * Math.PI * freq * j / sampleRate) * 0.3;
                    }
                }

                const blob = audioBufferToWav(buffer);
                const url = URL.createObjectURL(blob);

                results.push({
                    name: stemName as 'vocals' | 'drums' | 'bass' | 'other',
                    label: STEM_CONFIG[stemName].label,
                    color: STEM_CONFIG[stemName].color,
                    audioBuffer: buffer,
                    blob,
                    url,
                    isPlaying: false,
                    volume: 1,
                });
            }

            setStatus({
                stage: 'exporting',
                progress: 95,
                message: 'Preparing downloads...',
            });

            await new Promise(resolve => setTimeout(resolve, 500));

            // Store results in sessionStorage for results page
            const resultsData = results.map(r => ({
                name: r.name,
                label: r.label,
                color: r.color,
                url: r.url,
            }));
            sessionStorage.setItem('stemResults', JSON.stringify(resultsData));

            setStatus({
                stage: 'complete',
                progress: 100,
                message: 'Processing complete!',
            });

            // Redirect to results page after a brief delay
            setTimeout(() => {
                router.push('/results');
            }, 1500);

        } catch (err) {
            console.error('Processing error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred during processing');
            setStatus({
                stage: 'error',
                progress: 0,
                message: 'Processing failed',
                error: err instanceof Error ? err.message : 'Unknown error',
            });
        }
    }, [router]);

    useEffect(() => {
        processAudio();
    }, [processAudio]);

    const handleCancel = useCallback(() => {
        router.push('/');
    }, [router]);

    const handleRetry = useCallback(() => {
        setError(null);
        setStatus({
            stage: 'idle',
            progress: 0,
            message: 'Initializing...',
        });
        processAudio();
    }, [processAudio]);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 animate-float">
                        <Music2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                        {status.stage === 'complete' ? 'Processing Complete!' : 'Processing Your Audio'}
                    </h1>
                    <p className="text-foreground/60">
                        {status.stage === 'complete'
                            ? 'Redirecting to results...'
                            : 'Our AI is separating your audio into individual stems'}
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mb-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/30">
                        <div className="flex items-start gap-4">
                            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-400 mb-2">Processing Failed</h3>
                                <p className="text-sm text-foreground/60 mb-4">{error}</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleRetry}
                                        className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="px-4 py-2 rounded-full bg-white/10 text-foreground text-sm font-medium hover:bg-white/20 transition-colors"
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress */}
                {!error && (
                    <ProgressBar status={status} onCancel={handleCancel} />
                )}

                {/* Processing Steps Visualization */}
                {!error && status.stage !== 'complete' && (
                    <div className="mt-8 grid grid-cols-4 gap-4">
                        {Object.entries(STEM_CONFIG).map(([key, config], index) => {
                            const isActive = status.message.toLowerCase().includes(key);
                            const isComplete = status.progress > (15 + (index + 1) * 20);

                            return (
                                <div
                                    key={key}
                                    className={`text-center p-4 rounded-xl transition-all ${isActive ? 'bg-white/10 scale-105' : isComplete ? 'bg-white/5' : 'opacity-50'
                                        }`}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center transition-all ${isActive ? 'animate-pulse' : ''
                                            }`}
                                        style={{
                                            backgroundColor: isComplete || isActive ? `${config.color}30` : 'rgba(255,255,255,0.1)',
                                        }}
                                    >
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: isComplete || isActive ? config.color : 'rgba(255,255,255,0.3)' }}
                                        />
                                    </div>
                                    <span className="text-xs text-foreground/60">{config.label}</span>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleCancel}
                        className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Upload
                    </button>
                </div>
            </div>
        </div>
    );
}
