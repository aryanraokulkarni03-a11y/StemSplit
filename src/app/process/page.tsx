'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Music2, AlertCircle, ArrowLeft } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ProcessingStatus, StemResult, STEM_CONFIG } from '@/types/audio';
import { audioBufferToWav, simulateStemSeparation } from '@/lib/audio-utils';

export default function ProcessPage() {
    const router = useRouter();
    const [status, setStatus] = useState<ProcessingStatus>({
        stage: 'idle',
        progress: 0,
        message: 'Initializing...',
    });
    const [error, setError] = useState<string | null>(null);

    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let isCancelled = false;

        const runProcessing = async () => {
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

            if (isCancelled) return;

            setStatus({
                stage: 'processing',
                progress: 15,
                message: 'Preparing audio...',
                estimatedTimeRemaining: 100,
            });

            try {
                // Create a dummy buffer for simulation if we don't have real data loaded
                // In a real app we would decode the file here
                const audioContext = new AudioContext();
                const dummyBuffer = audioContext.createBuffer(2, 44100 * 10, 44100);

                const stems = await simulateStemSeparation(dummyBuffer, (progress, message, timeRemaining) => {
                    if (!isCancelled) {
                        setStatus({
                            stage: 'processing',
                            progress: progress,
                            message: message,
                            estimatedTimeRemaining: timeRemaining
                        });
                    }
                });

                if (isCancelled) return;

                setStatus({
                    stage: 'exporting',
                    progress: 95,
                    message: 'Preparing downloads...',
                });

                await new Promise(resolve => setTimeout(resolve, 500));

                // Convert Map to array format for storage
                const results: StemResult[] = [];
                stems.forEach((buffer, name) => {
                    // Create blob for download
                    const blob = audioBufferToWav(buffer);
                    const url = URL.createObjectURL(blob);

                    results.push({
                        name: name as StemResult['name'],
                        label: STEM_CONFIG[name].label,
                        color: STEM_CONFIG[name].color,
                        audioBuffer: buffer,
                        blob,
                        url,
                        isPlaying: false,
                        volume: 1
                    });
                });

                // Store results
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

                setTimeout(() => {
                    if (!isCancelled) router.push('/results');
                }, 1500);

            } catch (err) {
                console.error('Processing error:', err);
                if (!isCancelled) {
                    setError(err instanceof Error ? err.message : 'An error occurred during processing');
                    setStatus({
                        stage: 'error',
                        progress: 0,
                        message: 'Processing failed',
                        error: err instanceof Error ? err.message : 'Unknown error',
                    });
                }
            }
        };

        runProcessing();

        return () => {
            isCancelled = true;
        };
    }, [router, retryCount]);

    const handleCancel = useCallback(() => {
        router.push('/');
    }, [router]);

    const handleRetry = useCallback(() => {
        setError(null);
        setRetryCount(c => c + 1);
    }, []);

    // Map stem names to icons
    const getStemIcon = (name: string) => {
        switch (name) {
            case 'vocals': return <Music2 className="w-6 h-6" />; // Using Music2 as generic, or could import Mic2
            case 'drums': return <div className="w-6 h-6 border-2 border-current rounded-full" />; // Abstract drum
            case 'bass': return <div className="w-6 h-6 border-b-4 border-current rounded-lg" />; // Abstract bass
            default: return <Music2 className="w-6 h-6" />;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20" data-testid="process-page-container">
            <div className="w-full max-w-4xl relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-cyan-500/20 blur-3xl animate-pulse-slow rounded-full" />
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center relative z-10 shadow-2xl animate-float">
                            <Music2 className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-bold mt-8 mb-4 font-outfit tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                            {status.stage === 'complete' ? 'Separation Complete' : 'Separating Audio'}
                        </span>
                    </h1>

                    <p className="text-lg text-zinc-400 max-w-lg mx-auto font-light"
                        data-testid={status.stage === 'complete' ? 'processing-complete' : 'processing-status'}>
                        {status.stage === 'complete'
                            ? 'Your stems are ready for download.'
                            : 'Our AI is analyzing frequencies and isolating tracks.'}
                    </p>
                </div>

                {/* Main Content Area */}
                <div className="glass backdrop-blur-2xl rounded-3xl p-8 border border-white/5 shadow-2xl">

                    {/* Error State */}
                    {error ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-red-500 mb-2">Processing Failed</h3>
                            <p className="text-zinc-400 mb-8">{error}</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={handleRetry}
                                    className="px-8 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition-all hover:scale-105"
                                >
                                    Try Again
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Processor Visualizer (The Grid of Cards) */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                                {Object.entries(STEM_CONFIG).map(([key, config], index) => {
                                    const isActive = status.message.toLowerCase().includes(key);
                                    const isComplete = status.progress > (15 + (index + 1) * 20) || status.stage === 'complete';
                                    const isWaiting = !isActive && !isComplete;

                                    return (
                                        <div
                                            key={key}
                                            className={`
                                                relative overflow-hidden rounded-2xl p-6 transition-all duration-500
                                                ${isActive ? 'bg-white/10 scale-105 shadow-[0_0_30px_rgba(255,255,255,0.05)] border-white/20' : ''}
                                                ${isComplete ? 'bg-white/5 border-emerald-500/30' : 'border-white/5'}
                                                ${isWaiting ? 'opacity-40 grayscale' : 'opacity-100'}
                                                border
                                            `}
                                        >
                                            {/* Glow Background */}
                                            {isActive && (
                                                <div
                                                    className="absolute inset-0 opacity-20 animate-pulse"
                                                    style={{ backgroundColor: config.color }}
                                                />
                                            )}

                                            <div className="relative z-10 flex flex-col items-center">
                                                <div
                                                    className={`
                                                        w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all
                                                        ${isActive ? 'scale-110' : ''}
                                                    `}
                                                    style={{
                                                        backgroundColor: isComplete ? config.color : `${config.color}20`,
                                                        color: isComplete ? 'white' : config.color
                                                    }}
                                                >
                                                    {getStemIcon(key)}
                                                </div>

                                                <h3 className="font-semibold text-white mb-1">{config.label}</h3>

                                                <span className="text-xs font-mono text-zinc-400">
                                                    {isComplete ? 'DONE' : isActive ? 'EXTRACTING...' : 'WAITING'}
                                                </span>
                                            </div>

                                            {/* Loading Bar at bottom of card */}
                                            {isActive && (
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                                    <div className="h-full bg-white animate-shimmer w-full" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Global Progress Bar */}
                            <div className="max-w-xl mx-auto">
                                <ProgressBar status={status} onCancel={handleCancel} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
