'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface WaveformVisualizerProps {
    audioUrl: string;
    color?: string;
    height?: number;
    isPlaying?: boolean;
    currentTime?: number;
    onSeek?: (time: number) => void;
}

export function WaveformVisualizer({
    audioUrl,
    color = '#38bdf8',
    height = 80,
    currentTime = 0,
    onSeek
}: WaveformVisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [waveformData, setWaveformData] = useState<number[]>([]);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Generate waveform data from audio
    useEffect(() => {
        if (!audioUrl) return;

        let cancelled = false;

        const loadWaveform = async () => {
            try {
                const response = await fetch(audioUrl);
                const arrayBuffer = await response.arrayBuffer();
                const audioContext = new AudioContext();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

                if (cancelled) return;

                setDuration(audioBuffer.duration);

                // Get channel data and downsample for visualization
                const channelData = audioBuffer.getChannelData(0);
                const samples = 200; // Number of bars to display
                const blockSize = Math.floor(channelData.length / samples);
                const filteredData: number[] = [];

                for (let i = 0; i < samples; i++) {
                    let sum = 0;
                    for (let j = 0; j < blockSize; j++) {
                        sum += Math.abs(channelData[i * blockSize + j]);
                    }
                    filteredData.push(sum / blockSize);
                }

                // Normalize
                const max = Math.max(...filteredData);
                const normalized = filteredData.map(v => v / max);

                if (!cancelled) {
                    setWaveformData(normalized);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Error generating waveform:', error);
                if (!cancelled) {
                    // Generate fake waveform for demo
                    const fakeData = Array.from({ length: 200 }, (_, i) =>
                        Math.sin(i * 0.15) * 0.4 + 0.5
                    );
                    setWaveformData(fakeData);
                    setIsLoading(false);
                }
            }
        };

        loadWaveform();

        return () => { cancelled = true; };
    }, [audioUrl]);

    // Draw waveform on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || waveformData.length === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height);

        const barWidth = rect.width / waveformData.length;
        const barGap = 1;
        const progress = duration > 0 ? currentTime / duration : 0;
        const progressX = progress * rect.width;

        waveformData.forEach((value, index) => {
            const x = index * barWidth;
            const barHeight = value * (rect.height - 4);
            const y = (rect.height - barHeight) / 2;

            // Set color based on playback position
            if (x < progressX) {
                ctx.fillStyle = color;
            } else {
                ctx.fillStyle = `${color}40`; // 25% opacity
            }

            ctx.fillRect(x + barGap / 2, y, barWidth - barGap, barHeight);
        });
    }, [waveformData, currentTime, duration, color]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!onSeek || duration === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const progress = x / rect.width;
        const seekTime = progress * duration;

        onSeek(seekTime);
    }, [duration, onSeek]);

    if (isLoading) {
        return (
            <div
                className="w-full rounded-lg bg-white/5 animate-pulse flex items-center justify-center"
                style={{ height }}
            >
                <span className="text-xs text-foreground/40">Loading waveform...</span>
            </div>
        );
    }

    return (
        <canvas
            ref={canvasRef}
            className="w-full cursor-pointer rounded-lg"
            style={{ height }}
            onClick={handleClick}
        />
    );
}

// Simple bar visualizer for real-time audio
interface AudioBarsProps {
    isPlaying: boolean;
    color?: string;
    barCount?: number;
}

// Pre-defined bar heights for deterministic rendering
const BAR_HEIGHTS = [60, 80, 40, 90, 50, 70, 45, 85, 55, 75];

export function AudioBars({ isPlaying, color = '#38bdf8', barCount = 5 }: AudioBarsProps) {
    return (
        <div className="flex items-end gap-0.5 h-6">
            {Array.from({ length: barCount }).map((_, i) => (
                <div
                    key={i}
                    className={`w-1 rounded-full transition-all ${isPlaying ? 'animate-pulse' : ''}`}
                    style={{
                        backgroundColor: color,
                        height: isPlaying ? `${BAR_HEIGHTS[i % BAR_HEIGHTS.length]}%` : '20%',
                        animationDelay: `${i * 0.1}s`,
                        animationDuration: '0.5s',
                    }}
                />
            ))}
        </div>
    );
}

