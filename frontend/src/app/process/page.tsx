'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Music2, AlertCircle } from 'lucide-react';
// ProgressBar removed as it was unused
import { ProcessingStatus, StemResult, STEM_CONFIG } from '@/types/audio';
import { audioBufferToWav } from '@/lib/audio-utils';
import { useSession, signIn } from "next-auth/react";

export default function ProcessPage() {
    const router = useRouter();
    const [status, setStatus] = useState<ProcessingStatus>({
        stage: 'idle',
        progress: 0,
        message: 'Initializing...',
    });
    const [error, setError] = useState<string | null>(null);

    const { data: session, status: authStatus } = useSession();
    const [retryCount, setRetryCount] = useState(0);

    // Get JWT token for API calls
    const getApiToken = async () => {
        if (!session) return null;
        
        try {
            // Get token from our token API
            const response = await fetch('/api/auth/token');
            const tokenData = await response.json();
            return tokenData.accessToken;
        } catch (error) {
            console.error('Failed to get API token:', error);
            return null;
        }
    };

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
                const token = await getApiToken();
                
                if (!token) {
                    // Redirect to sign-in if not authenticated
                    router.push('/sign-in?callbackUrl=' + encodeURIComponent(window.location.pathname));
                    return;
                }

                // 1. Trigger Separation
                setStatus({
                    stage: 'loading-model',
                    progress: 5,
                    message: 'Initializing Demucs model...',
                    estimatedTimeRemaining: 180, // Real AI takes time
                });

                const startResponse = await fetch('/api/separate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        fileName: fileInfo.name,
                        inputPath: fileInfo.inputPath,
                    }),
                });

                if (!startResponse.ok) {
                    let message = 'Failed to start separation job';

                    try {
                        const errorBody = await startResponse.json() as { error?: string; code?: string; retryAfterSeconds?: number };
                        if (errorBody?.code === 'RATE_LIMITED') {
                            message = errorBody.error ??
                                `Too many separation requests. Please wait ${errorBody.retryAfterSeconds ?? 60} seconds and try again.`;
                        } else if (errorBody?.error) {
                            message = errorBody.error;
                        }
                    } catch {
                        // ignore JSON parse errors and fall back to default message
                    }

                    throw new Error(message);
                }

                const { statusEndpoint } = await startResponse.json();

                // 2. Poll Status
                pollInterval = setInterval(async () => {
                    if (isCancelled) return;

                    try {
                        const statusRes = await fetch(statusEndpoint, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });

                        if (!statusRes.ok) {
                            if (statusRes.status === 404) {
                                throw new Error('Separation job not found or has expired. Please start a new separation.');
                            }

                            // For 5xx or other errors, try to surface backend message if available
                            let message = 'Temporary issue contacting the AI engine. Please wait a moment and retry.';
                            try {
                                const errorBody = await statusRes.json();
                                if (errorBody?.error) {
                                    message = errorBody.error;
                                }
                            } catch {
                                // ignore JSON parse errors and keep default message
                            }

                            throw new Error(message);
                        }

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
                                await audioContext.close(); // Close to free resources
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
                            throw new Error(jobStatus.error || 'Separation job failed on the backend.');
                        }

                    } catch (pollErr) {
                        console.error('Polling error', pollErr);
                        if (!isCancelled) {
                            clearInterval(pollInterval);
                            const message = pollErr instanceof Error ? pollErr.message : 'An error occurred while checking job status.';
                            setError(message);
                            setStatus({
                                stage: 'error',
                                progress: 0,
                                message,
                                error: message,
                            });
                        }
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

    // handleCancel removed as it was unused

    const handleRetry = useCallback(() => {
        setError(null);
        setRetryCount(c => c + 1);
    }, []);

    // Map stem names to icons
    // getStemIcon removed as it was unused

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-leather" data-testid="process-page-container">
            <div className="w-full max-w-2xl relative z-10">

{/* Rack Mount Header */}
                <div className="bg-metal-dark p-4 sm:p-6 rounded-t-lg border-x border-t border-[#45362C] shadow-2xl relative overflow-hidden">
                    {/* Screws */}
                    <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>

                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 mb-2 opacity-80">
                            <div className={`w-2 h-2 rounded-full ${status.stage === 'error' ? 'bg-red-500' : 'bg-green-500'} led-glow animate-pulse`} />
                            <span className="font-mono text-xs text-[#A8977A] tracking-[0.2em] uppercase">Processing Unit Active</span>
                        </div>
<h1 className="text-2xl sm:text-3xl font-bold text-[#F2E8DC] font-outfit uppercase tracking-tight">
                            signal separation
                        </h1>
                    </div>
                </div>

                {/* Rack Units (Stems) */}
                <div className="bg-[#161711] border-x border-[#45362C]">
                    {error ? (
                        <div className="p-6 sm:p-12 text-center bg-red-900/20">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <p className="text-red-400 font-mono mb-6">{error}</p>
                            <button onClick={handleRetry} className="btn-tactile px-6 py-2 text-[#161711] font-bold rounded-sm">RETRY SEQUENCE</button>
                        </div>
                    ) : (
                        <div className="divide-y divide-black">
                            {Object.entries(STEM_CONFIG).map(([key, config], index) => {
                                const isActive = status.message.toLowerCase().includes(key);
                                const isComplete = status.progress > (15 + (index + 1) * 20) || status.stage === 'complete';

                                // Calculate needle rotation (-45 to 45 deg)
                                // If complete, peg to 45. If active, wiggle around 0. If waiting, -45.
                                let rotation = -45;
                                if (isComplete) rotation = 45;
                                else if (isActive) rotation = -10 + (Math.random() * 20) + (status.progress / 3); // Simulated movement

                                return (
                                    <div key={key} className="rack-unit p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 group relative">
                                        {/* Screw details */}
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black/50" />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-black/50" />

                                        <div className="flex items-center gap-4 sm:gap-6 pl-4 sm:pl-6">
{/* Channel Label */}
                                            <div className="w-20 sm:w-24">
                                                <span className="block text-xs text-[#A8977A]/60 font-mono uppercase tracking-widest mb-1">Channel</span>
                                                <h3 className="text-lg sm:text-xl font-bold text-[#F2E8DC] uppercase">{config.label}</h3>
                                            </div>

                                            {/* Status LED */}
                                            <div className="flex flex-col items-center gap-1">
                                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${isComplete ? 'bg-green-500 led-glow' : isActive ? 'bg-amber-500 animate-pulse' : 'bg-zinc-800'}`} />
                                                <span className="text-[9px] font-mono text-zinc-600 uppercase">Signal</span>
                                            </div>
                                        </div>

                                        {/* Analog VU Meter */}
                                        <div className="relative w-32 h-16 bg-[#F2E8DC] rounded-t-lg overflow-hidden border-2 border-[#161711] shadow-inner ml-auto mr-12 opacity-90">
                                            {/* Scale markings */}
                                            <div className="absolute bottom-0 left-[10%] w-[1px] h-3 bg-black/30 origin-bottom transform -rotate-[30deg]" />
                                            <div className="absolute bottom-0 left-[50%] w-[1px] h-4 bg-black/30" />
                                            <div className="absolute bottom-0 right-[10%] w-[1px] h-3 bg-red-500/50 origin-bottom transform rotate-[30deg]" />
                                            <span className="absolute top-2 right-2 text-[8px] font-bold text-red-700">PEAK</span>

                                            {/* Needle */}
                                            <div
                                                className="absolute bottom-[-2px] left-1/2 w-[2px] h-14 bg-red-600 origin-bottom needle-transition z-10"
                                                style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                                            />
                                            {/* Pivot */}
                                            <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-20" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Rack Footer / Global Progress */}
                <div className="bg-metal-dark p-6 rounded-b-lg border-x border-b border-[#45362C] shadow-2xl">
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-[#A8977A] uppercase w-24">Master Out</span>
                        <div className="flex-1 h-3 bg-black rounded-full overflow-hidden border border-zinc-700 relative">
                            {/* Striped progress bar */}
                            <div
                                className="h-full bg-amber-600 transition-all duration-300"
                                style={{ width: `${status.progress}%` }}
                            />
                            {/* Hatching texture overlay */}
                            <div className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(0,0,0,0.2)_5px,rgba(0,0,0,0.2)_10px)] opacity-50" />
                        </div>
                        <span className="font-mono text-xs text-[#F2E8DC] w-10 text-right">{Math.round(status.progress)}%</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
