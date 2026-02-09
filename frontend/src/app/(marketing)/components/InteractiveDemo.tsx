'use client';

import { useState } from 'react';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import { Waveform } from '@/components/visualizers/Waveform';
import { LyricDisplay, type LyricLine } from '@/components/audio/LyricDisplay';
import { DeviceRouter, type Routing } from '@/components/audio/DeviceRouter';

interface InteractiveDemoProps {
    className?: string;
}

// Sample lyric data (in production, this would come from API)
const sampleLyrics: LyricLine[] = [
    {
        startTime: 0,
        endTime: 3.5,
        text: 'Welcome to the AI Music Platform',
        translation: 'Bienvenue sur la plateforme musicale IA',
        words: [
            { text: 'Welcome', startTime: 0, endTime: 0.5 },
            { text: 'to', startTime: 0.5, endTime: 0.7 },
            { text: 'the', startTime: 0.7, endTime: 0.9 },
            { text: 'AI', startTime: 0.9, endTime: 1.3 },
            { text: 'Music', startTime: 1.3, endTime: 2.0 },
            { text: 'Platform', startTime: 2.0, endTime: 3.5 },
        ],
    },
    {
        startTime: 3.5,
        endTime: 7.0,
        text: 'Experience professional-grade stem separation',
        translation: 'Découvrez la séparation de stems de qualité professionnelle',
    },
    {
        startTime: 7.0,
        endTime: 10.5,
        text: 'With multi-device routing and real-time sync',
        translation: 'Avec routage multi-appareils et synchronisation en temps réel',
    },
];

/**
 * Interactive Demo Component (Fully Integrated)
 * Complete audio demo with all interactive features
 * 
 * Features:
 * - AudioPlayer with dual volume controls
 * - Waveform visualization
 * - Time-synced lyrics with word highlighting
 * - Multi-device routing simulator
 * 
 * TODO: Integrate user's custom skeuomorphic design
 * TODO: Replace sample audio URLs with actual demo files
 */
export function InteractiveDemo({ className }: InteractiveDemoProps) {
    const [currentTime, setCurrentTime] = useState(0);
    const [showTranslation, setShowTranslation] = useState(false);
    const [routing, setRouting] = useState<Routing>({
        vocal: ['device-1'],
        instrumental: ['device-2'],
    });

    // Sample audio URLs (replace with actual demo files)
    const vocalSrc = '/demo/vocal.mp3';
    const instrumentalSrc = '/demo/instrumental.mp3';

    const handleWaveformSeek = (time: number) => {
        setCurrentTime(time);
    };

    const handleLyricSeek = (time: number) => {
        setCurrentTime(time);
    };

    const handleRoutingChange = (newRouting: Routing) => {
        setRouting(newRouting);
        console.log('Routing updated:', newRouting);
    };

    return (
        <section className={className} data-section="interactive-demo">
            <h2>Try It Live</h2>
            <p className="section-description">
                Experience the power of AI music separation with our interactive demo.
            </p>

            <div className="demo-container">
                {/* Waveform Visualization */}
                <div className="demo-waveform">
                    <h3>Waveform Visualization</h3>
                    <Waveform
                        audioSrc={vocalSrc}
                        onSeek={handleWaveformSeek}
                        className="waveform-display"
                    />
                </div>

                {/* Audio Player Controls */}
                <div className="demo-player">
                    <h3>Audio Controls</h3>
                    <AudioPlayer
                        vocalSrc={vocalSrc}
                        instrumentalSrc={instrumentalSrc}
                        className="audio-player-demo"
                        controlsClassName="player-controls"
                    />
                </div>

                {/* Lyric Display */}
                <div className="demo-lyrics">
                    <div className="lyrics-header">
                        <h3>Synchronized Lyrics</h3>
                        <button
                            onClick={() => setShowTranslation(!showTranslation)}
                            className="translation-toggle"
                            aria-pressed={showTranslation}
                        >
                            {showTranslation ? 'Hide' : 'Show'} Translation
                        </button>
                    </div>
                    <LyricDisplay
                        lyrics={sampleLyrics}
                        currentTime={currentTime}
                        showTranslation={showTranslation}
                        onLineClick={handleLyricSeek}
                        className="lyric-display-demo"
                    />
                </div>

                {/* Device Routing */}
                <div className="demo-routing">
                    <DeviceRouter
                        onRoutingChange={handleRoutingChange}
                        className="device-router-demo"
                    />
                </div>
            </div>

            {/* Demo Info */}
            <div className="demo-info">
                <p className="demo-note">
                    <strong>Note:</strong> This is a demonstration of the platform's capabilities.
                    Upload your own music files to experience full stem separation.
                </p>
            </div>
        </section>
    );
}
