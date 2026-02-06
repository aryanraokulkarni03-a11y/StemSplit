'use client';

import React, { useCallback, useState } from 'react';
import { Upload, FileAudio, X, AlertCircle } from 'lucide-react';
import { AudioFile, FILE_CONSTRAINTS } from '@/types/audio';

interface FileUploadProps {
    onFileSelect: (file: AudioFile) => void;
    disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled = false }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);

    const validateFile = useCallback((file: File): string | null => {
        // Check file type
        const isValidType = FILE_CONSTRAINTS.acceptedTypes.includes(file.type) ||
            FILE_CONSTRAINTS.acceptedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

        if (!isValidType) {
            return 'Please upload an MP3 or WAV file';
        }

        // Check file size
        if (file.size > FILE_CONSTRAINTS.maxSize) {
            return `File too large. Maximum size is ${FILE_CONSTRAINTS.maxSize / (1024 * 1024)}MB`;
        }

        return null;
    }, []);

    const getAudioDuration = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.preload = 'metadata';

            audio.onloadedmetadata = () => {
                URL.revokeObjectURL(audio.src);
                resolve(audio.duration);
            };

            audio.onerror = () => {
                URL.revokeObjectURL(audio.src);
                reject(new Error('Could not load audio file'));
            };

            audio.src = URL.createObjectURL(file);
        });
    };

    const handleFile = useCallback(async (file: File) => {
        setError(null);

        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const duration = await getAudioDuration(file);

            const audioFile: AudioFile = {
                name: file.name,
                size: file.size,
                duration,
                file,
                url: URL.createObjectURL(file),
            };

            setSelectedFile(audioFile);
            onFileSelect(audioFile);
        } catch {
            setError('Could not read audio file. Please try another file.');
        }
    }, [validateFile, onFileSelect]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFile(file);
        }
    }, [disabled, handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFile(file);
        }
    }, [handleFile]);

    const clearFile = useCallback(() => {
        setSelectedFile(null);
        setError(null);
    }, []);

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${isDragging ? 'border-sky-500 bg-sky-500/10 scale-[1.02]' : 'border-white/20 hover:border-white/40'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${selectedFile ? 'border-emerald-500 bg-emerald-500/5' : ''}
        `}
            >
                {selectedFile ? (
                    /* Selected File Preview */
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                <FileAudio className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-foreground/60">
                                    {formatFileSize(selectedFile.size)} • {formatDuration(selectedFile.duration)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearFile();
                            }}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            disabled={disabled}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    /* Upload Prompt */
                    <label className={`block ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input
                            type="file"
                            accept=".mp3,.wav,audio/mpeg,audio/wav"
                            onChange={handleInputChange}
                            disabled={disabled}
                            className="sr-only"
                        />
                        <div className="flex flex-col items-center gap-4">
                            <div className={`
                w-16 h-16 rounded-full flex items-center justify-center transition-all
                ${isDragging ? 'bg-sky-500 scale-110' : 'bg-white/10'}
              `}>
                                <Upload className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-foreground/60'}`} />
                            </div>
                            <div>
                                <p className="text-lg font-medium">
                                    {isDragging ? 'Drop your audio file here' : 'Drag & drop your audio file'}
                                </p>
                                <p className="text-sm text-foreground/60 mt-1">
                                    or click to browse • MP3 or WAV • Max 10MB
                                </p>
                            </div>
                        </div>
                    </label>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                </div>
            )}
        </div>
    );
}
