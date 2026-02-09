'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { AudioFile, FILE_CONSTRAINTS } from '@/types/audio';

interface FileUploadProps {
    onFileSelect: (file: AudioFile) => void;
    disabled?: boolean;
}

export const FileUpload = React.memo(function FileUpload({ onFileSelect, disabled = false }: FileUploadProps) {
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
        return new Promise((resolve) => {
            const audio = new Audio();
            const objectUrl = URL.createObjectURL(file);

            audio.preload = 'metadata';

            const cleanup = () => {
                URL.revokeObjectURL(objectUrl);
                audio.onloadedmetadata = null;
                audio.onerror = null;
            };

            audio.onloadedmetadata = () => {
                const duration = audio.duration;
                cleanup();
                resolve(isNaN(duration) || duration === Infinity ? 0 : duration);
            };

            audio.onerror = () => {
                cleanup();
                console.warn('Could not read audio metadata, using 0 as fallback duration');
                resolve(0); // Fallback instead of rejecting
            };

            audio.src = objectUrl;
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
        if (selectedFile?.url) {
            URL.revokeObjectURL(selectedFile.url);
        }
        setSelectedFile(null);
        setError(null);
    }, [selectedFile]);

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (selectedFile?.url) {
                URL.revokeObjectURL(selectedFile.url);
            }
        };
    }, []); // Only on unmount. If selectedFile changes, clearFile already handles revocation.

    // formatFileSize and formatDuration removed as they were unused

    return (
        <div className="w-full max-w-2xl mx-auto font-outfit perspective-1000">
            {/* Tape Deck Chassis */}
            <div className="relative bg-metal-dark p-8 rounded-sm shadow-2xl border-t border-white/10 border-b border-black/50">

                {/* Screw Heads */}
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-zinc-700 shadow-inner flex items-center justify-center"><div className="w-full h-[1px] bg-black rotate-45" /></div>

                {/* Drop Zone / Tape Slot */}
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`
                        relative transition-all duration-300 slot-inset rounded-lg p-2 overflow-hidden
                        ${isDragging ? 'shadow-[0_0_15px_#A8977A] border-[#A8977A]/50' : ''}
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    style={{ minHeight: '200px' }}
                >
                    {/* Content Container */}
                    <div className="relative h-full flex flex-col items-center justify-center text-center p-8">

                        {selectedFile ? (
                            /* Cassette Tape Visual */
                            <div className="w-full animate-in slide-in-from-top duration-500 ease-out">
                                <div className="bg-[#1C1D18] border-2 border-[#2A2B24] rounded-md p-4 relative shadow-lg">
                                    {/* Cassette Texture */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0JyBoZWlnaHQ9JzQnPgo8cmVjdCB3aWR0aD0nNCcgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20" />

                                    {/* Label Area */}
                                    <div className="bg-[#F2E8DC] h-24 rounded-sm mb-4 relative overflow-hidden flex items-center justify-center p-4 border border-[#D4C5A9]">
                                        {/* Handwriting Font */}
                                        <p className="font-bold text-2xl text-[#161711] font-mono truncate uppercase tracking-tighter" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                                            {selectedFile.name}
                                        </p>
                                        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20" />
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-red-500/20" />
                                    </div>

                                    {/* Spools */}
                                    <div className="flex justify-center gap-12 px-8">
                                        <div className="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center animate-spin-slow">
                                            <div className="w-full h-1 bg-white/20 rotate-0" />
                                            <div className="w-full h-[1px] absolute bg-white/20 rotate-90" />
                                        </div>
                                        <div className="w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center animate-spin-slow">
                                            <div className="w-full h-1 bg-white/20 rotate-0" />
                                            <div className="w-full h-[1px] absolute bg-white/20 rotate-90" />
                                        </div>
                                    </div>

                                    {/* Clear Button (Eject) */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearFile();
                                        }}
                                        className="absolute top-2 right-2 p-2 bg-[#8B3A3A] hover:bg-red-600 text-white rounded-sm shadow-md transition-colors"
                                        title="Eject Tape"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Status Light */}
                                <div className="mt-6 flex justify-center items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500 led-glow animate-pulse" />
                                    <span className="text-[#A8977A] font-mono text-xs tracking-widest uppercase">Tape Loaded • Ready</span>
                                </div>
                            </div>
                        ) : (
                            /* Empty Slot Prompt */
                            <label className={`block w-full h-full flex flex-col items-center justify-center gap-6 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input
                                    type="file"
                                    accept=".mp3,.wav,audio/mpeg,audio/wav"
                                    onChange={handleInputChange}
                                    disabled={disabled}
                                    className="sr-only"
                                    data-testid="file-upload-input"
                                />

                                {/* Slot Visual */}
                                <div className={`
                                    w-full h-full absolute inset-0 
                                    bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.5)_10px,rgba(0,0,0,0.5)_20px)] 
                                    opacity-20 pointer-events-none transition-opacity duration-300
                                    ${isDragging ? 'opacity-0' : 'opacity-20'}
                                `} />

                                <div className={`
                                    w-24 h-24 border-4 border-dashed border-[#45362C] rounded-lg flex items-center justify-center transition-all duration-300 z-10
                                    ${isDragging ? 'border-[#A8977A] scale-110 bg-[#A8977A]/10' : 'group-hover:border-[#F2E8DC]/50'}
                                `}>
                                    <Upload
                                        className={`w-10 h-10 transition-colors duration-300 ${isDragging ? 'text-[#A8977A]' : 'text-[#45362C] group-hover:text-[#F2E8DC]'}`}
                                    />
                                </div>

                                <div className="space-y-2 z-10 relative">
                                    <h3 className="text-2xl font-bold font-outfit text-[#F2E8DC] uppercase tracking-wide group-hover:text-[#A8977A] transition-colors">
                                        {isDragging ? 'Insert Tape' : 'Load Audio'}
                                    </h3>
                                    <p className="text-[#8F7D60] font-mono text-xs uppercase tracking-widest">
                                        MP3 / WAV • Max 25MB
                                    </p>
                                </div>
                            </label>
                        )}
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-6 p-4 bg-[#8B3A3A] text-white flex items-center gap-3 border border-[#45362C] shadow-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-bold uppercase tracking-wide">{error}</p>
                </div>
            )}
        </div>
    );
});

