interface FooterProps {
    className?: string;
}

/**
 * Footer Component (Unstyled Shell)
 * Site footer with links, legal pages, and social media
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function Footer({ className }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const footerSections = {
        product: {
            title: 'Product',
            links: [
                { label: 'Features', href: '/features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'API Documentation', href: '/api-docs' },
                { label: 'Changelog', href: '/changelog' },
            ],
        },
        company: {
            title: 'Company',
            links: [
                { label: 'About Us', href: '/about' },
                { label: 'Blog', href: '/blog' },
                { label: 'Careers', href: '/careers' },
                { label: 'Contact', href: '/contact' },
            ],
        },
        legal: {
            title: 'Legal',
            links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookies' },
                { label: 'Acceptable Use', href: '/acceptable-use' },
            ],
        },
        resources: {
            title: 'Resources',
            links: [
                { label: 'Documentation', href: '/docs' },
                { label: 'Support', href: '/support' },
                { label: 'Community', href: '/community' },
                { label: 'Status', href: '/status' },
            ],
        },
    };

    return (
        <footer className={className} data-section="footer">
            <div className="footer-content">
                <div className="footer-grid">
                    {Object.entries(footerSections).map(([key, section]) => (
                        <div key={key} className="footer-section">
                            <h3>{section.title}</h3>
                            <ul>
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <a href={link.href}>{link.label}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="footer-bottom">
                    <div className="footer-brand">
                        <span className="brand-name">AI Music Platform</span>
                        <p className="tagline">Professional-grade music separation</p>
                    </div>

                    <div className="footer-social">
                        {/* Social media links placeholder */}
                        <a href="#" aria-label="Twitter">Twitter</a>
                        <a href="#" aria-label="GitHub">GitHub</a>
                        <a href="#" aria-label="LinkedIn">LinkedIn</a>
                        <a href="#" aria-label="YouTube">YouTube</a>
                    </div>

                    <div className="footer-copyright">
                        <p>&copy; {currentYear} AI Music Platform. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
