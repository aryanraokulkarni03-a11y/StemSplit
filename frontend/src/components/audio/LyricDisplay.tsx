'use client';

import { useEffect, useRef, useState } from 'react';

export interface LyricLine {
    startTime: number;
    endTime: number;
    text: string;
    translation?: string;
    words?: Array<{ text: string; startTime: number; endTime: number }>;
}

export interface LyricDisplayProps {
    lyrics: LyricLine[];
    currentTime: number;
    showTranslation?: boolean;
    onLineClick?: (time: number) => void;
    className?: string;
    activeClassName?: string;
}

/**
 * Lyric Display Component
 * Time-synced lyric display with highlighting and auto-scroll
 * 
 * Features:
 * - Time-synced lyrics from JSON data
 * - Highlight current line
 * - Auto-scroll to active lyric
 * - Multi-language translation support
 * - Word-by-word highlighting
 * - Click line to seek
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function LyricDisplay({
    lyrics,
    currentTime,
    showTranslation = false,
    onLineClick,
    className,
    activeClassName = 'active',
}: LyricDisplayProps) {
    const [activeLineIndex, setActiveLineIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const activeLineRef = useRef<HTMLDivElement>(null);

    // Find active line based on current time
    useEffect(() => {
        const index = lyrics.findIndex(
            (line) => currentTime >= line.startTime && currentTime < line.endTime
        );
        setActiveLineIndex(index);
    }, [currentTime, lyrics]);

    // Auto-scroll to active line
    useEffect(() => {
        if (activeLineRef.current && containerRef.current) {
            const container = containerRef.current;
            const activeLine = activeLineRef.current;
            const containerHeight = container.clientHeight;
            const lineTop = activeLine.offsetTop;
            const lineHeight = activeLine.clientHeight;

            // Scroll to center the active line
            const scrollTo = lineTop - containerHeight / 2 + lineHeight / 2;
            container.scrollTo({
                top: scrollTo,
                behavior: 'smooth',
            });
        }
    }, [activeLineIndex]);

    const handleLineClick = (line: LyricLine) => {
        onLineClick?.(line.startTime);
    };

    // Get active word index for word-by-word highlighting
    const getActiveWordIndex = (line: LyricLine): number => {
        if (!line.words) return -1;
        return line.words.findIndex(
            (word) => currentTime >= word.startTime && currentTime < word.endTime
        );
    };

    return (
        <div
            ref={containerRef}
            className={className}
            data-component="lyric-display"
        >
            {lyrics.map((line, index) => {
                const isActive = index === activeLineIndex;
                const activeWordIndex = isActive ? getActiveWordIndex(line) : -1;

                return (
                    <div
                        key={index}
                        ref={isActive ? activeLineRef : null}
                        className={`lyric-line ${isActive ? activeClassName : ''}`}
                        data-active={isActive}
                        onClick={() => handleLineClick(line)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleLineClick(line);
                            }
                        }}
                    >
                        {/* Main lyric text */}
                        <div className="lyric-text">
                            {line.words ? (
                                // Word-by-word highlighting
                                line.words.map((word, wordIndex) => (
                                    <span
                                        key={wordIndex}
                                        className={`lyric-word ${wordIndex === activeWordIndex ? 'active-word' : ''}`}
                                        data-active={wordIndex === activeWordIndex}
                                    >
                                        {word.text}{' '}
                                    </span>
                                ))
                            ) : (
                                // Line-level display
                                <span>{line.text}</span>
                            )}
                        </div>

                        {/* Translation (if enabled) */}
                        {showTranslation && line.translation && (
                            <div className="lyric-translation">{line.translation}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
