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
        let pollInterval: NodeJS.Timeout;

        const runProcessing = async () => {
            // Get file info from sessionStorage
            const fileInfoStr = sessionStorage.getItem('audioFile');

            if (!fileInfoStr) {
                setError('No audio file found. Please upload a file first.');
                return;
            }

            const fileInfo = JSON.parse(fileInfoStr);

            try {
                // 1. Trigger Separation
                setStatus({
                    stage: 'loading-model',
                    progress: 5,
                    message: 'Initializing Demucs model...',
                    estimatedTimeRemaining: 180, // Real AI takes time
                });

                const startResponse = await fetch('/api/separate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fileName: fileInfo.name }),
                });

                if (!startResponse.ok) throw new Error('Failed to start separation job');

                const { jobId, statusEndpoint } = await startResponse.json();

                // 2. Poll Status
                pollInterval = setInterval(async () => {
                    if (isCancelled) return;

                    try {
                        const statusRes = await fetch(statusEndpoint);
                        if (!statusRes.ok) return; // Skip this tick if network blip

                        const jobStatus = await statusRes.json();

                        if (jobStatus.status === 'processing' || jobStatus.status === 'starting') {
                            setStatus(prev => ({
                                ...prev,
                                stage: 'processing',
                                progress: jobStatus.progress || prev.progress, // Use reported progress or keep current
                                message: jobStatus.message || 'Separating stems...',
                            }));
                        } else if (jobStatus.status === 'completed') {
                            clearInterval(pollInterval);

                            // Transform result for UI
                            // backend returns { stems: { vocals: "path/to/wav", ... } }
                            const results: StemResult[] = [];

                            // We need to fetch the actual audio buffers to allow playback in the browser
                            // For MVP, we might just set the URL and load buffer on play?
                            // The existing StemPlayer expects 'audioBuffer'.
                            // Let's Load the buffers now (might be heavy) OR refactor Player to load on demand.
                            // For strict fidelity to current UI, we'll try to load them.

                            setStatus({
                                stage: 'exporting',
                                progress: 95,
                                message: 'Finalizing stems...',
                            });

                            const stemPaths = jobStatus.stems; // { vocals: "path", ... }

                            // Helper to fetch and decode
                            const loadStem = async (name: string, relativePath: string) => {
                                const response = await fetch(`/${relativePath}`); // public folder access
                                const arrayBuffer = await response.arrayBuffer();
                                const audioContext = new AudioContext(); // Browser dependent
                                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                                return { name, audioBuffer, url: `/${relativePath}` };
                            };

                            const loadedStems = await Promise.all(
                                Object.entries(stemPaths).map(([name, path]) =>
                                    loadStem(name, path as string)
                                )
                            );

                            loadedStems.forEach(stem => {
                                results.push({
                                    name: stem.name as StemResult['name'],
                                    label: STEM_CONFIG[stem.name].label,
                                    color: STEM_CONFIG[stem.name].color,
                                    audioBuffer: stem.audioBuffer,
                                    url: stem.url,
                                    blob: audioBufferToWav(stem.audioBuffer),
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

                            if (!isCancelled) router.push('/results');
                        } else if (jobStatus.status === 'failed' || jobStatus.status === 'error') {
                            throw new Error(jobStatus.error || 'Job failed on backend');
                        }

                    } catch (pollErr) {
                        console.error('Polling error', pollErr);
                        // Don't fail immediately on one poll error, but maybe track consecutive failures
                    }
                }, 2000);

            } catch (err) {
                console.error('Processing error:', err);
                if (!isCancelled) {
                    clearInterval(pollInterval);
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
            if (pollInterval) clearInterval(pollInterval);
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
                        <div className="w-24 h-24 bg-primary flex items-center justify-center relative z-10 shadow-[4px_4px_0px_white] transition-transform hover:-translate-y-1">
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
                <div className="brutalist-card p-8">

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
                                                relative overflow-hidden p-6 transition-all duration-200 border
                                                ${isActive ? 'bg-zinc-900 shadow-[2px_2px_0px_white] border-primary' : 'border-zinc-800'}
                                                ${isComplete ? 'bg-zinc-900/50 border-primary' : ''}
                                                ${isWaiting ? 'opacity-40' : 'opacity-100'}
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
                                                        w-12 h-12 flex items-center justify-center mb-3 transition-all border border-current
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
