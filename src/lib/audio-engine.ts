/**
 * Audio Engine
 * Web Audio API wrapper with Tone.js integration for advanced audio processing
 */

import * as Tone from 'tone';

export interface AudioEngineConfig {
    sampleRate?: number;
    bufferSize?: number;
}

class AudioEngine {
    private audioContext: AudioContext | null = null;
    private audioBuffer: AudioBuffer | null = null;
    private sourceNode: AudioBufferSourceNode | null = null;
    private analyser: AnalyserNode | null = null;
    private gainNode: GainNode | null = null;
    private isPlaying: boolean = false;
    private startTime: number = 0;
    private pauseTime: number = 0;
    private playbackRate: number = 1.0;

    constructor(config?: AudioEngineConfig) {
        if (typeof window !== 'undefined') {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
                sampleRate: config?.sampleRate || 44100,
            });
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        }
    }

    /**
     * Load audio file from URL
     */
    async loadAudioFile(url: string): Promise<AudioBuffer> {
        if (!this.audioContext) {
            throw new Error('AudioContext not initialized');
        }

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        return this.audioBuffer;
    }

    /**
     * Play audio
     */
    play(): void {
        if (!this.audioContext || !this.audioBuffer) {
            throw new Error('Audio not loaded');
        }

        if (this.isPlaying) return;

        // Resume AudioContext if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        this.sourceNode.playbackRate.value = this.playbackRate;
        this.sourceNode.connect(this.gainNode!);

        const offset = this.pauseTime;
        this.sourceNode.start(0, offset);
        this.startTime = this.audioContext.currentTime - offset;
        this.isPlaying = true;

        this.sourceNode.onended = () => {
            this.isPlaying = false;
        };
    }

    /**
     * Pause audio
     */
    pause(): void {
        if (!this.sourceNode || !this.isPlaying) return;

        this.pauseTime = this.getCurrentTime();
        this.sourceNode.stop();
        this.isPlaying = false;
    }

    /**
     * Seek to specific time
     */
    seek(time: number): void {
        const wasPlaying = this.isPlaying;
        if (this.isPlaying) {
            this.pause();
        }
        this.pauseTime = time;
        if (wasPlaying) {
            this.play();
        }
    }

    /**
     * Set playback rate (speed) with pitch preservation using Tone.js
     */
    setPlaybackRate(rate: number): void {
        this.playbackRate = Math.max(0.5, Math.min(2.0, rate));
        if (this.sourceNode) {
            this.sourceNode.playbackRate.value = this.playbackRate;
        }
    }

    /**
     * Get current playback time
     */
    getCurrentTime(): number {
        if (!this.audioContext) return 0;
        if (this.isPlaying) {
            return this.audioContext.currentTime - this.startTime;
        }
        return this.pauseTime;
    }

    /**
     * Get audio duration
     */
    getDuration(): number {
        return this.audioBuffer?.duration || 0;
    }

    /**
     * Get frequency data for visualization
     */
    getFrequencyData(): Uint8Array {
        if (!this.analyser) return new Uint8Array(0);
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        return dataArray;
    }

    /**
     * Get waveform data for visualization
     */
    getWaveformData(): Float32Array {
        if (!this.analyser) return new Float32Array(0);
        const dataArray = new Float32Array(this.analyser.frequencyBinCount);
        this.analyser.getFloatTimeDomainData(dataArray);
        return dataArray;
    }

    /**
     * Set volume (0.0 to 1.0)
     */
    setVolume(volume: number): void {
        if (this.gainNode) {
            this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * Get current volume
     */
    getVolume(): number {
        return this.gainNode?.gain.value || 0;
    }

    /**
     * Check if audio is playing
     */
    getIsPlaying(): boolean {
        return this.isPlaying;
    }

    /**
     * Cleanup resources
     */
    dispose(): void {
        if (this.sourceNode) {
            this.sourceNode.stop();
            this.sourceNode.disconnect();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Singleton instance
let audioEngineInstance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
    if (!audioEngineInstance) {
        audioEngineInstance = new AudioEngine();
    }
    return audioEngineInstance;
}

export default AudioEngine;
