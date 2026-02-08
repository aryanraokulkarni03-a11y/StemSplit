// TypeScript types for StemSplit audio processing

export interface AudioFile {
  name: string;
  size: number;
  duration: number;
  file: File;
  url?: string;
}

export interface StemResult {
  name: 'vocals' | 'drums' | 'bass' | 'other';
  label: string;
  color: string;
  audioBuffer: AudioBuffer | null;
  blob: Blob | null;
  url: string;
  isPlaying: boolean;
  volume: number;
}

export type ProcessingStage =
  | 'idle'
  | 'loading-model'
  | 'processing'
  | 'exporting'
  | 'complete'
  | 'error';

export interface ProcessingStatus {
  stage: ProcessingStage;
  progress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number; // seconds
  error?: string;
}

export interface ModelInfo {
  loaded: boolean;
  size: number; // bytes
  loadProgress: number; // 0-100
}

// Stem configuration
export const STEM_CONFIG: Record<string, { label: string; color: string }> = {
  vocals: { label: 'Vocals', color: '#e50914' },      // Brand Red
  drums: { label: 'Drums', color: '#ffff00' },        // Hyper Yellow
  bass: { label: 'Bass', color: '#00ff00' },          // Neon Green
  other: { label: 'Other', color: '#00ffff' },        // Cyan (CMYK style)
};

// File constraints for MVP
export const FILE_CONSTRAINTS = {
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
  acceptedExtensions: ['.mp3', '.wav'],
};
