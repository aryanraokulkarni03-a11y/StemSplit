'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react';
import { StemResult, STEM_CONFIG } from '@/types/audio';
import { formatDuration } from '@/lib/audio-utils';

interface StemPlayerProps {
    stem: StemResult;
    onPlayStateChange?: (isPlaying: boolean) => void;
}

export function StemPlayer({ stem, onPlayStateChange }: StemPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const config = STEM_CONFIG[stem.name];

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
        setIsPlaying(!isPlaying);
        onPlayStateChange?.(!isPlaying);
    }, [isPlaying, onPlayStateChange]);

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        if (newVolume === 0) {
            setIsMuted(true);
        } else {
            setIsMuted(false);
        }
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

    const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
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
        <div className="glass rounded-2xl p-4 sm:p-6">
            <audio ref={audioRef} src={stem.url} preload="metadata" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${config.color}20` }}
                    >
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: config.color }}
                        />
                    </div>
                    <div>
                        <h3 className="font-semibold">{config.label}</h3>
                        <p className="text-sm text-foreground/60">
                            {formatDuration(currentTime)} / {formatDuration(duration || 0)}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleDownload}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    title={`Download ${config.label}`}
                >
                    <Download className="w-5 h-5" style={{ color: config.color }} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: config.color
                        }}
                    />
                </div>
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
                    style={{ position: 'relative', marginTop: '-8px' }}
                />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
                {/* Play/Pause */}
                <button
                    onClick={togglePlay}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
                    style={{ backgroundColor: config.color }}
                >
                    {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                    ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleMute}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isMuted || volume === 0 ? (
                            <VolumeX className="w-5 h-5 text-foreground/60" />
                        ) : (
                            <Volume2 className="w-5 h-5 text-foreground/60" />
                        )}
                    </button>
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, ${config.color} ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%)`
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

interface StemGridProps {
    stems: StemResult[];
}

export function StemGrid({ stems }: StemGridProps) {
    const handleDownloadAll = useCallback(() => {
        stems.forEach((stem, index) => {
            if (stem.blob) {
                setTimeout(() => {
                    const url = URL.createObjectURL(stem.blob!);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${stem.name}.wav`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, index * 500); // Stagger downloads
            }
        });
    }, [stems]);

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                {stems.map((stem) => (
                    <StemPlayer key={stem.name} stem={stem} />
                ))}
            </div>

            <div className="text-center">
                <button
                    onClick={handleDownloadAll}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
                >
                    <Download className="w-5 h-5" />
                    Download All Stems
                </button>
            </div>
        </div>
    );
}
