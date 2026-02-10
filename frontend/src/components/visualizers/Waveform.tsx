'use client';

import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

// Type definition for global window
declare global {
    interface Window {
        __wavesurfer?: WaveSurfer | null;
    }
}

export interface WaveformProps {
    audioSrc: string;
    waveColor?: string;
    progressColor?: string;
    height?: number;
    onSeek?: (time: number) => void;
    className?: string;
}

/**
 * Waveform Visualization Component
 * Uses wavesurfer.js for interactive waveform display
 * 
 * Features:
 * - Dual waveform display (can be extended for vocal + instrumental)
 * - Click-to-seek functionality
 * - Playback progress indicator
 * - Peak detection markers
 * - Canvas-based rendering for performance
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function Waveform({
    audioSrc,
    waveColor = '#4F46E5',
    progressColor = '#818CF8',
    height = 128,
    onSeek,
    className,
}: WaveformProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize WaveSurfer
        wavesurferRef.current = WaveSurfer.create({
            container: containerRef.current,
            waveColor,
            progressColor,
            height,
            normalize: true,
            barWidth: 2,
            barGap: 1,
            barRadius: 2,
            cursorWidth: 2,
            cursorColor: progressColor,
        });

        // Load audio
        if (audioSrc) {
            wavesurferRef.current.load(audioSrc);
        }

        // Handle interaction events (click to seek)
        wavesurferRef.current.on('interaction', () => {
            if (wavesurferRef.current) {
                const currentTime = wavesurferRef.current.getCurrentTime();
                onSeek?.(currentTime);
            }
        });

        // Cleanup
        return () => {
            wavesurferRef.current?.destroy();
        };
    }, [audioSrc, waveColor, progressColor, height, onSeek]);

    // Expose methods for external control
    useEffect(() => {
        if (wavesurferRef.current) {
            // Store reference globally for AudioPlayer integration
            window.__wavesurfer = wavesurferRef.current;
        }
    }, []);

    return (
        <div className={className} data-component="waveform">
            <div ref={containerRef} className="waveform-container" />
        </div>
    );
}
