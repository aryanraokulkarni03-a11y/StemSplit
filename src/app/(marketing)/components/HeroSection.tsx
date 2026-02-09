import { ReactNode } from 'react';

interface HeroSectionProps {
    className?: string;
}

/**
 * Hero Section Component (Unstyled Shell)
 * Main hero section with CTA
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function HeroSection({ className }: HeroSectionProps) {
    return (
        <section className={className} data-section="hero">
            <div className="hero-content">
                <h1>AI-Powered Music Separation Platform</h1>
                <p>
                    Professional-grade stem separation with advanced audio processing,
                    multi-device routing, and real-time lyric synchronization.
                </p>
                <div className="hero-cta">
                    <button data-cta="primary">Request Demo</button>
                    <button data-cta="secondary">Watch Video</button>
                </div>
            </div>
        </section>
    );
}
