/**
 * Unit Tests for SEO Utilities
 */

import {
    defaultMetadata,
    generatePageMetadata,
    generateOrganizationSchema,
    generateWebsiteSchema,
    generateSoftwareApplicationSchema,
    generateBreadcrumbSchema,
} from '../seo';

describe('SEO Utilities', () => {
    describe('defaultMetadata', () => {
        it('should have correct title template', () => {
            expect(defaultMetadata.title).toHaveProperty('template');
            expect(defaultMetadata.title).toHaveProperty('default');
        });

        it('should have description', () => {
            expect(defaultMetadata.description).toBeDefined();
            expect(typeof defaultMetadata.description).toBe('string');
        });

        it('should have keywords array', () => {
            expect(Array.isArray(defaultMetadata.keywords)).toBe(true);
            expect((defaultMetadata.keywords as string[]).length).toBeGreaterThan(0);
        });

        it('should have Open Graph configuration', () => {
            expect(defaultMetadata.openGraph).toBeDefined();
            expect(defaultMetadata.openGraph?.type).toBe('website');
            expect(defaultMetadata.openGraph?.siteName).toBeDefined();
        });

        it('should have Twitter Card configuration', () => {
            expect(defaultMetadata.twitter).toBeDefined();
            expect(defaultMetadata.twitter?.card).toBe('summary_large_image');
        });
    });

    describe('generatePageMetadata', () => {
        it('should generate metadata with title and description', () => {
            const metadata = generatePageMetadata({
                title: 'Test Page',
                description: 'Test description',
            });

            expect(metadata.title).toBe('Test Page');
            expect(metadata.description).toBe('Test description');
        });

        it('should include canonical URL', () => {
            const metadata = generatePageMetadata({
                title: 'Test',
                description: 'Test',
                path: '/test',
            });

            expect(metadata.alternates?.canonical).toContain('/test');
        });

        it('should set noIndex when specified', () => {
            const metadata = generatePageMetadata({
                title: 'Test',
                description: 'Test',
                noIndex: true,
            });

            expect(metadata.robots).toBeDefined();
            expect(metadata.robots?.index).toBe(false);
        });
    });

    describe('generateOrganizationSchema', () => {
        it('should generate valid Organization schema', () => {
            const schema = generateOrganizationSchema();

            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe('Organization');
            expect(schema.name).toBeDefined();
            expect(schema.url).toBeDefined();
        });

        it('should include contact point', () => {
            const schema = generateOrganizationSchema();

            expect(schema.contactPoint).toBeDefined();
            expect(schema.contactPoint['@type']).toBe('ContactPoint');
        });
    });

    describe('generateWebsiteSchema', () => {
        it('should generate valid Website schema', () => {
            const schema = generateWebsiteSchema();

            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe('WebSite');
            expect(schema.name).toBeDefined();
            expect(schema.url).toBeDefined();
        });

        it('should include search action', () => {
            const schema = generateWebsiteSchema();

            expect(schema.potentialAction).toBeDefined();
            expect(schema.potentialAction['@type']).toBe('SearchAction');
        });
    });

    describe('generateSoftwareApplicationSchema', () => {
        it('should generate valid SoftwareApplication schema', () => {
            const schema = generateSoftwareApplicationSchema();

            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe('SoftwareApplication');
            expect(schema.applicationCategory).toBe('MultimediaApplication');
        });

        it('should include offers and rating', () => {
            const schema = generateSoftwareApplicationSchema();

            expect(schema.offers).toBeDefined();
            expect(schema.aggregateRating).toBeDefined();
        });
    });

    describe('generateBreadcrumbSchema', () => {
        it('should generate valid BreadcrumbList schema', () => {
            const items = [
                { name: 'Home', url: '/' },
                { name: 'Products', url: '/products' },
            ];

            const schema = generateBreadcrumbSchema(items);

            expect(schema['@context']).toBe('https://schema.org');
            expect(schema['@type']).toBe('BreadcrumbList');
            expect(schema.itemListElement).toHaveLength(2);
        });

        it('should set correct positions', () => {
            const items = [
                { name: 'Home', url: '/' },
                { name: 'About', url: '/about' },
            ];

            const schema = generateBreadcrumbSchema(items);

            expect(schema.itemListElement[0].position).toBe(1);
            expect(schema.itemListElement[1].position).toBe(2);
        });
    });
});
