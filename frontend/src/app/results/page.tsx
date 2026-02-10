'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Music2, ArrowLeft, Upload, CheckCircle2, Sparkles } from 'lucide-react';
import { StemResult, STEM_CONFIG } from '@/types/audio';
// Button removed as it was unused

const StemGrid = dynamic(
    () => import('@/components/ui/StemPlayer').then((mod) => mod.StemGrid),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-96 bg-zinc-900/50 animate-pulse border border-zinc-800 flex items-center justify-center">
                <span className="text-zinc-500 font-mono">LOADING STEMS...</span>
            </div>
        ),
    }
);

interface StoredStemResult {
    name: 'vocals' | 'drums' | 'bass' | 'other';
    label: string;
    color: string;
    url: string;
}

export default function ResultsPage() {
    const router = useRouter();
    const [stems, setStems] = useState<StemResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [originalFileName, setOriginalFileName] = useState<string>('');

    useEffect(() => {
        // Get results from sessionStorage
        const resultsStr = sessionStorage.getItem('stemResults');
        const fileInfoStr = sessionStorage.getItem('audioFile');

        if (!resultsStr) {
            // No results, redirect to home
            router.push('/');
            return;
        }

        try {
            const storedResults: StoredStemResult[] = JSON.parse(resultsStr);
            const fileInfo = fileInfoStr ? JSON.parse(fileInfoStr) : null;

            if (fileInfo) {
                setOriginalFileName(fileInfo.name);
            }

            // Convert stored results to StemResult format
            const stemResults: StemResult[] = storedResults
                .filter(r => {
                    const config = STEM_CONFIG[r.name as keyof typeof STEM_CONFIG];
                    return !!config; // Filter out stale stems (drums, bass, etc.)
                })
                .map(r => {
                    const config = STEM_CONFIG[r.name as keyof typeof STEM_CONFIG];
                    return {
                        name: r.name as StemResult['name'],
                        label: r.label,
                        color: r.color,
                        audioBuffer: null,
                        blob: null, // Will be recreated from URL if needed
                        url: r.url,
                        isPlaying: false,
                    volume: 1,
                }
            });

            setStems(stemResults);
            setLoading(false);
        } catch (err) {
            console.error('Error loading results:', err);
            router.push('/');
        }
    }, [router]);

    const handleProcessAnother = () => {
        // Clear session storage
        sessionStorage.removeItem('audioFile');
        sessionStorage.removeItem('audioFileData');
        sessionStorage.removeItem('stemResults');
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Music2 className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-foreground/60">Loading results...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 px-4 bg-leather">
            <div className="max-w-6xl mx-auto">
{/* Mixing Desk Header */}
                <div className="text-center mb-8 sm:mb-16 relative">
                    <div className="inline-block relative mb-4 sm:mb-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-metal-brushed border-4 border-[#2A2B24] flex items-center justify-center shadow-xl z-10 relative">
                            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#45362C]" />
                        </div>
                        {/* Status light */}
                        <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 led-glow animate-pulse" />
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-outfit tracking-tight text-[#F2E8DC] mb-2">
                        Session Complete
                    </h1>

                    <p className="text-base sm:text-lg text-[#A8977A]/80 font-mono tracking-wide">
                        {originalFileName ? (
                            <>MASTER TAPE: <span className="text-[#F2E8DC] uppercase">{originalFileName}</span></>
                        ) : (
                            'STEMS READY FOR MIXDOWN'
                        )}
                    </p>
                </div>

{/* Console Surface */}
                <div className="bg-metal-dark rounded-xl p-4 sm:p-8 border border-[#45362C] shadow-2xl relative">
                    {/* Metal Screws */}
                    <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                    <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                    <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8 border-b border-black/50 pb-4">
                        <h2 className="text-lg sm:text-xl font-bold font-outfit text-[#A8977A] uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                            Console Strips
                        </h2>
                        <span className="text-xs font-mono text-zinc-500 bg-black/30 px-2 py-1 rounded w-fit">
                            {stems.length} CHANNELS ACTIVE
                        </span>
                    </div>

                    <StemGrid stems={stems} />
                </div>

{/* Footer Controls */}
                <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
                    {/* Tactile Buttons */}
                    <button
                        onClick={handleProcessAnother}
                        className="btn-tactile px-8 py-4 text-[#161711] font-bold uppercase rounded-sm flex items-center gap-3 active:scale-95"
                    >
                        <Upload className="w-5 h-5" />
                        Load New Tape
                    </button>

                    <Link href="/">
                        <button className="text-[#A8977A] hover:text-[#F2E8DC] font-mono text-sm tracking-widest uppercase transition-colors flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Return to Storage
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
