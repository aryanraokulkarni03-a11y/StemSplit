import type { Metadata } from 'next';

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'StemSplit',
    description: 'AI-powered music stem separation platform',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stem-split-bice.vercel.app',
    logo: process.env.NEXT_PUBLIC_SITE_URL 
      ? `${process.env.NEXT_PUBLIC_SITE_URL}/favicon.ico`
      : '/favicon.ico',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@stemsplit.app',
      url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/contact` : '/contact',
    },
    sameAs: ['https://github.com/aryanraokulkarni03-a11y/StemSplit'],
  };
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'StemSplit',
    description: 'Professional AI-powered music stem separation',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stem-split-bice.vercel.app',
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    isPartOf: {
      '@type': 'CreativeWork',
      name: 'StemSplit',
      url: process.env.NEXT_PUBLIC_SITE_URL,
    },
    about: {
      '@type': 'WebPage',
      name: 'About',
      url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/about` : '/about',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${process.env.NEXT_PUBLIC_SITE_URL}/api/upload`,
      'query-input': 'audio_file_search',
    },
  };
}

export function generatePageMetadata(pageOptions: {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const { title, description, keywords, image } = pageOptions;
  
  return {
    title: `${title} | StemSplit`,
    description: description || 'Professional-grade audio stem separation using advanced AI technology. Separate vocals, drums, bass, and more from any music file.',
    keywords: keywords || ['stem separation', 'audio processing', 'AI music'],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stem-split-bice.vercel.app',
      title: `${title} | StemSplit`,
      description: description || 'Professional-grade audio stem separation using advanced AI.',
      images: image ? [{
        url: image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_SITE_URL || ''}${image}`,
        width: 1200,
        height: 630,
        alt: `${title} - StemSplit`,
      }] : [
        {
          url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg` : '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'StemSplit - AI Audio Processing',
        },
      ],
    },
  };
}

export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'StemSplit',
    description: 'AI-powered music stem separation platform',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stem-split-bice.vercel.app',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'AI-powered stem separation',
      'Multi-format audio support',
      'Real-time processing',
      'Cloud-based processing',
      'Download in multiple formats'
    ],
  };
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{
  name: string;
  url: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url,
    })),
  };
}

export function defaultMetadata(): Metadata {
  return {
    title: {
      template: '%s | StemSplit',
      default: 'StemSplit - AI-Powered Music Stem Separation',
    },
    description: 'Professional-grade audio stem separation using advanced AI technology. Separate vocals, drums, bass, and more from any music file.',
    keywords: ['stem separation', 'audio processing', 'AI music', 'vocal removal', 'music production', 'audio mixer', 'audio engineer', 'audio stems'],
    authors: [{ name: 'StemSplit Team', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stem-split-bice.vercel.app' }],
    creator: 'StemSplit',
    publisher: 'StemSplit',
    robots: {
      index: true,
      follow: true,
      googleBot: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml` : '/sitemap.xml',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'https://stem-split-bice.vercel.app',
      title: 'StemSplit - AI-Powered Music Stem Separation',
      description: 'Professional-grade audio stem separation using advanced AI technology.',
      images: [
        {
          url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg` : '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'StemSplit - AI Audio Processing',
        },
      ],
    },
    twitter: {
      handle: '@stemsplitapp',
      card: 'summary_large_image',
      title: 'StemSplit - AI-Powered Music Stem Separation',
      description: 'Professional-grade audio stem separation using advanced AI.',
      images: [
        process.env.NEXT_PUBLIC_SITE_URL 
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`
          : '/og-image.jpg'
      ],
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 1,
    },
  };
}