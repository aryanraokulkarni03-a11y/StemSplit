'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Music2, ArrowLeft, Upload, CheckCircle2, Sparkles } from 'lucide-react';
import { StemResult } from '@/types/audio';
import { Button } from '@/components/ui/ProgressBar';

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
            const stemResults: StemResult[] = storedResults.map(r => ({
                name: r.name,
                label: r.label,
                color: r.color,
                audioBuffer: null,
                blob: null, // Will be recreated from URL if needed
                url: r.url,
                isPlaying: false,
                volume: 1,
            }));

            setStems(stemResults);
            setLoading(false);
        } catch {
            console.error('Error loading results');
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
        <div className="min-h-screen py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-16">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse-slow rounded-full" />
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center relative z-10 shadow-2xl animate-float">
                            <CheckCircle2 className="w-12 h-12 text-white" />
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-bold mt-8 mb-4 font-outfit tracking-tight text-white">
                        Separation Complete
                    </h1>

                    <p className="text-lg text-zinc-400 max-w-lg mx-auto font-light">
                        {originalFileName ? (
                            <>
                                Results for <span className="text-white font-medium">{originalFileName}</span>
                            </>
                        ) : (
                            'Your audio has been separated into individual stems'
                        )}
                    </p>
                </div>

                {/* Stems Grid */}
                <div className="glass rounded-3xl p-6 sm:p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            Your Stems
                        </h2>
                        <span className="text-sm text-foreground/50">
                            {stems.length} tracks
                        </span>
                    </div>

                    <StemGrid stems={stems} />
                </div>

                {/* Tips Section */}
                <div className="glass rounded-2xl p-6 mb-8">
                    <h3 className="font-semibold mb-4">💡 What you can do with these stems:</h3>
                    <ul className="space-y-2 text-sm text-foreground/70">
                        <li className="flex items-start gap-2">
                            <span className="text-sky-400">•</span>
                            <span><strong>Practice:</strong> Mute the vocals to sing along with the instrumental</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-400">•</span>
                            <span><strong>Learn:</strong> Isolate drums or bass to study rhythms and patterns</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-amber-400">•</span>
                            <span><strong>Remix:</strong> Use individual stems to create your own remixes</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-pink-400">•</span>
                            <span><strong>Produce:</strong> Sample and integrate stems into your productions</span>
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={handleProcessAnother}
                        icon={<Upload className="w-5 h-5" />}
                        data-testid="process-another-btn"
                    >
                        Process Another File
                    </Button>
                    <Link href="/">
                        <Button
                            variant="secondary"
                            size="lg"
                            icon={<ArrowLeft className="w-5 h-5" />}
                        >
                            Back to Home
                        </Button>
                    </Link>
                </div>

                {/* Footer Note */}
                <p className="text-center text-sm text-foreground/40 mt-8">
                    All processing was done in your browser. Your audio files never left your device.
                </p>
            </div>
        </div>
    );
}
