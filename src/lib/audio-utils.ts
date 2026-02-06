// Audio utility functions for StemSplit

/**
 * Load an audio file and return its AudioBuffer
 */
export async function loadAudioFile(file: File): Promise<AudioBuffer> {
    const arrayBuffer = await file.arrayBuffer();
    const audioContext = new AudioContext();
    return audioContext.decodeAudioData(arrayBuffer);
}

/**
 * Convert AudioBuffer to Float32Array for model input
 * Handles stereo to mono conversion and resampling if needed
 */
export function audioBufferToTensor(buffer: AudioBuffer): Float32Array {
    const channels = buffer.numberOfChannels;
    const length = buffer.length;

    // Get mono audio (average of channels)
    if (channels === 1) {
        return new Float32Array(buffer.getChannelData(0));
    }

    const mono = new Float32Array(length);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    for (let i = 0; i < length; i++) {
        mono[i] = (left[i] + right[i]) / 2;
    }

    return mono;
}

/**
 * Convert Float32Array back to AudioBuffer
 */
export function tensorToAudioBuffer(
    tensor: Float32Array,
    sampleRate: number = 44100
): AudioBuffer {
    const audioContext = new AudioContext();
    const buffer = audioContext.createBuffer(1, tensor.length, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < tensor.length; i++) {
        channelData[i] = tensor[i];
    }
    return buffer;
}

/**
 * Export AudioBuffer to WAV Blob
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const samples = buffer.length;
    const dataSize = samples * blockAlign;
    const bufferSize = 44 + dataSize;

    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, bufferSize - 8, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);

    // Write samples
    let offset = 44;
    for (let i = 0; i < samples; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
            const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[i]));
            const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, intSample, true);
            offset += 2;
        }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

/**
 * Format file size to human readable string
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format duration to mm:ss
 */
export function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Create a silent audio buffer for placeholder/testing
 */
export function createSilentBuffer(
    duration: number = 1,
    sampleRate: number = 44100
): AudioBuffer {
    const audioContext = new AudioContext();
    const length = duration * sampleRate;
    return audioContext.createBuffer(1, length, sampleRate);
}

/**
 * Simulate stem separation (placeholder for MVP)
 * In production, this would call the ONNX model
 */
export async function simulateStemSeparation(
    audioBuffer: AudioBuffer,
    onProgress: (progress: number, message: string) => void
): Promise<Map<string, AudioBuffer>> {
    const stems = new Map<string, AudioBuffer>();
    const stemNames = ['vocals', 'drums', 'bass', 'other'];

    for (let i = 0; i < stemNames.length; i++) {
        const stemName = stemNames[i];
        const progress = ((i + 1) / stemNames.length) * 100;

        onProgress(progress - 20, `Extracting ${stemName}...`);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For demo: create filtered version of original audio
        // In production, this would be the actual separated stem
        const stemBuffer = createFilteredBuffer(audioBuffer, stemName);
        stems.set(stemName, stemBuffer);

        onProgress(progress, `${stemName} extracted`);
    }

    return stems;
}

/**
 * Create a filtered version of audio buffer for demo purposes
 * Applies different frequency filters to simulate stem separation
 */
function createFilteredBuffer(
    original: AudioBuffer,
    stemType: string
): AudioBuffer {
    const audioContext = new AudioContext();
    const buffer = audioContext.createBuffer(
        original.numberOfChannels,
        original.length,
        original.sampleRate
    );

    // Copy original audio with some modification for demo
    for (let channel = 0; channel < original.numberOfChannels; channel++) {
        const inputData = original.getChannelData(channel);
        const outputData = buffer.getChannelData(channel);

        // Simple amplitude scaling for demo (different for each stem)
        const scale = {
            vocals: 0.8,
            drums: 0.7,
            bass: 0.6,
            other: 0.5
        }[stemType] || 0.5;

        for (let i = 0; i < inputData.length; i++) {
            outputData[i] = inputData[i] * scale;
        }
    }

    return buffer;
}
