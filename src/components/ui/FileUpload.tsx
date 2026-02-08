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
            return 'Only MP3 or WAV files supported';
        }

        // Check file size
        if (file.size > FILE_CONSTRAINTS.maxSize) {
            return `Max file size is ${FILE_CONSTRAINTS.maxSize / (1024 * 1024)}MB`;
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
                url: URL.createObjectURL(file), // Still valid in browser
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
        <div className="w-full max-w-2xl mx-auto font-outfit">
            {/* Drop Zone (Brutalist Card) */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`
          relative group transition-all duration-200 brutalist-card p-12
          ${isDragging ? 'border-primary bg-zinc-900 translate-x-[2px] translate-y-[2px] shadow-none' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
            >
                {/* Content Container */}
                <div className="relative flex flex-col items-center justify-center text-center">

                    {selectedFile ? (
                        /* Selected File Preview - Solid Card */
                        <div className="w-full">
                            <div className="bg-zinc-900 border border-zinc-800 p-6 flex items-center justify-between gap-6">
                                <div className="flex items-center gap-6 min-w-0">
                                    <div className="w-16 h-16 bg-primary flex items-center justify-center flex-shrink-0 animate-spin-vinyl">
                                        <div className="w-6 h-6 bg-black rounded-full border-2 border-zinc-800"></div>
                                    </div>
                                    <div className="text-left min-w-0">
                                        <p className="font-bold text-lg text-white truncate max-w-[200px] sm:max-w-[300px] uppercase tracking-wide">
                                            {selectedFile?.name || 'Unknown File'}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-xs text-primary font-mono uppercase border border-primary px-1">
                                                {selectedFile?.size ? formatFileSize(selectedFile.size) : '0 B'}
                                            </span>
                                            <span className="text-zinc-600">/</span>
                                            <span className="text-sm text-zinc-400 font-mono">
                                                {selectedFile?.duration ? formatDuration(selectedFile.duration) : '0:00'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearFile();
                                    }}
                                    className="p-3 bg-zinc-800 hover:bg-destruct text-white transition-colors"
                                    disabled={disabled}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <p className="text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2 animate-pulse-fast">
                                    <div className="w-2 h-2 bg-primary"></div>
                                    File Locked & Loaded
                                </p>
                            </div>
                        </div>
                    ) : (
                        /* Upload Prompt */
                        <label className={`block w-full ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <input
                                type="file"
                                accept=".mp3,.wav,audio/mpeg,audio/wav"
                                onChange={handleInputChange}
                                disabled={disabled}
                                className="sr-only"
                                data-testid="file-upload-input"
                            />
                            <div className="flex flex-col items-center gap-6" data-testid="upload-drop-zone">
                                {/* Simple Icon */}
                                <div className={`
                                    w-20 h-20 border-2 border-dashed border-zinc-700 flex items-center justify-center transition-all duration-300
                                    ${isDragging ? 'border-primary bg-primary/10' : 'group-hover:border-white group-hover:bg-zinc-900'}
                                `}>
                                    <Upload
                                        className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-primary' : 'text-zinc-500 group-hover:text-white'}`}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black font-outfit text-white uppercase tracking-tighter group-hover:text-primary transition-colors">
                                        {isDragging ? 'Drop It' : 'Upload Track'}
                                    </h3>
                                    <p className="text-zinc-500 font-mono text-sm uppercase tracking-wide">
                                        Drag & drop or click to browse
                                        <br />
                                        <span className="text-zinc-600 mt-1 block">MP3 / WAV • Max 25MB</span>
                                    </p>
                                </div>
                            </div>
                        </label>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-6 p-4 bg-destruct text-white flex items-center gap-3 border border-white shadow-[4px_4px_0px_white]">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-bold uppercase tracking-wide">{error}</p>
                </div>
            )}
        </div>
    );
}

