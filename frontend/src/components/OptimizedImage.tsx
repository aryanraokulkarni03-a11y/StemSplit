/**
 * Optimized Image Component
 * 
 * Wrapper around Next.js Image with automatic optimizations
 */

'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'onError' | 'onLoad'> {
    fallbackSrc?: string;
}

export function OptimizedImage({
    src,
    alt,
    fallbackSrc = '/images/placeholder.png',
    ...props
}: OptimizedImageProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative overflow-hidden">
            <Image
                {...props}
                src={imgSrc}
                alt={alt}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                    setImgSrc(fallbackSrc);
                }}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
                className={`
                    transition-opacity duration-300
                    ${isLoading ? 'opacity-0' : 'opacity-100'}
                    ${hasError ? 'filter grayscale' : ''}
                    ${props.className || ''}
                `}
            />

            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {hasError && (
                <div className="absolute bottom-2 left-2 text-xs text-red-500 bg-white px-2 py-1 rounded">
                    Failed to load image
                </div>
            )}
        </div>
    );
}
