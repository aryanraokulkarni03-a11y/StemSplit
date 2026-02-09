// TypeScript types for StemSplit audio processing

export interface AudioFile {
  name: string;
  size: number;
  duration: number;
  file: File;
  url?: string;
}

export interface StemResult {
  name: 'vocals' | 'no_vocals';
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
// Stem configuration
export const STEM_CONFIG: Record<string, { label: string; color: string }> = {
  vocals: { label: 'Vocals', color: '#A8977A' },      // Mira Beige
  no_vocals: { label: 'Music', color: '#45362C' },    // Soft Brown
};

// File constraints
export const FILE_CONSTRAINTS = {
  maxSize: 25 * 1024 * 1024, // 25MB (FIXED: was incorrectly 10MB)
  acceptedTypes: ['audio/mpeg', 'audio/wav', 'audio/mp3'],
  acceptedExtensions: ['.mp3', '.wav'],
};
