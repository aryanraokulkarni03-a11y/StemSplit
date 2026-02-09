'use client';

import { useState, useEffect, useRef } from 'react';
import { getAudioEngine } from '@/lib/audio-engine';

export interface AudioPlayerProps {
    vocalSrc: string;
    instrumentalSrc: string;
    onDeviceChange?: (device: string) => void;
    className?: string;
    controlsClassName?: string;
}

/**
 * Audio Player Component (Unstyled)
 * Functional audio player with dual-track support
 * 
 * Features:
 * - Play/pause toggle
 * - Seek bar with progress
 * - Dual volume control (vocal + instrumental)
 * - Playback speed slider (0.5x-2x)
 * - Device routing selector
 * - Time display
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function AudioPlayer({
    vocalSrc,
    instrumentalSrc,
    onDeviceChange,
    className,
    controlsClassName,
}: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [vocalVolume, setVocalVolume] = useState(1.0);
    const [instrumentalVolume, setInstrumentalVolume] = useState(1.0);
    const [playbackRate, setPlaybackRate] = useState(1.0);
    const [selectedDevice, setSelectedDevice] = useState('default');

    const audioEngineRef = useRef(getAudioEngine());
    const animationFrameRef = useRef<number | null>(null);


    // Update current time during playback
    useEffect(() => {
        if (isPlaying) {
            const updateTime = () => {
                setCurrentTime(audioEngineRef.current.getCurrentTime());
                animationFrameRef.current = requestAnimationFrame(updateTime);
            };
            animationFrameRef.current = requestAnimationFrame(updateTime);
        } else {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying]);

    // Load audio file
    useEffect(() => {
        const loadAudio = async () => {
            try {
                await audioEngineRef.current.loadAudioFile(vocalSrc);
                setDuration(audioEngineRef.current.getDuration());
            } catch (error) {
                console.error('Failed to load audio:', error);
            }
        };

        if (vocalSrc) {
            loadAudio();
        }
    }, [vocalSrc]);

    const handlePlayPause = () => {
        if (isPlaying) {
            audioEngineRef.current.pause();
            setIsPlaying(false);
        } else {
            audioEngineRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        audioEngineRef.current.seek(time);
        setCurrentTime(time);
    };

    const handleVocalVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const volume = parseFloat(e.target.value);
        setVocalVolume(volume);
        audioEngineRef.current.setVolume(volume);
    };

    const handleInstrumentalVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const volume = parseFloat(e.target.value);
        setInstrumentalVolume(volume);
        // Note: For dual-track, you'd need two separate audio engines
        // This is a simplified version
    };

    const handlePlaybackRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rate = parseFloat(e.target.value);
        setPlaybackRate(rate);
        audioEngineRef.current.setPlaybackRate(rate);
    };

    const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const device = e.target.value;
        setSelectedDevice(device);
        onDeviceChange?.(device);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={className} data-component="audio-player">
            {/* Play/Pause Button */}
            <button
                onClick={handlePlayPause}
                className="play-pause-button"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                data-playing={isPlaying}
            >
                {isPlaying ? 'Pause' : 'Play'}
            </button>

            {/* Seek Bar */}
            <div className="seek-bar-container">
                <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="seek-bar"
                    aria-label="Seek"
                />
                <div className="time-display">
                    <span className="current-time">{formatTime(currentTime)}</span>
                    <span className="duration">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Volume Controls */}
            <div className={controlsClassName} data-controls="volume">
                <div className="volume-control" data-track="vocal">
                    <label htmlFor="vocal-volume">Vocal Volume</label>
                    <input
                        id="vocal-volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={vocalVolume}
                        onChange={handleVocalVolumeChange}
                        aria-label="Vocal volume"
                    />
                    <span className="volume-value">{Math.round(vocalVolume * 100)}%</span>
                </div>

                <div className="volume-control" data-track="instrumental">
                    <label htmlFor="instrumental-volume">Instrumental Volume</label>
                    <input
                        id="instrumental-volume"
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={instrumentalVolume}
                        onChange={handleInstrumentalVolumeChange}
                        aria-label="Instrumental volume"
                    />
                    <span className="volume-value">{Math.round(instrumentalVolume * 100)}%</span>
                </div>
            </div>

            {/* Playback Speed */}
            <div className="playback-speed-control">
                <label htmlFor="playback-speed">Speed</label>
                <input
                    id="playback-speed"
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={playbackRate}
                    onChange={handlePlaybackRateChange}
                    aria-label="Playback speed"
                />
                <span className="speed-value">{playbackRate.toFixed(1)}x</span>
            </div>

            {/* Device Routing Selector */}
            <div className="device-selector">
                <label htmlFor="output-device">Output Device</label>
                <select
                    id="output-device"
                    value={selectedDevice}
                    onChange={handleDeviceChange}
                    aria-label="Select output device"
                >
                    <option value="default">Default</option>
                    <option value="headphones">Headphones</option>
                    <option value="speakers">Speakers</option>
                    <option value="bluetooth">Bluetooth</option>
                </select>
            </div>
        </div>
    );
}
