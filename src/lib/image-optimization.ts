/**
 * Image Optimization Utilities
 * 
 * Helper functions for optimized image loading
 * Works with Next.js Image component
 */

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(src: string, widths: number[]): string {
    return widths
        .map((width) => `${src}?w=${width} ${width}w`)
        .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: { [key: string]: string }): string {
    return Object.entries(breakpoints)
        .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
        .join(', ');
}

/**
 * Image loading priorities
 */
export const ImagePriority = {
    HIGH: 'high' as const,
    LOW: 'low' as const,
    AUTO: 'auto' as const,
};

/**
 * Common image sizes
 */
export const ImageSizes = {
    THUMBNAIL: { width: 150, height: 150 },
    SMALL: { width: 320, height: 320 },
    MEDIUM: { width: 640, height: 640 },
    LARGE: { width: 1024, height: 1024 },
    HERO: { width: 1920, height: 1080 },
};

/**
 * Responsive image widths
 */
export const ResponsiveWidths = {
    MOBILE: [320, 640],
    TABLET: [640, 768, 1024],
    DESKTOP: [1024, 1280, 1536, 1920],
    ALL: [320, 640, 768, 1024, 1280, 1536, 1920],
};

/**
 * Image formats
 */
export const ImageFormats = {
    WEBP: 'image/webp',
    AVIF: 'image/avif',
    PNG: 'image/png',
    JPEG: 'image/jpeg',
};

/**
 * Blur data URL for placeholder
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
    const canvas = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#f0f0f0"/>
    </svg>
  `;
    return `data:image/svg+xml;base64,${Buffer.from(canvas).toString('base64')}`;
}

/**
 * Image optimization config for Next.js
 */
export const imageConfig = {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
};
