'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react';
import { StemResult, STEM_CONFIG } from '@/types/audio';
import { formatDuration } from '@/lib/audio-utils';
import dynamic from 'next/dynamic';

const WaveformVisualizer = dynamic(
    () => import('./WaveformVisualizer').then((mod) => mod.WaveformVisualizer),
    {
        ssr: false,
        loading: () => <div className="h-16 w-full bg-zinc-900/50 animate-pulse border border-zinc-800" />
    }
);

interface StemPlayerProps {
    stem: StemResult;
    onPlayStateChange?: (isPlaying: boolean) => void;
}

export const StemPlayer = React.memo(function StemPlayer({ stem, onPlayStateChange }: StemPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const config = STEM_CONFIG[stem.name] || { label: stem.name, color: '#808080' };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            onPlayStateChange?.(false);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [onPlayStateChange]);

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(prev => !prev);
        onPlayStateChange?.(!isPlaying);
    }, [isPlaying, onPlayStateChange]);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        setIsMuted(newVolume === 0);
    }, []);

    const toggleMute = useCallback(() => {
        if (audioRef.current) {
            if (isMuted) {
                audioRef.current.volume = volume || 1;
                setIsMuted(false);
            } else {
                audioRef.current.volume = 0;
                setIsMuted(true);
            }
        }
    }, [isMuted, volume]);

    const handleWaveformSeek = useCallback((time: number) => {
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    }, []);

    const handleDownload = useCallback(() => {
        if (!stem.blob) return;

        const url = URL.createObjectURL(stem.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${stem.name}.wav`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [stem]);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="brutalist-card p-6 bg-[#1C1D18] border border-[#45362C] transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_#45362C]">
            <audio ref={audioRef} src={stem.url} preload="metadata" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div
                        className="w-12 h-12 flex items-center justify-center border-2 border-[#161711]"
                        style={{
                            backgroundColor: config.color,
                            boxShadow: `4px 4px 0px #F2E8DC`
                        }}
                    >
                        <div className="w-8 h-8 bg-[#161711]"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl text-white font-outfit uppercase tracking-tighter">{config.label}</h3>
                        <p className="text-xs text-zinc-500 font-mono tracking-wider tabular-nums">
                            {formatDuration(currentTime)} / {formatDuration(duration || 0)}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    className="p-3 bg-zinc-800 hover:bg-white hover:text-black transition-colors border border-black focus-visible:ring-2 focus-visible:ring-white outline-none"
                    aria-label={`Download ${config.label} stem`}
                    title={`Download ${config.label}`}
                >
                    <Download className="w-5 h-5" />
                </button>
            </div>

            {/* Waveform Visualization */}
            <div className="mb-6 relative">
                {stem.url ? (
                    <WaveformVisualizer
                        audioUrl={stem.url}
                        color={config.color}
                        height={64}
                        currentTime={currentTime}
                        onSeek={handleWaveformSeek}
                    />
                ) : (
                    <div className="relative h-16 bg-black border border-zinc-800">
                        <div
                            className="absolute left-0 top-0 h-full transition-all duration-100 ease-linear"
                            style={{
                                width: `${progress}%`,
                                backgroundColor: `white`,
                                opacity: 0.1
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
                {/* Play/Pause */}
                <button
                    onClick={togglePlay}
                    className="w-14 h-14 flex items-center justify-center transition-all bg-black border border-zinc-700 hover:bg-white hover:text-black hover:border-white"
                    style={{
                        boxShadow: isPlaying ? `0 0 0 2px ${config.color}` : 'none'
                    }}
                    aria-label={isPlaying ? `Pause ${config.label}` : `Play ${config.label}`}
                    data-testid={`play-button-${stem.name}`}
                >
                    {isPlaying ? (
                        <Pause className="w-6 h-6 fill-current" />
                    ) : (
                        <Play className="w-6 h-6 fill-current ml-1" />
                    )}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-3 flex-1 bg-black p-3 border border-zinc-800">
                    <button
                        onClick={toggleMute}
                        className="p-1.5 hover:text-white text-zinc-500 transition-colors focus-visible:text-white outline-none"
                        aria-label={isMuted || volume === 0 ? "Unmute" : "Mute"}
                    >
                        {isMuted || volume === 0 ? (
                            <VolumeX className="w-5 h-5" />
                        ) : (
                            <Volume2 className="w-5 h-5" />
                        )}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        aria-label={`${config.label} volume`}
                        className="w-full h-2 bg-zinc-800 appearance-none cursor-pointer accent-white"
                        style={{
                            backgroundImage: `linear-gradient(${config.color}, ${config.color})`,
                            backgroundSize: `${(isMuted ? 0 : volume) * 100}% 100%`,
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                </div>
            </div>
        </div>
    );
});

interface StemGridProps {
    stems: StemResult[];
}

export const StemGrid = React.memo(function StemGrid({ stems }: StemGridProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadAll = useCallback(async () => {
        if (isDownloading) return;
        setIsDownloading(true);

        try {
            const downloadPromises = stems.map((stem, index) => {
                if (!stem.blob) return Promise.resolve();

                return new Promise<void>((resolve) => {
                    setTimeout(() => {
                        const url = URL.createObjectURL(stem.blob!);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${stem.name}.wav`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        resolve();
                    }, index * 500);
                });
            });

            await Promise.all(downloadPromises);
        } catch (error) {
            console.error('Download failed', error);
        } finally {
            setTimeout(() => setIsDownloading(false), (stems.length * 500) + 1000);
        }
    }, [stems, isDownloading]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="grid md:grid-cols-2 gap-8">
                {stems.map((stem) => (
                    <StemPlayer key={stem.name} stem={stem} />
                ))}
            </div>

            <div className="text-center pb-12">
                <button
                    onClick={handleDownloadAll}
                    disabled={isDownloading}
                    className={`
                        brutalist-button px-12 py-5 text-xl
                        ${isDownloading ? 'opacity-80 cursor-wait' : ''}
                    `}
                    data-testid="download-all-btn"
                    data-downloading={isDownloading}
                >
                    <div className="flex items-center gap-3">
                        <Download className={`w-6 h-6 ${isDownloading ? 'animate-bounce' : ''}`} />
                        {isDownloading ? 'Downloading Stems...' : 'DOWNLOAD ALL STEMS'}
                    </div>
                </button>
            </div>
        </div>
    );
});
