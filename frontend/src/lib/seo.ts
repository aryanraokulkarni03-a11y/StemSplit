/**
 * SEO Metadata Configuration
 * 
 * Centralized SEO metadata for all pages
 * Includes Open Graph, Twitter Cards, and structured data
 */

import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aimusicplatform.com';
const siteName = 'AI Music Platform';
const siteDescription = 'AI-powered audio separation platform. Separate vocals, instruments, and stems from any audio file with cutting-edge AI technology.';

export const defaultMetadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: `${siteName} - AI-Powered Audio Separation`,
        template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords: [
        'AI audio separation',
        'stem separation',
        'vocal isolation',
        'music production',
        'audio processing',
        'AI music tools',
        'vocal remover',
        'instrumental extraction',
        'karaoke maker',
        'audio stems',
    ],
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: siteUrl,
        siteName,
        title: `${siteName} - AI-Powered Audio Separation`,
        description: siteDescription,
        images: [
            {
                url: `${siteUrl}/og-image.png`,
                width: 1200,
                height: 630,
                alt: siteName,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${siteName} - AI-Powered Audio Separation`,
        description: siteDescription,
        images: [`${siteUrl}/twitter-image.png`],
        creator: '@aimusicplatform',
    },
    alternates: {
        canonical: siteUrl,
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        // yandex: 'yandex-verification-code',
        // bing: 'bing-verification-code',
    },
};

/**
 * Generate page-specific metadata
 */
export function generatePageMetadata({
    title,
    description,
    path = '',
    image,
    noIndex = false,
}: {
    title: string;
    description: string;
    path?: string;
    image?: string;
    noIndex?: boolean;
}): Metadata {
    const url = `${siteUrl}${path}`;
    const ogImage = image || `${siteUrl}/og-image.png`;

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            title,
            description,
            images: [ogImage],
        },
        robots: noIndex
            ? {
                index: false,
                follow: false,
            }
            : undefined,
    };
}

/**
 * Structured Data (JSON-LD) generators
 */
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description: siteDescription,
        sameAs: [
            'https://twitter.com/aimusicplatform',
            'https://github.com/aimusicplatform',
            'https://linkedin.com/company/aimusicplatform',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            email: 'contact@aimusicplatform.com',
            contactType: 'Customer Service',
        },
    };
}

export function generateWebsiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
        description: siteDescription,
        potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        },
    };
}

export function generateSoftwareApplicationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: siteName,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web Browser',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
        },
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteUrl}${item.url}`,
        })),
    };
}
