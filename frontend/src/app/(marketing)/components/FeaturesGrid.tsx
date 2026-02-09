interface FeaturesGridProps {
    className?: string;
}

/**
 * Features Grid Component (Unstyled Shell)
 * Displays 7 key features of the platform
 * 
 * TODO: Integrate user's custom skeuomorphic design
 */
export function FeaturesGrid({ className }: FeaturesGridProps) {
    const features = [
        {
            id: 1,
            title: 'AI Stem Separation',
            description: 'Separate vocals, drums, bass, and other instruments with neural networks.',
            icon: 'separation',
        },
        {
            id: 2,
            title: 'Multi-Device Audio Routing',
            description: 'Route different stems to different output devices simultaneously.',
            icon: 'routing',
        },
        {
            id: 3,
            title: 'Real-Time Lyric Sync',
            description: 'Karaoke-style lyrics with word-by-word highlighting and translations.',
            icon: 'lyrics',
        },
        {
            id: 4,
            title: 'Pitch-Preserving Speed Control',
            description: 'Change playback speed from 0.5x to 2x without affecting pitch.',
            icon: 'speed',
        },
        {
            id: 5,
            title: 'Waveform Visualization',
            description: 'Interactive waveforms with click-to-seek and peak detection.',
            icon: 'waveform',
        },
        {
            id: 6,
            title: 'DRM & Licensing',
            description: 'Built-in content protection and licensing management.',
            icon: 'security',
        },
        {
            id: 7,
            title: 'API & SDK',
            description: 'Integrate into your applications with our comprehensive API.',
            icon: 'api',
        },
    ];

    return (
        <section className={className} data-section="features">
            <h2>7 Integrated Features</h2>
            <p className="section-description">
                Everything you need for professional music separation and playback.
            </p>
            <div className="features-grid">
                {features.map((feature) => (
                    <div key={feature.id} className="feature-card" data-icon={feature.icon}>
                        <div className="feature-icon">{/* Icon placeholder */}</div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
