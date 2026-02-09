import { MetadataRoute } from 'next';

/**
 * Sitemap Generator
 * 
 * Automatically generates sitemap.xml for search engines
 * Update this file when adding new pages
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://aimusicplatform.com';
    const currentDate = new Date();

    return [
        // Homepage
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        // Legal Pages
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date('2026-02-09'),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date('2026-02-09'),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/cookies`,
            lastModified: new Date('2026-02-09'),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/acceptable-use`,
            lastModified: new Date('2026-02-09'),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        // TODO: Add more pages as they are created
        // {
        //   url: `${baseUrl}/pricing`,
        //   lastModified: currentDate,
        //   changeFrequency: 'weekly',
        //   priority: 0.8,
        // },
        // {
        //   url: `${baseUrl}/features`,
        //   lastModified: currentDate,
        //   changeFrequency: 'weekly',
        //   priority: 0.8,
        // },
        // {
        //   url: `${baseUrl}/blog`,
        //   lastModified: currentDate,
        //   changeFrequency: 'daily',
        //   priority: 0.7,
        // },
    ];
}
